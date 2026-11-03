"""Az 5. óra közös kódja: adat, jellemzők, időbeli foldok, modellek, mutatók.

A build_assets.py, a results.py és a demo.ipynb is ezt importálja, hogy a slide-ok, az ábrák és a notebook
ugyanazt a definíciót használják (egyetlen igazságforrás).

Feltevések (a slide-okon is szerepelnek):
- Cél: egy óra kölcsönzésszáma (cnt). A jóslatot a jósolt óra ELŐTTI óra elején adjuk ki: ekkor a jósolt óra előtti óra még tart, tehát
  az utolsó ISMERT óra 2 órával korábbi (lag2); a lag1 NEM használható. Az időjárást előrejelzésnek tekintjük (az adatban a megfigyelt
  érték áll helyette: ez optimista; a temp/atemp/hum/windspeed/weathersit), a naptár ismert.
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
LAGS = ["lag2", "lag3", "lag4", "lag24", "lag168", "roll3"]  # lag1 nincs: a jóslat kiadásakor még nem ismert
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
    for h in (2, 3, 4, 24, 168):
        out[f"lag{h}"] = s.reindex(df["ts"] - pd.Timedelta(hours=h)).to_numpy()
    out["roll3"] = out[["lag2", "lag3", "lag4"]].mean(axis=1)  # a három legutóbbi ISMERT óra átlaga
    return out


def add_leaky_roll(df: pd.DataFrame) -> pd.DataFrame:
    """A SZÁNDÉKOS hiba: központosított 3 órás átlag; a mostani és a KÖVETKEZŐ óra is benne van. Élesben nem ismert."""
    s = df.set_index("ts")["cnt"].asfreq("h")
    out = df.copy()
    out["roll3_centered"] = s.rolling(3, center=True, min_periods=1).mean().reindex(df["ts"]).to_numpy()
    return out


def add_time_enc(df: pd.DataFrame, harmonics: int = 12) -> pd.DataFrame:
    """Az óra körre csavarva: hs{k} = sin(2*pi*k*hr/24), hc{k} = cos(...). A *_w oszlopok a munkanappal szorzottak
    (így a munkanapnak és a hétvégének külön görbéje lehet, mint az óra x munkanap dummyknál)."""
    out = df.copy()
    ang = 2 * np.pi * out["hr"] / 24
    for k in range(1, harmonics + 1):
        out[f"hs{k}"], out[f"hc{k}"] = np.sin(k * ang), np.cos(k * ang)
        out[f"hs{k}_w"], out[f"hc{k}_w"] = out[f"hs{k}"] * out["workingday"], out[f"hc{k}"] * out["workingday"]
    return out


# Az órán kívüli jellemzők minden időkódolásnál ugyanazok: így csak az ÓRA kódolása különbözik.
TIME_CAT, TIME_NUM = ["mnth", "weathersit"], ["temp", "atemp", "hum", "windspeed", "yr", "holiday", "workingday"]


def time_spec(enc: str):
    """(kategorikus, numerikus) oszlopok az óra egy kódolásához. enc: 'num' | 'cat' | 'cat_x' | 'sc{k}' | 'sc{k}_x'
    (cat_x / sc{k}_x: külön görbe munkanapra és hétvégére)."""
    if enc == "num":
        return TIME_CAT, [*TIME_NUM, "hr"]
    if enc == "cat":
        return [*TIME_CAT, "hr"], TIME_NUM
    if enc == "cat_x":
        return [*TIME_CAT, "hr_wd"], TIME_NUM
    k = int(enc.removeprefix("sc").removesuffix("_x")); x = enc.endswith("_x")
    cols = [f"{p}{j}" for j in range(1, k + 1) for p in ("hs", "hc")]
    if x:
        cols += [c + "_w" for c in cols]
    return TIME_CAT, [*TIME_NUM, *cols]


def lr_time(enc: str):
    cat, num = time_spec(enc)
    ct = ColumnTransformer([("c", OneHotEncoder(handle_unknown="ignore"), cat), ("n", StandardScaler(), num)])
    return make_pipeline(ct, Ridge(1.0)), cat + num


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


def add_week_feats(df: pd.DataFrame) -> pd.DataFrame:
    """Heti késleltetések időbélyeg szerint (lag168 már az add_lags-ból megvan): lag170, lag336, és d2 = lag2 - (a lag2 óra múlt heti értéke)
    (az utolsó ismert óra a múlt hetihez képest: az idei hét eltérése a múlt héttől)."""
    full = pd.date_range(df["ts"].min(), df["ts"].max(), freq="h")
    s = df.set_index("ts")["cnt"].reindex(full)  # szabályos órás tengely: a hiányzó óra NaN, a shift(h) pontosan h órával korábbi
    out = df.copy()
    out["lag170"] = s.shift(170).reindex(df["ts"]).to_numpy()
    out["lag336"] = s.shift(336).reindex(df["ts"]).to_numpy()
    out["d2raw"] = out["lag2"] - out["lag170"]
    # „Múlt heti érték”, hiányzó adatnál a legközelebbi elérhető szomszéddal: 1) ugyanaz az óra múlt héten, 2) a múlt heti szomszéd órák
    # (t-167, t-169) átlaga, 3) ugyanaz az óra két hete. Csak ha mind hiányzik, marad NaN.
    nb = pd.concat([s.shift(167), s.shift(169)], axis=1).mean(axis=1, skipna=True)
    wk = s.shift(168).fillna(nb).fillna(s.shift(336))
    out["wk"] = wk.reindex(df["ts"]).to_numpy()
    out["wk_prev2"] = wk.shift(2).reindex(df["ts"]).to_numpy()  # a lag2 óra „múlt heti értéke”, ugyanazzal a szabállyal
    out["d2"] = out["lag2"] - out["wk_prev2"]
    out["wk_how"] = np.where(out["lag168"].notna(), "same", np.where(nb.reindex(df["ts"]).notna(), "neighbor", np.where(s.shift(336).reindex(df["ts"]).notna(), "2weeks", "none")))
    return out


# A „változás a múlt héthez képest” célhoz a múlt heti szintet (wk) a jellemzők közé is be kell tenni: nélküle nincs mihez viszonyítani.
CHANGE_COLS = [*BASE, "lag2", "wk", "d2", "lag24", "lag336"]
CHANGE_COLS_RAW = [*BASE, "lag2", "lag168", "d2raw", "lag24", "lag336"]  # a szomszéd-kitöltés nélküli változat (nyers lag168, hiányzik, ha az az óra hiányzik)


def fit_predict_target(df, tr, te, cols, mode="level", seed=0, base_col="wk", fallback=True):
    """Három célváltozó. level: cnt. delta: cnt - lag168 (a jóslat = lag168 + modell). logratio: log(1+cnt) - log(1+lag168)
    (a jóslat = expm1(log(1+lag168) + modell), sosem negatív). A tanításból kiesnek azok a sorok, ahol a lag168 hiányzik;
    a tesztben, ahol hiányzik, a szint-modell jósol (visszaadjuk, hány ilyen sor van)."""
    base, y = df[base_col], df["cnt"]
    ok = tr & base.notna()
    if mode == "level":
        t = y
    elif mode == "delta":
        t = y - base
    else:
        t = np.log1p(y) - np.log1p(base)
    m = xgb(random_state=seed)
    m.fit(df.loc[ok, cols], t[ok])
    raw = m.predict(df.loc[te, cols])
    b = base[te].to_numpy()
    p = raw if mode == "level" else (b + raw) if mode == "delta" else np.expm1(np.log1p(b) + raw)
    # hiányzó-adat szabály: ha a múlt heti érték (alap) hiányzik, az egyszerű szint-modell jósol (BASE + lag2)
    weekly = [c for c in ("wk", "lag168") if c in cols]  # csak a múlt heti érték (alap) hiánya számít
    miss = df.loc[te, weekly].isna().any(axis=1).to_numpy() if weekly else np.zeros(len(p), bool)
    if mode != "level":
        miss = miss | np.isnan(b)  # a delta/log-arány jóslathoz mindig kell a múlt heti alap
    if fallback and miss.any():
        fb = xgb(random_state=seed)
        fb.fit(df.loc[tr, [*BASE, "lag2"]], y[tr])
        p[miss] = fb.predict(df.loc[te, [*BASE, "lag2"]][miss])
    return p, int(miss.sum())


def oof_time_target(df, cols, mode="level", seed=0, folds=FOLDS) -> pd.DataFrame:
    parts = []
    for i, (a, b) in enumerate(folds):
        tr, te = df["ts"] < a, (df["ts"] >= a) & (df["ts"] < b)
        p, _ = fit_predict_target(df, tr, te, cols, mode, seed)
        parts.append(pd.DataFrame({"ts": df.loc[te, "ts"].to_numpy(), "y": df.loc[te, "cnt"].to_numpy(), "p": p, "fold": i}))
    return pd.concat(parts, ignore_index=True)


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
