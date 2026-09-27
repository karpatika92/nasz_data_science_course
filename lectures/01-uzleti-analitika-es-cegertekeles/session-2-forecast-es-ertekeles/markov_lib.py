"""checkers.com DAU/WAU Markov-modell -- TISZTAN SZINTETIKUS adatokon.

Ez a modul egy valos, nagy novekedesu social/mobile termeknel hasznalt,
publikusan is dokumentalt DAU-modellezesi gyakorlatot koevet (allapotter,
atmeneti rataneves szezonalitas-dekompozicio + visszahelyezes,
forgatokonyv-tervezes), de a szamok innentol kezdve kezzel
epitett, seedelt szintetikus sorok -- SOHA nem valos adat vagy meret.
Ezt szandekosan igy csinaljuk: egy tobb eves trend/szezonalitas ALAKJA
onmagaban is erzekeny vallalati info, amit egyedi sorok zajositasaval nem
lehet eltuntetni anelkul, hogy a tanitott mintazatot is eltuntetnenk.

Allapotok (napi granularitas):
    new_users            -- ma regisztralt uj felhasznalok
    current_users        -- tegnap is aktiv, ma is aktiv
    reactivated_users     -- regota (8-90 napja) inaktiv volt, ma visszatert
    resurrected_users     -- 90+ napja inaktiv (dormant) volt, ma visszatert
    at_risk_wau_users    -- a het folyaman aktiv volt, ma nem (rovid tavon veszelyeztetett)
    at_risk_90_day_users -- 90 napon belul aktiv volt, de mar 1 hete nem (hosszu tavon veszelyeztetett)
    dormant_users        -- 90+ napja inaktiv

XURR-rataneves (mind (0,1) koze szoritva -- SOHA nem lehet 100% folott):
    nurr    -- new user retention rate (uj felhasznalo -> current holnap)
    curr    -- current user retention rate
    rurr    -- reactivated user retention rate
    surr    -- resurrected user retention rate ("S" = feltamasztott)
    iwaurr  -- in-week at-risk user retention rate (at_risk_wau -> current)
    wau_loss_rate    -- at_risk_wau -> at_risk_90
    reactivation_rate -- at_risk_90 -> reactivated
    resurrection_rate -- dormant -> resurrected
    _90_day_loss_rate -- at_risk_90 -> dormant
"""

from __future__ import annotations

import numpy as np
import pandas as pd

STATES = [
    "new_users",
    "current_users",
    "reactivated_users",
    "resurrected_users",
    "at_risk_wau_users",
    "at_risk_90_day_users",
    "dormant_users",
]
RATES = [
    "nurr",
    "curr",
    "rurr",
    "surr",
    "iwaurr",
    "wau_loss_rate",
    "reactivation_rate",
    "resurrection_rate",
    "_90_day_loss_rate",
]


def clip01(x, lo=0.002, hi=0.998):
    """Sosem engedunk 100% folotti (vagy 0 alatti) valoszinuseget."""
    return np.clip(x, lo, hi)


def get_next_state(state: pd.Series, rates: pd.Series, tam: float | None = None) -> pd.Series:
    """Egy nap elorelepese az allapotteren -- ugyanaz a szerkezet, mint a
    valos DAU-modellezesi pipeline-ban, csak itt
    'rates' mar tartalmazza a mai new_users-t is.

    tam: ha nem None, egy veges piacmeret-korlat (Total Addressable Market).
    Minel kozelebb van a total az tam-hoz, annal inkabb "elparolog" az uj
    bearamlas nagy resze -- ez a TAMP=0 elesetnek felel meg. tam=None a
    "vegtelen piac" eleset (TAMP=1).
    """
    new_users = rates["new_users"]
    if tam is not None and tam > 0:
        saturation = np.clip(state["total"] / tam, 0.0, 1.0)
        new_users = new_users * (1.0 - saturation)

    next_state = {
        "current_users_current_users": state["current_users"] * rates["curr"],
        "current_users_new_users": new_users * rates["nurr"],
        "current_users_reactivated_users": state["reactivated_users"] * rates["rurr"],
        "current_users_resurrected_users": state["resurrected_users"] * rates["surr"],
        "current_users_at_risk_wau_users": state["at_risk_wau_users"] * rates["iwaurr"],
        "reactivated_users": state["at_risk_90_day_users"] * rates["reactivation_rate"],
        "resurrected_users": state["dormant_users"] * rates["resurrection_rate"],
        "total": state["total"] + new_users,
        "at_risk_wau_users": (
            new_users * (1 - rates["nurr"])
            + state["current_users"] * (1 - rates["curr"])
            + state["reactivated_users"] * (1 - rates["rurr"])
            + state["resurrected_users"] * (1 - rates["surr"])
            - state["at_risk_wau_users"] * rates["wau_loss_rate"]
            - state["at_risk_wau_users"] * rates["iwaurr"]
            + state["at_risk_wau_users"]
        ),
        "at_risk_90_day_users": (
            state["at_risk_wau_users"] * rates["wau_loss_rate"]
            + state["at_risk_90_day_users"]
            * (1 - (rates["_90_day_loss_rate"] + rates["reactivation_rate"]))
        ),
    }
    next_state["current_users"] = (
        next_state["current_users_current_users"]
        + next_state["current_users_new_users"]
        + next_state["current_users_reactivated_users"]
        + next_state["current_users_resurrected_users"]
        + next_state["current_users_at_risk_wau_users"]
    )
    next_state["new_users"] = new_users
    next_state["dormant_users"] = (
        next_state["total"]
        - new_users
        - next_state["current_users"]
        - next_state["reactivated_users"]
        - next_state["resurrected_users"]
        - next_state["at_risk_wau_users"]
        - next_state["at_risk_90_day_users"]
    )
    next_state["dau"] = (
        next_state["current_users"]
        + new_users
        + next_state["reactivated_users"]
        + next_state["resurrected_users"]
    )
    return pd.Series(next_state)


def build_synthetic_rate_trajectory(
    n_days: int,
    start_date: str = "2022-01-01",
    seed: int = 7,
    new_users_base: float = 800.0,
    new_users_annual_growth: float = 0.35,
    base_rates: dict | None = None,
    growth_rate_scenarios: dict | None = None,
    instant_changes: dict | None = None,
) -> pd.DataFrame:
    """Teljesen szintetikus, kezzel epitett (nem valos adatbol szarmazo)
    napi ratatrajektoriat general -- trend + heti/havi szezonalitas + zaj,
    majd (opcionalisan) forgatokonyv-modositasokat alkalmaz.

    growth_rate_scenarios: {rate_name: eves_novekedesi_rata} -- egy adott
        rata trendjenek eves %-os modositasa (pl. {"curr": 0.05} = a
        megtartas 5%-kal jobb egy ev alatt, linearisan felfutva).
    instant_changes: {rate_name: (nap_index, egyszeri_valtozas)} -- egy
        adott naptol kezdve egyszeri, allando eltolas.
    """
    rng = np.random.default_rng(seed)
    dates = pd.date_range(start_date, periods=n_days, freq="D")
    t = np.arange(n_days)

    if base_rates is None:
        base_rates = {
            "curr": 0.86,
            "nurr": 0.34,
            "rurr": 0.55,
            "surr": 0.42,
            "iwaurr": 0.30,
            "wau_loss_rate": 0.18,
            "reactivation_rate": 0.045,
            "resurrection_rate": 0.006,
            "_90_day_loss_rate": 0.03,
        }
    growth_rate_scenarios = growth_rate_scenarios or {}
    instant_changes = instant_changes or {}

    dow = dates.dayofweek.values  # 0=hetfo .. 6=vasarnap
    month = dates.month.values

    # Heti mintazat: hetvegen tobb uj regisztracio (tobb szabadido -> viral megosztas),
    # de valamivel alacsonyabb curr (kevesbe rutinszeru hasznalat).
    dow_new_users_factor = np.array([0.92, 0.95, 0.97, 1.0, 1.08, 1.22, 1.18])[dow]
    dow_curr_delta = np.array([0.02, 0.03, 0.03, 0.02, 0.0, -0.045, -0.035])[dow]

    # Havi mintazat: szeptemberi/januari "vissza a suliba/melobe" visszaeses,
    # nyari (jul-aug) fellendules -- teljesen kitalalt, illusztracios mintazat.
    month_new_users_factor = np.array(
        [1.05, 0.95, 0.95, 1.0, 1.0, 1.05, 1.15, 1.15, 0.85, 0.95, 1.0, 1.1]
    )[month - 1]

    # Alap novekedesi trend (nem valos meret vagy alak -- kitalalt
    # logisztikus-szeru felfutas egy kis kepzeletbeli cegre szabva).
    trend = new_users_base * (1 + new_users_annual_growth) ** (t / 365.0)
    new_users_raw = trend * dow_new_users_factor * month_new_users_factor
    new_users_noisy = new_users_raw * rng.normal(1.0, 0.05, size=n_days)
    new_users_noisy = np.clip(new_users_noisy, 1, None)

    if "new_users" in growth_rate_scenarios:
        annual_pct = growth_rate_scenarios["new_users"]
        weekly_g = (1 + annual_pct) ** (1 / 52) - 1
        new_users_noisy = new_users_noisy * (1 + weekly_g) ** (t / 7.0)

    df = pd.DataFrame({"date": dates, "new_users": new_users_noisy})

    for rate_name, base_val in base_rates.items():
        wiggle = dow_curr_delta if rate_name == "curr" else 0.0
        noise_scale = base_val * 0.008 if rate_name == "curr" else base_val * 0.02
        noise = rng.normal(0, noise_scale, size=n_days)
        series = base_val + wiggle + noise

        if rate_name in growth_rate_scenarios:
            annual_pct = growth_rate_scenarios[rate_name]
            weekly_g = (1 + annual_pct) ** (1 / 52) - 1
            series = series * (1 + weekly_g) ** (t / 7.0)

        if rate_name in instant_changes:
            change_day, delta = instant_changes[rate_name]
            series = series + np.where(t >= change_day, delta, 0.0)

        df[rate_name] = clip01(series)

    return df


def run_forecast(trajectory: pd.DataFrame, starting_state: pd.Series, tam: float | None = None) -> pd.DataFrame:
    """Vegigszimulalja a Markov-lancot a trajectory minden napjara."""
    states = [starting_state]
    current = starting_state
    for _, row in trajectory.iterrows():
        nxt = get_next_state(current, row, tam=tam)
        nxt.name = row["date"]
        states.append(nxt)
        current = nxt
    out = pd.DataFrame(states[1:])
    out.index = trajectory["date"].values
    return out


def decompose_seasonality(dates: pd.Series, values: pd.Series, multiplicative: bool = False) -> pd.DataFrame:
    """A valos DAU-modellezesi pipeline modszeret koveti:
    1) nap-a-heten faktor: eltero minden nap sajat ISO-heti atlagatol,
       heti napok szerinti MEDIAN, ujra-kozepre igazitva (osszeg=0, ill.
       szorzatos esetben atlag=1);
    2) havi faktor: ugyanez a mar 'kihetezett' (deweekened) soron, naptari
       honap szerinti MEDIAN, ujra-kozepre igazitva.
    Visszaadja a nyers, a kihetezett, a deszezonalizalt (trend) es a
    faktorokat is -- ez teszi lehetove, hogy a trendet kulon elorejelezzuk,
    majd a szezonalitast visszahelyezzuk.
    """
    df = pd.DataFrame({"date": pd.to_datetime(dates), "value": np.asarray(values, dtype=float)}).reset_index(drop=True)
    iso = df["date"].dt.isocalendar()
    week_key = iso["year"].astype(str) + "-W" + iso["week"].astype(str)
    week_mean = df.groupby(week_key)["value"].transform("mean")

    dow = df["date"].dt.dayofweek
    if multiplicative:
        dev = df["value"] / week_mean
    else:
        dev = df["value"] - week_mean
    dow_factor_raw = dev.groupby(dow).transform("median")
    if multiplicative:
        dow_factor = dow_factor_raw / dow_factor_raw.drop_duplicates().mean()
        df["deweekened"] = df["value"] / dow_factor
    else:
        dow_factor = dow_factor_raw - dow_factor_raw.drop_duplicates().mean()
        df["deweekened"] = df["value"] - dow_factor

    month = df["date"].dt.month
    year = df["date"].dt.year
    month_key = year.astype(str) + "-" + month.astype(str)
    month_mean = df.groupby(month_key)["deweekened"].transform("mean")
    if multiplicative:
        mdev = df["deweekened"] / month_mean
    else:
        mdev = df["deweekened"] - month_mean
    month_factor_raw = mdev.groupby(month).transform("median")
    if multiplicative:
        month_factor = month_factor_raw / month_factor_raw.drop_duplicates().mean()
        df["deseasoned"] = df["deweekened"] / month_factor
    else:
        month_factor = month_factor_raw - month_factor_raw.drop_duplicates().mean()
        df["deseasoned"] = df["deweekened"] - month_factor

    df["dow_factor"] = dow_factor
    df["month_factor"] = month_factor
    return df


def reapply_seasonality(deseasoned_forecast: pd.Series, dates: pd.Series, dow_factor_by_dow: dict, month_factor_by_month: dict, multiplicative: bool = False) -> pd.Series:
    """A deszezonalizalt elorejelzesi trendre visszahelyezi a korabban
    (decompose_seasonality-vel) becsult heti+havi faktorokat."""
    dates = pd.to_datetime(dates)
    dow = dates.dt.dayofweek.map(dow_factor_by_dow).values
    month = dates.dt.month.map(month_factor_by_month).values
    if multiplicative:
        return deseasoned_forecast.values * dow * month
    return deseasoned_forecast.values + dow + month


def default_starting_state(total: float = 120_000.0) -> pd.Series:
    """Kis, illusztracios kezdo allapot -- szandekosan egy sokkal kisebb,
    kepzeletbeli ceg nagysagrendjeben (nem egy nagy, valos platform merete)."""
    return pd.Series(
        {
            "new_users": total * 0.006,
            "current_users": total * 0.30,
            "reactivated_users": total * 0.01,
            "resurrected_users": total * 0.004,
            "at_risk_wau_users": total * 0.05,
            "at_risk_90_day_users": total * 0.08,
            "dormant_users": total * 0.55,
            "total": total,
        }
    )


def simple_two_state_equilibrium_ratio(reactivation_rate: float, churn_rate: float) -> float:
    """A legegyszerubb (Aktiv/Inaktiv + allando top-of-funnel) Markov-modell
    egyensulyi Aktiv/Teljes aranya: pi/(pi+c). Levezetes: a 2x2-es atmeneti
    matrix egyik sajaterteke mindig 1 (a rendszer nem 'vesz el' embereket),
    a masik sajatertek (pi-c... helyesebben rho-pi, lasd levezetes) lecseng;
    a fennmarado (nem-lecsengo) iranyt a sajatvektor rho:c = pi:c aranya adja,
    ami eppen a folyam-egyensuly (flow balance) feltetele: c*Aktiv = pi*Inaktiv.
    """
    return reactivation_rate / (reactivation_rate + churn_rate)


def simple_two_state_forecast(
    n_days: int,
    daily_registrations: float,
    churn_rate: float,
    reactivation_rate: float,
    start_active: float = 1_000.0,
    start_inactive: float = 9_000.0,
) -> pd.DataFrame:
    """A legegyszerubb lehetseges Markov-modell: csak Aktiv/Inaktiv allapot,
    plusz allando napi uj regisztracio (R), ami kozvetlenul az Aktiv
    allapotba lep be. Nincs szezonalitas, nincs tobbi alallapot -- csak azert
    van, hogy megmutassa: MAR EZ a modell is egyensulyhoz vezet."""
    active, inactive = start_active, start_inactive
    rows = []
    for day in range(n_days):
        next_active = active * (1 - churn_rate) + inactive * reactivation_rate + daily_registrations
        next_inactive = active * churn_rate + inactive * (1 - reactivation_rate)
        active, inactive = next_active, next_inactive
        total = active + inactive
        rows.append({"day": day, "active": active, "inactive": inactive, "total": total, "active_share": active / total})
    return pd.DataFrame(rows)
