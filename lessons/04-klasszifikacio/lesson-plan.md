# 4. óra — Klasszifikáció (90 perc)

Oktatói jegyzet, ugyanaz a formátum, mint a 2. óránál. A `slides.html` a vetített anyag (**52 slide, kb. 1/perc**); a notebookot
**nem vetítjük** (`demo.ipynb`), a hallgatók az órán nem látják az adatot, ezért minden kell-nem-kell a slide-on van.

**Cél:** hogy a hallgatók ne egy szám (pontosság, AUC, CV-pontszám) alapján higgyenek egy modellnek, hanem tudják, **mit mér**, **mit
hagy ki**, és **hogyan lehet félrevezető**.

**Végigvitt példa:** Kaggle „Don't Get Kicked!” (Carvana; OpenML 41162, CC0): használtautó-vásárlások egy aukción, a pozitív osztály a
„kick”, a rossz vétel (12,3%). **Előfeltétel:** a 2. óra (a recap az ottani gif-eket használja újra).

**Kérdés-költségvetés: összesen 6 kérdés** (a `qa()` segédfüggvény), mindegyik válasza a *következő kattintásra* jelenik meg. Minden más
slide állítás. A hat kérdés: a hiányzó keréktípus (eldobjuk-e?), időbeli adat (véletlen vágás?), a pontosság csapdája, a létra nyertese,
az új jellemzők (kinek segítenek?), a hangolás (segített-e?).

---

## Időzítés

| Blokk | Slide | Perc |
|---|---|---|
| Cím + recap (gif-ek) | 1–5 | 5 |
| Feladat, adat, EDA (kor, ár, hiányzó érték) | 6–11 | 9 |
| Tisztítás, kódolás (one-hot, célérték-átlag), split | 12–17 | 10 |
| Keresztvalidáció (+ időbeli adat), kiértékelés | 18–29 | 25 |
| Modell-létra | 30–32 | 6 |
| Visszacsatolási kör (hibaelemzés, feature engineering, küszöb) | 33–43 | 18 |
| Hangolás | 44–46 | 5 |
| Záró teszt, ellenőrzőlista, házi | 47–52 | 12 |

Ha csúszik, vágd: az **AUC-magyarázat**, a **legkockázatosabb 5%**, a **Hangolás** (3 slide → 1), a **fontosság** slide-ot.
A **keresztvalidációt** és a **visszacsatolási kört** ne vágd.

**Ami szándékosan nincs benne** (kivettük, hogy beférjen 90 percbe): a pontosságra optimalizált küszöb mint „szándékos hiba”, a
Goodhart-törvény, a felülmintavételezés és az arra épülő szivárgás-demó. A szivárgás témáját a célérték-átlag és a split slide-ok viszik.

---

## Blokkonként

**Recap.** Négy gif a 2. óráról (logisztikus regresszió, fa, forest, boosting), egy-egy állítással; nem magyarázzuk újra.

**Feladat, adat, EDA.** 72 983 sor; az órán egy **30 000 soros réteges minta** (24 000 tanító + 6 000 teszt), 12,3% rossz vétel, a „minden vétel jó”
modell pontossága 87,7%. A **piaci árbecslések** kétszer szerepelnek (vásárláskor és ma; aukciós/kiskereskedelmi × átlagos/tiszta): ez a későbbi feature
engineering alapja. **Nem az új autó ára:** a vásárláskori medián becslés 8 176 USD az 1 éves, 2 629 USD a 9 éves autóknál (teljes adat), és 0,82 a korrelációja a fizetett árral
(a kereskedő a becslés mediánban 1,10-szeresét fizette). Az adatsor nem definiálja, ezek az értékek alapján **következtetünk** rá, hogy az akkori használt-piaci érték becslése. **Kor szerint** 1 évesnél 3,8%, 9 évesnél 29%. **Vételár szerint** (hisztogram + arány): 3 000–4 000 USD között 27%, 7 000–9 000 között ~9%.
**Hiányzó keréktípus:** 1 299 autó, 71%-uk rossz vétel (a többinél 8–11%): ez az XGBoost legfontosabb oszlopa. **Őszintén:** nem tudjuk, miért hiányzik;
ha utólag derült ki, szivárgás. Kérdés a hallgatóknak: eldobjuk-e? (Nem.)

**Tisztítás, kódolás.** A nyers sorok táblázata (`tbl_raw.png`): unix-idő, 0 dollár becslés (a mintában 348 vásárláskori és 209 mai; a táblázatban mindkettő látszik), üres keréktípus,
„MANUAL” és „Manual” egyaránt, számnak látszó irányítószám. A `WheelTypeID` a `WheelType` kódja (1 = Alloy, 2 = Covers, 3 = Special; a hiányzás ugyanazokban a sorokban): **ugyanaz az információ**,
ezért az XGBoostban megoszlik a fontosságuk. A demóban mindkettő benne maradt (a notebookot nem futtattuk újra); élesben az egyiket eldobnánk. **One-hot** valódi sorokon: a „hiányzik” is kap oszlopot. **Sok értékű kategória** (`Model`, 876 érték a
tanítóban): one-hot helyett a **csoport rossz-vétel-aránya** (célérték-átlag), **csak a tanító adatból** (különben szivárgás; CV-ben foldonként),
**KISS: a 30-nál kevesebb autós érték (és a tanítóban nem látott új érték) hiányzónak számít, nincs simítás.** A 876 értékből 704 ilyen, de a tanító autók csak 17%-át fedik.
A hiányzót a modell kezeli (a fa NaN-ként, a lineáris modell mediánnal és jelzővel). **Figyelem:** a `demo.ipynb` még nem ezt használja (lásd lent).

**Keresztvalidáció, kiértékelés.** 3 részre vágjuk a tanító adatot; **out-of-fold** jóslat = minden sorra egy jóslat olyan modelltől, amely azt nem látta;
mutató = átlag ± szórás. **Időbeli adat:** a múltból jósolunk a jövőre (kiterjedő ablak); a mi adatunk 2009–2010 vásárlásai, a demó mégis véletlenül vág (a számok
optimisták lehetnek, nem mértük). **Pontosság csapdája:** dummy 87,7% pontosság, recall 0; 1%-os pozitívnál 99,1% (szintetikus). **Kiegyensúlyozott pontosság** =
a két osztály recallja átlaga: (0,25 + 0,99) / 2 = 0,62, miközben a pontosság 0,90. **Konfúziós mátrix** (logisztikus regresszió, 0,5): TP 740, FN 2 212, FP 265,
TN 20 783. **Precision** 740 / 1 005 = 0,74; **recall** 740 / 2 952 = 0,25. Küszöb 0,5 → 0,1: recall 25% → 69%, precision 74% → 23%. **ROC-AUC 0,76, PR-AUC 0,45** (alapvonal
0,12). A legkockázatosabb 5% (1 200 autó) 68%-a valóban rossz vétel (5,5-szörös lift).

**Modell-létra** (PR-AUC, 3-fold átlag ± szórás): dummy 0,123; logisztikus regresszió 0,449 ± 0,009; fa korlát nélkül 0,187; fa (mélység 6) 0,412; Random Forest 0,462;
**XGBoost 0,484 ± 0,014**. Páros különbség XGBoost − logisztikus: **+0,032 ± 0,008**: mérsékelt nyertes. Az XGBoost legfontosabb oszlopai: `WheelType`, `WheelTypeID`, kor, aukció.

**Visszacsatolási kör.** Kiindulás (XGBoost, 0,5): recall 0,254, precision 0,829, PR-AUC 0,483. A kihagyott rossz vételek friss, átlagos autók 0–1% jósolt eséllyel.
Hipotézis: a rossz vétel értékvesztés → a mai és a vásárláskori becsült ár **aránya**. A hibák árváltozás szerinti bontásában a kockázat **fordított U** (~20% ott, ahol az ár alig mozdult,
~10% a két szélen), a modell ezt elmossa (alulbecsül a csúcson: 0,17 a valódi 0,19 helyett). **Feature engineering:** 8 ár-jellemző; páros különbség a PR-AUC-ban
(3-fold × 2): XGBoost **+0,0179 ± 0,0062**, logisztikus regresszió +0,0006 ± 0,0005 (**nem segít**: a hatás nem monoton). **Küszöb: üzleti döntés.** A pontosság 0,56-nál a legjobb (recall 0,25);
0,12-nél (a kiegyensúlyozott pontosság csúcsa) a recall 0,62, a kiegyensúlyozott pontosság 0,70, a pontosság viszont 0,90 → 0,75. A 0,12 nem „a” helyes küszöb: üzleti költség híján ezt használjuk a demóban. **Őszintén:** azt, miért magas a kockázat ott, ahol az ár
nem mozdult, nem tudjuk.

**Hangolás.** Véletlen keresés (XGBoost 8, forest 3 jelölt, 3-fold). Új foldokon: XGBoost 0,499 → 0,493, forest 0,473 → 0,468: **nem segít**; az alapot tartjuk meg.

**Záró teszt.** Előre rögzített szabály: legjobb új-fold CV PR-AUC (logisztikus 0,450 / XGBoost alap **0,499** / hangolt 0,493 → alap XGBoost); küszöb (üzleti költség híján a kiegyensúlyozott pontosság csúcsa) a train out-of-fold jóslataiból: 0,12.

| teszt (6 000 sor, 738 rossz vétel) | pontosság | kiegy. pont. | recall | precision | PR-AUC |
|---|---|---|---|---|---|
| küszöb 0,5 | 0,900 | 0,606 | 0,215 | 0,874 | 0,472 |
| küszöb 0,12 | 0,751 | 0,692 | 0,615 | 0,273 | 0,472 |

Mátrix 0,12-nél: TP 454, FP 1 212, FN 284, TN 4 050. **A bootstrap konfidencia-intervallum slide kimaradt** (az óra közben nem kell); a notebook számai, ha valaki rákérdez: PR-AUC 0,472
[0,439; 0,506], logisztikus 0,406, páros különbség **+0,065** [+0,046; +0,085]. A CV-ben a különbség +0,05 körüli volt: az irány egyezik, a mérték egy mintán nem ismert.
Ellenőrzés: ismétlés több seeddel, a teljes adattal (**nem** futtattuk le).

---

## Miért ez az adatsor?

Két feltétel: (a) egy fa-alapú modell érdemben verje a logisztikus regressziót, (b) a feature engineering javítson a fa-alapú modellen. Négy OpenML-adatsort próbáltunk
(**teljes adat, 5-fold CV, a repo környezetében, de nem a `demo.ipynb`-ben; tájékoztató mérések**):

| Adatsor | XGBoost vs logisztikus (PR-AUC) | FE az XGBoostnak |
|---|---|---|
| Give Me Some Credit (46929, 150 000 sor) | ~0,40 vs ~0,24 (a 96/98 kódok NaN-ra cserélése után ~0,35) | nem segít (~+0,003 ± 0,003) |
| Online Shoppers (46947, 12 330 sor) | ~0,75 vs ~0,64 | nem segít |
| Bank Customer Churn (46911, 10 000 sor) | ~0,69 vs ~0,47 | nem segít |
| **kick (41162, 72 983 sor)** | ~0,50 vs ~0,455 | **~+0,020** |

Tanulság: a fa egy-oszlopos átalakításból (jelző, log, sáv) nem nyer, mert azt magától megtanulja; a lineáris modell igen (pl. Bank Churn: egy `products ≥ 3` jelző a logisztikus
PR-AUC-ját ~0,47-ről ~0,60-ra viszi). A fa ott nyer, ahol **új információt** kap: két oszlop **hányadosát**. Az első három adatsor a házi választék része. A kick gyenge pontja:
a logisztikushoz képest csak mérsékelt a különbség.

---

## Technikai megjegyzések az oktatónak

- **A `demo.ipynb` elmarad a slide-októl** (szándékosan, nem futtattuk újra): a notebook még tartalmazza a kivett kísérleteket (pontosságra optimalizált küszöb, felülmintavételezés és
  a szivárgás-demó), és a fáknak sorszám-kódot, a lineáris modellnek one-hot-ot használ; a **célérték-átlag kódolás nincs benne**, így arra a slide-okon **nincs mérés**. A slide-ok számai
  a notebook meglévő kimenetéből jönnek; a `build_assets.py` ábrái (ár-sávok, nyers sorok, célérték-átlag példa, időbeli split, javítás-táblázat) ugyanabból a mintából.
- **Nem használt ábrák** az `assets/`-ben (a notebook generálja, a slide-ok nem használják): `tbl_hiba1`, `tbl_hiba2`, `loop_szivargas`, `tbl_sorszam`, `tbl_utazas`, `ladder_folds`, `final_pr_gorbe`.
- **Újrafuttatás:** `uv run jupyter nbconvert --to notebook --execute demo.ipynb --inplace` (kb. 8 perc 8 maggal); `uv run python build_assets.py` (másodpercek). A számok rögzített
  seedekkel determinisztikusak az `uv.lock` függőségeivel (scikit-learn 1.9.1, pandas 3.0.6, xgboost 3.4.1, imbalanced-learn 0.14.2).
- **Demó-egyszerűsítések (szándékosak):** 30 000 soros minta (`SAMPLE_N`; `None` = teljes adat), 3-fold CV mindenhol, kis hangolási keresés. Zajosabb eredmények (a foldok szórása ~0,01 PR-AUC).
- **Slide-ellenőrzés (`slide_check`):** 52 slide, 0 jelzés. A `slide_check` **nem látja**, ha egy `visualLayout: "stack"` slide szövege ráfut a képre (a kép fix `40vh`): stack slide-oknál
  egysoros cím (~20 karakter), rövid szöveg (~110–140 karakter összesen). **`deck.css`:** két szűk szabály (kérdés + sima bekezdés, illetve kérdés + tension: nagyobb válasz-szöveg); a csak-listás és a
  bekezdés + tension diák nagyobb szövege **ennek a leckének a `slides.html`-jében** van (egy közös szabály az 1. óra egy hosszú listás diáját túlcsordította).
- **Táblázatok** képek (`assets/tbl_*.png`): a deck-motornak nincs táblázat-blokkja. Az adatfájl (`data/kick.csv.gz`) az OpenML 41162 (CC0) gzipelt másolata.
