"""A TELJES 7-allapotu allapotdiagram legyartasa (kulon dia, sajat helye van).

A "Negy zona" dian latott 4-dobozos diagram az "Aktiv ma" allapotot EGY
dobozba surıti (uj/jelenlegi/reaktivalt/feltamasztott). Ez a dia szetbontja
azt a dobozt a 4 tenyleges alcsoportjara -- ez teszi "teljesse" a modellt:
lathato, hogy a reaktivalt/feltamasztott/uj MINDEGYIKE onnan ered, ahonnan a
markov_lib.py::get_next_state ténylegesen szamolja (reactivated_users =
at_risk_90_day_users * reactivation_rate, resurrected_users =
dormant_users * resurrection_rate, stb.), es hogy mindegyik alcsoport
kulon-kulon "elbukhat" vissza a rovid-tavu veszelyeztetett zonaba.

A veszteseg-oldalt (1-curr / 1-nurr / 1-rurr / 1-surr) EGYETLEN, összevont
cimkeju nyillal jelezzuk Jelenlegibol -- nem 4 kulon vonallal --, mert mind a
4 pontosan ugyanoda (veszelyeztetett rovid tav) erkezik, es 4 kulon,
egymast keresztezo vonal a diagramot olvashatatlanna tenne a tenyleges
informaciotartalom novelese nelkul.
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


def bezier_point(p0, c, p1, t):
    x = (1 - t) ** 2 * p0[0] + 2 * t * (1 - t) * c[0] + t**2 * p1[0]
    y = (1 - t) ** 2 * p0[1] + 2 * t * (1 - t) * c[1] + t**2 * p1[1]
    return x, y


def draw_box(ax, x, y, w, h, title, sub, fc, title_size=12.5, sub_size=9):
    box = FancyBboxPatch(
        (x - w / 2, y - h / 2), w, h,
        boxstyle="round,pad=0.08,rounding_size=0.08",
        facecolor=fc, edgecolor=ACCENT, linewidth=1.6,
    )
    ax.add_patch(box)
    ax.text(x, y + h * 0.2, title, ha="center", va="center", fontsize=title_size, fontweight="bold", color=INK, family="monospace")
    ax.text(x, y - h * 0.24, sub, ha="center", va="center", fontsize=sub_size, color=INK_DIM)


def bezier_arrow(ax, p0, ctrl, p1, color, label=None, label_dy=0.3, dashed=True, lw=1.7, scale=15):
    path = MplPath([p0, ctrl, p1], [MplPath.MOVETO, MplPath.CURVE3, MplPath.CURVE3])
    arrow = FancyArrowPatch(
        path=path, arrowstyle="-|>", mutation_scale=scale, color=color,
        linewidth=lw, linestyle=(0, (6, 3)) if dashed else "solid",
    )
    ax.add_patch(arrow)
    if label:
        lx, ly = bezier_point(p0, ctrl, p1, 0.5)
        ax.text(lx, ly + label_dy, label, ha="center", va="center", fontsize=9.5, color=color, family="monospace", fontweight="bold")


fig, ax = plt.subplots(figsize=(13.5, 8.4), dpi=200)
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

y0 = 0.5
pw, ph = 2.4, 1.5   # persistens sor dobozmeret
cw, ch = 2.2, 1.3   # aktiv-klaszter dobozmeret

# ---------- perzisztens allapotok (bal oldal) ----------
draw_box(ax, 1.0, y0, pw, ph, "Inaktív\n(dormant)", "90+ napja nem aktív", BG_RAISED)
draw_box(ax, 4.0, y0, pw, ph, "Veszélyeztetett\n(hosszú táv)", "aktív volt 90 napon\nbelül, de 1 hete nem", BG_RAISED)
draw_box(ax, 7.0, y0, pw, ph, "Veszélyeztetett\n(rövid táv)", "e héten aktív volt,\nma nem", BG_RAISED)

# ---------- aktiv klaszter (jobb oldal, 2x2) ----------
jelenlegi = (10.3, 1.15)
uj = (13.0, 1.15)
reaktivalt = (10.3, -0.95)
feltamasztott = (13.0, -0.95)

draw_box(ax, *jelenlegi, cw, ch, "Jelenlegi", "tegnap is, ma is aktív", "#1a4a34")
draw_box(ax, *uj, cw, ch, "Új", "ma regisztrált", "#1a4a34")
draw_box(ax, *reaktivalt, cw, ch, "Reaktivált", "hosszú távról\ntért vissza", "#1a4a34")
draw_box(ax, *feltamasztott, cw, ch, "Feltámasztott", "inaktívból\ntért vissza", "#1a4a34")

# klaszter korberajzolasa + cimke -- ez a 4 doboz egyutt alkotja a "DAU"-t
cluster_box = FancyBboxPatch(
    (8.75, -1.95), 5.75, 4.0,
    boxstyle="round,pad=0.05,rounding_size=0.12",
    facecolor="none", edgecolor=INK_DIM, linewidth=1.2, linestyle=(0, (3, 3)),
)
ax.add_patch(cluster_box)
ax.text(11.62, 2.2, "AKTÍV MA (DAU)", ha="center", va="center", fontsize=10.5, color=INK_DIM, family="monospace")

# ---------- perzisztens lanc: szomszedos-zona veszteseg (rovid, cimke FENT --
# a diagram also fele a hosszu nyeresig-iveknek kell, hogy ne keresztezzenek
# cimket) ----------
for x0, x1, label in [(7.0, 4.0, "wau_loss_rate"), (4.0, 1.0, "_90_day_loss_rate")]:
    arrow = FancyArrowPatch(
        (x0 - 0.55, y0 + 0.08), (x1 + 0.55, y0 + 0.08),
        connectionstyle="arc3,rad=0.0875", arrowstyle="-|>", mutation_scale=14,
        color=TENSION, linewidth=1.6,
    )
    ax.add_patch(arrow)
    ax.text((x0 + x1) / 2, y0 + 1.05, label, ha="center", va="center", fontsize=9.5, color=TENSION, family="monospace")

# ---------- nyeresegek: mindegyik KOZVETLENUL a sajat celallapotaba ugrik ----------
bezier_arrow(ax, (7.55, 0.75), (8.9, 1.55), (9.2, 1.05), ACCENT, "iwaurr", label_dy=0.32, scale=15)
bezier_arrow(ax, (5.2, 0.15), (7.2, -2.35), (9.2, -0.75), ACCENT, "reactivation_rate", label_dy=-0.35, scale=15)
bezier_arrow(ax, (2.2, 0.1), (7.0, -3.55), (11.9, -0.75), ACCENT, "resurrection_rate", label_dy=-0.35, scale=16)

ax.annotate(
    "", xy=(13.0, 1.8), xytext=(13.0, 2.7),
    arrowprops=dict(arrowstyle="-|>", color=INK, lw=1.8),
)
ax.text(13.0, 2.85, "új regisztráció", ha="center", fontsize=10, color=INK, family="monospace")

# ---------- veszteseg: EGYETLEN, osszevont cimkeju nyil Jelenlegibol ----------
# (mind a 4 aktiv-alcsoport nem-megtartott resze ide erkezik -- 4 kulon,
# egymast keresztezo vonal helyett egy cimke sorolja fel oket, mert
# pontosan ugyanoda mennek.) Alacsonyabb savon fut, mint az iwaurr, hogy
# a ket nyil es cimke ne fedje egymast.
bezier_arrow(
    ax, (9.2, 0.58), (8.7, 0.85), (8.2, 0.58), TENSION,
    "1 − curr / nurr / rurr / surr", label_dy=-0.35, dashed=False, scale=15,
)

ax.set_xlim(-0.5, 14.9)
ax.set_ylim(-4.1, 3.3)
ax.axis("off")
fig.tight_layout()
fig.savefig(OUT_DIR / "markov_full_state_diagram.png", facecolor=BG, bbox_inches="tight")
plt.close(fig)
print("Kesz:", OUT_DIR / "markov_full_state_diagram.png")
