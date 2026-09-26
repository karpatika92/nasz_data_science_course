import nbformat as nbf
from pathlib import Path

nb = nbf.v4.new_notebook()
cells = []

def md(src):
    cells.append(nbf.v4.new_markdown_cell(src))

def code(src):
    cells.append(nbf.v4.new_code_cell(src))

md("""\
# CLTV — worked example

**FONTOS:** a `data/subscriptions_PLACEHOLDER.csv` egyelőre teljesen szintetikus
(kézzel épített) adat, NEM valós, névtelenített checkers.com-minta — az utóbbi
BigQuery-jóváhagyásra vár. Ha megjön, ugyanezzel a sémával lecseréljük a CSV-t,
és ez a notebook változtatás nélkül tovább fut.

Séma: `subscriber_id, tier, monthly_price_usd, registration_cohort_month,
tenure_months, is_active, upgraded, downgraded`.""")

code("""\
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("../data/subscriptions_PLACEHOLDER.csv")
df.head()""")

md("""\
## 1. Empirikus túlélési görbe (élettábla-módszer)

Minden hónapra $t$: kockázatban lévők = akik legalább $t$ hónapig megvoltak;
esemény = akik pontosan a $t$. hónapban morzsolódtak le. A hazárd ebből egy
egyszerű arány, a túlélés a hazárdok szorzata.""")

code("""\
max_t = df["tenure_months"].max()
hazard = []
for t in range(max_t + 1):
    at_risk = df[df["tenure_months"] >= t]
    events = df[(df["tenure_months"] == t) & (~df["is_active"])]
    h = len(events) / len(at_risk) if len(at_risk) else np.nan
    hazard.append(h)

hazard = pd.Series(hazard, name="hazard")
survival = (1 - hazard).cumprod()
survival.name = "survival"

fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(survival.index, survival.values * 100)
ax.set_xlabel("Hónapok az előfizetés kezdete óta (tenure)")
ax.set_ylabel("Túlélő előfizetők aránya (%)")
ax.set_title("Empirikus kohorsz-túlélési görbe")
plt.show()

print(hazard.head(6))""")

md("""\
## 2. CLTV — két módon

**(a) Zárt alak, állandó churn feltevéssel** (a diákon látott formula):
$V = P \\cdot (1+r) / (r + c)$, ahol $c$ egy ÁTLAGOS (állandónak feltételezett)
havi churn-ráta.

**(b) Numerikus összegzés a TÉNYLEGES (nem állandó) túlélési görbével**:
$V = \\sum_t P \\cdot S(t) / (1+r)^t$ — ez nem tételezi fel, hogy a churn
állandó, hanem a valós, korfüggő görbét használja.

Hasonlítsuk össze a kettőt — melyik ad magasabb értéket, és miért?""")

code("""\
monthly_wacc_annual = 0.10
r = (1 + monthly_wacc_annual) ** (1 / 12) - 1  # eves WACC -> havi diszkontrata
P = df["monthly_price_usd"].mean()

# (a) zart alak, atlagos churn-rataval (a hazard-sor elso ~12 honapjanak atlaga,
# hogy elkerüljuk a kis mintaszamu, zajos "farok" honapokat)
c_avg = hazard.iloc[:12].mean()
V_closed_form = P * (1 + r) / (r + c_avg)

# (b) numerikus osszegzes a tenyleges tulelesi gorbevel
discount = 1 / (1 + r) ** survival.index.values
V_numeric = (P * survival.values * discount).sum()

print(f"Átlagár (P): ${P:.2f}/hó")
print(f"Havi diszkontráta (r): {r:.4%}")
print(f"Átlagos churn (c, első 12 hónap): {c_avg:.4%}")
print(f"CLTV -- zárt alak (állandó churn): ${V_closed_form:,.2f}")
print(f"CLTV -- numerikus (tényleges görbe): ${V_numeric:,.2f}")""")

md("""\
## 3. Resubscription — a 2×2-es rendszer zárt alakja

$$V = \\frac{P \\cdot (1 - \\delta(1-\\pi))}{(1 - \\delta\\rho)(1 - \\delta(1-\\pi)) - \\delta^2 c \\pi}$$

ahol $\\delta = 1/(1+r)$, $\\rho = 1-c$. **A $\\pi$ (resub-ráta) egy FELTEVÉS**,
nem az adatból becsült érték — a mi egyszerűsített sémánk nem tartalmaz
resub-eseményeket.""")

code("""\
def cltv_with_resub(P, r, c, pi):
    delta = 1 / (1 + r)
    rho = 1 - c
    numerator = P * (1 - delta * (1 - pi))
    denominator = (1 - delta * rho) * (1 - delta * (1 - pi)) - delta**2 * c * pi
    return numerator / denominator

# Ellenorzes: pi=0-nal vissza kell adnia a resub nelkuli erteket
assert abs(cltv_with_resub(P, r, c_avg, pi=0.0) - V_closed_form) < 1e-6
print("Ellenőrzés OK: π=0 esetén visszaadja a resub nélküli formulát.")

for pi in [0.0, 0.02, 0.05, 0.10]:
    v = cltv_with_resub(P, r, c_avg, pi)
    print(f"π={pi:>5.0%} -> CLTV = ${v:,.2f}")""")

md("""\
## Ti jöttök

Számoljátok ki a CLTV-t (numerikus módszerrel) **külön-külön** az Alap és a
Prémium tier-re. Melyik ügyfél ér többet — és ez arányos-e az árkülönbséggel?""")

code("""\
for tier, g in df.groupby("tier"):
    max_t_tier = g["tenure_months"].max()
    haz = []
    for t in range(max_t_tier + 1):
        at_risk = g[g["tenure_months"] >= t]
        events = g[(g["tenure_months"] == t) & (~g["is_active"])]
        haz.append(len(events) / len(at_risk) if len(at_risk) else np.nan)
    surv = (1 - pd.Series(haz)).cumprod()
    price_tier = g["monthly_price_usd"].mean()
    disc = 1 / (1 + r) ** surv.index.values
    v_tier = (price_tier * surv.values * disc).sum()
    print(f"{tier:10s}: ár=${price_tier:.2f}/hó, CLTV=${v_tier:,.2f}")""")

md("""\
**Miért nő ilyen gyorsan?** A nevező egyre KISEBB lesz, ahogy π nő, és 10%
körül már csak néhány ezreleknyire van a nullától. Ez nem hiba: minél nagyobb
a visszatérési valószínűség a churn-hez képest, annál inkább egy gyakorlatilag
"halhatatlan" kapcsolatot írunk le -- a formula helyesen jelzi, hogy ilyenkor
közelítünk egy matematikai szingularitáshoz. **Gyakorlati tanulság:** mielőtt
bármilyen π-t komolyan vennétek egy valós elemzésben, ellenőrizzétek, hogy a
nevező kényelmesen pozitív marad -- ha nem, a bemeneti feltevések (c és π
egymáshoz képest) irreálisak.""")

nb["cells"] = cells
Path("../session-1-alapok-es-cltv").mkdir(exist_ok=True)
with open("../session-1-alapok-es-cltv/demo_cltv.ipynb", "w") as f:
    nbf.write(nb, f)
print("Written demo_cltv.ipynb")
