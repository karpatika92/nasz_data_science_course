"""Minden számot kiszámol, ami a slide-okon szerepel -> results.json (és compute() a build_assets.py-nak).

Futtatás (a lecke mappájából): uv run python results.py
Rögzített seedek; a végső teszt (2012-11, 2012-12) csak a `final` blokkban szerepel, a modellválasztás előtte, a dev foldokon dől el.
"""
import json
import warnings
from pathlib import Path

import bike as B
import numpy as np
import pandas as pd
from sklearn.model_selection import KFold

warnings.filterwarnings("ignore")
HERE = Path(__file__).parent


def compute():
    df = B.add_leaky_roll(B.add_lags(B.load()))
    R, O = {}, {}
    full_hours = int((df.ts.max() - df.ts.min()) / pd.Timedelta("1h")) + 1
    dev = df[df.ts < B.DEV_END]
    R["data"] = {"rows": len(df), "full_hours": full_hours, "missing_hours": full_hours - len(df), "start": str(df.ts.min()),
                 "end": str(df.ts.max()), "dev_rows": len(dev), "final_rows": int((df.ts >= B.FINAL[0]).sum()),
                 "mean_cnt": float(df.cnt.mean()), "median_cnt": float(df.cnt.median()), "max_cnt": int(df.cnt.max()),
                 "cnt_min": int(df.cnt.min()),
                 "leak_check_max_abs": None}
    raw = pd.read_csv(B.HERE / "data" / "hour.csv")
    R["data"]["leak_check_max_abs"] = int((raw.casual + raw.registered - raw.cnt).abs().max())
    # hány hiányzó óra esik a dev / final szakaszra
    R["data"]["yr_means_dev"] = {int(k): float(v) for k, v in dev.groupby("yr").cnt.mean().items()}  # csak a dev szakasz: az EDA nem látja a végső tesztet
    R["data"]["dev_mean_cnt"] = float(dev.cnt.mean())
    jo = dev[dev.mnth <= 10]  # azonos hónapok (jan-okt) mindkét évben: az évszak nem torzítja az összevetést
    R["data"]["janoct_means"] = {int(k): float(v) for k, v in jo.groupby("yr").cnt.mean().items()}
    R["data"]["temp_celsius_scale"] = 41  # a temp oszlop normalizált (/41 °C)

    # ---------------- 1. modell-létra (időrendi foldok, a dev szakaszon)
    cols_fair = B.BASE + ["hr_wd"]
    ladder = {}
    def oof_dummy():
        parts = []
        for i, (a, b) in enumerate(B.FOLDS):
            tr, te = df.ts < a, (df.ts >= a) & (df.ts < b)
            parts.append(pd.DataFrame({"ts": df.loc[te, "ts"].to_numpy(), "y": df.loc[te, "cnt"].to_numpy(),
                                       "p": df.loc[tr, "cnt"].mean(), "fold": i}))
        return pd.concat(parts, ignore_index=True)
    def oof_naive(col):
        parts = []
        for i, (a, b) in enumerate(B.FOLDS):
            tr, te = df.ts < a, (df.ts >= a) & (df.ts < b)
            p = df.loc[te, col].fillna(df.loc[tr, "cnt"].mean()).to_numpy()
            parts.append(pd.DataFrame({"ts": df.loc[te, "ts"].to_numpy(), "y": df.loc[te, "cnt"].to_numpy(), "p": p, "fold": i}))
        return pd.concat(parts, ignore_index=True)
    ladder["mean"] = oof_dummy()
    ladder["naive_week"] = oof_naive("lag168")
    ladder["naive_lag2"] = oof_naive("lag2")
    ladder["lr_naive"] = B.oof_time(B.lr_naive, B.BASE, df)
    ladder["lr_fair"] = B.oof_time(B.lr_fair, cols_fair, df)
    ladder["tree"] = B.oof_time(B.tree, B.BASE, df)
    ladder["forest"] = B.oof_time(B.forest, B.BASE, df)
    ladder["xgb"] = B.oof_time(B.xgb, B.BASE, df)
    R["ladder"] = {k: {**B.metrics(o.y, o.p), "fold_rmse": B.fold_rmse(o)} for k, o in ladder.items()}
    O["ladder"] = ladder

    # ---------------- 2. véletlen vs időrendi vágás UGYANAZOKON a teszt-órákon (2012-05..10)
    test_rows = (dev.ts >= B.FOLDS[0][0]) & (dev.ts < B.FOLDS[-1][1])
    devi = dev.reset_index(drop=True)
    pr = np.zeros(len(devi))
    for tr, te in KFold(3, shuffle=True, random_state=0).split(devi):
        m = B.xgb(); m.fit(devi.loc[tr, B.BASE], devi.loc[tr, "cnt"]); pr[te] = m.predict(devi.loc[te, B.BASE])
    sel = test_rows.reset_index(drop=True)
    o_rand = pd.DataFrame({"ts": devi.loc[sel, "ts"], "y": devi.loc[sel, "cnt"], "p": pr[sel.to_numpy()]})
    R["random_vs_time"] = {"random": B.metrics(o_rand.y, o_rand.p), "time": R["ladder"]["xgb"], "n_rows": int(sel.sum())}

    # ---------------- 3. mutatók ugyanazon a jóslaton (a létra minden modelljére a `ladder` blokk) + diagnosztika az XGBoost-on
    ob = ladder["xgb"].copy()
    ob["resid"] = ob.y - ob.p
    ob = ob.merge(df[["ts", "hr", "workingday", "temp", "weathersit", "mnth", "weekday"]], on="ts")
    O["xgb_base"] = ob
    # tölcsér: a reziduum szórása a becsült érték deciliseiben
    ob["dec"] = pd.qcut(ob.p, 10, labels=False, duplicates="drop")
    fun = ob.groupby("dec").agg(p_mean=("p", "mean"), sd=("resid", "std"), mean_resid=("resid", "mean"), y_mean=("y", "mean"), n=("y", "size"))
    R["funnel"] = {"p_mean": fun.p_mean.round(1).tolist(), "sd": fun.sd.round(1).tolist(), "y_mean": fun.y_mean.round(1).tolist(),
                   "mean_resid": fun.mean_resid.round(1).tolist()}
    a = B.acf(ob.resid.to_numpy(), 48)
    R["acf_base"] = {"lag1": float(a[1]), "lag2": float(a[2]), "lag24": float(a[24]), "lag168_n/a": None}
    O["acf_base"] = a
    # torzítás óra x munkanap szerint
    seg = ob.groupby(["workingday", "hr"]).resid.mean().unstack(0)
    O["bias_hr_wd"] = seg
    R["bias_hr_wd_extreme"] = {"max_over": float(seg.stack().min()), "max_under": float(seg.stack().max())}
    # alvó / csúcs óra szerinti RMSE (alapmodell)
    def seg_rmse(o):
        g = o.merge(df[["ts", "hr"]], on="ts", suffixes=("", "_"))
        night = g.hr.isin([0, 1, 2, 3, 4, 5]); peak = g.hr.isin([7, 8, 17, 18])
        f = lambda m: float(np.sqrt(((g.y - g.p)[m] ** 2).mean()))
        mean_y = lambda m: float(g.y[m].mean())
        return {"night_rmse": f(night), "peak_rmse": f(peak), "night_mean": mean_y(night), "peak_mean": mean_y(peak)}
    R["segments_base"] = seg_rmse(ladder["xgb"])
    # log-cél: visszatranszformálási torzítás
    olog = B.oof_time(B.xgb, B.BASE, df, log=True)
    R["log_target"] = {"raw": B.metrics(ladder["xgb"].y, ladder["xgb"].p), "log": B.metrics(olog.y, olog.p),
                       "mean_ratio_raw": float(ladder["xgb"].p.mean() / ladder["xgb"].y.mean()),
                       "mean_ratio_log": float(olog.p.mean() / olog.y.mean())}

    # ---------------- 4. a visszacsatolási kör: ELőször a hibás jellemző (központosított átlag), aztán a helyes (késleltetések)
    o_bad = B.oof_time(B.xgb, B.BASE + ["roll3_centered"], df)
    R["fe_wrong"] = {**B.metrics(o_bad.y, o_bad.p), "fold_rmse": B.fold_rmse(o_bad)}
    o_lag = B.oof_time(B.xgb, B.BASE + B.LAGS, df)
    o_lr_lag = B.oof_time(lambda: B.lr_fair(B.LAGS), cols_fair + B.LAGS, df)
    R["fe_right"] = {"xgb_lags": {**B.metrics(o_lag.y, o_lag.p), "fold_rmse": B.fold_rmse(o_lag)},
                     "lr_fair_lags": {**B.metrics(o_lr_lag.y, o_lr_lag.p), "fold_rmse": B.fold_rmse(o_lr_lag)}}
    O["xgb_lags"], O["lr_lags"], O["xgb_bad"] = o_lag, o_lr_lag, o_bad
    # páros különbség foldonként + napi blokk-bootstrap a pooled RMSE különbségre
    d_fold = np.array(R["ladder"]["xgb"]["fold_rmse"]) - np.array(R["fe_right"]["xgb_lags"]["fold_rmse"])
    R["fe_right"]["paired_fold_gain"] = d_fold.tolist()
    both = ladder["xgb"][["ts", "y", "p"]].rename(columns={"p": "p0"}).merge(o_lag[["ts", "p"]], on="ts")
    rm = lambda y, p: float(np.sqrt(((y - p) ** 2).mean()))
    boots = B.day_bootstrap(both, lambda g: rm(g.y, g.p0) - rm(g.y, g.p))
    R["fe_right"]["gain_boot"] = {"mean": float(boots.mean()), "lo": float(np.percentile(boots, 2.5)), "hi": float(np.percentile(boots, 97.5))}
    # egyes lag-ek külön-külön (ablation); a lag2 külön is megmarad: az egyszerűbb jelölt
    abl = {}
    for name in ["lag2", "lag24", "lag168", "roll3"]:
        o = B.oof_time(B.xgb, B.BASE + [name], df)
        abl[name] = B.metrics(o.y, o.p)["rmse"]
        if name == "lag2":
            o_lag2 = o
    R["fe_ablation_rmse"] = abl
    R["fe_lag2"] = {**B.metrics(o_lag2.y, o_lag2.p), "fold_rmse": B.fold_rmse(o_lag2),
                    "fold_diff_vs_all_lags": (np.array(B.fold_rmse(o_lag2)) - np.array(R["fe_right"]["xgb_lags"]["fold_rmse"])).tolist()}
    O["xgb_lag2"] = o_lag2
    # lehetetlen jóslatok: negatív kereslet az alap XGBoost-nál
    pb = ladder["xgb"].merge(df[["ts", "hr"]], on="ts")
    R["negative_preds"] = {"share": float((pb.p < 0).mean()), "count": int((pb.p < 0).sum()),
                           "share_night": float((pb[pb.hr <= 5].p < 0).mean()), "min": float(pb.p.min()),
                           "rmsle_unclipped_note": "az RMSLE-hez a jóslatot 0-ra vágjuk (bike.metrics)"}
    R["fe_lag2"]["acf_lag1"] = float(B.acf((o_lag2.y - o_lag2.p).to_numpy(), 48)[1])
    # diagnosztika a javítás után
    ol = o_lag.copy(); ol["resid"] = ol.y - ol.p
    O["acf_lags"] = B.acf(ol.resid.to_numpy(), 48)
    R["acf_lags"] = {"lag1": float(O["acf_lags"][1]), "lag24": float(O["acf_lags"][24])}
    R["segments_lags"] = seg_rmse(o_lag)
    olog2 = B.oof_time(B.xgb, B.BASE + B.LAGS, df, log=True)
    R["fe_right"]["xgb_lags_log"] = B.metrics(olog2.y, olog2.p)
    R["fe_right"]["r2_lag2_only"] = B.metrics(ladder["naive_lag2"].y, ladder["naive_lag2"].p)["r2"]
    # tölcsér a javítás után
    ol["dec"] = pd.qcut(ol.p, 10, labels=False, duplicates="drop")
    f2 = ol.groupby("dec").agg(p_mean=("p", "mean"), sd=("resid", "std"))
    R["funnel_lags"] = {"p_mean": f2.p_mean.round(1).tolist(), "sd": f2.sd.round(1).tolist()}

    # ---------------- 5. extrapoláció: 2011-en tanulunk, 2012-t jósoljuk (a trend, amit a fa nem lát)
    tr, te = df.ts < "2012-01-01", df.ts >= "2012-01-01"
    te = te & (df.ts < B.DEV_END)
    ext = {}
    for name, mk, cols in [("xgb_base", B.xgb, B.BASE), ("xgb_lags", B.xgb, B.BASE + B.LAGS), ("xgb_lag2", B.xgb, B.BASE + ["lag2"]),
                           ("lr_fair", B.lr_fair, cols_fair), ("lr_fair_lags", lambda: B.lr_fair(B.LAGS), cols_fair + B.LAGS)]:
        p, _ = B.fit_predict(mk, cols, tr, te, df)
        y = df.loc[te, "cnt"].to_numpy()
        ext[name] = {**B.metrics(y, p), "sum_ratio": float(p.sum() / y.sum())}
        O[f"ext_{name}"] = pd.DataFrame({"ts": df.loc[te, "ts"].to_numpy(), "y": y, "p": p})
    R["extrapolation"] = ext

    # ---------------- 6. PDP: átlagos jóslat óra szerint, munkanap / nem munkanap (alap XGBoost, a dev adaton)
    trm = df.ts < B.DEV_END
    m = B.xgb(); m.fit(df.loc[trm, B.BASE], df.loc[trm, "cnt"])
    pdp = {}
    for wd in (0, 1):
        sub = df.loc[trm & (df.workingday == wd), B.BASE]
        pdp[wd] = [float(m.predict(sub.assign(hr=h)).mean()) for h in range(24)]
    O["pdp"] = pdp
    R["pdp_peaks"] = {wd: {"argmax": int(np.argmax(v)), "max": float(max(v))} for wd, v in pdp.items()}

    # ---------------- 7. VÉGSŐ TESZT (egyszer): a szabály előre rögzítve = a legkisebb dev-RMSE a jelöltek közül
    cands = {"xgb_lag2": R["fe_lag2"]["rmse"], "xgb_lags": R["fe_right"]["xgb_lags"]["rmse"], "xgb": R["ladder"]["xgb"]["rmse"],
             "lr_fair_lags": R["fe_right"]["lr_fair_lags"]["rmse"], "lr_fair": R["ladder"]["lr_fair"]["rmse"]}
    R["final_rule"] = {"rule": "legkisebb dev-RMSE a jelöltek közül (a foldok nem a végső tesztből jönnek)",
                       "candidates_dev_rmse": cands, "winner": min(cands, key=cands.get)}
    trm, tem = df.ts < B.FINAL[0], (df.ts >= B.FINAL[0]) & (df.ts < B.FINAL[1])
    final = {}
    spec = {"naive_week": None, "lr_fair": (B.lr_fair, cols_fair), "lr_fair_lags": (lambda: B.lr_fair(B.LAGS), cols_fair + B.LAGS),
            "xgb": (B.xgb, B.BASE), "xgb_lags": (B.xgb, B.BASE + B.LAGS), "xgb_lag2": (B.xgb, B.BASE + ["lag2"])}
    WIN_COLS = {"xgb_lag2": B.BASE + ["lag2"], "xgb_lags": B.BASE + B.LAGS, "xgb": B.BASE}
    fo = {}
    for name, s in spec.items():
        if s is None:
            p = df.loc[tem, "lag168"].fillna(df.loc[trm, "cnt"].mean()).to_numpy()
        else:
            p, _ = B.fit_predict(s[0], s[1], trm, tem, df)
        fo[name] = pd.DataFrame({"ts": df.loc[tem, "ts"].to_numpy(), "y": df.loc[tem, "cnt"].to_numpy(), "p": p})
        final[name] = B.metrics(fo[name].y, fo[name].p)
    R["final"] = {"models": final, "n_test": int(tem.sum())}
    O["final"] = fo
    w = fo[R["final_rule"]["winner"]]
    bs = B.day_bootstrap(w, lambda g: rm(g.y, g.p))
    R["final"]["winner_rmse_ci"] = [float(np.percentile(bs, 2.5)), float(np.percentile(bs, 97.5))]
    b2 = fo["xgb"][["ts", "y", "p"]].rename(columns={"p": "p0"}).merge(w[["ts", "p"]], on="ts")
    bd = B.day_bootstrap(b2, lambda g: rm(g.y, g.p0) - rm(g.y, g.p))
    R["final"]["gain_vs_base_ci"] = [float(np.percentile(bd, 2.5)), float(np.percentile(bd, 97.5))]
    b3 = fo["lr_fair_lags"][["ts", "y", "p"]].rename(columns={"p": "p0"}).merge(w[["ts", "p"]], on="ts")
    bl = B.day_bootstrap(b3, lambda g: rm(g.y, g.p0) - rm(g.y, g.p))
    R["final"]["gain_vs_lr_lags_ci"] = [float(np.percentile(bl, 2.5)), float(np.percentile(bl, 97.5))]
    # ---------------- 8. bizonytalanság: 90%-os kvantilis-intervallum (5. és 95. percentilis), dev-en tanulva
    qs = {}
    for q in (0.05, 0.95):
        mq = B.xgb(objective="reg:quantileerror", quantile_alpha=q)
        mq.fit(df.loc[trm, WIN_COLS[R["final_rule"]["winner"]]], df.loc[trm, "cnt"])
        qs[q] = mq.predict(df.loc[tem, WIN_COLS[R["final_rule"]["winner"]]])
    lo, hi = np.minimum(qs[0.05], qs[0.95]), np.maximum(qs[0.05], qs[0.95])
    yt = df.loc[tem, "cnt"].to_numpy()
    ins = (yt >= lo) & (yt <= hi)
    O["interval"] = pd.DataFrame({"ts": df.loc[tem, "ts"].to_numpy(), "y": yt, "lo": lo, "hi": hi, "p": fo[R["final_rule"]["winner"]].p.to_numpy()})
    R["interval"] = {"coverage": float(ins.mean()), "mean_width": float((hi - lo).mean()),
                     "coverage_low_pred": float(ins[fo[R["final_rule"]["winner"]].p.to_numpy() < 100].mean()),
                     "coverage_high_pred": float(ins[fo[R["final_rule"]["winner"]].p.to_numpy() >= 100].mean()),
                     "width_low_pred": float((hi - lo)[fo[R["final_rule"]["winner"]].p.to_numpy() < 100].mean()),
                     "width_high_pred": float((hi - lo)[fo[R["final_rule"]["winner"]].p.to_numpy() >= 100].mean())}
    # ---------------- 9. Az idő mint változó: az óra kódolása (kategória vs sin/cos), az órán kívüli jellemzők mindenhol ugyanazok
    dft = B.add_time_enc(df)
    te = {}
    encs = ["num", "cat", "cat_x"] + [f"sc{k}" for k in range(1, 7)] + [f"sc{k}_x" for k in range(1, 13)]
    for enc in encs:
        o = B.oof_time(lambda enc=enc: B.lr_time(enc)[0], B.lr_time(enc)[1], dft)
        n_par = 1 if enc == "num" else 24 if enc == "cat" else 48 if enc == "cat_x" else 2 * int(enc.removeprefix("sc").removesuffix("_x")) * (2 if enc.endswith("_x") else 1)
        te[enc] = {**B.metrics(o.y, o.p), "hour_params": n_par, "fold_rmse": B.fold_rmse(o)}
    R["time_enc_lr"] = te
    sc_cols = [c for c in B.BASE if c != "hr"] + ["hs1", "hc1"]
    seeds, xa, xb = list(range(5)), [], []
    for s in seeds:
        oa = B.oof_time(lambda s=s: B.xgb(random_state=s), B.BASE, dft)
        ob_ = B.oof_time(lambda s=s: B.xgb(random_state=s), sc_cols, dft)
        xa.append(B.metrics(oa.y, oa.p)["rmse"]); xb.append(B.metrics(ob_.y, ob_.p)["rmse"])
    xa, xb = np.array(xa), np.array(xb)
    R["time_enc_xgb"] = {"seeds": seeds, "rmse_number": xa.tolist(), "rmse_sincos": xb.tolist(), "diff": (xa - xb).tolist(),
                         "diff_mean": float((xa - xb).mean()), "diff_sd": float((xa - xb).std()),
                         "fold_rmse_number_seed0": B.fold_rmse(B.oof_time(B.xgb, B.BASE, dft)),
                         "fold_rmse_sincos_seed0": B.fold_rmse(B.oof_time(B.xgb, sc_cols, dft))}
    # a hónap is kör: one-hot (11) vs sin/cos (k = 1, 2); az óra: óra x munkanap dummyk
    from sklearn.compose import ColumnTransformer
    from sklearn.linear_model import Ridge
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import OneHotEncoder, StandardScaler
    ang = 2 * np.pi * (dft["mnth"] - 1) / 12
    dm = dft.copy()
    for j in (1, 2):
        dm[f"ms{j}"], dm[f"mc{j}"] = np.sin(j * ang), np.cos(j * ang)
    def lr_month(mcols, onehot):
        cat = ["hr_wd", "weathersit"] + (["mnth"] if onehot else [])
        num = ["temp", "atemp", "hum", "windspeed", "yr", "holiday", "workingday", *mcols]
        ct = ColumnTransformer([("c", OneHotEncoder(handle_unknown="ignore"), cat), ("n", StandardScaler(), num)])
        return make_pipeline(ct, Ridge(1.0)), cat + num
    month = {}
    for name, mcols, oh, npar in [("none", [], False, 0), ("onehot", [], True, 11), ("sc1", ["ms1", "mc1"], False, 2), ("sc2", ["ms1", "mc1", "ms2", "mc2"], False, 4)]:
        mdl, cols = lr_month(mcols, oh)
        o = B.oof_time(lambda mcols=mcols, oh=oh: lr_month(mcols, oh)[0], cols, dm)
        month[name] = {"rmse": B.metrics(o.y, o.p)["rmse"], "month_params": npar}
    R["time_enc_month"] = month
    # illusztratív illesztések (a teljes dev szakaszra illesztve, nem out-of-fold): az átlagos óra-görbe munkanapon és hétvégén
    trm_all = dft.ts < B.DEV_END
    fits = {}
    for enc in ("sc1_x", "sc2_x", "sc6_x", "cat_x"):
        mdl, cols = B.lr_time(enc)
        mdl.fit(dft.loc[trm_all, cols], dft.loc[trm_all, "cnt"])
        pred = pd.Series(mdl.predict(dft.loc[trm_all, cols]), index=dft.index[trm_all])
        d_ = dft.loc[trm_all].assign(p=pred)
        fits[enc] = {w: d_[d_.workingday == w].groupby("hr").p.mean().tolist() for w in (0, 1)}
    O["time_fits"] = fits
    O["time_actual"] = {w: dft[trm_all & (dft.workingday == w)].groupby("hr").cnt.mean().tolist() for w in (0, 1)}

    # ---------------- 10. A cél átfogalmazása: változás a múlt héthez képest (delta) és a log-arány; a nő-rendszer próbáján (2011 -> 2012)
    dw = B.add_week_feats(dft)
    # (jellemzők, alap-oszlop). A "nyers" változat a szomszéd-kitöltés nélküli lag168-at használja: hiány esetén az egyszerű szint-modell jósol.
    csets = {"lag2": ([*B.BASE, "lag2"], "wk"), "lag2+wk": ([*B.BASE, "lag2", "wk"], "wk"),
             "teljes": (B.CHANGE_COLS, "wk"), "teljes_nyers": (B.CHANGE_COLS_RAW, "lag168")}
    tr11, te12 = dw.ts < "2012-01-01", (dw.ts >= "2012-01-01") & (dw.ts < B.DEV_END)
    trf, tef = dw.ts < B.FINAL[0], (dw.ts >= B.FINAL[0]) & (dw.ts < B.FINAL[1])
    y12 = dw.loc[te12, "cnt"].to_numpy()
    ch = {}
    for sname, (cols, base) in csets.items():
        for mode in ("level", "delta", "logratio"):
            parts = []
            for i_, (a_, b_) in enumerate(B.FOLDS):
                tr_, te_ = dw["ts"] < a_, (dw["ts"] >= a_) & (dw["ts"] < b_)
                pp, _ = B.fit_predict_target(dw, tr_, te_, cols, mode, 0, base)
                parts.append(pd.DataFrame({"y": dw.loc[te_, "cnt"].to_numpy(), "p": pp}))
            o = pd.concat(parts)
            dr = []
            for sd in range(3):
                p_, nfb = B.fit_predict_target(dw, tr11, te12, cols, mode, seed=sd, base_col=base)
                mt = B.metrics(y12, p_)
                dr.append((mt["rmse"], p_.sum() / y12.sum(), mt["rmsle"], mt["mae"], int((p_ < 0).sum()), nfb))
                if sd == 0 and sname == "teljes":
                    O.setdefault("drift_change", {})[mode] = pd.DataFrame({"ts": dw.loc[te12, "ts"].to_numpy(), "y": y12, "p": p_})
            dr = np.array(dr)
            pf, nff = B.fit_predict_target(dw, trf, tef, cols, mode, base_col=base)
            ch[f"{sname}|{mode}"] = {"folds_rmse": B.metrics(o.y, o.p)["rmse"], "folds_rmsle": B.metrics(o.y, o.p)["rmsle"],
                                      "drift_rmse": float(dr[:, 0].mean()), "drift_rmse_sd": float(dr[:, 0].std()), "drift_ratio": float(dr[:, 1].mean()),
                                      "drift_rmsle": float(dr[:, 2].mean()), "drift_negatives": int(dr[0, 4]), "drift_fallback_rows": int(dr[0, 5]),
                                      "final_rmse": B.metrics(dw.loc[tef, "cnt"], pf)["rmse"], "final_fallback_rows": nff}
    R["change"] = ch
    # a múlt heti érték forrása: ugyanaz az óra / szomszéd órák / két hete / semmi
    cov = {}
    for nm, msk in (("folds", (dw.ts >= B.FOLDS[0][0]) & (dw.ts < B.FOLDS[-1][1])), ("drift", te12), ("final", tef)):
        cov[nm] = {k: int(v) for k, v in dw.loc[msk, "wk_how"].value_counts().items()} | {"rows": int(msk.sum())}
    # POST-HOC: a záró teszt ezekre a modellekre már nem tiszta (a hibát a záró teszten vettük észre, a dev foldokon nincs hiányzó múlt heti érték).
    nof = {}
    pn, _ = B.fit_predict_target(dw, trf, tef, B.CHANGE_COLS_RAW, "level", base_col="lag168", fallback=False)
    nof["raw_level_no_fallback_final_rmse"] = B.metrics(dw.loc[tef, "cnt"], pn)["rmse"]
    tt = dw.loc[tef, ["ts", "cnt", "lag168", "wk_how"]].assign(p=pn).reset_index(drop=True)
    pw, _ = B.fit_predict_target(dw, trf, tef, B.CHANGE_COLS, "level")
    tt["p_neighbor"] = pw
    for d_ in ("2012-11-05", "2012-11-06"):
        g = tt[tt.ts.dt.floor("D") == d_]
        nof[f"day_{d_}"] = {"actual_mean": float(g.cnt.mean()), "pred_mean_raw_no_fallback": float(g.p.mean()), "pred_mean_neighbor_fill": float(g.p_neighbor.mean()),
                            "lag168_missing_hours": int(g.lag168.isna().sum()), "neighbor_filled_hours": int((g.wk_how == "neighbor").sum()), "two_week_filled_hours": int((g.wk_how == "2weeks").sum()),
                            "unfilled_hours": int((g.wk_how == "none").sum())}
    if cov["final"].get("none", 0) == 0:  # ha nincs kitöltetlen sor, a delta/log-arány is fut fallback nélkül
        for mode in ("level", "delta", "logratio"):
            pq, _ = B.fit_predict_target(dw, trf, tef, B.CHANGE_COLS, mode, fallback=False)
            nof[f"neighbor_{mode}_no_fallback_final_rmse"] = B.metrics(dw.loc[tef, "cnt"], pq)["rmse"]
    R["change_post_hoc"] = nof
    nv = dw.loc[te12, "lag168"].fillna(dw.loc[tr11, "cnt"].mean()).to_numpy()
    R["change_meta"] = {"naive_week_drift_rmse": B.metrics(y12, nv)["rmse"], "wk_source_rows": cov,
                        "lr_fair_lags_drift_rmse": R["extrapolation"]["lr_fair_lags"]["rmse"], "lr_fair_lags_drift_ratio": R["extrapolation"]["lr_fair_lags"]["sum_ratio"]}
    # a három célváltozó átlaga évenként (azonos hónapok, jan-okt): a szint nő, a változás nem
    jo = dw[(dw.ts < B.DEV_END) & (dw.mnth <= 10)].dropna(subset=["lag168"])
    R["change_meta"]["janoct_target_means"] = {
        int(yr): {"level": float(g.cnt.mean()), "delta": float((g.cnt - g.lag168).mean()),
                  "logratio": float((np.log1p(g.cnt) - np.log1p(g.lag168)).mean()),
                  "delta_sd": float((g.cnt - g.lag168).std()), "level_sd": float(g.cnt.std()),
                  "logratio_sd": float((np.log1p(g.cnt) - np.log1p(g.lag168)).std())}
        for yr, g in jo.groupby("yr")}
    # ---------------- 11. Mennyire használható a lag1 éles esetben? Jóslási horizont h: az utolsó ISMERT forgalom h órával a jósolt óra előtti (h = 1: az előző óra ismert).
    # És a megfigyelt időjárás szerepe (a slide-ok előrejelzésnek nevezik; az adatban megfigyelt érték van).
    sf = df.set_index("ts")["cnt"].reindex(pd.date_range(df.ts.min(), df.ts.max(), freq="h"))
    dh = df.copy()
    for k in range(1, 28):
        dh[f"L{k}"] = sf.shift(k).reindex(dh["ts"]).to_numpy()
    dh["L336"] = sf.shift(336).reindex(dh["ts"]).to_numpy()
    wcols = ["temp", "atemp", "hum", "windspeed", "weathersit"]
    hor = {}
    for h in (1, 2, 3, 6, 12, 24):
        rec = [f"L{h}", f"L{h + 1}", f"L{h + 2}"] + (["L24"] if h <= 24 else [])
        hor[str(h)] = {}
        for wname, wdrop in (("weather", False), ("no_weather", True)):
            hcols = list(dict.fromkeys([c for c in B.BASE if not (wdrop and c in wcols)] + rec + ["lag168", "L336"]))
            o = B.oof_time(B.xgb, hcols, dh)
            hor[str(h)][wname] = B.metrics(o.y, o.p)["rmse"]
    R["horizon"] = hor
    return R, O, df


if __name__ == "__main__":
    R, O, df = compute()
    (HERE / "results.json").write_text(json.dumps(R, indent=1, ensure_ascii=False))
    print(json.dumps(R, indent=1, ensure_ascii=False))
