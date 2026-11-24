"""A 6. óra közös kódja: a magyarázhatósági demók (lineáris együtthatók, fa-fontosság, SHAP) az 5. óra bike-sharing adatán.

Az adat- és modelldefiníciót az 5. óra `bike.py`-ja adja (egyetlen igazságforrás): innen csak importáljuk.
A magyarázott modell ugyanaz, mint az 5. órán: XGBoost, BASE + hat késleltetés (lag2..lag168, roll3).

Rögzített seedek; a magyarázat a 2012-09..10 validációs blokkon fut (a modell 2012-09-01 előtt tanult). A záró teszt (2012-11, 12)
érintetlen. Egy vágás, egy seed: a számok demók, nem benchmarkok.
"""
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import statsmodels.api as sm
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LinearRegression, LogisticRegression

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent / "05-regresszio"))
import bike as B

LIN_COLS = ["temp_C", "hum_pct", "wind_kmh", "workingday", "rush", "yr"]
VAL_START = "2012-09-01"


def lin_data():
    """Dev adat (a záró teszt nélkül), olvasható mértékegységekkel (az UCI az értékeket normalizálva adja: temp/41, hum/100, windspeed/67)."""
    d = B.add_lags(B.load())
    d = d[d.ts < B.DEV_END].copy()
    d["temp_C"], d["hum_pct"], d["wind_kmh"] = d.temp * 41, d.hum * 100, d.windspeed * 67
    d["rush"] = d.hr.isin([7, 8, 9, 16, 17, 18, 19]).astype(int)
    return d


def linear(d):
    X, y = d[LIN_COLS], d["cnt"]
    out = {}
    m = sm.OLS(y, sm.add_constant(X)).fit()
    out["raw"] = {"coef": m.params.to_dict(), "r2": float(m.rsquared)}
    # mértékegység-csere: °C -> °F
    XF = X.assign(temp_F=X.temp_C * 9 / 5 + 32).drop(columns="temp_C")
    mf = sm.OLS(y, sm.add_constant(XF)).fit()
    out["fahrenheit"] = {"coef_temp_C": float(m.params["temp_C"]), "coef_temp_F": float(mf.params["temp_F"]), "r2_C": float(m.rsquared),
                         "r2_F": float(mf.rsquared), "max_abs_pred_diff": float(np.abs(mf.fittedvalues - m.fittedvalues).max())}
    # standardizált jellemzők
    sd, mu = X.std(), X.mean()
    ms = sm.OLS(y, sm.add_constant((X - mu) / sd)).fit()
    out["std"] = {"sd": sd.to_dict(), "mean": mu.to_dict(), "coef_per_sd": ms.params.drop("const").to_dict(), "intercept": float(ms.params["const"]),
                  "ymean": float(y.mean())}
    # log cél
    ml = sm.OLS(np.log(y), sm.add_constant(X)).fit()
    out["log_target"] = {"coef": ml.params.to_dict(), "pct": (np.exp(ml.params) - 1).to_dict(), "r2_log": float(ml.rsquared)}
    # log jellemző: a múlt heti azonos óra (lag168), a hiányzó lag168 sorok kiesnek
    e = d.dropna(subset=["lag168"]).copy()
    e["log_lag168"] = np.log(e.lag168)
    base = [c for c in LIN_COLS if c != "yr"] + ["yr"]
    two = {}
    for yn, yy in (("level", e.cnt), ("log", np.log(e.cnt))):
        for fn, f in (("level", "lag168"), ("log", "log_lag168")):
            mm = sm.OLS(yy, sm.add_constant(e[[*base, f]])).fit()
            two[f"{yn}_{fn}"] = float(mm.params[f])
    two["n"] = len(e)
    two["lag168_mean"] = float(e.lag168.mean())
    out["lag168_2x2"] = two
    # kollinearitás: temp és atemp
    X3 = X.assign(atemp_C=d.atemp * 50)
    m3 = sm.OLS(y, sm.add_constant(X3)).fit()
    out["collinear"] = {"corr": float(X3.temp_C.corr(X3.atemp_C)), "temp_alone": float(m.params["temp_C"]), "temp_with": float(m3.params["temp_C"]),
                        "atemp_with": float(m3.params["atemp_C"]), "r2_alone": float(m.rsquared), "r2_with": float(m3.rsquared)}
    # workingday nulla közelében: az interakció az óra x munkanap
    e2 = d.assign(rush_wd=d.rush * d.workingday)
    m4 = sm.OLS(y, sm.add_constant(e2[[*LIN_COLS, "rush_wd"]])).fit()
    out["interaction"] = {"workingday_main": float(m.params["workingday"]), "workingday_with_int": float(m4.params["workingday"]),
                          "rush_with_int": float(m4.params["rush"]), "rush_wd": float(m4.params["rush_wd"]), "r2_with_int": float(m4.rsquared)}
    return out


def logistic(d):
    X, y = d[LIN_COLS], d["cnt"]
    thr = float(y.quantile(.75))
    yb = (y > thr).astype(int)
    sd = X.std()
    raw = LogisticRegression(C=1e6, max_iter=5000).fit(X, yb)
    std = LogisticRegression(C=1e6, max_iter=5000).fit((X - X.mean()) / sd, yb)
    out = {"thr": thr, "prevalence": float(yb.mean()), "coef": dict(zip(LIN_COLS, raw.coef_[0])), "intercept": float(raw.intercept_[0]),
           "or": dict(zip(LIN_COLS, np.exp(raw.coef_[0]))), "or_per_sd": dict(zip(LIN_COLS, np.exp(std.coef_[0]))), "sd": sd.to_dict()}
    # a valószínűség-hatás nem állandó: ugyanaz az +1 °C, más kiindulásnál (munkanap, csúcsóra, 2012, átlag páratartalom és szél)
    def p(t):
        x = pd.DataFrame([{"temp_C": t, "hum_pct": X.hum_pct.mean(), "wind_kmh": X.wind_kmh.mean(), "workingday": 1, "rush": 1, "yr": 1}])
        return float(raw.predict_proba(x)[0, 1])
    out["p_curve"] = {str(t): p(t) for t in range(41)}
    out["p_examples"] = {"5to6": [p(5), p(6)], "15to16": [p(15), p(16)], "30to31": [p(30), p(31)]}
    return out


def trees(d):
    cols = B.BASE + B.LAGS
    tr, va = d[d.ts < VAL_START], d[d.ts >= VAL_START]
    m = B.xgb().fit(tr[cols], tr.cnt)
    p = m.predict(va[cols])
    out = {"n_train": len(tr), "n_val": len(va), "val_rmse": B.metrics(va.cnt, p)["rmse"], "cols": cols}
    bs = m.get_booster()
    imp = {}
    for t in ("weight", "gain", "cover"):
        s = pd.Series(bs.get_score(importance_type=t)).reindex(cols).fillna(0)
        imp[t] = (s / s.sum()).to_dict()
    out["xgb_builtin"] = imp
    pi = permutation_importance(m, va[cols], va.cnt, scoring="neg_root_mean_squared_error", n_repeats=5, random_state=0, n_jobs=1)
    out["xgb_perm"] = dict(zip(cols, pi.importances_mean))
    out["xgb_perm_std"] = dict(zip(cols, pi.importances_std))
    # zaj-oszlopok: MDI (tanítón) vs permutációs (validáción), Random Forest
    rng = np.random.default_rng(0)
    tr2, va2 = tr.copy(), va.copy()
    for x in (tr2, va2):
        x["zaj_folytonos"] = rng.normal(size=len(x))
        x["zaj_azonosito"] = rng.integers(0, 5000, len(x)).astype(float)
    c2 = cols + ["zaj_folytonos", "zaj_azonosito"]
    rf = B.forest().fit(tr2[c2], tr2.cnt)
    mdi = pd.Series(rf.feature_importances_, c2)
    pi2 = permutation_importance(rf, va2[c2], va2.cnt, scoring="neg_root_mean_squared_error", n_repeats=5, random_state=0, n_jobs=1)
    pm = pd.Series(pi2.importances_mean, c2)
    out["rf_mdi"], out["rf_perm"] = mdi.to_dict(), pm.to_dict()
    out["rf_mdi_rank"] = mdi.rank(ascending=False).astype(int).to_dict()
    out["rf_perm_rank"] = pm.rank(ascending=False).astype(int).to_dict()
    out["rf_val_rmse"] = B.metrics(va2.cnt, rf.predict(va2[c2]))["rmse"]
    # temp / atemp: a MDI megosztja
    out["rf_temp_pair"] = {"mdi_temp": float(mdi["temp"]), "mdi_atemp": float(mdi["atemp"]), "perm_temp": float(pm["temp"]), "perm_atemp": float(pm["atemp"])}
    return out, m, tr, va, cols, p


def shap_part(m, va, cols, p):
    import shap
    ex = shap.TreeExplainer(m)
    sv = ex(va[cols])
    base = float(sv.base_values[0])
    out = {"base": base, "additivity_max_abs_err": float(np.abs(sv.values.sum(1) + sv.base_values - p).max()),
           "mean_abs": dict(zip(cols, np.abs(sv.values).mean(0))), "n": len(va)}
    ex_rows = {}
    for key, ts in (("kedd_8", "2012-09-04 08:00"), ("vasarnap_3", "2012-09-09 03:00")):
        i = int(np.where(va.ts == ts)[0][0])
        ex_rows[key] = {"ts": ts, "y": float(va.cnt.iloc[i]), "pred": float(p[i]), "base": base, "i": i,
                        "contrib": dict(zip(cols, sv.values[i])), "x": {c: float(va[c].iloc[i]) if pd.notna(va[c].iloc[i]) else None for c in cols}}
    out["examples"] = ex_rows
    # lineáris modellen a SHAP = b * (x - átlag) (független-jellemző közelítés, itt pontos): ellenőrzés
    d = va.dropna(subset=["lag168"])
    lm = LinearRegression().fit(d[["temp", "hum", "windspeed", "hr", "lag168"]], d.cnt)
    xs = d[["temp", "hum", "windspeed", "hr", "lag168"]]
    lex = shap.LinearExplainer(lm, shap.maskers.Independent(xs, max_samples=len(xs)))
    lsv = lex(xs)
    manual = (xs - xs.mean()).to_numpy() * lm.coef_
    out["linear_check"] = {"max_abs_diff": float(np.abs(lsv.values - manual).max())}
    return out, sv


# ---------------------------------------------------------------- Shapley-példák (játékelmélet) és a fa útja
def shapley_games():
    """Pontos Shapley-értékek a slide-ok példáira (az összes sorrend átlaga): üzleti társak, kesztyű-játék, ENSZ Biztonsági Tanács."""
    from itertools import permutations
    from math import comb, factorial

    def shapley(players, v):
        out = dict.fromkeys(players, 0.0)
        perms = list(permutations(players))
        for order in perms:
            seen = frozenset()
            for p in order:
                out[p] += v(seen | {p}) - v(seen)
                seen = seen | {p}
        return {p: x / len(perms) for p, x in out.items()}

    biz = {frozenset(): 0, frozenset("A"): 10, frozenset("B"): 20, frozenset("AB"): 50}
    glove = lambda S: 1 if ("L" in S and ("R1" in S or "R2" in S)) else 0
    out = {"partners": {"v": {"".join(sorted(k)) or "-": v for k, v in biz.items()}, "shapley": shapley(["A", "B"], lambda S: biz[frozenset(S)])},
           "glove": shapley(["L", "R1", "R2"], glove)}
    # Biztonsági Tanács: 5 állandó (súly 7) + 10 nem állandó (súly 1), kvóta 39 (= 9 szavazat, mind az 5 állandó köztük): az állandó tag vétója
    n, quota, w_perm = 15, 39, 7
    def phi(is_perm):
        """Egy tag Shapley-Shubik hatalma: azon sorrendek aránya, ahol ő viszi át a koalíciót a kvóta alá -> fölé."""
        other_perm, other_non = (4, 10) if is_perm else (5, 9)
        wi = w_perm if is_perm else 1
        tot = 0.0
        for a in range(other_perm + 1):
            for b in range(other_non + 1):
                w_before = a * w_perm + b
                if w_before < quota <= w_before + wi:
                    size = a + b
                    tot += comb(other_perm, a) * comb(other_non, b) * factorial(size) * factorial(n - size - 1) / factorial(n)
        return tot

    out["unsc"] = {"permanent_each": phi(True), "nonpermanent_each": phi(False)}
    out["unsc"]["permanent_total"] = 5 * out["unsc"]["permanent_each"]
    out["unsc"]["check_sum"] = 5 * out["unsc"]["permanent_each"] + 10 * out["unsc"]["nonpermanent_each"]
    return out


def tree_path(m, row, cols):
    """A 0. fa útja egy sorra (XGBoost): [(jellemző, küszöb, érték, igen/nem)], a levél értéke; és a lépcsőzetes jóslat (hány fa után mennyi)."""
    bst = m.get_booster()
    df = bst.trees_to_dataframe()
    t0 = df[df.Tree == 0].set_index("ID")
    node, steps = "0-0", []
    while t0.loc[node, "Feature"] != "Leaf":
        r = t0.loc[node]
        val = row[r["Feature"]]
        if pd.isna(val):
            nxt = r["Missing"]; yes = nxt == r["Yes"]
        else:
            yes = bool(val < r["Split"]); nxt = r["Yes"] if yes else r["No"]
        steps.append({"feature": r["Feature"], "split": float(r["Split"]), "value": None if pd.isna(val) else float(val), "yes": yes})
        node = nxt
    import json as _json
    base = float(str(_json.loads(bst.save_config())["learner"]["learner_model_param"]["base_score"]).strip("[]"))
    X = pd.DataFrame([row[cols]])
    staged = {int(k): float(m.predict(X, iteration_range=(0, k))[0]) for k in (1, 3, 10, 30, 100, 300, 500)}
    return {"steps": steps, "leaf": float(t0.loc[node, "Gain"]), "base_score": base, "staged": staged}


def compute():
    d = lin_data()
    R = {"n_dev": len(d), "linear": linear(d), "logistic": logistic(d)}
    R["trees"], m, tr, va, cols, p = trees(d)
    R["shap"], sv = shap_part(m, va, cols, p)
    R["shapley_games"] = shapley_games()
    row = va[va.ts == "2012-09-04 08:00"].iloc[0]
    R["tree_path"] = tree_path(m, row, cols)
    return R, dict(d=d, m=m, tr=tr, va=va, cols=cols, p=p, sv=sv)


if __name__ == "__main__":
    import json
    R, _ = compute()
    (HERE / "results.json").write_text(json.dumps(R, indent=1, ensure_ascii=False, default=float))
    print("results.json kész")
