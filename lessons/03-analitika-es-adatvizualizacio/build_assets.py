"""A 3. óra (Analitika és adatvizualizáció) saját ábráinak generálása -> assets/.

Futtatás (a lecke mappájából): uv run python build_assets.py

Minden szám vagy a repo adatfájljaiból (nflx_weekly_price.csv, datasaurus.csv),
vagy kifejezetten "szintetikus, illusztráció" jelzéssel ellátott, beégetett
magból jön. Az Anscombe-adatok a klasszikus 1973-as értékek (a script ellenőrzi
a közös statisztikáikat).
"""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.colors import LinearSegmentedColormap

HERE = Path(__file__).parent
OUT = HERE / "assets"
OUT.mkdir(exist_ok=True)
NFLX = (
    HERE
    / "../../lectures/01-uzleti-analitika-es-cegertekeles/data/nflx_weekly_price.csv"
)

# A deck színeihez igazítva (assets/deck/deck.css: --bg, --ink, --ink-dim, --line a háttéren).
# Kategoriális színek: a dataviz skill SÖTÉT módú lépései; a validate_palette.js-sel ellenőrizve a
# deck hátterén (#0d2a20): minden próba PASS (CVD ΔE 8,4 az adjacens párokra, kontraszt >= 3:1).
# Szekvenciális rámpa (egy árnyalat, monoton világosság, a legsötétebb lépés is >= 2:1): szintén validált.
SURFACE, INK, INK2, GRID = "#0d2a20", "#e9e4d2", "#b9c2b3", "#30483c"
BLUE, ORANGE, AQUA, YELLOW = "#3987e5", "#d95926", "#199e70", "#c98500"
SEQ = LinearSegmentedColormap.from_list(
    "seq_blue_dark", ["#2f66a8", "#3f7cc6", "#5f9be0", "#92bdf0", "#c3dcf8"]
)
DIV = LinearSegmentedColormap.from_list("div_bo_dark", [BLUE, "#4a5c53", ORANGE])

plt.rcParams.update(
    {
        "figure.facecolor": SURFACE,
        "axes.facecolor": SURFACE,
        "savefig.facecolor": "auto",  # az ábra saját háttere (a szándékosan rossz ábráé sárga marad)
        "text.color": INK,
        "axes.labelcolor": INK2,
        "xtick.color": INK2,
        "ytick.color": INK2,
        "axes.edgecolor": GRID,
        "axes.spines.top": False,
        "axes.spines.right": False,
        "font.size": 15,
        "axes.titlesize": 17,
        "axes.titleweight": "bold",
        "axes.titlelocation": "left",
        "axes.labelsize": 15,
        "axes.grid": True,
        "grid.color": GRID,
        "grid.linewidth": 0.8,
        "axes.axisbelow": True,
    }
)


def save(fig, name):
    fig.savefig(OUT / name, dpi=130, bbox_inches="tight", pad_inches=0.25)
    plt.close(fig)
    print("wrote", name)


# ---------------------------------------------------------------- Anscombe
def anscombe():
    x = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5]
    x4 = [8] * 7 + [19] + [8] * 3
    ys = [
        (x, [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68]),
        (x, [9.14, 8.14, 8.74, 8.77, 9.26, 8.10, 6.13, 3.10, 9.13, 7.26, 4.74]),
        (x, [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73]),
        (x4, [6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.50, 5.56, 7.91, 6.89]),
    ]
    for xs, y in ys:  # a klasszikus közös statisztikák: guard az adatbevitel ellen
        assert (
            abs(np.mean(y) - 7.50) < 0.01
            and abs(np.corrcoef(xs, y)[0, 1] - 0.816) < 0.002
        )
    fig, axes = plt.subplots(2, 2, figsize=(11, 8), sharex=True, sharey=True)
    for ax, (xs, y), t in zip(axes.flat, ys, ["I.", "II.", "III.", "IV."]):
        ax.scatter(xs, y, color=BLUE, s=70, zorder=3)
        b, a = np.polyfit(xs, y, 1)
        gx = np.array([3, 20])
        ax.plot(gx, a + b * gx, color=ORANGE, lw=2.5, zorder=2)
        ax.set_title(t + " adatsor", fontsize=16)
    for ax in axes[1]:
        ax.set_xlabel("x")
    for ax in axes[:, 0]:
        ax.set_ylabel("y")
    fig.suptitle(
        "Anscombe négyese: mind a négynek ugyanaz az átlaga, szórása, korrelációja (r = 0,82)\n"
        "és ugyanaz az illesztett egyenes (y = 3 + 0,5x) — a kép mégis négy külön történet",
        x=0.01,
        ha="left",
        fontsize=17,
        fontweight="bold",
        y=1.02,
    )
    fig.text(
        0.01,
        -0.02,
        "Forrás: Anscombe (1973), Graphs in Statistical Analysis. Statisztikák a script által ellenőrizve.",
        fontsize=11,
        color=INK2,
    )
    fig.tight_layout()
    save(fig, "anscombe.png")


# --------------------------------------------------------------- Datasaurus
def datasaurus():
    d = pd.read_csv(HERE / "data/datasaurus.csv")
    names = ["dino", "star", "bullseye", "x_shape"]
    fig, axes = plt.subplots(2, 2, figsize=(11, 8.4))
    for ax, n in zip(axes.flat, names):
        g = d[d.dataset == n]
        ax.scatter(g.x, g.y, color=BLUE, s=22, alpha=0.9)
        ax.set_title(
            f"x̄={g.x.mean():.2f}  ȳ={g.y.mean():.2f}  sx={g.x.std():.2f}  sy={g.y.std():.2f}  r={g.x.corr(g.y):.2f}",
            fontsize=12,
            fontweight="normal",
            color=INK2,
        )
        ax.set_xticks([])
        ax.set_yticks([])
        ax.grid(False)
    fig.suptitle(
        "Datasaurus: négy teljesen különböző alakzat, két tizedesre azonos statisztikákkal",
        x=0.01,
        ha="left",
        fontsize=17,
        fontweight="bold",
        y=1.0,
    )
    fig.text(
        0.01,
        0.0,
        "Forrás: Matejka & Fitzmaurice (2017), Same Stats, Different Graphs (Alberto Cairo dinoszaurusza). Adat: TidyTuesday 2020-10-13.",
        fontsize=10.5,
        color=INK2,
    )
    fig.tight_layout(rect=(0, 0.02, 1, 0.97))
    save(fig, "datasaurus.png")


# ------------------------------------------------------- Makeover (Netflix)
def makeover():
    d = pd.read_csv(NFLX, parse_dates=["date"]).set_index("date")[
        "close_split_adjusted_usd"
    ]
    pk = d.loc[:"2022-06-30"].idxmax()
    tr = d.loc[pk:"2023-12-31"].idxmin()
    mx = d.idxmax()
    last = d.index[-1]
    drop = (d[tr] / d[pk] - 1) * 100
    up = d[mx] / d[tr]
    off = (d[last] / d[mx] - 1) * 100
    print(
        f"netflix: peak {d[pk]:.2f} trough {d[tr]:.2f} ({drop:.1f}%), max {d[mx]:.2f} ({up:.1f}x), last {d[last]:.2f} ({off:.1f}% vs max)"
    )

    # ROSSZ: kiválogatott ablak (mélypont -> csúcs), se cím, se tengelycím, se forrás, kövér piros terület
    w = d.loc[tr:mx]
    fig, ax = plt.subplots(figsize=(11, 6.2), facecolor="#f0e68c")
    ax.set_facecolor("#fffacd")
    ax.fill_between(w.index, w.values, color="red", alpha=0.85)
    ax.grid(True, color="black", lw=1.4)
    for s in ("top", "right"):
        ax.spines[s].set_visible(True)
    ax.tick_params(
        labelsize=9, colors="black"
    )  # a szándékosan rossz ábra világos háttéren él
    save(fig, "makeover_bad.png")

    # JÓ: teljes idősor, a cím maga az insight, tengelycímek + egység, annotált fordulópontok, forrás
    fig, ax = plt.subplots(figsize=(11, 6.2))
    ax.plot(d.index, d.values, color=BLUE, lw=2.4)
    hu = lambda v, nd=0: f"{v:.{nd}f}".replace(".", ",")  # magyar tizedesvessző
    ax.set_title(
        f"Netflix: a 2021-es csúcsból {hu(abs(drop))}%-ot esett, onnan a mélypontról {hu(up, 1)}-szeresére nőtt —\n"
        f"a 2025-ös csúcs óta viszont ismét {hu(abs(off))}%-kal lejjebb",
        fontsize=16,
    )
    ax.set_xlabel("Év")
    ax.set_ylabel("Heti záróár (USD, split-korrigált)")
    # (időpont, felirat, eltolás pontban, vízszintes igazítás)
    for t, lab, off_xy, ha in [
        (pk, f"2021 okt.: ${hu(d[pk])}", (0, 14), "center"),
        (tr, f"2022 jún.: ${hu(d[tr], 1)}", (16, -16), "left"),
        (mx, f"2025 jún.: ${hu(d[mx])}", (0, 8), "center"),
    ]:
        ax.scatter([t], [d[t]], color=ORANGE, s=70, zorder=4)
        ax.annotate(
            lab,
            (t, d[t]),
            textcoords="offset points",
            xytext=off_xy,
            ha=ha,
            fontsize=14,
            color=INK,
        )
    # a legrosszabb hét jegyzete a vonal ALATT, a csúcs-mélypont szakasztól balra (nincs ütközés a vonallal)
    wk = d.pct_change().idxmin()
    ax.annotate(
        f"2022 ápr.: egyetlen hét alatt {hu(d.pct_change().min() * 100)}%",
        xy=(wk, d[wk]),
        xytext=(wk - pd.Timedelta(days=40), 7),
        ha="right",
        fontsize=13,
        color=INK2,
        arrowprops={"arrowstyle": "-", "color": INK2},
    )
    ax.set_ylim(0, None)
    fig.text(
        0.01,
        -0.03,
        "Forrás: nflx_weekly_price.csv (heti záróár, split-korrigált) — a repo adatfájlja.",
        fontsize=11,
        color=INK2,
    )
    save(fig, "makeover_good.png")


# ----------------------------------------------------------- Lie techniques
def lies():
    # 1) csonkolt tengely
    fig, (a, b) = plt.subplots(1, 2, figsize=(11, 5.2))
    for ax, lo, ttl in [
        (a, 96, "Csonkolt tengely (96-tól)"),
        (b, 0, "Nullától induló tengely"),
    ]:
        ax.bar(
            ["1. negyedév", "2. negyedév"], [98, 100], color=[INK2, BLUE], width=0.55
        )
        ax.set_ylim(lo, 101)
        ax.set_title(ttl, fontsize=16)
        ax.set_ylabel("Bevétel (M$) — szintetikus illusztráció")
    fig.suptitle(
        "Ugyanaz a +2%: az egyik képen „megduplázódott”",
        x=0.01,
        ha="left",
        fontsize=17,
        fontweight="bold",
        y=1.03,
    )
    fig.tight_layout()
    save(fig, "lie_truncated_axis.png")

    # 2) két tengely -> álkorreláció
    rng = np.random.default_rng(3)
    yrs = np.arange(2010, 2021)
    s1 = np.cumsum(rng.normal(1.0, 0.4, len(yrs))) + 20
    s2 = np.cumsum(rng.normal(1.0, 0.4, len(yrs))) * 40 + 500
    fig, axes = plt.subplots(1, 2, figsize=(11, 5.2))
    ax = axes[0]
    ax.plot(yrs, s1, color=BLUE, lw=2.6)
    ax2 = ax.twinx()
    ax2.plot(yrs, s2, color=ORANGE, lw=2.6)
    ax2.grid(False)
    ax2.spines["right"].set_visible(True)
    ax.set_title("Két y-tengely: „látványos” együttmozgás", fontsize=15)
    ax.set_xlabel("Év")
    axes[1].scatter(s1, s2, color=INK2, s=60)
    axes[1].set_title("Ugyanez pontdiagramon: két független, trendes sor", fontsize=15)
    axes[1].set_xlabel("A sorozat")
    axes[1].set_ylabel("B sorozat")
    fig.text(
        0.01,
        -0.03,
        "Szintetikus illusztráció: két egymástól független, felfelé sodródó véletlen bolyongás. A trend önmagában „korrelációt” gyárt (vö. 1. óra: álkorreláció).",
        fontsize=10.5,
        color=INK2,
    )
    fig.tight_layout()
    save(fig, "lie_dual_axis.png")

    # 3) terület vs hossz: a kétszeres érték négyszeres területnek látszik
    fig, ax = plt.subplots(figsize=(11, 4.8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4)
    ax.axis("off")
    ax.set_aspect("equal")  # különben a kör ellipszis
    for x, v, lab in [(2.5, 1, "Tavaly: 1"), (7, 2, "Idén: 2")]:
        ax.add_patch(
            plt.Circle((x, 2), 0.7 * v, color=BLUE if v == 1 else ORANGE)
        )  # sugár ~ érték -> terület ~ érték²
        ax.text(x, 0.15, lab, ha="center", fontsize=16)
    ax.set_title(
        "A sugarat skáláztuk az értékkel: +100% az adatban, de ×4 a körterület — a szem a területet olvassa",
        fontsize=15,
        loc="left",
    )
    save(fig, "lie_area.png")


# ------------------------------------------------------- Chart-type gallery
def chart_types():
    rng = np.random.default_rng(0)
    fig, axes = plt.subplots(2, 3, figsize=(15, 8.4))
    t = np.arange(60)
    axes[0, 0].plot(t, 100 + np.cumsum(rng.normal(1, 3, 60)), color=BLUE, lw=2.4)
    axes[0, 0].set_title("Vonal — változás az időben")
    axes[0, 1].bar(["A", "B", "C", "D"], [42, 31, 27, 12], color=BLUE, width=0.6)
    axes[0, 1].set_title("Oszlop — kategóriák összevetése")
    axes[0, 2].hist(rng.lognormal(3, 0.6, 2000), bins=40, color=BLUE)
    axes[0, 2].set_title("Hisztogram — eloszlás alakja")
    x = rng.normal(0, 1, 200)
    axes[1, 0].scatter(
        x, 0.6 * x + rng.normal(0, 0.7, 200), color=BLUE, s=30, alpha=0.8
    )
    axes[1, 0].set_title("Pontdiagram — kapcsolat")
    axes[1, 1].boxplot(
        [rng.normal(m, s, 150) for m, s in [(0, 1), (0.5, 1.6), (1.2, 0.7)]],
        tick_labels=["X", "Y", "Z"],
        patch_artist=True,
        boxprops={"facecolor": "#2f66a8", "color": INK2},
        medianprops={"color": ORANGE, "lw": 2.5},
        whiskerprops={"color": INK2},
        capprops={"color": INK2},
        flierprops={"markeredgecolor": INK2},
    )
    axes[1, 1].set_title("Boxplot — eloszlások összevetése")
    m = np.array(
        [
            [
                max(0.0, 1 - 0.55 * j**0.45 - 0.02 * i) if i + j < 8 else np.nan
                for j in range(8)
            ]
            for i in range(8)
        ]
    )
    axes[1, 2].imshow(m, cmap=SEQ, aspect="auto")
    axes[1, 2].grid(False)
    axes[1, 2].set_title("Hőtérkép — két dimenzió × érték")
    axes[1, 2].set_xlabel("Hónap a regisztráció óta")
    axes[1, 2].set_ylabel("Kohorsz")
    fig.text(
        0.01,
        -0.01,
        "Szintetikus adatok, csak a forma illusztrálására.",
        fontsize=11,
        color=INK2,
    )
    fig.tight_layout()
    save(fig, "chart_types.png")


# ----------------------------------------------------------------- Colors
def colors():
    yy, xx = np.mgrid[-3:3:200j, -3:3:200j]
    z = np.exp(-((xx - 0.8) ** 2 + (yy + 0.4) ** 2)) + 0.6 * np.exp(
        -((xx + 1.2) ** 2 + (yy - 1) ** 2) / 0.6
    )
    fig, axes = plt.subplots(1, 2, figsize=(12, 5.2))
    for ax, cm, ttl in [
        (axes[0], "jet", "Szivárvány („jet”): hamis határok"),
        (axes[1], SEQ, "Egyszínű, egyre világosabb"),
    ]:
        im = ax.imshow(z, cmap=cm, extent=(-3, 3, -3, 3))
        ax.grid(False)
        ax.set_title(ttl, fontsize=15)
        fig.colorbar(im, ax=ax, shrink=0.8)
    fig.suptitle(
        "Ugyanaz a sima dombocska — a szivárványon „gyűrűk” és „csúcsok” látszanak, amik az adatban nincsenek",
        x=0.01,
        ha="left",
        fontsize=15,
        fontweight="bold",
        y=1.02,
    )
    fig.tight_layout()
    save(fig, "color_rainbow.png")

    fig, axes = plt.subplots(1, 3, figsize=(14, 4.6))
    g = np.linspace(0, 1, 256)[None, :]
    axes[0].imshow(g, cmap=SEQ, aspect="auto")
    axes[0].set_title("Szekvenciális: mennyiség (kevés → sok)", fontsize=14)
    axes[1].imshow(g, cmap=DIV, aspect="auto")
    axes[1].set_title("Divergáló: két pólus + semleges közép", fontsize=14)
    pal = [BLUE, ORANGE, AQUA, YELLOW]
    for i, c in enumerate(pal):
        axes[2].add_patch(plt.Rectangle((i, 0), 0.9, 1, color=c))
    axes[2].set_xlim(0, 4)
    axes[2].set_ylim(0, 1)
    axes[2].set_title("Kategoriális: azonosság (max ~4–5 szín)", fontsize=14)
    for ax in axes:
        ax.set_xticks([])
        ax.set_yticks([])
        ax.grid(False)
        for s in ax.spines.values():
            s.set_visible(False)
    fig.tight_layout()
    save(fig, "color_types.png")


# ------------------------------------- Minard: a hőmérsékleti panel újrarajzolva
def minard_temperature():
    """A Minard-térkép alsó hőmérsékleti paneljének jelölt pontjai, olvashatóan újrarajzolva.

    A (dátum, °Réaumur) párok a térkép feliratairól vannak leolvasva (a nagyított kivágáson
    ellenőrizve): "Zéro le 18 8.bre", "-9° le 9 9.bre", "-21° le 14 9.bre", "-20° le 28 9.bre",
    "-24° le 1er X.bre", "-30° le 6 X.bre", "-26° le 7 X.bre". A régi hónapjelölés: 8.bre = október,
    9.bre = november, X.bre = december. Egy további pont (-11°) dátum nélkül szerepel a térképen,
    ezért kimarad. Réaumur -> Celsius: x1,25 (a Réaumur-skálán a víz 0 °R-en fagy, 80 °R-en forr).
    """
    readings = [
        ("1812-10-18", 0),
        ("1812-11-09", -9),
        ("1812-11-14", -21),
        ("1812-11-28", -20),
        ("1812-12-01", -24),
        ("1812-12-06", -30),
        ("1812-12-07", -26),
    ]
    dates = pd.to_datetime([d for d, _ in readings])
    reau = np.array([r for _, r in readings], dtype=float)
    celsius = reau * 1.25
    months = {10: "okt.", 11: "nov.", 12: "dec."}

    def hu(v):
        """Magyar tizedesvessző, valódi mínuszjel, felesleges nullák nélkül (−11,25 és nem −11,2)."""
        s = f"{v:.2f}".rstrip("0").rstrip(".")
        return s.replace(".", ",").replace("-", "−")

    fig, ax = plt.subplots(figsize=(11, 5.4))
    ax.plot(dates, celsius, color=BLUE, lw=2.4, marker="o", ms=8, zorder=3)
    low = int(np.argmin(celsius))
    ax.scatter([dates[low]], [celsius[low]], color=ORANGE, s=90, zorder=4)
    # felirat-eltolás pontban és igazítás pontonként: a decemberi pontok egymáshoz közel vannak
    placement = [
        ((0, 16), "center"),  # okt. 18.
        ((12, -4), "left"),  # nov. 9.
        ((-6, -34), "right"),  # nov. 14.
        ((0, 16), "center"),  # nov. 28.
        ((14, 10), "left"),  # dec. 1.
        ((-14, -30), "right"),  # dec. 6.
        ((16, -24), "left"),  # dec. 7.
    ]
    for (t, r, c), (off, ha) in zip(zip(dates, reau, celsius), placement):
        ax.annotate(
            f"{months[t.month]} {t.day}.\n{hu(r)} °R = {hu(c)} °C",
            (t, c),
            textcoords="offset points",
            xytext=off,
            ha=ha,
            fontsize=12,
            color=INK,
        )
    ax.set_title(
        "A visszavonulás alatt a hőmérséklet 0 °R-ról −30 °R-ra (−37,5 °C-ra) esett",
        fontsize=16,
    )
    ax.set_ylabel("Hőmérséklet (°C, a Réaumur-érték × 1,25)")
    ax.set_xlabel("1812 (a térkép dátumai: okt. 18. – dec. 7.)")
    ax.set_ylim(-48, 10)
    ax.set_xlim(pd.Timestamp("1812-10-12"), pd.Timestamp("1812-12-24"))
    ticks = pd.to_datetime(["1812-10-18", "1812-11-01", "1812-11-15", "1812-12-01"])
    ax.set_xticks(ticks)
    ax.set_xticklabels([f"{months[d.month]} {d.day}." for d in ticks], fontsize=12)
    fig.text(
        0.01,
        -0.04,
        "Forrás: Minard (1869) hőmérsékleti panelje; a jelölt mérési pontok leolvasva a térképről. "
        "Az idő itt balról jobbra telik (a térképen jobbról balra).",
        fontsize=10.5,
        color=INK2,
    )
    save(fig, "minard_temperature.png")


if __name__ == "__main__":
    anscombe()
    datasaurus()
    makeover()
    lies()
    chart_types()
    colors()
    minard_temperature()
