"""A nap 'aha' abrája: naiv relativ lift vs. netto konverzio/DAU.

Fogalmi abra (nem BigQuery-adat) a Streaks / Puzzle v2 pelda illusztralasahoz.
Kimenet: ../assets/net_conversions_per_dau.png
"""

import matplotlib.pyplot as plt
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "assets"
OUT_DIR.mkdir(exist_ok=True)

# deck.css szinek (lasd lectures/01-.../data_generation/generate_conceptual_charts.py)
BG = "#0d2a20"
BG_RAISED = "#123626"
INK = "#e9e4d2"
INK_DIM = "#b9c2b3"
ACCENT = "#d1a13a"
LINE = "#e9e4d233"
STREAKS_COLOR = "#e9e4d2"
PUZZLE_COLOR = "#d1a13a"

plt.rcParams.update(
    {
        "font.family": "sans-serif",
        "text.color": INK,
        "axes.edgecolor": LINE,
    }
)

LABELS = ["Streaks\n(elérés: 100%)", "Puzzle v2\n(elérés: 10%)"]
RELATIVE_LIFT_PCT = [1.4, 9.1]
NET_CONVERSIONS_PER_DAU_PCT = [0.60, 0.50]
NET_INCREMENTAL_USERS = [1200, 1000]


def style_axis(ax, title):
    ax.set_facecolor(BG_RAISED)
    ax.set_title(title, color=INK, fontsize=14, fontweight="bold", pad=14)
    ax.tick_params(colors=INK_DIM, labelsize=11)
    for spine in ax.spines.values():
        spine.set_color(LINE)
    ax.yaxis.grid(True, color=LINE, linewidth=0.8)
    ax.set_axisbelow(True)


def net_conversions_chart():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5.4), dpi=200)
    fig.patch.set_facecolor(BG)

    colors = [STREAKS_COLOR, PUZZLE_COLOR]

    bars1 = ax1.bar(LABELS, RELATIVE_LIFT_PCT, color=colors, edgecolor=ACCENT, linewidth=1.2, width=0.55)
    style_axis(ax1, "Naiv nezet: relativ lift a sajat szegmensen")
    ax1.set_ylabel("Relativ lift (%)", color=INK_DIM, fontsize=11)
    ax1.set_ylim(0, 11)
    for bar, val in zip(bars1, RELATIVE_LIFT_PCT):
        ax1.text(bar.get_x() + bar.get_width() / 2, val + 0.25, f"+{val}%", ha="center", color=INK, fontsize=13, fontweight="bold")

    bars2 = ax2.bar(LABELS, NET_INCREMENTAL_USERS, color=colors, edgecolor=ACCENT, linewidth=1.2, width=0.55)
    style_axis(ax2, "A kozos valuta: netto beszamitott D30-visszatero/nap")
    ax2.set_ylabel("Netto beszamitott felhasznalo / nap", color=INK_DIM, fontsize=11)
    ax2.set_ylim(0, 1450)
    for bar, val, pct in zip(bars2, NET_INCREMENTAL_USERS, NET_CONVERSIONS_PER_DAU_PCT):
        ax2.text(
            bar.get_x() + bar.get_width() / 2,
            val + 30,
            f"{val}\n({pct}% / DAU)",
            ha="center",
            color=INK,
            fontsize=13,
            fontweight="bold",
        )

    fig.suptitle(
        "Ugyanaz a ket kiserlet, ket nezetbol — a sorrend megfordul",
        color=INK,
        fontsize=16,
        fontweight="bold",
        y=1.03,
    )
    fig.tight_layout()
    fig.savefig(OUT_DIR / "net_conversions_per_dau.png", bbox_inches="tight", facecolor=BG)
    plt.close(fig)


if __name__ == "__main__":
    net_conversions_chart()
    print(f"Written to {OUT_DIR / 'net_conversions_per_dau.png'}")
