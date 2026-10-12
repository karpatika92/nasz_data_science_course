# 3. óra — Analitika és adatvizualizáció

Oktatói jegyzet, ugyanaz a formátum, mint az 1–2. óránál (szókratészi, kiscsoportos).
A `slides.html` a vetített anyag, a `demo.ipynb` az élő CLTV-notebook,
a `build_assets.py` generálja a saját ábrákat (`uv run python build_assets.py`).

**Végcél:** a csoport maga vezesse le a *adat → információ → insight → döntés*
láncot egy valós típusú kérdésen (fizetési adatból cégérték), és közben minden
ábrájuk legyen **önmagában érthető és mesélő**.

Nincs időzítési kényszer (a szerző szerint belefér) — a sorrend a lényeg.

## Menet

| # | Rész | Mi történik |
|---|------|-------------|
| 0 | Házi beszámoló | Szóban: 1. házi (kódoló ügynök kifaggatott), 2. házi (Kaggle, saját ötlet). **Az új házik szóban mennek, nincs `homework.md`.** |
| 1 | Adatvizualizáció | Tézis → Anscombe + Datasaurus → trükkök (csonkolt/két tengely/terület) → élő átalakítás |
| 2 | Diagramtípusok | Hat forma, hat kérdés |
| 3 | Színelmélet | Szivárvány vs. egyszínű; három feladat (mennyiség/eltérés/azonosság) |
| 4 | Történetmesélés | Netflix, OWID, Snow, Nightingale, Minard |
| 5 | Esettanulmány | checkers.com: fizetési adat → cégérték (CLTV) |

## 0. Házi beszámoló

- **1. házi:** „Mit kérdezett az ügynök? Volt-e kimenet?” — hagyd őket beszélni, ne értékelj.
- **2. házi:** a kulcskérdés a **„melyik halmazon mérted?”** — ha a hangoláshoz használt
  halmazon mértek javulást, az nem javulás (2. óra: holdout). Ez nem csapda, hanem a
  leggyakoribb hiba; kérdezd meg mindenkitől.

## 1. Adatvizualizáció

- **Tézis:** egy ábra legyen önmagában érthető. Az „5 másodperces teszt” a kulcs:
  kapja meg e-mailben, minden más nélkül.
- **Anscombe és Datasaurus:** a számok azonosak, az ábra nem. Mindkét ábra
  statisztikája a scriptből ellenőrzött (Anscombe: átlag 7,50, r = 0,816; Datasaurus:
  13 halmaz, azonos átlag/szórás, r ≈ −0,06). *Előbb nézd meg, aztán számolj* = EDA.
- **Trükkök** (mind szintetikus illusztráció): csonkolt tengely (oszlopnál tilos,
  vonalnál elfogadható), két y-tengely (álkorreláció), terület vs. hossz.
- **Élő átalakítás (rossz példa dián):** a „rossz” ábra szándékos — kiválogatott
  ablak (mélypont→csúcs), se cím, se tengelycím. Adat: `nflx_weekly_price.csv` a
  `lectures/01…/data/` alól. A csoport az ügynökével javítja 5 percig; hasonlítsd össze
  a `makeover_good.png`-vel (a cím a lényeg: −75%, majd 7,5×, azóta −46%; számok
  a scriptből, a repo adatfájljából).
- **Reddit-példák (TEENDŐ, kézzel):** a Reddit scriptből 403-at ad, ezért nincsenek
  benne. Válaszd ki a „Top, all time” posztokat az r/dataisbeautiful és
  r/dataisugly alól, mentsd a **képet** az `assets/reddit/` mappába, és vedd fel a
  `slides-data.js` tetején a `PICKS_GOOD` / `PICKS_BAD` tömbbe (`{ src, why }`).
  Amíg a tömb üres, nem jelenik meg dia (nincs törött kép).

## 2–3. Diagramtípusok, színek

- A hőtérkép példája a kohorsz-megtartás — előrevetíti a következő (CLTV/Markov) anyagot.
- Színek: a szivárvány „hamis határokat” mutat; a világosság hordoz sorrendet, nem az
  árnyalat. Ábráink a dataviz-skill validált palettájából dolgoznak
  (kék #2a78d6, narancs #eb6834). A színvakságra csak egy általános mondat van
  (nincs konkrét arány a dián).

## 4. Történetmesélés

| Dia | Forrás / licenc | Megjegyzés |
|-----|-----------------|------------|
| Netflix (`makeover_good.png`) | saját ábra, repo-adat | „Mi történhetett 2022 áprilisában?” — a vitához a csoportra bízzuk; az 1. előadás terve szerint ez az első előfizető-vesztés egy évtizedben (**ezt itt nem ellenőriztem újra**) |
| Várható élettartam | Our World in Data, CC BY 4.0 (a harmadik fél adatai saját feltételekkel: Riley; Zijdeman et al.; HMD; UN WPP) | Angol nyelvű; a cím téma, nem állítás — szándékosan **megszegi** az első szabályt, és ezt kérdezzük meg |
| Snow koleratérképe, 1854 | közkincs (Wikimedia Commons, `Snow-cholera-map-1.jpg`) | letöltött kép: 1920 × 1801 px |
| Nightingale rózsadiagramja, 1858 | közkincs (Commons, `Nightingale-mortality.jpg`) | letöltött kép: 3840 × 2100 px |
| Minard, 1869 | közkincs (Commons, `Minard.png`; a lapon US-tag is kell) | 2003 px — kivetítőn nézd meg teljes képernyőn; hőmérséklet Réaumur-ban |

**Minard — hány adat?** Létszám (sávszélesség, 1 mm = 10 000 fő), pozíció (2 koordináta),
irány (bézs = előre, fekete = vissza — az ábra saját magyarázata szerint),
hőmérséklet, idő (a hőmérsékleti panel dátumai) — hat. (A „hat” Tufte-tól való, memóriából.)

**TEENDŐ — egyszerű, közéleti ábra:** nem találtam ellenőrzött politikai/közéleti
ábrát (NYT / 538 szerzői jogvédett). Ha kell, tegyél be egy általad választottat
(kép + forrás), vagy keress CC BY-os OWID-ábrát.

## 5. Esettanulmány — checkers.com, fizetési adat → cégérték

Ugyanaz a fiktív dámacég, mint a BCE-s előadáson (`lectures/01…`). **A mai adat
`subscriptions_PLACEHOLDER.csv` — szintetikus, nem valós.** A módszer a tanulság.

A szókratészi ív (mindenhol előbb kérdezz, aztán mutasd):

1. *„Van egy fizetési adatsorunk. Mit kezdjünk vele?”* — gyűjtsd a táblára; a szándékolt
   válasz: **értékeljük a céget**.
2. *„Hogyan értékelnétek egy céget?”* → DCF → előbb egy előfizető értéke.
3. *„P-t fizet n hónapig”* (annuitás) → *„végtelen?”* (perpetuitás) → *„ha c eséllyel lelép?”*
   → átlagos élettartam 1/c → **V = P(1+r)/(r+c)** (a csoport vezesse le a táblán).
4. *„P, c, r — melyik adat, melyik feltevés?”* r feltevés; c: de melyik c?
5. *Jóslat, mielőtt futtatod:* a tényleges görbével nagyobb vagy kisebb a CLTV?
6. Élő számolás → **három gyanúsított**, hogy miért tér el (lásd lent).
7. Resubscription (π = feltevés, nincs resub-esemény az adatban).
8. Mi mozgatja az értéket? (1 pp churn vs +10% ár — csoport tippel, utána kiszámoljuk.)
9. Döntés: LTV/CAC, **döntési kártya** (mit teszünk · mérőszám · kill-kritérium).
10. **Ti jöttök:** egy önmagában érthető ábra a CLTV-történetről (cím = insight) —
    a vizualizációs rész alkalmazása.

### Amit a notebookon MÉRTEM (placeholder adat, `demo.ipynb` outputjai)

| Mennyiség | Érték |
|---|---|
| P (átlagár) | $12,96/hó |
| r (havi, 10% éves WACC) | 0,797% |
| c (első 12 hazárd egyszerű átlaga) | 14,02% |
| CLTV zárt alak | $88,21 |
| CLTV numerikus (az 1. előadás notebookja szerint) | $48,26 |
| CLTV numerikus, időzítés javítva (horizonton levágva) | $59,99 |
| Állandó churn, ami ezt reprodukálja | 20,98% |
| Kockázatban lévők a 19.–24. tenure-hónapban | 81, 65, 49, 44, 25, 8 |
| Túlélés a megfigyelés végén (24 hó) | 8,0% |
| + farok, ha a farok-churn 1% / 3% / 5% / 10% | $107,67 / $82,56 / $74,77 / $67,93 (a farok a CLTV 44% / 27% / 20% / 12%-a) |
| Tier CLTV (időzítés javítva): Alap / Prémium | $45,82 / $93,38 |
| 1 pp churn-csökkentés / +10% ár (zárt alak, ceteris paribus) | +7,2% / +10,0% |

**Fontos felfedezés (az 1. előadás notebookjára is vonatkozik):** a `demo_cltv.ipynb`
numerikus összege `S(t) = P(tenure > t)`-vel súlyoz, miközben a zárt alak a hónap
*elején* fizettet (`P(tenure ≥ t) = S(t−1)`). Állandó hazárdnál (c = 14%) ezt
**egységteszttel** ellenőriztem: zárt alak $88,21, numerikus `S(t)` szerint $74,42,
a hónap elején élők szerint $86,55 (a maradék a 24 hónapos levágás). Tehát az
előadáson látott „zárt alak $88 vs. numerikus $48” eltérés **egy része off-by-one**
artefaktum, nem a nem-állandó churn hatása. **Feltétel:** ez a `tenure_months`
jelentésétől függ — én a generátor docstringje alapján olvastam
(„ahány hónapja előfizető”; egy tenure=0 sor is egyszer fizetett). Valós
BigQuery-adatnál ellenőrizni kell a definíciót. A `lectures/` fájlokat **nem
módosítottam**.

**Döntési kártya:** CAC = $65 egy *tetszőleges* kiinduló érték (a
csoport a sajátját mondja). Ezzel az alsó korlát LTV/CAC = 0,92 („nem éri meg”),
a farokkal bővített és a zárt alak 1,05–1,66 („megéri”) — a döntés a farokról szóló
feltevésen fordul. **Nem** a kapott CAC-hoz hangoltam az adatot, de a flip-tartomány
nagyjából $60 és $108 közé esik: más CAC-nál lehet, hogy mindegyik ugyanazt mondja.

**Amit ez a számolás NEM tud:** a placeholder adat szintetikus (a generátor hazárdja
`0,02 + 0,5/(t+1)`), a farokra a 8 emberes mintán semmilyen becslés nem
megbízható, az áremelés→churn hatást nem modelleztük.

## Források és hivatkozások

- Anscombe (1973), *Graphs in Statistical Analysis*. Matejka & Fitzmaurice (2017),
  *Same Stats, Different Graphs* (Datasaurus: TidyTuesday 2020-10-13 `datasaurus.csv`,
  letöltve → `data/datasaurus.csv`).
- Our World in Data, *Life expectancy* (CC BY 4.0).
- Wikimedia Commons: Minard, Nightingale, Snow (közkincs).
- Kutatás: a `general-purpose` ügynök találta a forrásokat; a Reddit-linkek nem
  voltak ellenőrizhetők, ezért nincsenek az anyagban.
