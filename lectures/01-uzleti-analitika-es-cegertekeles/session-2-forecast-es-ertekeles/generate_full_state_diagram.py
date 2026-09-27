"""A TELJES 7-allapotu allapotdiagram legyartasa (kulon dia, sajat helye van).

A "Negy zona" dian latott 4-dobozos diagram az "Aktiv ma" allapotot EGY
dobozba surıti (uj/jelenlegi/reaktivalt/feltamasztott). Ez a dia szetbontja
azt a dobozt a 4 tenyleges alcsoportjara, ES kiirja MIND A NEGY XURR-rata
sajat nyilat -- ezek (curr/nurr/rurr/surr, es ezek komplementer resze az
at-risk-wau fele) a modell szive, nem szabad egy összevont cimke moge
rejteni oket. Lasd markov_lib.py::get_next_state:
    current_users = current*curr + new*nurr + reactivated*rurr
                     + resurrected*surr + at_risk_wau*iwaurr
    at_risk_wau    = new*(1-nurr) + current*(1-curr) + reactivated*(1-rurr)
                     + resurrected*(1-surr) + ...

Elrendezes: a 4 aktiv-alcsoport EGY FUGGOLEGES oszlopban van (nem 2x2-ben),
Jelenlegi a kozepen -- igy mind a negynek termeszetes, kulon-kulon vonala
lehet a VeszRovid fele (a sajat magassagaban), es a satellita-dobozok
(Uj/Reaktivalt/Feltamasztott) termeszetesen csatlakoznak Jelenlegihez.
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


def draw_box(ax, x, y, w, h, title, sub, fc, title_size=13, sub_size=9.5):
    box = FancyBboxPatch(
        (x - w / 2, y - h / 2), w, h,
        boxstyle="round,pad=0.08,rounding_size=0.08",
        facecolor=fc, edgecolor=ACCENT, linewidth=1.6,
    )
    ax.add_patch(box)
    ax.text(x, y + h * 0.22, title, ha="center", va="center", fontsize=title_size, fontweight="bold", color=INK, family="monospace")
    ax.text(x, y - h * 0.26, sub, ha="center", va="center", fontsize=sub_size, color=INK_DIM)


def bezier_arrow(ax, p0, ctrl, p1, color, label=None, label_dx=0.0, label_dy=0.3, dashed=True, lw=1.7, scale=15, fontsize=10.5):
    path = MplPath([p0, ctrl, p1], [MplPath.MOVETO, MplPath.CURVE3, MplPath.CURVE3])
    arrow = FancyArrowPatch(
        path=path, arrowstyle="-|>", mutation_scale=scale, color=color,
        linewidth=lw, linestyle=(0, (6, 3)) if dashed else "solid",
    )
    ax.add_patch(arrow)
    if label:
        lx, ly = bezier_point(p0, ctrl, p1, 0.5)
        ax.text(lx + label_dx, ly + label_dy, label, ha="center", va="center", fontsize=fontsize, color=color, family="monospace", fontweight="bold")


def self_loop(ax, cx, cy, w, h, color, label):
    p0 = (cx + w * 0.42, cy + h * 0.3)
    c1 = (cx + w / 2 + 1.15, cy + h * 0.62)
    c2 = (cx + w / 2 + 1.15, cy - h * 0.62)
    p1 = (cx + w * 0.42, cy - h * 0.3)
    path = MplPath([p0, c1, c2, p1], [MplPath.MOVETO, MplPath.CURVE4, MplPath.CURVE4, MplPath.CURVE4])
    arrow = FancyArrowPatch(path=path, arrowstyle="-|>", mutation_scale=14, color=color, linewidth=1.7)
    ax.add_patch(arrow)
    ax.text(cx + w / 2 + 1.45, cy, label, ha="center", va="center", fontsize=12, color=color, family="monospace", fontweight="bold")


fig, ax = plt.subplots(figsize=(14.5, 10.5), dpi=200)
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

y0 = 0.5
pw, ph = 2.4, 1.5   # perzisztens sor dobozmeret
cw, ch = 2.3, 1.15  # aktiv-oszlop dobozmeret

# ---------- perzisztens allapotok (bal oldal) ----------
draw_box(ax, 1.0, y0, pw, ph, "Inaktív\n(dormant)", "90+ napja nem aktív", BG_RAISED)
draw_box(ax, 4.0, y0, pw, ph, "Veszélyeztetett\n(hosszú táv)", "aktív volt 90 napon\nbelül, de 1 hete nem", BG_RAISED)
draw_box(ax, 7.0, y0, pw, ph, "Veszélyeztetett\n(rövid táv)", "e héten aktív volt,\nma nem", BG_RAISED)

# ---------- aktiv oszlop (jobb oldal, fuggoleges: Uj / Jelenlegi / Reaktivalt / Feltamasztott) ----------
cx = 11.3
uj_y, jel_y, rea_y, fel_y = 2.85, 1.0, -0.85, -2.7

draw_box(ax, cx, uj_y, cw, ch, "Új", "ma regisztrált", "#1a4a34")
draw_box(ax, cx, jel_y, cw, ch, "Jelenlegi", "tegnap is, ma is aktív", "#1a4a34")
draw_box(ax, cx, rea_y, cw, ch, "Reaktivált", "hosszú távról\ntért vissza", "#1a4a34")
draw_box(ax, cx, fel_y, cw, ch, "Feltámasztott", "inaktívból\ntért vissza", "#1a4a34")

# klaszter korberajzolasa + cimke -- ez a 4 doboz egyutt alkotja a "DAU"-t
cluster_box = FancyBboxPatch(
    (cx - cw / 2 - 0.35, fel_y - ch / 2 - 0.3), cw + 2.2, (uj_y - fel_y) + ch + 0.6,
    boxstyle="round,pad=0.05,rounding_size=0.12",
    facecolor="none", edgecolor=INK_DIM, linewidth=1.2, linestyle=(0, (3, 3)),
)
ax.add_patch(cluster_box)
ax.text(cx + 0.6, uj_y + ch / 2 + 0.55, "AKTÍV MA (DAU)", ha="center", va="center", fontsize=10.5, color=INK_DIM, family="monospace")

# ---------- perzisztens lanc: szomszedos-zona veszteseg (cimke fent) ----------
for x0, x1, label in [(7.0, 4.0, "wau_loss_rate"), (4.0, 1.0, "_90_day_loss_rate")]:
    arrow = FancyArrowPatch(
        (x0 - 0.55, y0 + 0.08), (x1 + 0.55, y0 + 0.08),
        connectionstyle="arc3,rad=0.0875", arrowstyle="-|>", mutation_scale=14,
        color=TENSION, linewidth=1.6,
    )
    ax.add_patch(arrow)
    ax.text((x0 + x1) / 2, y0 + 1.05, label, ha="center", va="center", fontsize=9.5, color=TENSION, family="monospace")

# ---------- kulso (perzisztens lancbol jovo) nyeresegek: mindegyik KOZVETLENUL ----------
# a sajat celallapotaba ugrik (nem a szomszedos zonaba)
bezier_arrow(ax, (7.55, 0.75), (8.75, 1.05), (10.15, 1.25), ACCENT, "iwaurr", label_dx=-0.15, label_dy=0.28, scale=15)
bezier_arrow(ax, (4.6, 0.05), (7.6, -2.0), (10.15, -0.55), ACCENT, "reactivation_rate", label_dy=-0.35, scale=15)
bezier_arrow(ax, (1.7, 0.0), (6.6, -3.6), (10.15, -2.35), ACCENT, "resurrection_rate", label_dy=-0.35, scale=16)

ax.annotate(
    "", xy=(cx, uj_y + ch / 2 + 0.05), xytext=(cx, uj_y + ch / 2 + 0.85),
    arrowprops=dict(arrowstyle="-|>", color=INK, lw=1.8),
)
ax.text(cx, uj_y + ch / 2 + 1.0, "új regisztráció", ha="center", fontsize=10, color=INK, family="monospace")

# ---------- BELSO oszlop-nyilak: mindegyik satellita Jelenlegibe torekszik ----------
# (nurr / rurr / surr) -- ez ES a self-loop (curr) egyutt a "megtartas" oldal.
bezier_arrow(ax, (cx - 0.3, uj_y - ch / 2), (cx - 0.5, (uj_y + jel_y) / 2), (cx - 0.3, jel_y + ch / 2), ACCENT, "nurr", label_dx=-0.55, label_dy=0, scale=14, fontsize=11.5)
bezier_arrow(ax, (cx - 0.3, rea_y + ch / 2), (cx - 0.5, (rea_y + jel_y) / 2), (cx - 0.3, jel_y - ch / 2), ACCENT, "rurr", label_dx=-0.55, label_dy=0, scale=14, fontsize=11.5)
bezier_arrow(ax, (cx + 0.5, fel_y + ch / 2), (cx + 2.4, (fel_y + jel_y) / 2), (cx + 0.5, jel_y - ch / 2), ACCENT, "surr", label_dx=0.9, label_dy=0, scale=14, fontsize=11.5)
self_loop(ax, cx, jel_y, cw, ch, ACCENT, "curr")

# ---------- VESZTESEG: mindegyik aktiv-alcsoport SAJAT nyila VeszRovid fele ----------
# Cimke nelkul -- a curr/nurr/rurr/surr mar megvan a megtartas oldalon, a
# "1-X" felirat csak redundans zsufoltsag lenne. A landolasi pontok a
# forras magassaga szerint rendezve, hogy a legyezo NE keresztezze onmagat.
loss_specs = [
    ((10.15, uj_y - 0.3), (9.7, 2.15), (8.2, 1.05)),
    ((10.15, jel_y - 0.2), (9.2, 0.75), (8.2, 0.7)),
    ((10.15, rea_y + 0.15), (9.2, 0.05), (8.2, 0.35)),
    ((10.15, fel_y + 0.35), (9.4, -1.2), (8.2, 0.0)),
]
for p0, ctrl, p1 in loss_specs:
    bezier_arrow(ax, p0, ctrl, p1, TENSION, dashed=False, scale=15)

ax.set_xlim(-0.5, 15.6)
ax.set_ylim(-4.5, 4.1)
ax.axis("off")
fig.tight_layout()
fig.savefig(OUT_DIR / "markov_full_state_diagram.png", facecolor=BG, bbox_inches="tight")
plt.close(fig)
print("Kesz:", OUT_DIR / "markov_full_state_diagram.png")
