"""VALÓS (nem szintetikus, nem placeholder) NFLX heti reszveny-arfolyam.

Forras: Yahoo Finance chart API (nyilvanos, publikus tozsdei adat -- nem a
checkers.com sajat adata, es nem is BigQuery-bol jon, tehat a szokasos
anonimizalasi/jovahagyasi terv rea nem vonatkozik).

A 2025-11-17-i 10:1 reszveny-split miatt a nyers es a split-adjusztalt
arfolyam KULONBOZIK a split elotti idoszakra -- a Yahoo API `adjclose`
mezoje mar kezeli ezt, ezert azt hasznaljuk at a teljes 2016-2026-os
ablakban konzisztens, osszehasonlithato skalan.

Ellenorzott, valos esemenyek (a lekert adaton is lathatoak):
  2022-01: gyenge Q1 2022 elorejelzes -> kb. -24% ket het alatt
  2022-04: az elso elofizeto-VESZTES egy evtizedben -> kb. -37% egy het alatt
  2023-2025: fokozatos felfutas minden korabbi csucs fole (jelszo-megosztas
             visszaszoritasa + hirdetéses tier bevezetese utan)
"""

import json
import urllib.request
from pathlib import Path

import pandas as pd

OUT_DIR = Path(__file__).resolve().parent.parent / "data"
OUT_DIR.mkdir(exist_ok=True)

URL = "https://query1.finance.yahoo.com/v8/finance/chart/NFLX?range=10y&interval=1wk&events=split,div"


def fetch_nflx_weekly() -> pd.DataFrame:
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.load(resp)

    result = data["chart"]["result"][0]
    ts = result["timestamp"]
    adjclose = result["indicators"]["adjclose"][0]["adjclose"]

    df = pd.DataFrame({"timestamp": ts, "adjclose": adjclose}).dropna()
    df["date"] = pd.to_datetime(df["timestamp"], unit="s").dt.date
    df = df[["date", "adjclose"]].rename(columns={"adjclose": "close_split_adjusted_usd"})

    splits = result.get("events", {}).get("splits", {})
    if splits:
        print("Talalt split(ek), mar kezelve az adjclose-ban:", splits)

    return df


if __name__ == "__main__":
    df = fetch_nflx_weekly()
    df.to_csv(OUT_DIR / "nflx_weekly_price.csv", index=False)
    print(f"nflx_weekly_price.csv: {len(df)} sor, {df['date'].min()} .. {df['date'].max()}")
