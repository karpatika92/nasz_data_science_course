"""A 4. óra kiegészítő ábrái -> assets/. A demo.ipynb-től függetlenül, másodpercek alatt fut.

Futtatás (a lecke mappájából): uv run python build_assets.py

Ugyanazt a 30 000 soros réteges mintát és ugyanazt a train/teszt splitet használja, mint a demo.ipynb
(random_state=0, illetve 42), az adatok a data/kick.csv.gz-ből jönnek. A tbl_javitas.png számai a demo.ipynb
kimenetéből valók (a notebook "visszacsatolási kör" cellája: alap XGBoost, új jellemzők, új jellemzők + küszöb).
"""
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.patches import Rectangle
from sklearn.model_selection import train_test_split

HERE = Path(__file__).parent
OUT = HERE / "assets"
OUT.mkdir(exist_ok=True)

# A deck színeihez igazítva (assets/deck/deck.css), mint a 3. órán és a demo.ipynb-ben.
SURFACE, INK, INK2, GRID = "#0d2a20", "#e9e4d2", "#b9c2b3", "#30483c"
BLUE, ORANGE = "#3987e5", "#d95926"
plt.rcParams.update({"figure.facecolor": SURFACE, "axes.facecolor": SURFACE, "savefig.facecolor": SURFACE,
    "text.color": INK, "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK2, "axes.edgecolor": GRID,
    "axes.spines.top": False, "axes.spines.right": False, "axes.grid": True, "grid.color": GRID, "grid.alpha": .7,
    "font.size": 15, "axes.titlesize": 17, "axes.labelsize": 15, "legend.fontsize": 14})
hu = lambda v, nd=2: f"{v:.{nd}f}".replace(".", ",")
thou = lambda v: f"{v:,.0f}".replace(",", " ")


def keep(fig, name):
    fig.savefig(OUT / f"{name}.png", dpi=170, bbox_inches="tight", facecolor=SURFACE)
    plt.close(fig)


def table_png(df, name, hl_rows=None, hl_cells=None, fs=16):
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
        if r == 0:
            cell.set_facecolor("#123626"); cell.get_text().set_color("#d1a13a"); cell.get_text().set_fontweight("bold")
        else:
            cell.set_facecolor("#16442f" if hl_rows and (r - 1) in hl_rows else SURFACE)
            cell.get_text().set_color(INK)
            if hl_cells and (r - 1, c) in hl_cells:
                cell.set_facecolor("#6b2f14"); cell.get_text().set_fontweight("bold")
    keep(fig, name)


# ---------------------------------------------------------------- adat (ugyanaz a minta és split, mint a notebookban)
full = pd.read_csv(HERE / "data/kick.csv.gz")
raw = train_test_split(full, train_size=30000, stratify=full.IsBadBuy, random_state=0)[0].reset_index(drop=True)
y_all = raw.IsBadBuy.astype(int)
base = float(y_all.mean())

# ---------------------------------------------------------------- 1. vételár: hisztogram + a rossz vétel aránya ugyanazokban a sávokban
edges = list(range(0, 14000, 1000)) + [10 ** 6]
lab = [f"{a // 1000}" for a in edges[:-2]] + ["13+"]
b = pd.cut(raw.VehBCost, edges, right=False, labels=lab)
g = pd.DataFrame({"y": y_all, "b": b}).groupby("b", observed=False).y.agg(["size", "mean"])
fig, (a1, a2) = plt.subplots(2, 1, figsize=(10.5, 6.6), sharex=True, gridspec_kw={"height_ratios": [1, 1]})
a1.bar(range(len(g)), g["size"], color=BLUE, width=.8)
a1.set_ylabel("autók száma")
a1.grid(axis="x", visible=False)
ok = g["size"] >= 100                                     # kevés autót tartalmazó sávban nem rajzolunk arányt
a2.plot(np.arange(len(g))[ok], g["mean"][ok], color=ORANGE, lw=2.8, marker="o", ms=8)
a2.axhline(base, color=INK2, ls="--", lw=1.2)
a2.text(len(g) - 1.1, base + .012, f"átlag {base:.1%}".replace(".", ","), ha="right", color=INK2, fontsize=13)
a2.set_ylabel("rossz vétel aránya")
a2.set_xticks(range(len(g)))
a2.set_xticklabels(lab)
a2.set_xlabel("vételár (ezer USD, 1 000-es sávok)")
a2.set_ylim(0, None)
a2.yaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: f"{v:.0%}"))
plt.tight_layout()
keep(fig, "eda_ar")
print("ár-sávok (ezer USD): autók száma és rossz vétel aránya")
print(g.assign(mean=lambda d: d["mean"].round(3)).T.to_string())

# ---------------------------------------------------------------- 2. nyers sorok: a problémás értékekkel
cols = ["PurchDate", "VehicleAge", "Make", "Transmission", "WheelType", "VNZIP1", "MMRAcquisitionAuctionAveragePrice", "VehBCost"]
r_ok = raw[(raw.WheelType.notna()) & (raw.MMRAcquisitionAuctionAveragePrice > 0) & (raw.Transmission == "AUTO")].iloc[0]
r_zero = raw[raw.MMRAcquisitionAuctionAveragePrice == 0].iloc[0]
r_wheel = raw[raw.WheelType.isna() & (raw.MMRAcquisitionAuctionAveragePrice > 0)].iloc[0]
r_man = raw[raw.Transmission == "Manual"].iloc[0]
rows = pd.DataFrame([r_ok, r_zero, r_wheel, r_man])[cols]
show = rows.copy()
show.columns = ["PurchDate", "kor", "Make", "Transmission", "WheelType", "VNZIP1", "MMR vételkori átlagár", "VehBCost"]
for c in show.columns:
    show[c] = show[c].map(lambda v: "NaN" if pd.isna(v) else (f"{v:.0f}" if isinstance(v, (int, float, np.integer, np.floating)) else str(v)))
hl = {(1, 6), (0, 0), (2, 4), (3, 3), (0, 5)}               # 0 dollár, unix-idő, hiányzó keréktípus, „Manual”, irányítószám
table_png(show, "tbl_raw", hl_cells=hl, fs=15)
print("nyers sorok:\n", show.to_string())

# ---------------------------------------------------------------- 3. nagy kategória: célérték-átlag (csak a tanító halmazból!)
X, y = raw.drop(columns="IsBadBuy"), raw.IsBadBuy.astype(int)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=.2, stratify=y, random_state=42)
gm = float(y_train.mean())
stat = pd.DataFrame({"y": y_train.values, "m": X_train.Model.values}).groupby("m").y.agg(["size", "mean"])
top = stat.sort_values("size", ascending=False).head(4)
rare = stat[(stat["size"].between(3, 5))].sort_values("mean", ascending=False).head(1)
ex = pd.concat([top, rare])
tab = pd.DataFrame({"Model": [str(i)[:26] for i in ex.index], "autók száma (tanító)": [thou(v) for v in ex["size"]],
                    "rossz vétel aránya": [f"{v:.0%}".replace(".", ",") for v in ex["mean"]]})
tab = pd.concat([tab, pd.DataFrame({"Model": ["(minden autó)"], "autók száma (tanító)": [thou(len(y_train))], "rossz vétel aránya": [f"{gm:.1%}".replace(".", ",")]})])
table_png(tab.reset_index(drop=True), "tbl_celatlag", hl_rows=[4], fs=16)
print("célérték-átlag példa:\n", tab.to_string(), "\nkülönböző Model a tanítóban:", int(stat.shape[0]))

# ---------------------------------------------------------------- 4. időbeli adat: kiterjedő ablak (múltból a jövőbe)
fig, ax = plt.subplots(figsize=(11, 4.2))
ax.axis("off")
ax.set_xlim(-1.6, 12.2)
ax.set_ylim(-.9, 3.9)
for r in range(3):
    yy = 2.6 - r * 1.15
    ax.text(-.1, yy + .38, f"{r + 1}. kör", ha="right", va="center", fontsize=17, color=INK)
    for c in range(4):
        if c <= r:
            col, txt = BLUE, "tanítás"
        elif c == r + 1:
            col, txt = ORANGE, "validáció"
        else:
            col, txt = GRID, ""
        ax.add_patch(Rectangle((c * 2.25 + .15, yy), 2.15, .76, facecolor=col, edgecolor=SURFACE, lw=2))
        if txt:
            ax.text(c * 2.25 + 1.22, yy + .38, txt, ha="center", va="center", fontsize=15, color="#0d2a20", fontweight="bold")
ax.annotate("", xy=(9.15, -.35), xytext=(.15, -.35), arrowprops=dict(arrowstyle="-|>", color=INK2, lw=2))
ax.text(.15, -.75, "múlt", color=INK2, fontsize=15)
ax.text(9.15, -.75, "jövő", color=INK2, fontsize=15, ha="right")
ax.text(9.5, 2.98, "a validáció mindig a tanítás UTÁN jön", fontsize=14.5, color=INK2, va="center")
keep(fig, "idoszeru_split")

# ---------------------------------------------------------------- 5. a javítás egy táblázatban (számok: demo.ipynb, "visszacsatolási kör")
jav = pd.DataFrame({"": ["alap XGBoost, küszöb 0,5", "+ új ár-jellemzők, küszöb 0,5", "+ új ár-jellemzők, küszöb 0,12"],
                    "pontosság": ["0,902", "0,902", "0,754"], "kiegyens. pont.": ["0,623", "0,619", "0,698"],
                    "recall": ["0,254", "0,245", "0,624"], "precision": ["0,829", "0,848", "0,277"], "PR-AUC": ["0,483", "0,496", "0,496"]})
table_png(jav, "tbl_javitas", hl_rows=[2], fs=16)
print("kész:", sorted(p.name for p in OUT.glob("*.png")))
