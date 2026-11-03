"""Az 5. óra ábrái és táblázat-képei -> assets/. Minden szám a results.compute()-ból jön (ugyanaz a bike.py, mint a notebookban).

Futtatás (a lecke mappájából): uv run python build_assets.py     (kb. 1 perc: a modelleket újraszámolja, rögzített seedekkel)

Az EDA-ábrák csak a dev szakaszt (2011-01 .. 2012-10) használják: a végső teszt (2012-11, 2012-12) csak a záró blokkban jelenik meg.
"""
import warnings
from pathlib import Path

import bike as B
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.patches import Rectangle
from results import compute

warnings.filterwarnings("ignore")
HERE = Path(__file__).parent
OUT = HERE / "assets"
OUT.mkdir(exist_ok=True)

# A deck színeihez igazítva (assets/deck/deck.css), mint a 3. és 4. órán. A kék/narancs páros átment a validate_palette.js dark ellenőrzésén.
SURFACE, INK, INK2, GRID = "#0d2a20", "#e9e4d2", "#b9c2b3", "#30483c"
BLUE, ORANGE, MUTED = "#3987e5", "#d95926", "#7d9486"
plt.rcParams.update({"figure.facecolor": SURFACE, "axes.facecolor": SURFACE, "savefig.facecolor": SURFACE,
    "text.color": INK, "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK2, "axes.edgecolor": GRID,
    "axes.spines.top": False, "axes.spines.right": False, "axes.grid": True, "grid.color": GRID, "grid.alpha": .7,
    "font.size": 15, "axes.titlesize": 17, "axes.labelsize": 15, "legend.fontsize": 14})
hu = lambda v, nd=2: f"{v:.{nd}f}".replace(".", ",")
thou = lambda v: f"{v:,.0f}".replace(",", " ")
DIV = LinearSegmentedColormap.from_list("div", [BLUE, "#1d3b31", ORANGE])  # kék - semleges - narancs


def keep(fig, name):
    fig.savefig(OUT / f"{name}.png", dpi=170, bbox_inches="tight", facecolor=SURFACE)
    plt.close(fig)


def table_png(df, name, hl_rows=None, hl_cells=None, fs=16, first_left=False):
    """Sötét témájú táblázat-ábra (a deck-motornak nincs táblázat-blokkja). hl_cells: {(sor, oszlop)} narancs kiemelés."""
    widths = [max(len(str(v)) for v in [c, *df[c]]) * 0.155 + 0.8 for c in df.columns]
    fig, ax = plt.subplots(figsize=(sum(widths), .62 * (len(df) + 1)))
    ax.axis("off")
    t = ax.table(cellText=df.values.tolist(), colLabels=list(df.columns), loc="center", cellLoc="center",
                 colWidths=[w / sum(widths) for w in widths])
    t.auto_set_font_size(False)
    t.set_fontsize(fs)
    t.scale(1, 1.9)
    for (r, c), cell in t.get_celld().items():
        cell.set_edgecolor(GRID)
        cell.set_linewidth(1)
        if first_left and c == 0:
            cell.get_text().set_ha("left"); cell.set_text_props(ha="left"); cell._loc = "left"
        if r == 0:
            cell.set_facecolor("#123626"); cell.get_text().set_color("#d1a13a"); cell.get_text().set_fontweight("bold")
        else:
            cell.set_facecolor("#16442f" if hl_rows and (r - 1) in hl_rows else SURFACE)
            cell.get_text().set_color(INK)
            if hl_cells and (r - 1, c) in hl_cells:
                cell.set_facecolor("#6b2f14"); cell.get_text().set_fontweight("bold")
    keep(fig, name)


print("számítás (modellek)...", flush=True)
R, O, df = compute()
dev = df[df.ts < B.DEV_END].copy()
raw = pd.read_csv(HERE / "data" / "hour.csv")
NAMES = {"mean": "Átlag", "naive_week": "Múlt heti azonos óra", "naive_prev": "Előző óra", "lr_naive": "Lineáris (óra = szám)",
         "lr_fair": "Lineáris (tisztességes)", "tree": "Döntési fa", "forest": "Random Forest", "xgb": "XGBoost"}

# ================================================================= adat, EDA
# nyers sorok (a szivárgó oszlopok kiemelve)
t = raw.iloc[[8, 9, 10, 11, 12, 13]][["dteday", "hr", "workingday", "weathersit", "temp", "hum", "casual", "registered", "cnt"]].copy()
t.columns = ["dátum", "óra", "munkanap", "időjárás", "temp", "páratart.", "casual", "registered", "cnt"]
t["temp"] = t["temp"].map(lambda v: hu(v)); t["páratart."] = t["páratart."].map(lambda v: hu(v))
table_png(t.astype(str), "tbl_nyers", hl_cells={(r, c) for r in range(6) for c in (6, 7)}, fs=15)

# lag-táblázat egy hiányzó óra körül (időbélyeg szerinti késleltetés)
d2 = B.add_lags(B.load())
gaps = d2.index[(d2.ts.diff() > pd.Timedelta("1h")) & (d2.index > 800)]
g = next(int(i) for i in gaps if d2.iloc[i - 1: i + 3][["lag24", "lag168"]].notna().all().all())  # tiszta példa: csak a lag1 hiányzik
tt = d2.iloc[g - 1: g + 3][["ts", "cnt", "lag1", "lag24", "lag168"]].copy()
fmt = lambda v: "hiányzik" if pd.isna(v) else str(int(v))
hlc = {(i, c) for i, (_, r_) in enumerate(tt.iterrows()) for c, k in ((2, "lag1"), (3, "lag24"), (4, "lag168")) if pd.isna(r_[k])}
tt["ts"] = tt.ts.dt.strftime("%m-%d %H:00"); tt["cnt"] = tt.cnt.astype(int)
for k in ("lag1", "lag24", "lag168"): tt[k] = tt[k].map(fmt)
tt.columns = ["időpont", "cnt", "lag1 (1 órája)", "lag24 (tegnap)", "lag168 (múlt hét)"]
table_png(tt, "tbl_lag", hl_cells=hlc, fs=15)
R["lag_table_gap_ts"] = str(d2.ts.iloc[g])

# 1. napi menet: óra szerint, munkanap / nem munkanap
fig, ax = plt.subplots(figsize=(9.5, 4.8))
for wd, col, lab in ((1, ORANGE, "munkanap"), (0, BLUE, "hétvége / ünnep")):
    s = dev[dev.workingday == wd].groupby("hr").cnt.mean()
    ax.plot(s.index, s.values, color=col, lw=2.6, marker="o", ms=5)
    ax.text(s.index[-1] + .4 if wd else 12.5, s.values[-1] if wd else s.values[12] + 14, lab, color=col, fontsize=15, va="center", ha="left" if wd else "center")
ax.set_xlabel("óra"); ax.set_ylabel("átlagos kölcsönzés / óra"); ax.set_xticks(range(0, 24, 3)); ax.set_xlim(-.5, 27)
keep(fig, "eda_ora")

# 2. hőmérséklet
dev["tc"] = dev.temp * 41
bins = pd.cut(dev.tc, np.arange(-1, 43, 4)); s = dev.groupby(bins, observed=True).agg(c=("cnt", "mean"), n=("cnt", "size"), tc=("tc", "mean"))
fig, ax = plt.subplots(figsize=(9.5, 4.8))
ax.scatter(dev.tc.sample(2500, random_state=0), dev.cnt.sample(2500, random_state=0), s=7, color=MUTED, alpha=.25, lw=0)
ax.plot(s.tc, s.c, color=ORANGE, lw=2.8, marker="o", ms=6)
slope = np.polyfit(dev.tc, dev.cnt, 1); xs = np.array([0, 40])
ax.plot(xs, np.polyval(slope, xs), color=BLUE, lw=2.2, ls="--")
ax.text(2, 215, "egyenes illesztés", color=BLUE, fontsize=14)
ax.text(29, s.c.max() + 55, "sávátlag", color=ORANGE, fontsize=14, ha="left")
ax.set_xlabel("hőmérséklet (°C)"); ax.set_ylabel("kölcsönzés / óra"); ax.set_ylim(0, 800)
keep(fig, "eda_homerseklet")

# 3. trend (heti átlag)
wk = dev.set_index("ts").cnt.resample("W").mean()
fig, ax = plt.subplots(figsize=(10, 4.6))
ax.plot(wk.index, wk.values, color=BLUE, lw=2.4)
jm = R["data"]["janoct_means"]
for yr, x0, x1 in ((0, "2011-01-01", "2011-10-31"), (1, "2012-01-01", "2012-10-31")):
    v = jm[str(yr)] if str(yr) in jm else jm[yr]
    ax.hlines(v, pd.Timestamp(x0), pd.Timestamp(x1), color=ORANGE, lw=2.2, ls="--")
    ax.text(pd.Timestamp(x0) + pd.Timedelta(days=8), v + 14, f"jan–okt átlag {hu(v, 1)}", color=ORANGE, fontsize=14)
ax.set_ylabel("heti átlag, kölcsönzés / óra"); ax.set_ylim(0, 400)
keep(fig, "eda_trend")

# 4. eloszlás + a szórás az átlaggal nő
fig, (a1, a2) = plt.subplots(1, 2, figsize=(11.5, 4.5), gridspec_kw={"width_ratios": [1.1, 1]})
a1.hist(dev.cnt, bins=45, color=BLUE, edgecolor=SURFACE)
a1.set_xlabel("kölcsönzés / óra"); a1.set_ylabel("órák száma"); a1.set_title("jobbra elnyúló", color=INK2, fontsize=15)
gh = dev.groupby(["hr", "workingday"]).cnt.agg(["mean", "std"])
a2.scatter(gh["mean"], gh["std"], s=48, color=ORANGE)
a2.set_xlabel("átlag (óra × munkanap csoportonként)"); a2.set_ylabel("szórás"); a2.set_title("a szórás az átlaggal nő", color=INK2, fontsize=15)
keep(fig, "eda_eloszlas")

# ================================================================= kiértékelés
# időrendi foldok
fig, ax = plt.subplots(figsize=(11.5, 3.9))
m0 = pd.Timestamp("2011-01-01"); mo = lambda s: (pd.Timestamp(s).year - 2011) * 12 + pd.Timestamp(s).month - 1
rows = [(f"fold {i + 1}", mo(a), mo(b)) for i, (a, b) in enumerate(B.FOLDS)]
for k, (lab, a, b) in enumerate(rows):
    y = 3 - k
    ax.add_patch(Rectangle((0, y), a, .62, color=BLUE)); ax.add_patch(Rectangle((a, y), b - a, .62, color=ORANGE))
    ax.text(-.5, y + .31, lab, ha="right", va="center", color=INK2, fontsize=14)
ax.add_patch(Rectangle((0, 0), mo(B.FINAL[0]), .62, color=BLUE, alpha=.55)); ax.add_patch(Rectangle((mo(B.FINAL[0]), 0), 2, .62, facecolor=SURFACE, edgecolor=INK, hatch="////", lw=1.6))
ax.text(-.5, .31, "záró teszt", ha="right", va="center", color=INK2, fontsize=14)
ax.text(2, 3.85, "tanítás", color=BLUE, fontsize=15, fontweight="bold"); ax.text(mo(B.FOLDS[0][0]) + 1, 3.85, "teszt", color=ORANGE, fontsize=15, fontweight="bold")
ax.text(mo(B.FINAL[0]) + 1, -.65, "egyszer, a végén", color=INK, fontsize=13, ha="center")
ax.set_xlim(-6, 24); ax.set_ylim(-1, 4.7); ax.set_yticks([]); ax.grid(False)
ax.set_xticks([0, 6, 12, 18, 24]); ax.set_xticklabels(["2011-01", "2011-07", "2012-01", "2012-07", "2013-01"])
ax.spines["left"].set_visible(False)
keep(fig, "split_idorendi")

# véletlen vs időrendi
rv = R["random_vs_time"]
fig, ax = plt.subplots(figsize=(8.6, 3.5))
vals = [rv["random"]["rmse"], rv["time"]["rmse"]]
bars = ax.barh(["véletlen vágás", "időrendi vágás"], vals, color=[MUTED, ORANGE], height=.55)
for b, v in zip(bars, vals): ax.text(v + 1.5, b.get_y() + b.get_height() / 2, hu(v, 1), va="center", color=INK, fontsize=17, fontweight="bold")
ax.set_xlim(0, 80); ax.set_xlabel("RMSE ugyanazokon a teszt-órákon (XGBoost)"); ax.invert_yaxis(); ax.grid(axis="y", visible=False)
keep(fig, "random_vs_time")

# alapmodellek
L = R["ladder"]
base_t = pd.DataFrame([[NAMES[k], hu(L[k]["rmse"], 1), hu(L[k]["mae"], 1), hu(L[k]["r2"])] for k in ("mean", "naive_prev", "naive_week")],
                      columns=["Alapmodell", "RMSE", "MAE", "R²"])
table_png(base_t, "tbl_alap", hl_rows={2})

# a mutatók táblázata (ugyanazon a jóslaton)
keys = ["mean", "naive_week", "lr_naive", "lr_fair", "tree", "forest", "xgb"]
M = pd.DataFrame({"Modell": [NAMES[k] for k in keys]})
cols = [("RMSE", "rmse", 1, min), ("MAE", "mae", 1, min), ("WAPE", "wape", 3, min), ("RMSLE", "rmsle", 3, min), ("R²", "r2", 3, max)]
hl = set()
for j, (lab, key, nd, fn) in enumerate(cols, start=1):
    v = [L[k][key] for k in keys]; M[lab] = [hu(x, nd) for x in v]; hl.add((v.index(fn(v)), j))
table_png(M, "tbl_mutatok", hl_cells=hl, fs=15, first_left=True)

# RMSE a csúcsot, RMSLE az éjszakát nézi
sb = R["segments_base"]
seg_t = pd.DataFrame([["éjszaka (0–5 óra)", hu(sb["night_mean"], 0), hu(sb["night_rmse"], 1), f"{hu(sb['night_rmse'] / sb['night_mean'] * 100, 0)}%"],
                      ["csúcs (7–8, 17–18 óra)", hu(sb["peak_mean"], 0), hu(sb["peak_rmse"], 1), f"{hu(sb['peak_rmse'] / sb['peak_mean'] * 100, 0)}%"]],
                     columns=["Órák", "átlagos kereslet", "RMSE", "RMSE / átlag"])
table_png(seg_t, "tbl_szegmens_alap", fs=16, first_left=True)

# ================================================================= modell-létra
# lineáris, az óra számként
lo = O["ladder"]["lr_naive"].merge(df[["ts", "hr"]], on="ts"); ac = dev.groupby("hr").cnt.mean()
fig, ax = plt.subplots(figsize=(9.5, 4.6))
ax.plot(ac.index, ac.values, color=ORANGE, lw=2.8, marker="o", ms=5); ax.text(9.5, 425, "tényleges átlag", color=ORANGE, fontsize=15)
pr = lo.groupby("hr").p.mean(); ax.plot(pr.index, pr.values, color=BLUE, lw=2.8, marker="o", ms=5); ax.text(2, pr.values[2] - 90, "lineáris modell (az óra egy szám)", color=BLUE, fontsize=15)
ax.set_xlabel("óra"); ax.set_ylabel("kölcsönzés / óra"); ax.set_xticks(range(0, 24, 3))
keep(fig, "lr_ora_szam")

# a létra
order = ["mean", "lr_naive", "lr_fair", "tree", "forest", "xgb"]
fig, ax = plt.subplots(figsize=(10, 5))
ys = np.arange(len(order))
cols_b = [MUTED, BLUE, BLUE, BLUE, BLUE, ORANGE]
ax.barh(ys, [L[k]["rmse"] for k in order], color=cols_b, height=.58)
for y_, k in zip(ys, order):
    ax.scatter(L[k]["fold_rmse"], [y_] * 3, s=26, color=INK, zorder=3)
    ax.text(max(max(L[k]["fold_rmse"]), L[k]["rmse"]) + 8, y_, hu(L[k]["rmse"], 1), va="center", color=INK, fontsize=16, fontweight="bold", bbox=dict(fc=SURFACE, ec="none", pad=1.5), zorder=5)
ax.axvline(L["naive_week"]["rmse"], color=INK, ls="--", lw=1.8); ax.text(L["naive_week"]["rmse"] + 3, -.62, f"múlt heti azonos óra: {hu(L['naive_week']['rmse'], 1)}", color=INK, fontsize=14)
ax.set_yticks(ys); ax.set_yticklabels([NAMES[k] for k in order]); ax.invert_yaxis(); ax.set_xlim(0, 320); ax.grid(axis="y", visible=False)
ax.set_xlabel("RMSE, 3 időrendi fold átlaga (pontok: foldonként)")
keep(fig, "ladder")

# PDP: két púp / egy púp
fig, ax = plt.subplots(figsize=(9.5, 4.6))
for wd, col, lab in ((1, ORANGE, "munkanap"), (0, BLUE, "hétvége / ünnep")):
    ax.plot(range(24), O["pdp"][wd], color=col, lw=2.8, marker="o", ms=5)
ax.text(17.8, O["pdp"][1][17] + 8, "munkanap", color=ORANGE, fontsize=15); ax.text(13.2, O["pdp"][0][12] + 30, "hétvége / ünnep", color=BLUE, fontsize=15)
ax.set_xlabel("óra"); ax.set_ylabel("átlagos jósolt kölcsönzés"); ax.set_xticks(range(0, 24, 3)); ax.set_ylim(0, 520)
keep(fig, "pdp_ora")

# ================================================================= diagnosztika
ob = O["xgb_base"]; Fn = R["funnel"]
# kalibráció deciliseken
fig, ax = plt.subplots(figsize=(7.2, 5.4))
lim = 760; ax.plot([0, lim], [0, lim], color=INK2, ls="--", lw=1.6); ax.text(470, 440, "tökéletes", color=INK2, fontsize=14, rotation=36)
ax.scatter(Fn["p_mean"], Fn["y_mean"], s=95, color=ORANGE, zorder=3)
ax.annotate(f"legfelső decilis:\njósolt {hu(Fn['p_mean'][-1], 0)},\ntényleges {hu(Fn['y_mean'][-1], 0)}", (Fn["p_mean"][-1], Fn["y_mean"][-1]), xytext=(290, 600), color=INK, fontsize=14,
            arrowprops=dict(arrowstyle="-", color=INK2))
ax.set_xlim(0, lim); ax.set_ylim(0, lim); ax.set_xlabel("átlagos jósolt érték (decilis)"); ax.set_ylabel("átlagos tényleges érték")
keep(fig, "calib_decilis")

# reziduum vs becsült: tölcsér
s_ = ob.sample(3500, random_state=0)
fig, ax = plt.subplots(figsize=(10, 4.8))
ax.scatter(s_.p, s_.resid, s=8, color=MUTED, alpha=.35, lw=0)
ax.plot(Fn["p_mean"], Fn["sd"], color=ORANGE, lw=2.8, marker="o", ms=6); ax.plot(Fn["p_mean"], [-v for v in Fn["sd"]], color=ORANGE, lw=2.8, marker="o", ms=6)
ax.axhline(0, color=INK2, lw=1.4); ax.text(690, 112, "±1 szórás", color=ORANGE, fontsize=15)
ax.set_xlabel("becsült kölcsönzés"); ax.set_ylabel("reziduum (tényleges − becsült)")
keep(fig, "reziduum_tolcser")

# log cél
lt = R["log_target"]
log_t = pd.DataFrame([["nyers cél", hu(lt["raw"]["rmse"], 1), hu(lt["raw"]["rmsle"], 3), f"{hu(lt['mean_ratio_raw'] * 100, 1)}%"],
                      ["log(1 + cél)", hu(lt["log"]["rmse"], 1), hu(lt["log"]["rmsle"], 3), f"{hu(lt['mean_ratio_log'] * 100, 1)}%"]],
                     columns=["XGBoost célváltozója", "RMSE", "RMSLE", "jósolt / tényleges összeg"])
table_png(log_t, "tbl_log", hl_cells={(1, 1), (1, 2), (1, 3)} if False else {(1, 2)}, fs=16, first_left=True)

# negatív jóslatok éjszaka
nb = ob[ob.hr <= 5]
fig, ax = plt.subplots(figsize=(9, 4.2))
ax.hist(nb.p, bins=np.arange(-45, 125, 5), range=(-45, 120), color=BLUE, edgecolor=SURFACE)
ax.axvline(0, color=ORANGE, lw=2.6); ax.text(-3, ax.get_ylim()[1] * .8, "0 alatt:\nlehetetlen", color=ORANGE, fontsize=15, ha="right")
ax.set_xlabel("XGBoost jóslat éjjel (0–5 óra)"); ax.set_ylabel("órák száma")
keep(fig, "negativ_joslat")

# torzítás: óra × munkanap
seg = O["bias_hr_wd"]
fig, ax = plt.subplots(figsize=(11, 3.2))
im = ax.imshow(seg.T.loc[[1, 0]].values, cmap=DIV, vmin=-65, vmax=65, aspect="auto")
ax.set_yticks([0, 1]); ax.set_yticklabels(["munkanap", "hétvége / ünnep"]); ax.set_xticks(range(0, 24, 2)); ax.set_xlabel("óra"); ax.grid(False)
cb = fig.colorbar(im, ax=ax, pad=.01); cb.set_label("átlagos reziduum"); cb.outline.set_edgecolor(GRID); cb.ax.tick_params(colors=INK2)
for sp in ax.spines.values(): sp.set_visible(False)
keep(fig, "bias_ora_munkanap")

# a legrosszabb hét
w = ob.assign(week=pd.to_datetime(ob.ts).dt.to_period("W-SUN").dt.start_time)
cnt = w.groupby("week").size(); okw = cnt[cnt >= 160].index
worst = w[w.week.isin(okw)].groupby("week").apply(lambda g: (g.resid ** 2).mean()).idxmax()
wk_ = w[w.week == worst]
fig, ax = plt.subplots(figsize=(11.5, 4.6))
ax.plot(pd.to_datetime(wk_.ts), wk_.y, color=BLUE, lw=2.4); ax.plot(pd.to_datetime(wk_.ts), wk_.p, color=ORANGE, lw=2.4)
ax.text(pd.to_datetime(wk_.ts).iloc[3], wk_.y.max() * 1.2, "tényleges", color=BLUE, fontsize=15); ax.text(pd.to_datetime(wk_.ts).iloc[3], wk_.y.max() * 1.1, "XGBoost", color=ORANGE, fontsize=15)
ax.set_ylabel("kölcsönzés / óra"); ax.set_ylim(0, wk_.y.max() * 1.32); ax.xaxis.set_major_formatter(plt.matplotlib.dates.DateFormatter("%m-%d"))
keep(fig, "het_joslat")
R["worst_week_start"] = str(worst.date())

# ACF
a0, a1_ = O["acf_base"], O["acf_lags"]
fig, ax = plt.subplots(figsize=(10.5, 4.6))
lags_ = np.arange(1, 49)
ax.plot(lags_, a0[1:], color=ORANGE, lw=2.4, marker="o", ms=5); ax.plot(lags_, a1_[1:], color=BLUE, lw=2.4, marker="o", ms=5)
ax.axhline(0, color=INK2, lw=1.2)
ax.text(5, .6, "alap XGBoost", color=ORANGE, fontsize=15); ax.text(27, .21, "+ késleltetett jellemzők", color=BLUE, fontsize=15)
ax.set_xlabel("késleltetés (óra)"); ax.set_ylabel("a reziduum autokorrelációja"); ax.set_xticks([1, 6, 12, 18, 24, 30, 36, 42, 48])
keep(fig, "acf")

# a lineáris modell feltevései
feltev = pd.DataFrame([
    ["lineáris kapcsolat", "reziduum szegmensenként", "az óra-görbe nem egyenes"],
    ["állandó szórás", "reziduum vs becsült", f"tölcsér: szórás {hu(Fn['sd'][0], 0)} → {hu(Fn['sd'][-1], 0)}"],
    ["független hibák", "autokorreláció (ACF)", f"az 1 órás késleltetésnél {hu(R['acf_base']['lag1'])}"],
    ["azonos eloszlás", "időrendi vágás", f"véletlen vágás {hu((1 - rv['random']['rmse'] / rv['time']['rmse']) * 100, 0)}%-kal optimista"],
], columns=["Klasszikus feltevés", "Hogyan nézzük", "Itt mit láttunk"])
table_png(feltev, "tbl_feltevesek", fs=17, first_left=True)

# ================================================================= visszacsatolás
fw, fr_, f1 = R["fe_wrong"], R["fe_right"], R["fe_lag1"]
rossz = pd.DataFrame([["alap jellemzők", hu(L["xgb"]["rmse"], 1), hu(L["xgb"]["r2"], 3)],
                      ["+ 3 órás átlag (a mostani órával)", hu(fw["rmse"], 1), hu(fw["r2"], 3)]], columns=["XGBoost", "RMSE", "R²"])
table_png(rossz, "tbl_fe_rossz", hl_cells={(1, 1), (1, 2)}, fs=17, first_left=True)

fig, ax = plt.subplots(figsize=(10, 4.7))
x = np.arange(3); w_ = .36
b0, b1 = L["xgb"]["fold_rmse"], fr_["xgb_lags"]["fold_rmse"]
r0 = ax.bar(x - w_ / 2, b0, w_, color=BLUE); r1 = ax.bar(x + w_ / 2, b1, w_, color=ORANGE)
for rr in (r0, r1):
    for b in rr: ax.text(b.get_x() + b.get_width() / 2, b.get_height() + 1.2, hu(b.get_height(), 1), ha="center", color=INK, fontsize=14)
ax.set_xticks(x); ax.set_xticklabels(["fold 1 (2012-05–06)", "fold 2 (07–08)", "fold 3 (09–10)"]); ax.set_ylim(0, 85); ax.set_ylabel("RMSE"); ax.grid(axis="x", visible=False)
ax.text(-.45, 78, "alap", color=BLUE, fontsize=15, fontweight="bold"); ax.text(.1, 78, "+ késleltetések", color=ORANGE, fontsize=15, fontweight="bold")
keep(fig, "fe_helyes")

ab = R["fe_ablation_rmse"]
items = [("alap jellemzők", L["xgb"]["rmse"], MUTED), ("+ lag24 (tegnap)", ab["lag24"], BLUE), ("+ lag168 (múlt hét)", ab["lag168"], BLUE),
         ("+ roll3 (3 órás átlag)", ab["roll3"], BLUE), ("+ mind a hat", fr_["xgb_lags"]["rmse"], BLUE), ("+ csak lag1", ab["lag1"], ORANGE)]
fig, ax = plt.subplots(figsize=(10, 4.8))
for i, (lab, v, c) in enumerate(items):
    ax.barh(i, v, color=c, height=.58); ax.text(v + 1, i, hu(v, 1), va="center", color=INK, fontsize=16, fontweight="bold")
ax.set_yticks(range(len(items))); ax.set_yticklabels([i[0] for i in items]); ax.invert_yaxis(); ax.set_xlim(0, 80); ax.grid(axis="y", visible=False)
ax.set_xlabel("RMSE, XGBoost, 3 időrendi fold")
keep(fig, "fe_ablation")

# újradiagnosztika: tölcsér előtte/utána
fl = R["funnel_lags"]
fig, ax = plt.subplots(figsize=(9.5, 4.6))
ax.plot(Fn["p_mean"], Fn["sd"], color=ORANGE, lw=2.8, marker="o", ms=6); ax.plot(fl["p_mean"], fl["sd"], color=BLUE, lw=2.8, marker="o", ms=6)
ax.text(480, 105, "alap", color=ORANGE, fontsize=15); ax.text(560, 48, "+ késleltetések", color=BLUE, fontsize=15)
ax.set_xlabel("becsült kölcsönzés (decilis)"); ax.set_ylabel("a reziduum szórása"); ax.set_ylim(0, 115)
keep(fig, "rediag_tolcser")

sl = R["segments_lags"]
seg2 = pd.DataFrame([["éjszaka (0–5 óra)", hu(sb["night_rmse"], 1), hu(sl["night_rmse"], 1)], ["csúcs (7–8, 17–18 óra)", hu(sb["peak_rmse"], 1), hu(sl["peak_rmse"], 1)]],
                    columns=["Órák", "RMSE alap", "RMSE + késleltetések"])
table_png(seg2, "tbl_szegmens_javitas", fs=16, first_left=True)

# ================================================================= extrapoláció
E = R["extrapolation"]
fig, ax = plt.subplots(figsize=(10.5, 4.8))
act = O["ext_xgb_base"].set_index("ts").y.resample("MS").mean()
ax.plot(act.index, act.values, color=INK, lw=2.8, marker="o", ms=5)
for key, col in (("xgb_base", ORANGE), ("lr_fair_lags", BLUE)):
    s = O[f"ext_{key}"].set_index("ts").p.resample("MS").mean(); ax.plot(s.index, s.values, color=col, lw=2.8, marker="o", ms=5)
ax.text(act.index[0], act.values[0] + 75, "tényleges", color=INK, fontsize=15)
sx = O["ext_xgb_base"].set_index("ts").p.resample("MS").mean(); ax.text(sx.index[4], sx.values[4] - 75, "XGBoost, alap jellemzők", color=ORANGE, fontsize=15)
sl_ = O["ext_lr_fair_lags"].set_index("ts").p.resample("MS").mean(); ax.text(sl_.index[6], sl_.values[6] - 52, "lineáris + késleltetések", color=BLUE, fontsize=15)
ax.set_ylabel("havi átlag, kölcsönzés / óra"); ax.set_ylim(0, 380); ax.xaxis.set_major_formatter(plt.matplotlib.dates.DateFormatter("%m"))
ax.set_xlabel("2012 hónapjai (a modellek csak 2011-et láttak)")
keep(fig, "ext_trend")
ext_t = pd.DataFrame([[n, hu(E[k]["rmse"], 1), f"{hu(E[k]['sum_ratio'] * 100, 0)}%"] for k, n in
                      (("xgb_base", "XGBoost, alap"), ("xgb_lag1", "XGBoost + lag1"), ("xgb_lags", "XGBoost + mind a hat"), ("lr_fair", "Lineáris, alap"), ("lr_fair_lags", "Lineáris + késleltetések"))],
                     columns=["Modell (2011-en tanult, 2012 a teszt)", "RMSE", "jósolt / tényleges összeg"])
table_png(ext_t, "tbl_ext", hl_cells={(4, 1), (4, 2)}, fs=15, first_left=True)

# ================================================================= záró teszt
F = R["final"]["models"]
dev_rmse = {"naive_week": L["naive_week"]["rmse"], "lr_fair": L["lr_fair"]["rmse"], "lr_fair_lags": fr_["lr_fair_lags"]["rmse"],
            "xgb": L["xgb"]["rmse"], "xgb_lags": fr_["xgb_lags"]["rmse"], "xgb_lag1": f1["rmse"]}
fn_names = {"naive_week": "Múlt heti azonos óra", "lr_fair": "Lineáris, alap", "lr_fair_lags": "Lineáris + késleltetések", "xgb": "XGBoost, alap",
            "xgb_lags": "XGBoost + mind a hat", "xgb_lag1": "XGBoost + lag1 (választott)"}
vt = pd.DataFrame([[fn_names[k], hu(dev_rmse[k], 1), hu(F[k]["rmse"], 1), hu(F[k]["mae"], 1), hu(F[k]["wape"], 3), hu(F[k]["r2"], 3)] for k in fn_names],
                  columns=["Modell", "CV-RMSE (dev)", "teszt RMSE", "MAE", "WAPE", "R²"])
table_png(vt, "tbl_vegso", hl_rows={5}, fs=15, first_left=True)

fig, ax = plt.subplots(figsize=(9.5, 3.4))
win = F["xgb_lag1"]["rmse"]
items = [("XGBoost + lag1 vs. XGBoost alap", F["xgb"]["rmse"] - win, R["final"]["gain_vs_base_ci"]),
         ("XGBoost + lag1 vs. lineáris + késleltetések", F["lr_fair_lags"]["rmse"] - win, R["final"]["gain_vs_lr_lags_ci"])]
for i, (lab, pt, ci) in enumerate(items):
    ax.hlines(i, ci[0], ci[1], color=ORANGE, lw=4); ax.scatter([pt], [i], s=110, color=INK, zorder=3)
    ax.text(ci[1] + 1.2, i, f"{hu(pt, 1)}  [{hu(ci[0], 1)}; {hu(ci[1], 1)}]", va="center", color=INK, fontsize=14)
ax.axvline(0, color=INK2, lw=1.6, ls="--"); ax.set_yticks([0, 1]); ax.set_yticklabels([i[0] for i in items], fontsize=13); ax.invert_yaxis(); ax.set_xlim(-2, 62); ax.grid(axis="y", visible=False)
ax.set_xlabel("RMSE-javulás a teszthalmazon (95%-os napi blokk-bootstrap)")
keep(fig, "final_javulas")

# intervallum
iv = O["interval"]; st = pd.Timestamp("2012-11-12"); wkk = iv[(iv.ts >= st) & (iv.ts < st + pd.Timedelta(days=7))]
fig, ax = plt.subplots(figsize=(11.5, 4.8))
ax.fill_between(wkk.ts, wkk.lo, wkk.hi, color=BLUE, alpha=.35, lw=0); ax.plot(wkk.ts, wkk.p, color=ORANGE, lw=2.2); ax.plot(wkk.ts, wkk.y, color=INK, lw=1.4, alpha=.9)
ax.text(wkk.ts.iloc[4], wkk.hi.max() * .97, "90%-os sáv (5.–95. percentilis)", color=BLUE, fontsize=15); ax.text(wkk.ts.iloc[4], wkk.hi.max() * .85, "pontbecslés", color=ORANGE, fontsize=15)
ax.text(wkk.ts.iloc[4], wkk.hi.max() * .73, "tényleges", color=INK, fontsize=15)
ax.set_ylabel("kölcsönzés / óra"); ax.set_ylim(0, wkk.hi.max() * 1.1); ax.xaxis.set_major_formatter(plt.matplotlib.dates.DateFormatter("%m-%d"))
keep(fig, "interval")

import json

(HERE / "results.json").write_text(json.dumps(R, indent=1, ensure_ascii=False))
print("kész:", len(list(OUT.glob("*.png"))), "kép")
