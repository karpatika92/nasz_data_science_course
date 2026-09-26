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


if __name__ == "__main__":
    business_analytics_pyramid()
    print("Kesz:", OUT_DIR / "uzleti_analitika_piramis.png")
