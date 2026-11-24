"""A 6. óra ábrái és táblázat-képei -> assets/. Minden szám az expl.compute()-ból jön (ugyanaz az 5. órás bike.py, mint a notebookban).

Futtatás (a lecke mappájából): uv run python build_assets.py     (kb. 1 perc, rögzített seedek)
Az ábrák csak a dev szakaszt (2011-01 .. 2012-10) használják; a záró teszt (2012-11, 12) érintetlen.
"""
import json
import warnings
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import shap
from matplotlib.patches import Rectangle

from expl import compute

warnings.filterwarnings("ignore")
HERE = Path(__file__).parent
OUT = HERE / "assets"
OUT.mkdir(exist_ok=True)

SURFACE, INK, INK2, GRID = "#0d2a20", "#e9e4d2", "#b9c2b3", "#30483c"
BLUE, ORANGE, MUTED = "#3987e5", "#d95926", "#7d9486"
plt.rcParams.update({"figure.facecolor": SURFACE, "axes.facecolor": SURFACE, "savefig.facecolor": SURFACE,
    "text.color": INK, "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK2, "axes.edgecolor": GRID,
    "axes.spines.top": False, "axes.spines.right": False, "axes.grid": True, "grid.color": GRID, "grid.alpha": .7,
    "font.size": 15, "axes.titlesize": 17, "axes.labelsize": 15, "legend.fontsize": 14})
hu = lambda v, nd=2: f"{v:.{nd}f}".replace(".", ",")
sg = lambda v, nd=2: ("+" if v >= 0 else "−") + f"{abs(v):.{nd}f}".replace(".", ",")


def keep(fig, name):
    fig.savefig(OUT / f"{name}.png", dpi=170, bbox_inches="tight", facecolor=SURFACE)
    plt.close(fig)


def table_png(df, name, hl_cells=None, fs=16, first_left=True, left_cols=(), header_col=False):
    """Sötét témájú táblázat-ábra. A cellák a SZÖVEG MÉRETÉHEZ igazodnak (a szöveget lemérjük), így a betű sosem lóg ki a cellából.
    hl_cells: {(sor, oszlop)} narancs kiemelés; header_col: az első oszlop fejléc-stílusú."""
    cols = list(df.columns)
    body = [[str(x) for x in row] for row in df.values.tolist()]
    probe = plt.figure(figsize=(4, 2), dpi=170)
    rend = probe.canvas.get_renderer()

    def ext(text, bold=False):
        t = probe.text(0, 0, text, fontsize=fs, fontweight="bold" if bold else "normal")
        bb = t.get_window_extent(rend)
        t.remove()
        return bb.width / 170, bb.height / 170

    padx, pady = .55 * fs / 72, .55 * fs / 72
    widths = [max(ext(str(c), True)[0], *(ext(r[j], (header_col and j == 0) or bool(hl_cells and (i, j) in hl_cells))[0] for i, r in enumerate(body))) + 2 * padx
              for j, c in enumerate(cols)]
    heights = [max(ext(str(c), True)[1] for c in cols) + 2 * pady] + [max(ext(x)[1] for x in r) + 2 * pady for r in body]
    plt.close(probe)
    W, H = sum(widths), sum(heights)
    fig = plt.figure(figsize=(W + .1, H + .1))
    ax = fig.add_axes([.05 / (W + .1), .05 / (H + .1), W / (W + .1), H / (H + .1)])
    ax.set_xlim(0, W); ax.set_ylim(H, 0); ax.axis("off")
    y = 0
    for i in range(len(heights)):
        x = 0
        for j in range(len(cols)):
            head = i == 0
            txt = str(cols[j]) if head else body[i - 1][j]
            hl = (not head) and hl_cells and (i - 1, j) in hl_cells
            face = "#123626" if (head or (header_col and j == 0)) else ("#6b2f14" if hl else SURFACE)
            ax.add_patch(Rectangle((x, y), widths[j], heights[i], facecolor=face, edgecolor=GRID, lw=1.2))
            left = (j == 0 and first_left) or j in left_cols
            colr = "#d1a13a" if (head or (header_col and j == 0)) else INK
            ax.text(x + (padx if left else widths[j] / 2), y + heights[i] / 2, txt, fontsize=fs, color=colr, va="center", ha="left" if left else "center",
                    fontweight="bold" if (head or hl or (header_col and j == 0)) else "normal", linespacing=1.3)
            x += widths[j]
        y += heights[i]
    keep(fig, name)


print("számítás...", flush=True)
R, X = compute()
(HERE / "results.json").write_text(json.dumps(R, indent=1, ensure_ascii=False, default=float))
L, G, T, S = R["linear"], R["logistic"], R["trees"], R["shap"]
NAME = {"temp_C": "hőmérséklet", "hum_pct": "páratartalom", "wind_kmh": "szélsebesség", "workingday": "munkanap", "rush": "csúcsóra", "yr": "2012 (vs 2011)"}
UNIT = {"temp_C": "°C", "hum_pct": "százalékpont", "wind_kmh": "km/h", "workingday": "0 → 1", "rush": "0 → 1", "yr": "0 → 1"}
VARS = list(NAME)

# ================================================================= lineáris: nyers együtthatók
rows = [[NAME["temp_C"], "+1 °C", sg(L["raw"]["coef"]["temp_C"])],
        [NAME["hum_pct"], "+1 százalékpont", sg(L["raw"]["coef"]["hum_pct"])],
        [NAME["wind_kmh"], "+1 km/h", sg(L["raw"]["coef"]["wind_kmh"])],
        [NAME["workingday"], "hétvége → munkanap", sg(L["raw"]["coef"]["workingday"])],
        [NAME["rush"], "nem csúcs → csúcsóra", sg(L["raw"]["coef"]["rush"])],
        [NAME["yr"], "2011 → 2012", sg(L["raw"]["coef"]["yr"])]]
table_png(pd.DataFrame(rows, columns=["Jellemző", "Változás", "Együttható (kölcsönzés/óra)"]), "tbl_lin_raw", first_left=True, left_cols=(1,), fs=16)

# egység-csere
F = L["fahrenheit"]
table_png(pd.DataFrame([["hőmérséklet °C-ban", sg(F["coef_temp_C"]), hu(F["r2_C"], 3)], ["hőmérséklet °F-ban", sg(F["coef_temp_F"]), hu(F["r2_F"], 3)]],
                       columns=["Ugyanaz a jellemző", "Együttható", "R²"]), "tbl_units", first_left=True, fs=16)

# standardizált: oszlopdiagram, SD-vel
sd, cs = L["std"]["sd"], L["std"]["coef_per_sd"]
order = sorted(VARS, key=lambda v: abs(cs[v]))
fig, ax = plt.subplots(figsize=(10, 4.6))
ax.barh([f"{NAME[v]}  (1 SD = {hu(sd[v], 2 if v in ('temp_C','hum_pct','wind_kmh') else 2)}{'' if v in ('workingday','rush','yr') else ' ' + UNIT[v]})" for v in order],
        [cs[v] for v in order], color=[BLUE if cs[v] > 0 else ORANGE for v in order])
for i, v in enumerate(order):
    ax.text(cs[v] + (2 if cs[v] >= 0 else -2), i, sg(cs[v], 1), va="center", ha="left" if cs[v] >= 0 else "right", color=INK, fontsize=14)
ax.axvline(0, color=MUTED, lw=1)
ax.set_xlabel("standardizált együttható: kölcsönzés/óra változása +1 szórásnyi (SD) növekedésre")
ax.set_xlim(-65, 105)
ax.grid(axis="y", visible=False)
keep(fig, "fig_lin_std")

# log cél
lg = L["log_target"]
rows = [[NAME[v], sg(lg["coef"][v], 4), f"{sg(lg['pct'][v] * 100, 1)} %", f"×{hu(1 + lg['pct'][v], 3)}"] for v in VARS]
table_png(pd.DataFrame(rows, columns=["Jellemző (nyers egység)", "együttható (log cél)", "exp(b) − 1", "szorzó"]), "tbl_log", first_left=True, fs=16)

# 2x2
Q = L["lag168_2x2"]
table_png(pd.DataFrame([["cél: szint", f"+1 kölcsönzés múlt héten\n→ {sg(Q['level_level'], 2)} kölcsönzés", f"+1 % múlt héten\n→ {sg(Q['level_log'] / 100, 2)} kölcsönzés"],
                        ["cél: log", f"+1 kölcsönzés múlt héten\n→ {sg(Q['log_level'] * 100, 2)} %", f"+1 % múlt héten\n→ {sg(Q['log_log'], 2)} % (rugalmasság)"]],
                       columns=["", "jellemző: szint", "jellemző: log"]), "tbl_2x2", header_col=True, hl_cells={(1, 2)}, first_left=False)

# kollinearitás
C = L["collinear"]
table_png(pd.DataFrame([["csak temp", sg(C["temp_alone"]), "–", hu(C["r2_alone"], 3)], ["temp + atemp (hőérzet)", sg(C["temp_with"]), sg(C["atemp_with"]), hu(C["r2_with"], 3)]],
                       columns=["Modell", "temp együttható", "atemp együttható", "R²"]), "tbl_collin", first_left=True, fs=16, hl_cells={(1, 1)})

# interakció
I = L["interaction"]
table_png(pd.DataFrame([["nincs interakció", sg(I["workingday_main"]), sg(L["raw"]["coef"]["rush"]), "–", hu(L["raw"]["r2"], 3)],
                        ["+ csúcsóra × munkanap", sg(I["workingday_with_int"]), sg(I["rush_with_int"]), sg(I["rush_wd"]), hu(I["r2_with_int"], 3)]],
                       columns=["Modell", "munkanap", "csúcsóra", "csúcsóra × munkanap", "R²"]), "tbl_interaction", first_left=True, fs=16, hl_cells={(0, 1), (1, 1)})

# logisztikus: esély-hányados táblázat
rows = [[NAME[v], hu(G["or"][v], 3), hu(G["or_per_sd"][v], 2)] for v in VARS]
table_png(pd.DataFrame(rows, columns=["Jellemző", "esélyhányados\n(1 egység)", "esélyhányados\n(1 SD)"]), "tbl_or", first_left=True, fs=16)

# logisztikus: valószínűség-görbe
pc = G["p_curve"]
ts = np.array(sorted(map(int, pc)))
fig, ax = plt.subplots(figsize=(9, 4.8))
ax.plot(ts, [pc[str(t)] * 100 for t in ts], color=BLUE, lw=3)
for a, b, key in ((5, 6, "5to6"), (15, 16, "15to16"), (30, 31, "30to31")):
    p0, p1 = G["p_examples"][key]
    ax.plot([a, b], [p0 * 100, p1 * 100], "o", color=ORANGE, ms=8)
    ax.annotate(f"+1 °C: {sg((p1 - p0) * 100, 1)} százalékpont", (b, p1 * 100), xytext=(b + 1, p1 * 100 - 11), color=INK, fontsize=13)
ax.set_xlabel("hőmérséklet (°C)")
ax.set_ylabel("P(forgalmas óra) (%)")
ax.set_ylim(0, 100)
keep(fig, "fig_logit_prob")

# ================================================================= fák: beépített fontosságok
cols = T["cols"]
gain = pd.Series(T["xgb_builtin"]["gain"])
union = list(gain.sort_values(ascending=False).head(4).index)
for k in ("weight", "cover"):
    union += [c for c in pd.Series(T["xgb_builtin"][k]).sort_values(ascending=False).head(1).index if c not in union]
perm = pd.Series(T["xgb_perm"])
union += [c for c in perm.sort_values(ascending=False).head(2).index if c not in union]
rk = {k: pd.Series(T["xgb_builtin"][k]).rank(ascending=False).astype(int) for k in ("weight", "gain", "cover")}
rk["perm"] = perm.rank(ascending=False).astype(int)
rows = []
for c in union:
    rows.append([c, f"{rk['weight'][c]}.  ({T['xgb_builtin']['weight'][c] * 100:.0f} %)", f"{rk['gain'][c]}.  ({T['xgb_builtin']['gain'][c] * 100:.0f} %)",
                 f"{rk['cover'][c]}.  ({T['xgb_builtin']['cover'][c] * 100:.0f} %)", f"{rk['perm'][c]}.  (+{perm[c]:.1f})"])
rows.sort(key=lambda r: int(r[2].split(".")[0]))
hl = {(i, j) for i, r in enumerate(rows) for j in (1, 2, 3, 4) if r[j].startswith("1.")}
table_png(pd.DataFrame(rows, columns=["jellemző", "weight\n(hány split)", "gain\n(hibacsökkenés)", "cover\n(hány minta)", "permutációs\n(+RMSE)"]), "tbl_builtin", first_left=True, fs=16, hl_cells=hl)

# zaj-oszlopok: MDI vs permutáció (csak a gyenge jellemzők és a zaj: ott dől el, hogy megkülönböztethető-e a zajtól)
show = ["temp", "windspeed", "zaj_folytonos", "zaj_azonosito"]
lab = {"zaj_folytonos": "zaj (folytonos)", "zaj_azonosito": "zaj (azonosító)"}
fig, axs = plt.subplots(1, 2, figsize=(13, 3.2), sharey=True)
for ax, key, ttl, xl, fmt in ((axs[0], "rf_mdi", "beépített (MDI), a tanítón", "fontosság-hányad", lambda v: hu(v * 100, 2) + " %"),
                              (axs[1], "rf_perm", "permutációs, a validáción", "RMSE-növekedés a keverés után", lambda v: "+" + hu(v, 2))):
    v = [T[key][c] for c in show][::-1]
    names = [lab.get(c, c) for c in show][::-1]
    ax.barh(names, v, color=[ORANGE if c.startswith("zaj") else BLUE for c in show][::-1])
    for i, x in enumerate(v):
        ax.text(x, i, " " + fmt(x), va="center", fontsize=13, color=INK)
    ax.set_title(ttl, fontsize=15)
    ax.set_xlabel(xl)
    ax.set_xlim(0, max(v) * 1.3)
    ax.grid(axis="y", visible=False)
keep(fig, "fig_noise")

# ================================================================= SHAP
sv, va = X["sv"], X["va"]
base = S["base"]


def waterfall(key, name, ttl):
    e = S["examples"][key]
    c = pd.Series(e["contrib"])
    top = c.reindex(c.abs().sort_values(ascending=False).index)
    top, rest = top.iloc[:6], top.iloc[6:].sum()
    items = [(f"{k} = {e['x'][k]:.0f}" if e["x"][k] is not None and abs(e["x"][k]) >= 2 else f"{k} = {e['x'][k]:.2f}", v) for k, v in top.items()]
    items.append((f"a többi {len(c) - 6} jellemző", rest))
    fig, ax = plt.subplots(figsize=(10, 5.2))
    cur = base
    ys = list(range(len(items)))[::-1]
    for y, (nm, v) in zip(ys, items):
        ax.barh(y, v, left=cur, color=BLUE if v >= 0 else ORANGE, height=.62)
        ax.text(cur + v + (4 if v >= 0 else -4), y, sg(v, 0), va="center", ha="left" if v >= 0 else "right", fontsize=13, color=INK)
        cur += v
    ax.axvline(base, color=MUTED, lw=1, ls="--"); ax.axvline(e["pred"], color=INK, lw=1.5)
    ax.set_yticks(ys); ax.set_yticklabels([n for n, _ in items])
    ax.set_xlabel(f"kölcsönzés/óra   (átlagos jóslat = {base:.0f}  →  jóslat = {e['pred']:.0f};  tényleges: {e['y']:.0f})")
    ax.set_title(ttl, fontsize=16, loc="left")
    ax.grid(axis="y", visible=False)
    lo = min(e['pred'], base) - 40; hi = max(e['pred'], base) + 60
    ax.set_xlim(min(lo, min(base, e['pred']) - 80), hi)
    keep(fig, name)


waterfall("kedd_8", "fig_wf_kedd", "Kedd, 2012-09-04, 8:00")
waterfall("vasarnap_3", "fig_wf_vasarnap", "Vasárnap, 2012-09-09, 3:00")

DIVC = plt.matplotlib.colors.LinearSegmentedColormap.from_list("div", [BLUE, "#6e7d8a", ORANGE])
plt.figure(figsize=(10.5, 6.2))
shap.plots.beeswarm(sv, max_display=10, show=False, color=DIVC, plot_size=None)
ax = plt.gca()
ax.set_xlabel("SHAP-érték: a jóslat változása (kölcsönzés/óra)")
ax.grid(axis="y", visible=False)
TR = {"Feature value": "jellemző értéke", "High": "magas", "Low": "alacsony"}
fig_ = plt.gcf()
for ax_ in fig_.axes:
    labs = [t_.get_text() for t_ in ax_.get_yticklabels()]
    if any(l in TR or l.startswith("Sum of") for l in labs):
        ax_.set_yticks(ax_.get_yticks())
        ax_.set_yticklabels([TR.get(l, f"a többi {l.split()[2]} jellemző" if l.startswith("Sum of") else l) for l in labs])
    if ax_.get_ylabel() in TR:
        ax_.set_ylabel(TR[ax_.get_ylabel()])
for t_ in fig_.findobj(plt.Text):
    t_.set_color(INK2)
keep(plt.gcf(), "fig_beeswarm")

# dependence: hr x workingday
hr_i, wd_i = S and list(X["cols"]).index("hr"), list(X["cols"]).index("workingday")
fig, ax = plt.subplots(figsize=(10, 4.9))
hrv, shv, wd = va["hr"].to_numpy(), sv.values[:, hr_i], va["workingday"].to_numpy()
for w, col, nm in ((1, BLUE, "munkanap"), (0, ORANGE, "hétvége / ünnep")):
    ax.scatter(hrv[wd == w] + (np.random.default_rng(0).uniform(-.2, .2, (wd == w).sum())), shv[wd == w], s=16, alpha=.7, color=col, label=nm)
ax.axhline(0, color=MUTED, lw=1)
ax.set_xlabel("óra (hr)")
ax.set_ylabel("SHAP-érték (hr)")
ax.set_xticks(range(0, 24, 2))
ax.legend(frameon=False)
keep(fig, "fig_dep_hr")

# SHAP globális vs permutációs rang
ma = pd.Series(S["mean_abs"]).sort_values(ascending=False)
print("mean|SHAP| top:", ma.head(5).round(1).to_dict())
print("kész:", sorted(p.name for p in OUT.glob("*.png")))


# ================================================================= ÚJ ÁBRÁK (log-esély, permutáció, Shapley, fa útja, terminál, házi kimenetek)
import getpass
import os
import re
import shutil
import subprocess
import tempfile
import textwrap

MONO = "DejaVu Sans Mono"

# ---- log-esély frissítő
rows = []
for pr in (.1, .5, .8, .9, .99):
    odds = pr / (1 - pr)
    rows.append([hu(pr, 2), hu(odds, 2), sg(np.log(odds), 2) if pr != .5 else "0"])
table_png(pd.DataFrame(rows, columns=["valószínűség p", "esély = p / (1 − p)", "log-esély = ln(esély)"]), "tbl_logodds", first_left=False)

# ---- permutációs fontosság lépésről lépésre
base_rmse = T["val_rmse"]
pr_rows = [["az eredeti validációs adat", hu(base_rmse, 1), "–"]]
for f, nm in (("lag168", "lag168 megkeverve"), ("hr", "hr (óra) megkeverve"), ("temp", "temp megkeverve"), ("windspeed", "windspeed megkeverve")):
    pr_rows.append([nm, hu(base_rmse + T["xgb_perm"][f], 1), "+" + hu(T["xgb_perm"][f], 1)])
table_png(pd.DataFrame(pr_rows, columns=["Mit rontunk el", "RMSE", "romlás = fontosság"]), "tbl_perm", hl_cells={(1, 2), (2, 2)})

# ---- Shapley-példák
G_ = R["shapley_games"]
table_png(pd.DataFrame([["A, majd B", "+10", "+40"], ["B, majd A", "+30", "+20"], ["átlag (Shapley-érték)", hu(G_["partners"]["shapley"]["A"], 0), hu(G_["partners"]["shapley"]["B"], 0)]],
                       columns=["Belépési sorrend", "Anna hozzájárulása", "Bence hozzájárulása"]), "tbl_shapley_partners", hl_cells={(2, 1), (2, 2)})
from itertools import permutations

gl = lambda S: 1 if ("L" in S and ("R1" in S or "R2" in S)) else 0
rows = []
for order in permutations(["L", "R1", "R2"]):
    seen, c = set(), {}
    for pl in order:
        c[pl] = gl(seen | {pl}) - gl(seen)
        seen.add(pl)
    rows.append([", ".join(order), c["L"], c["R1"], c["R2"]])
rows.append(["átlag (Shapley-érték)", hu(G_["glove"]["L"], 2), hu(G_["glove"]["R1"], 2), hu(G_["glove"]["R2"], 2)])
table_png(pd.DataFrame(rows, columns=["Sorrend", "bal (L)", "jobb 1 (R1)", "jobb 2 (R2)"]), "tbl_glove", hl_cells={(6, 1), (6, 2), (6, 3)})
U = G_["unsc"]
table_png(pd.DataFrame([["állandó tag (5 db, vétójog)", "7", f"{hu(U['permanent_each'] * 100, 2)} %", f"{hu(U['permanent_total'] * 100, 1)} %"],
                        ["nem állandó tag (10 db)", "1", f"{hu(U['nonpermanent_each'] * 100, 2)} %", f"{hu((1 - U['permanent_total']) * 100, 1)} %"]],
                       columns=["Tag", "súly a modellben", "hatalom / tag", "hatalom összesen"]), "tbl_unsc", hl_cells={(0, 2), (0, 3)})

# ---- a fa útja egy jóslatra (0. fa) és a lépcsőzetes jóslat
TP = R["tree_path"]
steps = [[str(i + 1), f"{st['feature']} < {hu(st['split'], 2 if st['split'] % 1 else 0)} ?", hu(st["value"], 2 if st["value"] % 1 else 0), "igen" if st["yes"] else "nem"] for i, st in enumerate(TP["steps"])]
steps.append(["levél", "a fa hozzájárulása a jóslathoz", "", sg(TP["leaf"], 1)])
table_png(pd.DataFrame(steps, columns=["lépés", "kérdés a döntési fában", "az óra értéke", "válasz"]), "tbl_tree_path", hl_cells={(len(steps) - 1, 3)}, first_left=False, left_cols=(1,))
ks = [0, *sorted(TP["staged"])]
vals = [TP["base_score"], *[TP["staged"][k] for k in sorted(TP["staged"])]]
fig, ax = plt.subplots(figsize=(10, 4.6))
ax.plot(range(len(ks)), vals, "-o", color=BLUE, lw=3, ms=9)
for i, v in enumerate(vals):
    ax.annotate(f"{v:.0f}", (i, v), xytext=(0, 12), textcoords="offset points", ha="center", color=INK, fontsize=14)
ax.axhline(S["examples"]["kedd_8"]["y"], color=ORANGE, ls="--", lw=2)
ax.text(.1, S["examples"]["kedd_8"]["y"] + 15, "tényleges: 632", color=ORANGE, fontsize=14)
ax.set_xticks(range(len(ks))); ax.set_xticklabels(["átlag", *map(str, sorted(TP["staged"]))])
ax.set_xlabel("hány fát adtunk össze (a 500-ból)"); ax.set_ylabel("jóslat (kölcsönzés/óra)")
ax.set_ylim(100, 760)
keep(fig, "fig_staged")

# ---- terminál-ábrák (valódi parancsok, egy eldobható mappában, LC_ALL=C; a felhasználónevet lecseréljük)
USER = getpass.getuser()


def term_png(name, cmds, title, setup=None, sub=None, maxc=104, fs=13):
    """cmds: parancsok listája; mindegyiket VALÓBAN lefuttatjuk egy ideiglenes 'otthon' mappában. A `cd`-t külön kezeljük (a prompt követi)."""
    home = Path(tempfile.mkdtemp()) / "diak"
    home.mkdir()
    if sub:
        (home / sub).mkdir()
    for f in (setup or []):
        shutil.copy(HERE.parent / "05-regresszio" / f if f != "hour.csv" else HERE.parent / "05-regresszio" / "data" / "hour.csv", (home / sub if sub else home) / Path(f).name)
    cwd = (home / sub) if sub else home
    lines = []
    env = {**os.environ, "LC_ALL": "C", "HOME": str(home), "PS1": ""}
    for c in cmds:
        rel = "~" + str(cwd)[len(str(home)):]
        lines.append(("p", rel, c))
        if c.startswith("cd "):
            cwd = (cwd / c[3:]).resolve()
            continue
        r = subprocess.run(c, shell=True, cwd=cwd, env=env, capture_output=True, text=True)
        out = (r.stdout + r.stderr).replace(str(home), "/home/diak").replace(USER, "diak").rstrip("\n")
        for ln in out.split("\n") if out else []:
            lines.append(("o", ln[:maxc - 1] + "…" if len(ln) > maxc else ln))
    shutil.rmtree(home.parent, ignore_errors=True)
    n = len(lines)
    cw = .602 * fs / 72
    W = maxc * cw + .8
    lh = fs * 1.55 / 72
    H = n * lh + 1.05
    fig = plt.figure(figsize=(W, H))
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, W); ax.set_ylim(H, 0); ax.axis("off")
    ax.add_patch(Rectangle((0, 0), W, H, facecolor="#1c1f24", edgecolor="#4a5159", lw=2))
    ax.add_patch(Rectangle((0, 0), W, .5, facecolor="#2b3036", edgecolor="#4a5159", lw=1))
    for i, col in enumerate(("#ff5f56", "#ffbd2e", "#27c93f")):
        ax.add_patch(plt.Circle((.3 + i * .3, .25), .09, color=col))
    ax.text(W / 2, .25, title, color="#b8bec6", fontsize=fs - 1, ha="center", va="center", family=MONO)
    y = .5 + .35
    for ln in lines:
        if ln[0] == "p":
            x = .4
            for part, colr in (("diak@gep", "#6fd86f"), (":", "#d6d6d6"), (ln[1], "#6aa9ff"), ("$ ", "#d6d6d6"), (ln[2], "#ffffff")):
                t = ax.text(x, y, part, color=colr, fontsize=fs, family=MONO, va="center", fontweight="bold" if part == ln[2] else "normal")
                x += len(part) * cw
        else:
            ax.text(.4, y, ln[1], color="#c9ced6", fontsize=fs, family=MONO, va="center")
        y += lh
    keep(fig, name)


term_png("term_nav", ["pwd", "ls", "mkdir -p kurzus/hf", "mv hour.csv bike.py kurzus/", "cd kurzus", "ls -la"], "diak@gep: ~/kurzus", setup=["hour.csv", "bike.py"], maxc=84, fs=15)
term_png("term_view", ["head -n 3 hour.csv", "wc -l hour.csv", 'grep -n "^LAGS" bike.py', 'find . -name "*.csv"'], "diak@gep: ~/kurzus", setup=["hour.csv", "bike.py"], sub="kurzus", maxc=88, fs=15)
term_png("term_pipe", ["cut -d, -f2,6,17 hour.csv | head -n 4", "cut -d, -f17 hour.csv | sort -n | tail -n 1", 'grep -c "^[0-9]*,2012" hour.csv',
                       'echo "6. ora" > jegyzet.txt', 'echo "kesz" >> jegyzet.txt', "cat jegyzet.txt"], "diak@gep: ~/kurzus", setup=["hour.csv"], sub="kurzus", maxc=70, fs=15)

# a prompt felépítése (annotált): a feliratok a prompt FÖLÖTT, a vonalak lefelé mutatnak
fig = plt.figure(figsize=(10.5, 4.2))
ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 10.5); ax.set_ylim(4.2, 0); ax.axis("off")
ax.add_patch(Rectangle((0, 0), 10.5, 4.2, facecolor="#1c1f24", edgecolor="#4a5159", lw=2))
ax.add_patch(Rectangle((0, 0), 10.5, .5, facecolor="#2b3036", edgecolor="#4a5159", lw=1))
for i, col in enumerate(("#ff5f56", "#ffbd2e", "#27c93f")):
    ax.add_patch(plt.Circle((.3 + i * .3, .25), .09, color=col))
ax.text(5.25, .25, "Terminal", color="#b8bec6", fontsize=13, ha="center", va="center", family=MONO)
fs_ = 24; cw_ = .602 * fs_ / 72
x = .5
segs = (("diak", "#6fd86f"), ("@", "#d6d6d6"), ("gep", "#6fd86f"), (":", "#d6d6d6"), ("~/kurzus", "#6aa9ff"), ("$", "#d6d6d6"), (" ls", "#ffffff"))
xs = []
for t_, c_ in segs:
    ax.text(x, 2.75, t_, color=c_, fontsize=fs_, family=MONO, va="center", fontweight="bold" if t_ == " ls" else "normal")
    xs.append((x, x + len(t_) * cw_)); x += len(t_) * cw_
ax.text(.5, 3.5, "bike.py   hour.csv   hf", color="#c9ced6", fontsize=fs_, family=MONO, va="center")
for (xa, xb), txt, ty, ha in ((xs[0], "ki vagy (felhasználó)", .95, "left"), (xs[2], "melyik gép", 1.65, "left"), (xs[4], "hol vagy (a mappa)", .95, "left"), (xs[5], "ide írod a parancsot", 1.65, "left")):
    xm = (xa + xb) / 2
    ax.plot([xm, xm], [ty + .2, 2.45], color=ORANGE, lw=1.6)
    ax.text(xm - .05, ty, txt, color=ORANGE, fontsize=14, ha=ha, va="center")
keep(fig, "term_look")

# ---- hol találod: operációs rendszerek
table_png(pd.DataFrame([["Linux (Ubuntu)", "Ctrl+Alt+T, vagy az alkalmazásmenüben „Terminal”", "bash / zsh"],
                        ["macOS", "Cmd+Szóköz (Spotlight) → „Terminal”\n(Alkalmazások → Segédprogramok)", "zsh"],
                        ["Windows", "Start → „Terminal” vagy „PowerShell”\nAjánlott: WSL2 (wsl --install), utána „Ubuntu”", "PowerShell\n(WSL2-ben: bash)"]],
                       columns=["Rendszer", "Hol találod", "Shell"]), "tbl_os", left_cols=(1,))

# ---- házi: a kimenetek (a hw_example/notebook.ipynb végrehajtott celláiból, szó szerint, rövidítve)
NB = json.loads((HERE / "hw_example" / "notebook.ipynb").read_text())
PLAN = (HERE / "hw_example" / "plan.md").read_text().splitlines()


def cell_text(i):
    return "".join("".join(o.get("text", [])) for o in NB["cells"][i]["outputs"] if o["output_type"] == "stream")


def clip(ln, n):
    return ln if len(ln) <= n else ln[: n - 1] + "…"


def transcript_png(name, label, prompt, out, maxc=100, fs=12.5, note=None):
    pl = textwrap.wrap(prompt, maxc - 2)
    out = [clip(x.rstrip(), maxc) for x in out]
    cw = .602 * fs / 72
    lh = fs * 1.5 / 72
    n = len(pl) + len(out) + 3
    W = maxc * cw + .9
    H = n * lh + .9
    fig = plt.figure(figsize=(W, H))
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, W); ax.set_ylim(H, 0); ax.axis("off")
    ax.add_patch(Rectangle((0, 0), W, H, facecolor="#1c1f24", edgecolor="#4a5159", lw=2))
    ph = (len(pl) + 1) * lh + .25
    ax.add_patch(Rectangle((.12, .12), W - .24, ph, facecolor="#3a2a1f", edgecolor=ORANGE, lw=1.5))
    ax.text(.3, .12 + lh * .7, label, color=ORANGE, fontsize=fs - 1, family=MONO, va="center", fontweight="bold")
    y = .12 + lh * 1.7
    for ln in pl:
        ax.text(.3, y, ln, color="#f3e9dc", fontsize=fs, family=MONO, va="center"); y += lh
    y = .12 + ph + .35 + lh * .5
    ax.text(.3, y - lh * .9, "kimenet" + (f" ({note})" if note else ""), color="#6fd86f", fontsize=fs - 1.5, family=MONO, va="center")
    for ln in out:
        ax.text(.3, y, ln, color="#c9ced6", fontsize=fs, family=MONO, va="center"); y += lh
    keep(fig, name)


P = {  # a slide-okon szereplő prompt-szövegek (a slides-data.js ugyanezeket mutatja)
    1: "Read homework.md. We solve it in one notebook. Do not write code yet. Ask me what you need to decide, then give me a numbered plan: for each step, the output and the check that proves it worked.",
    2: "Do steps 1-3 of the plan: load the data, 2 EDA plots, cleaning with one-line reasons, then the split: lock the final test set and build 3 expanding-window time folds. Repeated properties (key: lat, long, sqft_living, sqft_lot, yr_built, zipcode) stay in one chunk, placed by their LAST sale date. Print shapes and date ranges.",
    3: "Do steps 4-5: baselines on the same folds: mean, zipcode median, a fair linear model (log target, zip dummies), plus tree, random forest, XGBoost. One table: RMSE, MAE, WAPE, RMSLE, R2, mean +- std across folds. Don't tune.",
    4: "Do step 6: diagnostics on the best model's out-of-fold predictions: calibration by decile, residual vs predicted, residual by segment, residual map by lat/long. Two sentences per plot: what you see, what you'd do. Then propose 3 hypotheses ranked by expected gain and save them to hypotheses.md.",
    5: "Take hypothesis #1 from hypotheses.md only. Implement it leakage-safe (anything derived from the target is computed inside the training fold only). Report the paired per-fold difference versus the previous model. If the mean paired difference is not larger than its fold std, say it did not help.",
    6: "Unlock the test set once: score the chosen model and the baselines, bootstrap a 95% CI for RMSE (resample by property). Then act as a skeptical reviewer: list every place information from the target or the test set could have leaked, with cell references. Finally write a 10-line summary.",
}
plan_pick = [ln for i, ln in enumerate(PLAN) if ln.startswith(("## What I need", "3. \"Time-ordered\"", "4. \"Repeated", "6. Order conflict", "## Steps"))]
steps_ = [ln for ln in PLAN if re.match(r"^\d+\. ", ln)][-10:]
plan_out = [plan_pick[0], plan_pick[1], plan_pick[3], plan_pick[4], steps_[0], steps_[1], steps_[3], steps_[7], steps_[8]]
transcript_png("hw_p1", "PROMPT 1 · plan mód", P[1], plan_out, note="plan.md, részlet")
o2 = [ln for i in (1, 3, 7) for ln in cell_text(i).splitlines() if ln.strip() and not ln.strip().startswith(("rows ", "chunk", "0 ", "1 ", "2 ", "3 "))]
o2 = [ln for ln in o2 if not ln.startswith("properties")] + []
transcript_png("hw_p2", "PROMPT 2 · adat, EDA, vágás", P[2], [x for x in o2 if not x.startswith(("shape", "dates"))][:10], note="részlet")
# P3: a mutatótábla (a kimenetből parsolva, tömörebb formában)
tab = []
for ln in cell_text(9).splitlines():
    m = re.match(r"^(\S+)\s+([\d,\.]+) \+- ([\d,\.]+)\s+[\d,\.]+ \+- [\d,\.]+\s+([\d\.]+) \+- ([\d\.]+)\s+[\d\.]+ \+- [\d\.]+\s+(-?[\d\.]+) \+- ([\d\.]+)", ln)
    if m:
        tab.append((m.group(1), m.group(2).split(".")[0], m.group(3).split(".")[0], m.group(4), m.group(6)))
o3 = [f"{'model':<16}{'RMSE (átlag +- szórás)':<28}{'WAPE':>7}{'R2':>8}"] + [f"{a:<16}{b + ' +- ' + c:<28}{d:>7}{e:>8}" for a, b, c, d, e in tab] + ["best by mean CV RMSE: xgb"]
transcript_png("hw_p3", "PROMPT 3 · alapmodellek", P[3], o3, note="a kimenet oszlopai összevonva")
c11 = cell_text(11).splitlines()
o4 = [*c11[:4], "...", *c11[9:12], *[ln for ln in c11 if ln.startswith("corr(")]]
transcript_png("hw_p4", "PROMPT 4 · diagnosztika", P[4], o4, note="részlet")
for o in NB["cells"][11]["outputs"]:
    if o["output_type"] == "display_data" and "image/png" in o["data"]:
        import base64
        (OUT / "hw_diag.png").write_bytes(base64.b64decode(o["data"]["image/png"]))
c14 = cell_text(14).splitlines()
o5 = [ln for ln in c14 if ln.strip()]
transcript_png("hw_p5", "PROMPT 5 · egy visszacsatolási kör", P[5], o5, note="szó szerint")
c16 = [ln for ln in cell_text(16).splitlines() if ln.strip()]
transcript_png("hw_p6", "PROMPT 6 · a teszt egyszer", P[6], c16, note="szó szerint")
md18 = "".join(NB["cells"][18]["source"]).splitlines()
items = [ln for ln in md18 if re.match(r"^\d+\. ", ln)]
summ = [ln for ln in cell_text(19).splitlines() if ln.strip()]
o6b = [clip(x, 100) for x in items[:6]] + [""] + [clip(x, 100) for x in summ[:1]] + [clip(x, 100) for x in summ[7:9]]
transcript_png("hw_p6b", "PROMPT 6 · szkeptikus bíráló és összefoglaló", "(ugyanaz a prompt, második fele: bírálat cellahivatkozásokkal, majd 10 soros összefoglaló)", o6b, note="részlet")
print("új ábrák kész")
