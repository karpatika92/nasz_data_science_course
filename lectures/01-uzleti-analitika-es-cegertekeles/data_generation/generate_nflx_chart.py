"""NFLX arfolyam-diaabra -- VALOS adatbol (lasd nflx_price_data.py)."""

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
OUT_DIR = Path(__file__).resolve().parent.parent / "assets"

BG = "#0d2a20"
INK = "#e9e4d2"
INK_DIM = "#b9c2b3"
ACCENT = "#d1a13a"
TENSION = "#c1543a"

plt.rcParams.update({"font.family": "sans-serif", "text.color": INK})


def chart_nflx_price():
    df = pd.read_csv(DATA_DIR / "nflx_weekly_price.csv", parse_dates=["date"])

    fig, ax = plt.subplots(figsize=(12, 6.2), dpi=200)
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)
    ax.plot(df["date"], df["close_split_adjusted_usd"], color=ACCENT, lw=2.2)

    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)
    for spine in ["left", "bottom"]:
        ax.spines[spine].set_color("#e9e4d233")
    ax.tick_params(colors=INK_DIM, labelsize=13)
    ax.grid(axis="y", color="#e9e4d222", linewidth=0.7)
    ax.set_ylabel("Split-adjusztált záróár (USD)", color=INK_DIM, fontsize=14)
    ax.set_title("Netflix (NFLX) heti záróár, 2016–2026 — valós adat", color=INK, fontsize=17, loc="left")

    def annotate(date_str, text, y_text, xytext_dx=0):
        d = pd.Timestamp(date_str)
        row = df.iloc[(df["date"] - d).abs().argsort()[:1]]
        x, y = row["date"].values[0], row["close_split_adjusted_usd"].values[0]
        ax.annotate(
            text,
            xy=(x, y),
            xytext=(x + pd.Timedelta(days=xytext_dx), y_text),
            fontsize=12.5,
            color=TENSION,
            fontweight="bold",
            ha="center",
            arrowprops=dict(arrowstyle="-|>", color=TENSION, lw=1.6),
        )

    annotate("2022-01-17", "Gyenge Q1-előrejelzés\n(~ -24% két hét alatt)", 90, xytext_dx=-260)
    annotate("2022-04-18", "Első előfizető-vesztés\negy évtizedben (~ -37%)", 8, xytext_dx=180)

    fig.tight_layout()
    fig.savefig(OUT_DIR / "nflx_price_chart.png", facecolor=BG, bbox_inches="tight")
    plt.close(fig)
    print("Kesz:", OUT_DIR / "nflx_price_chart.png")


if __name__ == "__main__":
    chart_nflx_price()
