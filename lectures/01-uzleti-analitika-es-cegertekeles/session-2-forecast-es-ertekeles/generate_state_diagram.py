"""A 4 csomopontos (leegyszerusitett) allapotdiagram legyartasa diahoz.

FONTOS a topologia: a lancon vegig-csuszas (churn) szomszedos zonarol
zonara halad (Aktiv -> rovid tav veszelyeztetett -> hosszu tav veszelyeztetett
-> Inaktiv), DE a visszaterese (reaktivacio, feltamasztas) SOSEM a szomszedos
zonaba lep -- mindig KOZVETLENUL az "Aktiv ma" allapotba ugrik, akarhany
zonat is kell at hozza "atugrania". Lasd markov_lib.py::get_next_state:
reactivated_users = at_risk_90_day_users * reactivation_rate (nem
at_risk_wau_users-be lep at), resurrected_users = dormant_users *
resurrection_rate -- mindketto kozvetlenul a DAU/aktiv csoporthoz adodik.
"""

from pathlib import Path as FsPath

import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch
from matplotlib.path import Path as MplPath

OUT_DIR = FsPath(__file__).resolve().parent.parent / "assets"

BG = "#0d2a20"
BG_RAISED = "#123626"
INK = "#e9e4d2"
INK_DIM = "#b9c2b3"
ACCENT = "#d1a13a"
TENSION = "#c1543a"

fig, ax = plt.subplots(figsize=(12, 6.6), dpi=200)
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

boxes = [
    (1.0, "Inaktív\n(dormant)", "90+ napja nem aktív"),
    (4.0, "Veszélyeztetett\n(hosszú táv)", "aktív volt 90 napon\nbelül, de 1 hete nem"),
    (7.0, "Veszélyeztetett\n(rövid táv)", "e héten aktív volt,\nma nem"),
    (10.2, "Aktív ma\n(DAU)", "új / jelenlegi /\nreaktivált / feltámasztott"),
]

y = 0.5
box_h = 1.5
box_w = 2.4

for x, title, sub in boxes:
    fc = BG_RAISED if title != "Aktív ma\n(DAU)" else "#1a4a34"
    box = FancyBboxPatch(
        (x - box_w / 2, y - box_h / 2),
        box_w,
        box_h,
        boxstyle="round,pad=0.08,rounding_size=0.08",
        facecolor=fc,
        edgecolor=ACCENT,
        linewidth=1.6,
    )
    ax.add_patch(box)
    ax.text(x, y + 0.28, title, ha="center", va="center", fontsize=13, fontweight="bold", color=INK, family="monospace")
    ax.text(x, y - 0.35, sub, ha="center", va="center", fontsize=9.5, color=INK_DIM)

# ---------- rovid-tavu, szomszedos-zona nyilak (a churn/losing lanc) ----------
# Ezek mind a "kovetkezo szomszedos zonaba csuszas" iranyat kovetik -- ez az
# EGYETLEN irany, ahol a szomszedos zona a cel.
short_specs = [
    (10.2, 7.0, -0.35, "1 − curr / nurr / rurr / surr", "above", TENSION),
    (7.0, 10.2, 0.35, "iwaurr", "below", ACCENT),
    (7.0, 4.0, -0.35, "wau_loss_rate", "above", TENSION),
    (4.0, 1.0, -0.35, "_90_day_loss_rate", "above", TENSION),
]

for x0, x1, rad, label, pos, color in short_specs:
    arrow = FancyArrowPatch(
        (x0 + (0.55 if x1 > x0 else -0.55), y + (0.08 if rad > 0 else -0.08)),
        (x1 + (-0.55 if x1 > x0 else 0.55), y + (0.08 if rad > 0 else -0.08)),
        connectionstyle=f"arc3,rad={rad*0.25}",
        arrowstyle="-|>",
        mutation_scale=14,
        color=color,
        linewidth=1.6,
    )
    ax.add_patch(arrow)
    mid_x = (x0 + x1) / 2
    y_off = 1.05 if pos == "below" else -1.05
    ax.text(mid_x, y + y_off, label, ha="center", va="center", fontsize=9.5, color=color, family="monospace")

# ---------- hosszu-tavu "atugro" nyilak: a visszateres MINDIG kozvetlenul ----------
# az Aktiv ma allapotba lep, akarhany zonat kell at hozza atugrania -- SOSEM
# a szomszedos (kevesbe veszelyeztetett) zonaba. Explicit kvadratikus Bezier,
# a kontrollpontot a cel fele toljuk (nem a felezopontra), hogy a gorbe
# sokaig FENT maradjon, es csak az "Aktiv ma" doboz elott ereszkedjen le --
# igy nem keresztezi a rovid nyilak cimkeit (pl. "iwaurr") felezouton.
# A cimket a gorbe SAJAT t=0.5 pontjaba tesszuk (bezier_point), nem egy
# feltetelezett "csucs"-ba -- igy garantaltan a vonalon ul.
def bezier_point(p0, c, p1, t):
    x = (1 - t) ** 2 * p0[0] + 2 * t * (1 - t) * c[0] + t**2 * p1[0]
    y = (1 - t) ** 2 * p0[1] + 2 * t * (1 - t) * c[1] + t**2 * p1[1]
    return x, y


long_specs = [
    # (P0, control, P1, label)
    ((4.3, 1.0), (8.6, 2.75), (9.75, 2.05), "reactivation_rate"),
    ((1.3, 1.35), (7.2, 3.55), (10.55, 2.5), "resurrection_rate"),
]

for p0, ctrl, p1, label in long_specs:
    path = MplPath([p0, ctrl, p1], [MplPath.MOVETO, MplPath.CURVE3, MplPath.CURVE3])
    arrow = FancyArrowPatch(
        path=path,
        arrowstyle="-|>",
        mutation_scale=16,
        color=ACCENT,
        linewidth=1.8,
        linestyle=(0, (6, 3)),
    )
    ax.add_patch(arrow)
    lx, ly = bezier_point(p0, ctrl, p1, 0.5)
    ax.text(lx, ly + 0.32, label, ha="center", va="center", fontsize=10.5, color=ACCENT, family="monospace", fontweight="bold")

ax.annotate(
    "",
    xy=(10.2, y + box_h / 2 + 0.05),
    xytext=(10.2, y + box_h / 2 + 0.9),
    arrowprops=dict(arrowstyle="-|>", color=INK, lw=1.8),
)
ax.text(10.2, y + box_h / 2 + 1.05, "új regisztráció", ha="center", fontsize=10, color=INK, family="monospace")

ax.set_xlim(-0.5, 12.2)
ax.set_ylim(-1.9, 3.2)
ax.axis("off")
fig.tight_layout()
fig.savefig(OUT_DIR / "markov_states_diagram.png", facecolor=BG, bbox_inches="tight")
plt.close(fig)
print("Kesz:", OUT_DIR / "markov_states_diagram.png")
