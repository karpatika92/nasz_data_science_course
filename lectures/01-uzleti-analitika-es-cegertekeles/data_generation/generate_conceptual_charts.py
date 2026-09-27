"""Nem adatvezérelt, fogalmi ábrák legyártása a diákhoz (nem BigQuery-adat).

A deck sajat szinpalettajat hasznaljuk (lasd assets/deck/deck.css), hogy az
abrak vizualisan simuljanak a diakba. Kimenet: ../assets/*.png
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "assets"
OUT_DIR.mkdir(exist_ok=True)

# deck.css szinek
BG = "#0d2a20"
BG_RAISED = "#123626"
INK = "#e9e4d2"
INK_DIM = "#b9c2b3"
ACCENT = "#d1a13a"
LINE = "#e9e4d233"

plt.rcParams.update(
    {
        "font.family": "sans-serif",
        "text.color": INK,
        "axes.edgecolor": LINE,
    }
)


def business_analytics_pyramid():
    """4 szintes piramis: Leiro / Diagnosztikai / Prediktiv / Preskriptiv."""
    fig, ax = plt.subplots(figsize=(10, 7.2), dpi=200)
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    tiers = [
        ("LEÍRÓ ANALITIKA", "Mi történt?", ACCENT, 0.55),
        ("DIAGNOSZTIKAI ANALITIKA", "Miért történt?", "#c9a34f", 0.62),
        ("PREDIKTÍV ANALITIKA", "Mi fog történni?", "#c9b36a", 0.70),
        ("PRESKRIPTÍV ANALITIKA", "Mit tegyünk?", "#e9e4d2", 0.78),
    ]
    n = len(tiers)
    tier_h = 1.0 / n
    base_half_width = 0.92

    for i, (title, question, color, shade) in enumerate(tiers):
        y0 = i * tier_h
        y1 = y0 + tier_h
        # szelesseg csokken felfele -> klasszikus piramis-korvonal
        w0 = base_half_width * (1 - i / n)
        w1 = base_half_width * (1 - (i + 1) / n)
        poly = patches.Polygon(
            [(-w0, y0), (w0, y0), (w1, y1), (-w1, y1)],
            closed=True,
            facecolor=BG_RAISED if i % 2 == 0 else BG,
            edgecolor=ACCENT,
            linewidth=1.4,
        )
        ax.add_patch(poly)
        ax.text(
            0,
            (y0 + y1) / 2 + 0.018,
            title,
            ha="center",
            va="center",
            fontsize=15,
            fontweight="bold",
            color=INK,
            family="monospace",
        )
        ax.text(
            0,
            (y0 + y1) / 2 - 0.045,
            question,
            ha="center",
            va="center",
            fontsize=12.5,
            color=INK_DIM,
            style="italic",
        )

    # tengelyek: ertek / nehezseg, nyillal jobbra-felfele
    ax.annotate(
        "",
        xy=(1.08, 1.05),
        xytext=(1.08, -0.02),
        arrowprops=dict(arrowstyle="-|>", color=ACCENT, lw=2),
    )
    ax.text(
        1.14,
        0.5,
        "ÉRTÉK / NEHÉZSÉG",
        rotation=90,
        va="center",
        ha="center",
        fontsize=11,
        color=ACCENT,
        family="monospace",
    )

    ax.set_xlim(-1.05, 1.3)
    ax.set_ylim(-0.05, 1.08)
    ax.axis("off")
    fig.tight_layout()
    fig.savefig(OUT_DIR / "uzleti_analitika_piramis.png", facecolor=BG, bbox_inches="tight")
    plt.close(fig)


def venn_adattudomany():
    """Sajat, deck-stilusu Venn-diagram (Drew Conway, 2010 tartalommal,
    ujrarajzolva a deck sajat szinpalettajaval, nem az eredeti szines kep)."""
    fig, ax = plt.subplots(figsize=(9, 8), dpi=200)
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    r = 1.25
    centers = {
        "hacking": (-0.62, 0.36),
        "math": (0.62, 0.36),
        "domain": (0.0, -0.62),
    }
    colors = {
        "hacking": ACCENT,
        "math": "#4a8f72",
        "domain": "#c1543a",
    }
    labels = {
        "hacking": "Hacking skills",
        "math": "Matek &\nstatisztika",
        "domain": "Terület-specifikus\ntudás",
    }
    label_offsets = {
        "hacking": (-1.15, 1.05),
        "math": (1.15, 1.05),
        "domain": (0.0, -1.55),
    }

    for key, c in centers.items():
        circ = patches.Circle(c, r, facecolor=colors[key], edgecolor=colors[key], alpha=0.32, linewidth=2.2)
        ax.add_patch(circ)
        circ_outline = patches.Circle(c, r, facecolor="none", edgecolor=colors[key], alpha=0.9, linewidth=2.2)
        ax.add_patch(circ_outline)
        lx, ly = label_offsets[key]
        ax.text(lx, ly, labels[key], ha="center", va="center", fontsize=15, fontweight="bold", color=colors[key], family="monospace")

    # Metszet-cimkek (kezzel pozicionalva a klasszikus 3-koros elrendezeshez)
    ax.text(0, 0.62, "Gépi\ntanulás", ha="center", va="center", fontsize=12.5, color=INK, fontweight="bold")
    ax.text(-0.78, -0.55, "Danger\nzone", ha="center", va="center", fontsize=12, color=INK, style="italic")
    ax.text(0.78, -0.55, "Hagyományos\nkutatás", ha="center", va="center", fontsize=11.5, color=INK)
    ax.text(0, -0.12, "Adat-\ntudomány", ha="center", va="center", fontsize=15, fontweight="bold", color=INK, family="monospace")

    ax.set_xlim(-2.1, 2.1)
    ax.set_ylim(-2.1, 1.9)
    ax.set_aspect("equal")
    ax.axis("off")
    fig.tight_layout()
    fig.savefig(OUT_DIR / "venn_adattudomany.png", facecolor=BG, bbox_inches="tight")
    plt.close(fig)


def churn_curve_simple():
    """Egyetlen, illusztracios tulelesi gorbe: a churn NEM linearis --
    gyors az elejen, majd lassul (duration dependence)."""
    import numpy as np

    months = np.arange(0, 37)
    hazard = 0.02 + 0.5 / (months + 1)
    survival = np.concatenate([[1.0], np.cumprod(1 - hazard[1:])])

    fig, ax = plt.subplots(figsize=(9, 5.5), dpi=200)
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)
    ax.plot(months, survival * 100, color=ACCENT, lw=2.8)
    ax.fill_between(months, survival * 100, color=ACCENT, alpha=0.12)

    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)
    for spine in ["left", "bottom"]:
        ax.spines[spine].set_color(LINE)
    ax.tick_params(colors=INK_DIM, labelsize=12)
    ax.set_xlabel("Hónapok az előfizetés kezdete óta", color=INK_DIM, fontsize=13)
    ax.set_ylabel("Túlélő előfizetők (%)", color=INK_DIM, fontsize=13)
    ax.set_title("A churn NEM lineáris — gyors az elején, majd lassul", color=INK, fontsize=15, loc="left")
    ax.grid(axis="y", color=LINE, linewidth=0.6)

    fig.tight_layout()
    fig.savefig(OUT_DIR / "churn_curve_simple.png", facecolor=BG, bbox_inches="tight")
    plt.close(fig)


if __name__ == "__main__":
    business_analytics_pyramid()
    venn_adattudomany()
    churn_curve_simple()
    print("Kesz:", OUT_DIR / "uzleti_analitika_piramis.png")
    print("Kesz:", OUT_DIR / "venn_adattudomany.png")
    print("Kesz:", OUT_DIR / "churn_curve_simple.png")
