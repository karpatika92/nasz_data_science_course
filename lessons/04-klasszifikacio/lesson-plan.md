# 4. óra — Klasszifikáció (kb. 180 perc, szünet nélkül)

Oktatói jegyzet, ugyanaz a formátum, mint a 2. óránál: időzítés, szókratészi
kérdések, várt válaszok. A `slides.html` a vetített anyag; **a notebookot nem
vetítjük** (`demo.ipynb`), minden, ami az órán kell, a slide-okon van. A notebook
csak a háttér: ez generálja a slide-ok ábráit és táblázatait (`assets/`), és
innen jön minden szám.

**Az óra végcélja:** hogy a hallgatók ne egy szám (pontosság, AUC, CV-pontszám)
alapján higgyenek egy modellnek, hanem tudják, **mit mér** az a szám, **mit
hagy ki**, és **hogyan lehet félrevezető**.

**Végigvitt példa:** IBM Telco Customer Churn (7 043 ügyfél, 26,5% lemond).
Mindenhol ehhez térünk vissza: nyers fájltól a hangolt modellig.

**Előfeltétel:** a 2. óra (modellek: fa, Random Forest, Gradient Boosting,
overfitting, bias-variance). A recap blokk az ottani gif-eket használja újra.

---

## Időzítés

| # | Blokk | Perc | Kumulált |
|---|-------|------|----------|
| 0 | Recap: a 2. óra modelljei (gif-ek) | 12 | 12 |
| 1 | Nyers adat és EDA | 18 | 30 |
| 2 | Adattisztítás és split | 15 | 45 |
| 3 | Hogyan értékeljünk egy klasszifikátort? | 30 | 75 |
| 4 | A modell-létra | 30 | 105 |
| 5 | Visszacsatolási kör (két szándékos hiba) | 40 | 145 |
| 6 | Hiperparaméter-hangolás | 15 | 160 |
| 7 | Záró teszt és házi | 20 | 180 |

**Figyelem:** a többi óra 90 perces; ez dupla hosszú. Ha csúszik (valószínű), vágj
ebben a sorrendben:
1. **Hangolás: „optimista-e a keresés pontszáma”** (6. blokk utolsó slide) → egy mondatra.
2. **Jellemző-ötletek slide** (5. blokk) → egy mondat: „három ötletet próbáltunk, egyik sem segített”.
3. **Precision@K** és a **logisztikus regresszió / fa belülről** slide-ok (3., 4. blokk).
4. A **recap** (0. blokk) 12-ről 5 percre: csak a záró összefoglaló slide.
A visszacsatolási kört (5.) és az értékelést (3.) **ne** vágd: ezek az óra lényege.

**Egy óra két részben:** a természetes törés a 4. és 5. blokk között (105. perc).

---

## 0. Recap (0–12 perc)

Hagyd, hogy a hallgatók mondják vissza: fa, forest, boosting különbsége. A gif-ek
a 2. órából jönnek (`../02-gepi-tanulas/assets/`), ezért ismerősek; ne magyarázd
újra. A záró slide-on **tippeljenek**, melyik modell nyer a mai adaton, és
írják fel a táblára: a 4. blokkban visszatérünk rá. (Várt: a többség XGBoostot
mond. Ez ad majd lendületet a meglepetéshez.)

## 1. Nyers adat és EDA (12–30 perc)

- **A feladat:** „melyik hiba drágább: fölösleges hívás vagy elveszített ügyfél?”
  Ne dönts helyettük; a lényeg, hogy a két hiba ára **különböző**, és ez dönt a
  küszöbről a 3. és 7. blokkban.
- **A célváltozó:** a „senki nem mond le” modell pontossága **73,5%**. Hagyd, hogy
  ők találják ki a számot (1 − 0,265).
- **EDA-ábrák:** szerződés (43% / 11% / 3%), internet és fizetés (fiber 42%,
  e-csekk 45%), tenure. Az ábrákon rajta vannak a számok, ezért a slide-on csak
  a kérdés van. **Az EDA-t az egész fájlon végezzük** (gyakori, és a nulladik
  pillantáshoz rendben van); szigorúan a train részen kéne. Ezt mondd is ki
  egy mondatban.
- **Tanulság, amit meg kell jegyezni a hallgatóknak:** a hosszú szerződéseken
  szinte senki nem mond le. Ez az 5. blokkban a hibaelemzés kulcsa.

## 2. Adattisztítás és split (30–45 perc)

- **TotalCharges:** 11 üres karakterlánc. Mind **tenure = 0**, és egyik sem
  mondott le. Kérdés: „véletlen hiányzás ez?” Várt válasz: nem; még nem
  számlázták őket.
- **Nulla, nem medián.** A nulla kézzel írt szabály, a split előtt is
  alkalmazható; egy medián-imputert viszont csak a train részen szabad illeszteni.
- **Ellenőrzőlista:** a slide csak felsorolja. **Kiugró értékeket ma nem
  vizsgáltunk**: ha kérdezik, a `describe()` az első lépés; ne állítsd, hogy
  nincs kiugró érték.
- **Split:** 5 634 train / 1 409 teszt, rétegzett, 26,5% mindkettőben. A teszthalmaz
  a 7. blokkig **zárolva**. Technikai megjegyzés: a repo pandas 3-at használ,
  ahol a szöveges oszlop dtype-ja `str`, nem `object`: a notebookban ezért a
  `selector(dtype_exclude="number")` választja a kategorikus oszlopokat.

## 3. Hogyan értékeljünk? (45–75 perc)

Ez az óra fő pontja; **ne rohanj**. A sorrend szándékos: előbb a mérce, aztán a modellek.

- **A pontosság csapdája:** dummy 73,5% pontosság, kiegyensúlyozott pontosság
  0,50, recall 0. Az 1%-os példa (99,1%) **szintetikus** (véletlen címkék); mondd ki.
- **Kiegyensúlyozott pontosság** = a két osztály recallja átlaga. Példa: logisztikus
  regresszió 0,5-nél: (0,55 + 0,90) / 2 = 0,72, miközben a nyers pontosság 0,80.
- **Konfúziós mátrix:** TP 822, FP 431, FN 673, TN 3 708 (logisztikus regresszió,
  out-of-fold a train halmazon). Kérdés: melyik cella a fölösleges hívás, melyik az elveszett ügyfél?
- **Precision / recall:** 0,66 / 0,55. A küszöb állításával cserélhetők; a
  táblázaton (0,5 → 0,2) látszik, hogy a pontosság csúcsa 0,5 körül van, a
  kiegyensúlyozotté 0,3 körül.
- **ROC vs PR:** ugyanazokra a jóslatokra 0,85 és 0,66. A PR alapvonala a
  pozitívok aránya (0,27). A ROC-AUC rangstatisztika, ritka pozitívnál hízelgő
  lehet; ezért PR-AUC az elsődleges. Tudománytörténet: a ROC a radarjel-felismerés
  (signal detection) munkájából ered (II. világháború).
- **Precision@K:** K = 100/300/500/1000 → 0,88 / 0,79 / 0,77 / 0,70.
- **Modellek összehasonlítása:** négy szabály (mérőszám előre, ugyanazok a foldok,
  átlag ± szórás, teszten nem választunk).

## 4. A modell-létra (75–105 perc)

Hat versenyző, ugyanazok az 5 fold. **PR-AUC átlag ± szórás:**

| modell | PR-AUC |
|---|---|
| dummy | 0,265 |
| logisztikus regresszió | **0,661 ± 0,031** |
| fa, korlát nélkül | 0,380 ± 0,021 |
| fa, mélység 4 | 0,598 ± 0,025 |
| Random Forest | 0,610 ± 0,033 |
| XGBoost | 0,653 ± 0,035 |

- **A meglepetés:** alapbeállításnál a **logisztikus regresszió legalább olyan jó**,
  mint az XGBoost; a szórás nagyobb a különbségnél. Hívd fel a recapnél leírt tippekre.
- **A korlátlan fa:** a 2. órai gif eredménye számban (0,38).
- **Belülről:** a logisztikus regresszió együtthatói egyeznek az EDA-val (fiber,
  havi szerződés felfelé; tenure, kétéves szerződés lefelé). **Figyelem:**
  a `MonthlyCharges` negatív, a `TotalCharges` pozitív együtthatója a három
  összefüggő változó (havidíj, teljes számla, tenure) együttes hatása: nem külön-külön olvassuk.
  A 3 mélységű fa első kérdése a szerződéstípus; a legmagasabb arányú levél
  (havi, fiber, tenure ≤ 13 hónap) **71%** lemondó.

## 5. Visszacsatolási kör (105–145 perc): a leglényegesebb blokk

A kör: hibák → hipotézis → változtatás → újramérés **ugyanazokon a foldokon**.
A hibaelemzés a **train out-of-fold** jóslatain történik, a teszthalmaz zárolva marad.

**Kiindulás** (XGBoost, 0,5): pontosság 0,791, kiegyensúlyozott 0,702, recall 0,513, PR-AUC 0,651.

**Hibaelemzés:** az egy- és kétéves szerződésű lemondók **96%-át, illetve
mindegyikét** kihagyja (alapvalószínűségük 11% és 3%: sosem éri el a 0,5-et); a
havi szerződéses maradók ~25%-át megjelöli. Hipotézis: a modell **félénk**.

**1. szándékos hiba: a küszöb a pontosságra** (csúcs 0,56-nál)
- Pontosság 0,791 → 0,793 (**+0,2 pont, a zajon belül**), recall 0,513 → 0,448,
  kiegyensúlyozott 0,702 → 0,683.
- **Őszintén mondd ki:** ez a csapda ezen az adaton **gyenge**: a pontosság alig
  mozdul, mert a küszöb körül lapos a görbe. A tanulság nem az, hogy „a pontosság
  sokat javul”, hanem hogy **a pontosság szinte semmit nem lát a recall-vesztésből**.
- Goodhart-törvény (Strathern megfogalmazásában): ha egy mérőszám céllá válik, megszűnik jó mérőszámnak lenni.

**2. szándékos hiba: felülmintavételezés a CV előtt** (a szivárgás)
- PR-AUC 0,651 → **0,873**; recall 0,877. Kérdés: „új információ nélkül lett jobb: hiszel neki?”
- Az ellenőrzés: a validációs lemondó sorok **88%-ának** ott van a pontos másolata a
  tanító foldban (a maradóknál 0,4%).
- Javítás: `imblearn` pipeline, a mintavétel a foldon belül. Eredmény: PR-AUC
  **0,650** (változatlan), de recall 0,724, kiegyensúlyozott 0,751. A felülmintavételezés
  csak feltolta a valószínűségeket, ugyanaz, mintha a küszöböt vittük volna lejjebb.

**Jellemző-ötletek:** `n_addons` (−0,0007 ± 0,0069), `price_gap` (−0,0092 ± 0,0090),
`m2m_fiber` (+0,0003 ± 0,0054) páros különbség a PR-AUC-ban. **Egyik sem segít**;
a `price_gap` inkább rosszabb. Negatív eredmény, és ezt le is írjuk.

**A valódi javítás: a működési pont.** Küszöb 0,30 (kiegyensúlyozott pontosságra): recall
**0,739**, kiegyensúlyozott pontosság **0,754**, PR-AUC változatlan. Egy paraméter,
a train out-of-fold jóslatain választva.

**Miért csak egy kör?** Minden iteráció elhasznál egy kicsit a validációs „költségvetésből”
(többszörös összehasonlítás).

## 6. Hiperparaméter-hangolás (145–160 perc)

- Véletlen keresés, PR-AUC, 5-fold: XGBoost 30, Random Forest 25 jelölt. A nyertes
  XGBoost kicsi: 122 fa, mélység 3, learning rate 0,038, `min_child_weight` 14.
- **Új foldokon** (a kereséstől független): logisztikus regresszió 0,661; Random Forest
  0,619 → **0,668**; XGBoost 0,652 → **0,672**. Hangolás után a három modell a zajon belül egyforma.
- **A keresés saját pontszáma elvileg optimista** (maximum 30 próbán), **de itt nem látszik**:
  0,671 vs 0,672 új foldokon. Ne állítsd általánosan, hogy mindig torzít; csak azt, hogy ellenőrizni kell.

## 7. Záró teszt (160–180 perc)

**Előre rögzített szabály** (mondd ki, mielőtt kinyitod a teszthalmazt):
a logisztikus regresszió és a hangolt XGBoost közül az új CV-foldokon jobb PR-AUC-jú a végső
(0,672 vs 0,661 → XGBoost); a küszöb a végső modell train out-of-fold jóslataiból, 0,23.

| teszt (1 409 sor, 374 lemondó) | pontosság | kiegy. pont. | recall | precision | PR-AUC |
|---|---|---|---|---|---|
| küszöb 0,5 | 0,806 | 0,712 | 0,511 | 0,680 | 0,663 |
| küszöb 0,23 | 0,730 | 0,764 | 0,837 | 0,494 | 0,663 |

Konfúziós mátrix 0,23-nál: TP 313, FP 320, FN 61, TN 715.

**Az őszinte csavar (ne hagyd ki):**
- Teszt PR-AUC 0,663, 95%-os bootstrap CI [0,615; 0,714]; a logisztikus regresszió
  ugyanott 0,634. A páros bootstrap szerint az XGBoost **+0,029-cel jobb**, CI
  [+0,010; +0,048], tehát nem tartalmazza a nullát.
- **De** a CV-ben a két modell közel döntetlen volt (0,672 vs 0,661). A bootstrap
  csak a teszt-sorok mintavételi zaját méri két rögzített modellre; a tanító halmaz
  véletlenjét és az egy split szerencséjét nem. Józan olvasat: valószínűleg kissé
  jobb, a mértéke bizonytalan.
- Kérdés a hallgatóknak: hogyan ellenőriznéd? Várt: több seeddel megismételni a teljes
  split–hangolás–kiértékelés folyamatot. (Ezt **nem** futtattuk le; ha időd van, jó extra demó.)

## Házi

Lásd `homework.md`. Hangsúly: az indoklás számít, nem a pontszám; a sikertelen
próbálkozás is érték, ha őszintén leírják.

---

## Technikai megjegyzések az oktatónak

- **Újrafuttatás:** a lecke mappájából `uv run jupyter nbconvert --to notebook --execute demo.ipynb --inplace`
  (kb. 4-5 perc). Ez újragenerálja az `assets/*.png` fájlokat. A számok rögzített seedekkel
  determinisztikusak **ennél a függőségkészletnél** (`uv.lock`: scikit-learn 1.9.1, pandas 3.0.6, xgboost 3.4.1,
  imbalanced-learn 0.14.2); más verziónál kissé eltérhetnek (egy korábbi, nem a repo környezetében futtatott
  próbán pl. az alap XGBoost PR-AUC 0,648 volt a mostani 0,651 helyett), ezért a slide-ok szövege a
  `demo.ipynb` aktuális kimenetéhez van igazítva.
- **Slide-ellenőrzés:** `slide_check` skill. Eredmény: 63 slide, nincs túlcsordulás; a #15 és #28
  „small-for-space” jelzés (29%) szemrevételezve rendben van. A `slide_check` **nem látja**, ha egy `visualLayout: "stack"`
  slide szövege ráfut a képre (a `deck.css`-ben a kép fix `40vh` magas); ezért a stack slide-oknál
  maximum: egysoros cím (~20 karakter), ≤ 80 karakteres kérdés, ≤ ~120 karakteres felfedett sor.
- **Táblázatok** a slide-okon képek (`assets/tbl_*.png`), mert a deck-motornak nincs táblázat-blokkja.
- Az adatfájl (`data/telco.csv`) az IBM mintaadata; licencét nem ellenőriztem.
