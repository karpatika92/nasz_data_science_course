"""IDEIGLENES, teljesen szintetikus (nem BigQuery-bol szarmazo) adatok a
notebookokhoz -- pontosan azzal a sema val, amit a valos, nevtelenitett
BigQuery-mintak is majd kovetnek (lasd terv 2. pontja), hogy a notebookok
mar most vegigfuthassanak, es kesobb csak a CSV-ket kelljen lecserelni,
a kod valtozatlan maradhat.

Ha a BigQuery-lehuzas jovahagyast kap, EZT A FAJLT NE hasznaljuk tovabb --
a valos adatot kulon szkript (pull_and_anonymize.py, meg nem irt) allitja
elo, ugyanezzel a sema val, es a "_PLACEHOLDER" jelzest a CSV-nevekbol torolni
kell mindenhol (ide ertve a slides-data.js es a notebookok hivatkozasait is).

Kimenet:
  ../data/subscriptions_PLACEHOLDER.csv
  ../data/user_daily_states_sample_PLACEHOLDER.csv
"""

import numpy as np
import pandas as pd
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "data"
OUT_DIR.mkdir(exist_ok=True)


def make_subscriptions(seed=42, n_cohorts=24, current_month=24):
    """Elofizeto-szintu adat: 1 sor / elofizeto.

    Oszlopok:
      subscriber_id, tier, monthly_price_usd, registration_cohort_month,
      tenure_months, is_active, upgraded, downgraded

    tenure_months = ahany honapja elofizeto (meg akkor is, ha idokozben
    valtott tier-t) -- is_active=False eseten ez a TELJES elettartam,
    is_active=True eseten a JELENLEGI (jobbra cenzoralt) tartas.
    """
    rng = np.random.default_rng(seed)
    rows = []
    subscriber_id = 0

    # Tenure-fuggo havi churn-hazard: gyors az elejen, lassul (duration dependence)
    def monthly_hazard(t):
        return 0.02 + 0.5 / (t + 1)

    for cohort_month in range(n_cohorts):
        max_tenure = current_month - cohort_month
        if max_tenure <= 0:
            continue
        cohort_size = int(rng.integers(80, 260))  # kis, kezelheto kohorszok

        tiers = rng.choice(["Alap", "Prémium"], size=cohort_size, p=[0.7, 0.3])
        base_price = np.where(tiers == "Alap", 10.0, 20.0)
        price = base_price * rng.normal(1.0, 0.03, size=cohort_size)
        price = np.round(np.clip(price, 5, 40), 2)

        for i in range(cohort_size):
            t = 0
            alive = True
            while t < max_tenure:
                h = monthly_hazard(t)
                if rng.random() < h:
                    alive = False
                    break
                t += 1
            upgraded = bool((tiers[i] == "Alap") and alive and rng.random() < 0.06)
            downgraded = bool((tiers[i] == "Prémium") and rng.random() < 0.04)
            rows.append(
                {
                    "subscriber_id": subscriber_id,
                    "tier": tiers[i],
                    "monthly_price_usd": price[i],
                    "registration_cohort_month": cohort_month,
                    "tenure_months": t,
                    "is_active": alive,
                    "upgraded": upgraded,
                    "downgraded": downgraded,
                }
            )
            subscriber_id += 1

    df = pd.DataFrame(rows)
    return df


def make_user_daily_states(seed=11, n_users=600, n_days=100):
    """Felhasznalo-napi allapotpanel: 1 sor / (user_id, day_index).

    Oszlopok: user_id, day_index, state, next_state (mindket oszlop az
    XURR-allapottér szokeszletebol: new_users, current_users,
    reactivated_users, resurrected_users, at_risk_wau_users,
    at_risk_90_day_users, dormant_users).
    """
    rng = np.random.default_rng(seed)
    states = [
        "new_users",
        "current_users",
        "reactivated_users",
        "resurrected_users",
        "at_risk_wau_users",
        "at_risk_90_day_users",
        "dormant_users",
    ]
    # Egyszerusitett, kezzel irt atmeneti valoszinusegek (sor=jelenlegi, oszlop=kovetkezo)
    # -- illusztracios, nem valos rata, de realisztikus nagysagrendu es sorosszeg=1.
    trans = {
        "new_users": {"current_users": 0.34, "at_risk_wau_users": 0.66},
        "current_users": {"current_users": 0.86, "at_risk_wau_users": 0.14},
        "reactivated_users": {"current_users": 0.55, "at_risk_wau_users": 0.45},
        "resurrected_users": {"current_users": 0.42, "at_risk_wau_users": 0.58},
        "at_risk_wau_users": {"current_users": 0.30, "at_risk_90_day_users": 0.18, "at_risk_wau_users": 0.52},
        "at_risk_90_day_users": {"reactivated_users": 0.045, "dormant_users": 0.03, "at_risk_90_day_users": 0.925},
        "dormant_users": {"resurrected_users": 0.006, "dormant_users": 0.994},
    }

    def step(state):
        opts = trans[state]
        return rng.choice(list(opts.keys()), p=list(opts.values()))

    rows = []
    for uid in range(n_users):
        # kezdo allapot: tobbseg current/dormant, kevesebb uj/veszelyeztetett
        state = rng.choice(states, p=[0.05, 0.35, 0.03, 0.02, 0.1, 0.15, 0.30])
        for day in range(n_days):
            nxt = step(state)
            rows.append({"user_id": uid, "day_index": day, "state": state, "next_state": nxt})
            state = nxt

    return pd.DataFrame(rows)


if __name__ == "__main__":
    subs = make_subscriptions()
    subs.to_csv(OUT_DIR / "subscriptions_PLACEHOLDER.csv", index=False)
    print(f"subscriptions_PLACEHOLDER.csv: {len(subs)} sor")

    panel = make_user_daily_states()
    panel.to_csv(OUT_DIR / "user_daily_states_sample_PLACEHOLDER.csv", index=False)
    print(f"user_daily_states_sample_PLACEHOLDER.csv: {len(panel)} sor")
