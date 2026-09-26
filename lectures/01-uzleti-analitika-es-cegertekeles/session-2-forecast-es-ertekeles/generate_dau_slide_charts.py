"""Dia-abrak legyartasa a DAU/Markov-esettanulmanyhoz -- csak szintetikus adat.

Futtatas: uv run python generate_dau_slide_charts.py
Kimenet: ../assets/*.png
"""

import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))
from markov_lib import (
    build_synthetic_rate_trajectory,
    decompose_seasonality,
    default_starting_state,
    reapply_seasonality,
    run_forecast,
)

OUT_DIR = Path(__file__).resolve().parent.parent / "assets"
OUT_DIR.mkdir(exist_ok=True)

BG = "#0d2a20"
BG_RAISED = "#123626"
INK = "#e9e4d2"
INK_DIM = "#b9c2b3"
ACCENT = "#d1a13a"
TENSION = "#c1543a"
LINE = "#e9e4d233"

plt.rcParams.update(
    {
        "font.family": "sans-serif",
        "text.color": INK,
        "axes.edgecolor": LINE,
        "axes.labelcolor": INK_DIM,
        "xtick.color": INK_DIM,
        "ytick.color": INK_DIM,
        "axes.facecolor": BG,
        "figure.facecolor": BG,
        "grid.color": LINE,
    }
)


def style_ax(ax):
    ax.set_facecolor(BG)
    for spine in ["top", "right"]:
        ax.spines[spine].set_visible(False)
    for spine in ["left", "bottom"]:
        ax.spines[spine].set_color(LINE)
    ax.grid(axis="y", alpha=0.5, linewidth=0.6)


def chart_dau_decomposition():
    traj = build_synthetic_rate_trajectory(n_days=365 * 3)
    start = default_starting_state()
    out = run_forecast(traj, start)
    out = out.iloc[-365 * 2 :]  # utolso 2 ev, olvashatobb

    cols = ["current_users", "new_users", "reactivated_users", "resurrected_users"]
    labels = ["Jelenlegi (current)", "Új (new)", "Reaktivált", "Feltámasztott"]
    colors = ["#3d5c4d", ACCENT, TENSION, "#5b9c8a"]
    shares = out[cols].div(out["dau"], axis=0) * 100

    fig, ax = plt.subplots(figsize=(11, 6), dpi=200)
    ax.stackplot(out.index, [shares[c] for c in cols], labels=labels, colors=colors, alpha=0.92)
    style_ax(ax)
    ax.set_ylabel("A DAU %-os összetétele")
    ax.set_ylim(0, 100)
    ax.legend(loc="lower left", frameon=False, labelcolor=INK, fontsize=10, ncol=4)
    ax.set_title("DAU felbontása komponensekre — %-os összetétel (szintetikus adat)", color=INK, fontsize=13, loc="left")
    fig.tight_layout()
    fig.savefig(OUT_DIR / "dau_decomposition.png", facecolor=BG, bbox_inches="tight")
    plt.close(fig)


def chart_seasonality_before_after():
    traj = build_synthetic_rate_trajectory(n_days=365 * 2)
    window = traj.iloc[-365:].reset_index(drop=True)

    dec_new = decompose_seasonality(window["date"], window["new_users"], multiplicative=True)
    dec_curr = decompose_seasonality(window["date"], window["curr"], multiplicative=False)

    fig, axes = plt.subplots(2, 1, figsize=(11, 8), dpi=200, sharex=True)

    ax = axes[0]
    ax.plot(dec_new["date"], dec_new["value"], color=INK_DIM, lw=1, alpha=0.8, label="nyers (heti+havi mintázattal)")
    ax.plot(dec_new["date"], dec_new["deseasoned"], color=ACCENT, lw=2, label="deszezonalizált trend")
    style_ax(ax)
    ax.set_title("Új felhasználók — nyers vs. deszezonalizált trend", color=INK, fontsize=13, loc="left")
    ax.legend(loc="upper left", frameon=False, labelcolor=INK, fontsize=9)

    ax = axes[1]
    ax.plot(dec_curr["date"], dec_curr["value"], color=INK_DIM, lw=1, alpha=0.8, label="nyers curr")
    ax.plot(dec_curr["date"], dec_curr["deseasoned"], color=ACCENT, lw=2, label="deszezonalizált trend")
    style_ax(ax)
    ax.set_title("Megtartási ráta (curr) — nyers vs. deszezonalizált trend", color=INK, fontsize=13, loc="left")
    ax.legend(loc="upper left", frameon=False, labelcolor=INK, fontsize=9)

    fig.tight_layout()
    fig.savefig(OUT_DIR / "seasonality_before_after.png", facecolor=BG, bbox_inches="tight")
    plt.close(fig)


def chart_scenario_comparison():
    n_days = 365 * 4
    start = default_starting_state()

    scenarios = {
        "Alapeset": {},
        "Növekedés leáll": {"new_users": -0.40},
        "Végtelen növekedés": {"new_users": 0.40},
        "Megtartás javul (+1.5pp/nap)": {"curr": 0.015},
    }

    fig, ax = plt.subplots(figsize=(11, 6), dpi=200)
    colors = [ACCENT, TENSION, "#7fae8e", "#e9e4d2"]
    for (name, growth_scn), color in zip(scenarios.items(), colors):
        traj = build_synthetic_rate_trajectory(n_days=n_days, growth_rate_scenarios=growth_scn)
        out = run_forecast(traj, start)
        ax.plot(out.index, out["dau"], label=name, color=color, lw=2)

    style_ax(ax)
    ax.set_ylabel("Napi aktív felhasználó (DAU)")
    ax.legend(loc="upper left", frameon=False, labelcolor=INK, fontsize=10)
    ax.set_title("Forgatókönyv-összehasonlítás (szintetikus adat)", color=INK, fontsize=13, loc="left")
    fig.tight_layout()
    fig.savefig(OUT_DIR / "scenario_comparison.png", facecolor=BG, bbox_inches="tight")
    plt.close(fig)


def chart_equilibrium_tam():
    n_days = 365 * 6
    start = default_starting_state()
    traj = build_synthetic_rate_trajectory(n_days=n_days)

    out_infinite = run_forecast(traj, start, tam=None)
    out_finite = run_forecast(traj, start, tam=2_000_000.0)

    fig, axes = plt.subplots(1, 2, figsize=(14, 3.0), dpi=200)

    ax = axes[0]
    ax.plot(out_infinite.index, out_infinite["dau"], color=ACCENT, lw=2)
    style_ax(ax)
    ax.set_title("„Végtelen piac” (TAMP=1)\nEgyensúly = konstans NÖVEKEDÉSI RÁTA", color=INK, fontsize=12, loc="left")
    ax.set_ylabel("DAU")

    ax = axes[1]
    ax.plot(out_finite.index, out_finite["dau"], color="#7fae8e", lw=2)
    style_ax(ax)
    ax.set_title("Véges piacméret (TAM = 2M)\nEgyensúly = fix SZINT", color=INK, fontsize=12, loc="left")

    fig.tight_layout()
    fig.savefig(OUT_DIR / "equilibrium_tam.png", facecolor=BG, bbox_inches="tight")
    plt.close(fig)

    weekly_growth_end = out_infinite["dau"].iloc[-8] and (
        out_infinite["dau"].iloc[-1] / out_infinite["dau"].iloc[-8] - 1
    )
    print(f"Vegtelen piac -- utolso heti novekedesi rata: {weekly_growth_end:.4%}")
    print(f"Veges piac -- utolso DAU: {out_finite['dau'].iloc[-1]:,.0f}, TAM: 2,000,000")


if __name__ == "__main__":
    chart_dau_decomposition()
    chart_seasonality_before_after()
    chart_scenario_comparison()
    chart_equilibrium_tam()
    print("Kesz -- lasd ../assets/*.png")
