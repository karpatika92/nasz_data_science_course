# Házi feladat — Üzleti analitika és cégértékelés

Két rész: (1) egy rövid, ellenőrzött forrás + reflexió, (2) gyakorlati
feladat a három notebookon.

## 1. rész — Források + reflexió

Csak azokat a forrásokat listázom, amiket ténylegesen ellenőriztem (megnyitva
vagy kereséssel megerősítve), nem tippeltem linkeket.

| Téma | Forrás | Link |
|---|---|---|
| Markov-láncok + egyensúlyi állapot | StatQuest — "Markov Chains Clearly Explained! Part 1" | https://www.youtube.com/watch?v=i3AkTO9HLXo |
| DCF-értékelés (formula, levezetés) | Corporate Finance Institute — "Discounted Cash Flow DCF Formula" | https://corporatefinanceinstitute.com/resources/valuation/dcf-formula-guide/ |
| CLTV (fogalmi áttekintő) | Wikipedia — "Customer lifetime value" | https://en.wikipedia.org/wiki/Customer_lifetime_value |

**Reflexió (4-6 mondat):** nézd meg a StatQuest videót (kb. 20 perc), és írj
4-6 mondatot:
1. A videó hogyan definiálja az egyensúlyi (stacionárius) állapotot — ez
   ugyanaz-e, amit az órán "egyensúlyi növekedési rátaként" tárgyaltunk, vagy
   más? (Segítség: a videóban tárgyalt egyensúly egy ZÁRT láncra vonatkozik,
   nálunk viszont folyamatos új-felhasználó-beáramlás van — gondold végig,
   ez miért számít.)
2. A DCF-guide és a mi CLTV-képletünk (annuitás/perpetuitás alapon) között mi
   a kapcsolat — ugyanannak a logikának két különböző alkalmazása?

## 2. rész — Gyakorlati feladat: érzékenységvizsgálat mindhárom notebookon

A cél: minden esettanulmányban **egy-egy feltevést** tudatosan
megváltoztatni, és megindokolni, miért pont azt választottátok.

**Lépések:**

1. **`demo_cltv.ipynb`**: számoljátok újra a CLTV-t úgy, hogy EGYSZERRE
   változtattok két paramétert — a WACC 10%-ról 15%-ra nő (a befektetők
   kockázatosabbnak látják a céget), DE a churn 2 százalékponttal javul (egy
   termékfejlesztés miatt). Melyik hatás dominál — nő vagy csökken a nettó
   CLTV?

2. **`demo_dau_markov.ipynb`**: találjatok ki **egy saját, névvel ellátott
   forgatókönyvet** (a slide-okon látott "Növekedés leáll" / "Végtelen
   növekedés" mintájára), és alkalmazzátok a `rates` szótáron. Írjatok 3-4
   mondatot: milyen üzleti esemény indokolná ezt a paraméterváltozást (pl.
   egy vírusvideó, egy versenytárs piacra lépése, egy UX-probléma)?

3. **`demo_subscriber_forecast.ipynb`**: változtassátok meg a
   `new_subscribers_per_month` feltevést (próbáljatok ki legalább 2 másik
   értéket, pl. 80 és 300). Mekkora a 6 hónapos előrejelzés érzékenysége erre
   az egyetlen számra?

4. **Összegzés (4-6 mondat):** a három feltevés közül (WACC/churn kombináció,
   saját forgatókönyv, új-előfizető ütem) **melyiket védenétek meg
   legnehezebben** egy befektető előtt, és miért pont azt?

**Bónusz (nem kötelező):** a `demo_cltv.ipynb` "Ti jöttök" cellájában külön
számoltuk az Alap és a Prémium tier CLTV-jét. Mi történne, ha a checkers.com
egy **harmadik, drágább tiert** vezetne be — vázoljatok fel egy egyszerű
becslést arra, milyen churn-görbét várnátok tőle (magasabb vagy alacsonyabb
korai lemorzsolódást, mint az Alap tier), és indokoljátok.

*(Miért fontos ez? Egy CLTV- vagy előrejelzés-szám önmagában hamis
biztonságot ad — a valódi elemzői munka nagy része abban van, hogy tudod,
MELYIK feltevés mozgatja leginkább az eredményt, és azt tudod-e megvédeni.)*
