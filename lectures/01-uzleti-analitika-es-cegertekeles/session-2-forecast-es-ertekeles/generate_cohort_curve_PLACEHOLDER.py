"""IDEIGLENES, teljesen szintetikus kohorsz-tulelesi gorbe -- csak addig,
amig a valos, nevtelenitett subscription_states-mintat jova nem hagyjak es
le nem huzzuk BigQueryből (lasd 2. terv-lepes). Ha a valos adat megjon,
EZT A FAJLT/abrat cikkre kell (data_generation/ pull szkript + ujragenerlt
tenure_churn_curve.png), es a fajlnevbol a PLACEHOLDER jelzest torolni kell.
"""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np

OUT_DIR = Path(__file__).resolve().parent.parent / "assets"

BG = "#0d2a20"
INK = "#e9e4d2"
INK_DIM = "#b9c2b3"
ACCENT = "#d1a13a"
TENSION = "#c1543a"

rng = np.random.default_rng(11)
months = np.arange(1, 37)
hazard = 0.02 + 0.5 / (months + 1)  # gyors korai churn, majd lassulas
survival_avg = np.cumprod(1 - hazard)

# Egy veletlen, KIS mintaju kohorsz (N~150) -- zajosabb, mert kevesebb ember
N = 150
alive = np.full(N, True)
survival_cohort = []
for h in hazard:
    churn_now = alive & (rng.random(N) < h)
    alive = alive & ~churn_now
    survival_cohort.append(alive.mean())
survival_cohort = np.array(survival_cohort)

fig, ax = plt.subplots(figsize=(11, 6), dpi=200)
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
ax.plot(months, survival_avg * 100, color=ACCENT, lw=2.5, label="Átlag (sok kohorsz együtt)")
ax.plot(months, survival_cohort * 100, color=TENSION, lw=1.8, alpha=0.85, label=f"Egy véletlen kohorsz (N={N})")
for spine in ["top", "right"]:
    ax.spines[spine].set_visible(False)
for spine in ["left", "bottom"]:
    ax.spines[spine].set_color("#e9e4d233")
ax.tick_params(colors=INK_DIM)
ax.set_xlabel("Hónapok az előfizetés kezdete óta (tenure)", color=INK_DIM)
ax.set_ylabel("Túlélő előfizetők aránya (%)", color=INK_DIM)
ax.grid(axis="y", color="#e9e4d233", linewidth=0.6)
ax.legend(loc="upper right", frameon=False, labelcolor=INK, fontsize=10)
ax.set_title(
    "ILLUSZTRÁCIÓ (szintetikus, nem valós adat) — kohorsz-túlélési görbe",
    color=INK, fontsize=13, loc="left",
)
fig.tight_layout()
fig.savefig(OUT_DIR / "tenure_churn_curve_PLACEHOLDER.png", facecolor=BG, bbox_inches="tight")
plt.close(fig)
print("Kesz (PLACEHOLDER):", OUT_DIR / "tenure_churn_curve_PLACEHOLDER.png")
