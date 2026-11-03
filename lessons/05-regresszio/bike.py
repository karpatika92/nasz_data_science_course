"""Az 5. óra közös kódja: adat, jellemzők, időbeli foldok, modellek, mutatók.

A build_assets.py, a results.py és a demo.ipynb is ezt importálja, hogy a slide-ok, az ábrák és a notebook
ugyanazt a definíciót használják (egyetlen igazságforrás).

Feltevések (a slide-okon is szerepelnek):
- Cél: a KÖVETKEZŐ óra kölcsönzésszáma (cnt). A jósláskor ismert: minden korábbi óra forgalma, az időjárás-előrejelzés
  (a temp/atemp/hum/windspeed oszlopokat előrejelzésként kezeljük), a naptár.
- A `casual` és `registered` oszlop összege = cnt, ezért eldobjuk (szivárgás).
- A foldok időrendiak (kiterjedő ablak); a végső teszt 2012-11 és 2012-12, amit egyszer nézünk meg.
"""
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeRegressor
from xgboost import XGBRegressor

HERE = Path(__file__).parent
BASE = ["season", "yr", "mnth", "hr", "holiday", "weekday", "workingday", "weathersit", "temp", "atemp", "hum", "windspeed"]
LAGS = ["lag1", "lag2", "lag3", "lag24", "lag168", "roll3"]
# Kiterjedő ablakos foldok: a teszt-blokk előtti összes hónapon tanulunk. A végső teszt (FINAL) nincs köztük.
FOLDS = [("2012-05-01", "2012-07-01"), ("2012-07-01", "2012-09-01"), ("2012-09-01", "2012-11-01")]
FINAL = ("2012-11-01", "2013-01-01")
DEV_END = FINAL[0]


def load() -> pd.DataFrame:
    """hour.csv -> időrendi DataFrame `ts` időbélyeggel; a szivárgó casual/registered és az instant nélkül."""
    df = pd.read_csv(HERE / "data" / "hour.csv", parse_dates=["dteday"])
    df["ts"] = df["dteday"] + pd.to_timedelta(df["hr"], unit="h")
    df = df.drop(columns=["casual", "registered", "instant"]).sort_values("ts").reset_index(drop=True)
    df["hr_wd"] = df["hr"].astype(str) + "_" + df["workingday"].astype(str)  # óra x munkanap, a „tisztességes" lineáris modellnek
    return df


def add_lags(df: pd.DataFrame) -> pd.DataFrame:
    """Késleltetett jellemzők IDŐBÉLYEG szerint (nem sor-eltolással: az adatból 165 óra hiányzik, ott NaN lesz)."""
    s = df.set_index("ts")["cnt"]
    out = df.copy()
    for h in (1, 2, 3, 24, 168):
        out[f"lag{h}"] = s.reindex(df["ts"] - pd.Timedelta(hours=h)).to_numpy()
    out["roll3"] = out[["lag1", "lag2", "lag3"]].mean(axis=1)
    return out


def add_leaky_roll(df: pd.DataFrame) -> pd.DataFrame:
    """A SZÁNDÉKOS hiba: központosított 3 órás átlag; a mostani és a KÖVETKEZŐ óra is benne van. Élesben nem ismert."""
    s = df.set_index("ts")["cnt"].asfreq("h")
    out = df.copy()
    out["roll3_centered"] = s.rolling(3, center=True, min_periods=1).mean().reindex(df["ts"]).to_numpy()
    return out


# ---------------------------------------------------------------- modellek
def lr_naive():
    """Az óra egyetlen szám (0..23): a lineáris modell egyetlen lejtőt illeszt rá."""
    return make_pipeline(SimpleImputer(strategy="median"), StandardScaler(), LinearRegression())


def lr_fair(num_extra=()):
    """Tisztességes lineáris modell: óra x munkanap, hónap, időjárás dummy-k, a folytonos oszlopok skálázva."""
    cat = ["hr_wd", "mnth", "weathersit"]
    num = ["temp", "atemp", "hum", "windspeed", "yr", "holiday", *num_extra]
    ct = ColumnTransformer([("c", OneHotEncoder(handle_unknown="ignore"), cat),
                            ("n", make_pipeline(SimpleImputer(strategy="median"), StandardScaler()), num)])
    return make_pipeline(ct, Ridge(1.0))


def tree():
    return DecisionTreeRegressor(max_depth=8, min_samples_leaf=10, random_state=0)


def forest():
    return RandomForestRegressor(n_estimators=200, min_samples_leaf=3, n_jobs=-1, random_state=0)


def xgb(**kw):
    p = {"n_estimators": 500, "learning_rate": 0.05, "max_depth": 6, "subsample": 0.8, "colsample_bytree": 0.8, "n_jobs": 4, "random_state": 0}
    p.update(kw)
    return XGBRegressor(**p)


# ---------------------------------------------------------------- mutatók
def metrics(y, p) -> dict:
    y, p = np.asarray(y, float), np.asarray(p, float)
    pc = np.clip(p, 0, None)
    return {"rmse": float(mean_squared_error(y, p) ** .5), "mae": float(mean_absolute_error(y, p)),
            "wape": float(np.abs(y - p).sum() / y.sum()),
            "rmsle": float(mean_squared_error(np.log1p(y), np.log1p(pc)) ** .5), "r2": float(r2_score(y, p))}


def acf(r, nlags=48):
    r = np.asarray(r, float) - np.mean(r)
    d = np.dot(r, r)
    return np.array([np.dot(r[k:], r[:len(r) - k]) / d for k in range(nlags + 1)])


# ---------------------------------------------------------------- kiértékelés
def fit_predict(make, cols, train_mask, test_mask, df, log=False):
    m = make()
    y = df.loc[train_mask, "cnt"]
    m.fit(df.loc[train_mask, cols], np.log1p(y) if log else y)
    p = m.predict(df.loc[test_mask, cols])
    return (np.expm1(p) if log else p), m


def oof_time(make, cols, df, log=False, folds=FOLDS) -> pd.DataFrame:
    """Időrendi out-of-fold jóslatok: minden teszt-blokkra a MEGELŐZŐ adaton tanult modell."""
    parts = []
    for i, (a, b) in enumerate(folds):
        tr = df["ts"] < a
        te = (df["ts"] >= a) & (df["ts"] < b)
        p, _ = fit_predict(make, cols, tr, te, df, log)
        parts.append(pd.DataFrame({"ts": df.loc[te, "ts"].to_numpy(), "y": df.loc[te, "cnt"].to_numpy(), "p": p, "fold": i}))
    return pd.concat(parts, ignore_index=True)


def fold_rmse(o: pd.DataFrame) -> list:
    return [float(mean_squared_error(g["y"], g["p"]) ** .5) for _, g in o.groupby("fold")]


def day_bootstrap(o: pd.DataFrame, fn, n=2000, seed=0):
    """Napi blokk-bootstrap: az egymást követő órák nem függetlenek, ezért egész napokat húzunk."""
    rng = np.random.default_rng(seed)
    days = pd.to_datetime(o["ts"]).dt.floor("D")
    idx = {d: np.flatnonzero((days == d).to_numpy()) for d in days.unique()}
    keys = list(idx)
    out = []
    for _ in range(n):
        pick = rng.choice(len(keys), len(keys))
        sel = np.concatenate([idx[keys[k]] for k in pick])
        out.append(fn(o.iloc[sel]))
    return np.array(out)
