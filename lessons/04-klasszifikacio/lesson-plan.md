# 4. óra — Klasszifikáció (kb. 180 perc, szünet nélkül)

Oktatói jegyzet, ugyanaz a formátum, mint a 2. óránál. A `slides.html` a vetített anyag; **a notebookot nem vetítjük**
(`demo.ipynb`), minden, ami az órán kell, a slide-okon van. A notebook a háttér: ez generálja a slide-ok ábráit és
táblázatait (`assets/`), és innen jön minden szám.

**A mai óra végcélja:** hogy a hallgatók ne egy szám (pontosság, AUC, CV-pontszám) alapján higgyenek egy modellnek,
hanem tudják, **mit mér** az a szám, **mit hagy ki**, és **hogyan lehet félrevezető**.

**Végigvitt példa:** a Kaggle „Don't Get Kicked!” adatsor (Carvana; OpenML 41162, CC0): használtautó-vásárlások egy
aukción; a pozitív osztály a „kick”, a rossz vétel (12,3%).

**Előfeltétel:** a 2. óra (fa, Random Forest, Gradient Boosting, overfitting, bias-variance). A recap blokk az ottani
gif-eket használja újra (`../02-gepi-tanulas/assets/`).

**Szabály a slide-okon:** minden kérdés (ask) a slide első állapotában látszik, a **válasz csak a következő kattintásra**
jelenik meg. A `slides-data.js` `qa()` segédfüggvénye ezt szerkezetileg garantálja (a kérdés step 0, a válasz step ≥ 1).

---

## Miért ez az adatsor? (és mit mértünk a kiválasztásához)

Két feltétel volt: (a) egy fa-alapú modell **érdemben verje** a logisztikus regressziót (nemlinearitás), és (b) a
**feature engineering javítson** a fa-alapú modellen. Négy nyilvános (OpenML) adatsort próbáltunk. **Figyelem:** ezek a
mérések a **teljes adaton, 5-fold CV-vel, a repo környezetében** készültek, de nem a `demo.ipynb`-ben; tájékoztató jellegűek.

| Adatsor | XGBoost vs logisztikus regresszió (PR-AUC) | Feature engineering az XGBoostnak | Megjegyzés |
|---|---|---|---|
| Give Me Some Credit (OpenML 46929, 150 000 sor, 6,7%) | ~0,40 vs ~0,24 nyersen; ~0,35 a 96/98-as kódok NaN-ra cserélése után | **nem segít** (8 féle jellemző, együtt ~+0,003 ± 0,003) | a tisztítás a lineáris modellnek ~+0,11 |
| Online Shoppers (46947, 12 330 sor, 15,5%) | ~0,75 vs ~0,64 | **nem segít** | a `PageValues > 0` jelző a logisztikusnak ~+0,056 |
| Bank Customer Churn (46911, 10 000 sor, 20,4%) | ~0,69 vs ~0,47 | **nem segít** | a `products ≥ 3` jelző a logisztikusnak ~+0,13 |
| **kick (41162, 72 983 sor, 12,3%)** | ~0,50 vs ~0,455 | **segít: ~+0,020 (t ≈ 25)** | a logisztikusnak ~+0,002 |

A tanulság, amit az óra végén érdemes kimondani: **a fa-alapú modell egy-oszlopos átalakításból (jelző, log, sáv) nem
nyer, mert azt magától megtanulja; a lineáris modell igen.** A fa ott nyer a feature engineeringből, ahol **új
információt** kap: itt két oszlop (mai és vételkori ár) **hányadosát**, amit egy fa nem tud kiszámolni. Az első három
adatsor ezért a házi választék része (lásd `homework.md`), ahol a hallgatók maguk láthatják ugyanezt.

**A kick gyengébb pontja:** a logisztikus regressziótól való különbség mérsékelt (a demó-mintán +0,032 ± 0,008 páros),
nem látványos. Őszintén mondd ki.

---

## Időzítés (83 slide, kb. 2 perc/slide)

| # | Blokk | Perc | Kumulált |
|---|-------|------|----------|
| 0 | Recap: a 2. óra modelljei (gif-ek) | 10 | 10 |
| 1 | Nyers adat és EDA | 18 | 28 |
| 2 | Tisztítás, kódolás (one-hot), split | 22 | 50 |
| 3 | Keresztvalidáció és kiértékelés | 35 | 85 |
| 4 | A modell-létra | 15 | 100 |
| 5 | Visszacsatolási kör (két szándékos hiba + feature engineering) | 45 | 145 |
| 6 | Hangolás | 12 | 157 |
| 7 | Záró teszt, összefoglaló, házi | 23 | 180 |

A többi óra 90 perces; ez dupla. Ha csúszik, vágj ebben a sorrendben:
1. **Hangolás (6. blokk)** → 2 slide-ra (a „Hiperparaméter” és az „Előtte és utána”): itt úgyis az az eredmény, hogy nem segít.
2. **Precision@K** („A legkockázatosabb 5%”), **AUC-magyarázat** és a **Goodhart-slide**.
3. A **recap** 10-ről 4 percre (csak az utolsó összefoglaló).
4. A **tisztítási** alslide-ok (dátum, kód-oszlopok) egy mondatra.
A **keresztvalidációt (3.)** és a **visszacsatolási kört (5.)** ne vágd. Természetes törés a 3. és 4. blokk között (85. perc).

---

## 0. Recap (0–10 perc)
Hagyd, hogy a hallgatók mondják vissza a fa/forest/boosting különbségét; ne magyarázd újra. A gif-ek ismerősek. Az utolsó
slide-on **tippeljenek**, melyik nyer a mai adaton, és írják a táblára: a 4. blokkban visszatérünk rá.

## 1. Nyers adat és EDA (10–28 perc)
- **A feladat:** „melyik hiba drágább?” Az OpenML-leírás szerint a rossz vétel drága (szállítás, felesleges javítás,
  piaci veszteség); azt, hogy egy plusz ellenőrzés olcsóbb, **feltételezzük**, mondd ki.
- **Az adat:** 72 983 sor, az órán a **30 000 soros réteges minta** (24 000 tanító + 6 000 teszt), 12,3% rossz vétel.
  A „minden vétel jó” modell pontossága 87,7%.
- **Kor szerint:** 1 évesnél 3,8%, 9 évesnél 29%. **Vételár szerint:** a legolcsóbb nyolcadban 23%.
- **A hiányzó érték:** 1 299 autónál nincs kerék-típus (`WheelType`); 71%-uk rossz vétel (a többinél 8–11%). Ez az XGBoost
  legfontosabb oszlopa. **Őszintén:** nem tudjuk, **miért** hiányzik. Ha csak utólag derült ki (a rossz vétel következtében),
  az szivárgás; ezt a vásárláskori adatrögzítés ismeretében kellene eldönteni. A demóban jellemzőként használjuk.

## 2. Tisztítás, kódolás, split (28–50 perc)
- **Nulla dollár:** a mintában 348 (vételkori átlagár) és 209 (mai átlagár) sor: lehetetlen, NaN lesz.
- **PurchDate:** unix-idő → hónap, hét napja. **Kód-oszlopok** (`VNZIP1`, `BYRNO`, `WheelTypeID`, `IsOnlineSale`): kategória, nem szám.
  `Transmission`: „Manual” (1 sor) és „MANUAL”.
- **One-hot** valódi sorokon (`tbl_onehot.png`): a „hiányzik” is kap oszlopot. **Miért nem 1, 2, 3?** A lineáris modell
  értelmet tulajdonítana a sorrendnek. **Fáknak sorszám-kód elég:** a lineáris előfeldolgozás **643**, a fáké **33** oszlop.
- **Hiányzó érték:** lineáris modellnek medián + „hiányzott” jelző; fának NaN marad.
- **Split:** 24 000 / 6 000, rétegzett; ami tanul, pipeline-ban él; a teszt a 7. blokkig zárolva.

## 3. Keresztvalidáció és kiértékelés (50–85 perc): ne rohanj
- **Keresztvalidáció:** a diagram (`cv_abra.png`) 3 kört mutat: 3 részre vágjuk a tanító adatot, mindig egy másik rész a „vizsga”.
  Élesben 5–10 fold szokás; **a demó 3-foldos a gyorsaság miatt**. **Out-of-fold jóslat:** minden sorra egy jóslat, olyan
  modelltől, amely azt a sort nem látta. A mutatók **átlag ± szórás** a foldokon.
- **A pontosság csapdája:** a dummy 87,7%, kiegyensúlyozott pontosság 0,50, recall 0. Az 1%-os példa (99,1%) **szintetikus**.
- **Kiegyensúlyozott pontosság** = a két osztály recallja átlaga: logisztikus regresszió 0,5-nél (0,25 + 0,99) / 2 = 0,62; pontosság 0,90.
- **Konfúziós mátrix** (`cm_lr.png`): TP 740, FP 265, FN 2 212, TN 20 783 (out-of-fold, tanító halmaz).
- **Precision** = 740 / 1 005 = 0,74; **recall** = 740 / 2 952 = 0,25. A küszöb 0,5 → 0,1 között a recall 25% → 69%, a precision 74% → 23%.
- **ROC vs PR:** 0,76 vs 0,45; a PR alapvonala 0,12. A ROC-AUC rangstatisztika, ritka pozitívnál hízelgő; ezért PR-AUC az elsődleges.
- **A legkockázatosabb X%:** 1% (240 autó) → 88%; 5% (1 200) → 68% (5,5-szörös lift); 10% → 48%; 20% → 32%.
- **Modellek összehasonlítása:** mérőszám előre, ugyanazok a foldok, átlag ± szórás, teszten nem választunk.

## 4. A modell-létra (85–100 perc)
**PR-AUC, 3-fold átlag ± szórás** (tanító halmaz):

| modell | PR-AUC |
|---|---|
| dummy | 0,123 |
| logisztikus regresszió | 0,449 ± 0,009 |
| fa, korlát nélkül | 0,187 ± 0,002 |
| fa, mélység 6 | 0,412 ± 0,008 |
| Random Forest | 0,462 ± 0,011 |
| XGBoost | **0,484 ± 0,014** |

- Az XGBoost nyer, de **mérsékelten**: páros különbség a logisztikushoz képest **+0,032 ± 0,008** (6 fold).
- **A korlát nélküli fa** összeomlik (0,19): a 2. órai gif számban.
- **Fontosság** (`xgb_fontossag.png`): `WheelType` és `WheelTypeID` (ugyanott hiányzik mindkettő), aztán a kor és az aukció.

## 5. Visszacsatolási kör (100–145 perc): a leglényegesebb blokk
A hibákat a **tanító halmaz out-of-fold** jóslatain nézzük, a teszt zárolva marad.

**Kiindulás** (XGBoost, 0,5): pontosság 0,902, kiegyensúlyozott 0,623, recall 0,254, precision 0,829, PR-AUC 0,483.
A konfúziós mátrix: TP 749, FP 155, FN 2 203, TN 20 893: négy rossz vételből egyet talál meg.

**Hibaelemzés → hipotézis.** A kihagyott rossz vételek (`tbl_tevedesek.png`) friss, átlagos autók, 0–1% jósolt esélyel:
a nyers oszlopokból nem látszik, miért rosszak. Hipotézis (üzleti gondolkodásból): a rossz vétel = az autó értéke nem úgy
alakult → **mennyit mozdult a piaci ár a vásárlás óta?** A hibák árváltozás szerinti bontása (`loop_arvaltozas.png`): a rossz
vétel aránya **fordított U** alakú (~20% ott, ahol az ár alig mozdult, ~10% a két szélen), a modell ezt **elmossa**
(alulbecsül a csúcson: 0,17 a valódi 0,19 helyett; felülbecsül a szélein). **Őszintén:** azt, hogy miért magas a kockázat
ott, ahol az ár nem mozdult, nem tudjuk (lehet adat-artefaktum).

**1. szándékos hiba: a küszöb a pontosságra** (csúcs 0,56-nál). **Figyelem:** ez ezen az adaton **gyenge csapda**: a
modell már eleve konzervatív, így a pontosság-optimális küszöb alig különbözik a 0,5-től (pontosság 0,902 → 0,902, recall
0,254 → 0,244). A tanulság nem az, hogy „a pontosság sokat javul”, hanem az **ellenkezője**: a **hasznos** küszöb
(0,12) a pontosságot **rontja** (0,90 → 0,75), miközben a recall 0,25 → 0,62. Aki a pontosságot optimalizálja, a
rossz vételek megtalálásától fordul el. Goodhart-törvény (Strathern megfogalmazásában).

**Felülmintavételezés: mi az értelme?** A ritka osztályt megsokszorozzuk, hogy a modell jobban figyeljen rá (olyan, mintha
nagyobb súlyt adnánk neki). **Nem ad új információt**, és felfelé tolja a valószínűségeket: hatása a küszöb lejjebb
viteléhez hasonló.

**2. szándékos hiba: felülmintavételezés a CV előtt** (a szivárgás). PR-AUC 0,483 → **0,899**; a validációs rossz vételek
**99%**-ának ott van a pontos másolata a tanító részben (a jó vételeknél 0%). Javítás: `imblearn` pipeline, a mintavétel a
foldon belül: PR-AUC 0,475 (**nem javul**), de recall 0,504, kiegyensúlyozott 0,682: csak a küszöb tolódott.

**Feature engineering** (a valódi javítás első fele): 8 új jellemző az árakból (mai / vételkori árarányok 4 féle árra,
árkülönbség, fizetett ár / mai ár, kiskereskedelmi / aukciós ár, tiszta / átlagos ár). Páros különbség a PR-AUC-ban
(3-fold × 2, 6 fold):

| változat | XGBoost | logisztikus regresszió |
|---|---|---|
| + árkülönbség | +0,0143 ± 0,0057 | −0,0005 ± 0,0005 |
| + 4 árarány | +0,0156 ± 0,0060 | +0,0003 ± 0,0005 |
| **+ mind a 8** | **+0,0179 ± 0,0062** | +0,0006 ± 0,0005 |

A logisztikus regresszió **nem profitál**: a hatás nem monoton, az egyenes csak lejtő lehet. **A feature engineering a
modell és az adat párosításáról szól.** A kör végén a PR-AUC 0,483 → 0,496.

**A valódi javítás második fele: a működési pont.** Küszöb 0,12 (kiegyensúlyozott pontosságra): recall **0,624**,
kiegyensúlyozott **0,698**, precision 0,277, pontosság 0,754.

**Miért csak egy kör?** Minden iteráció elhasznál a validációs „költségvetésből” (többszörös összehasonlítás).

## 6. Hangolás (145–157 perc)
Véletlen keresés, PR-AUC, 3-fold: XGBoost 8, Random Forest 3 jelölt. **Új foldokon** (a kereséstől független, 3×2):
logisztikus 0,450; Random Forest 0,473 → 0,468; XGBoost 0,499 → 0,493. **A hangolás itt nem segít** (a zajon belül);
a keresés saját pontszáma (0,495) alig különbözik az új foldokon mértől (0,493). Ez **őszinte eredmény**: a hangolt
modell nem jobb, tehát **az egyszerűbbet (az alapot) tartjuk meg**. A demó kis kereséssel dolgozik; élesben több
jelölt és több fold kell.

## 7. Záró teszt (157–180 perc)
**Előre rögzített szabály:** a logisztikus regresszió, az alap XGBoost és a hangolt XGBoost közül az új CV-foldokon a
legjobb PR-AUC nyer (0,450 / **0,499** / 0,493 → alap XGBoost); a küszöb a train out-of-fold jóslataiból: **0,12**.

| teszt (6 000 sor, 738 rossz vétel) | pontosság | kiegy. pont. | recall | precision | PR-AUC |
|---|---|---|---|---|---|
| küszöb 0,5 | 0,900 | 0,606 | 0,215 | 0,874 | 0,472 |
| küszöb 0,12 | 0,751 | 0,692 | 0,615 | 0,273 | 0,472 |

Konfúziós mátrix 0,12-nél: TP 454, FP 1 212, FN 284, TN 4 050. **Megéri?** Az üzleti költségtől függ.

**Bootstrap konfidencia-intervallum:** a tesztsorokat 1 000-szer újrahúzzuk visszatevéssel; PR-AUC 0,472, 95%:
[0,439; 0,506]. A logisztikus regresszió ugyanott 0,406. **Páros bootstrap:** az XGBoost **+0,065**, [+0,046; +0,085]:
nem tartalmazza a nullát. **De:** a CV-ben a különbség +0,05 körüli volt; az irány egyezik, a pontos mérték egy mintán
nem ismert. Kérdés a hallgatóknak: hogyan ellenőriznéd? (Több seeddel, a teljes adattal; ezt **nem** futtattuk le.)

## Házi
Lásd `homework.md`.

---

## Technikai megjegyzések az oktatónak

- **Újrafuttatás:** a lecke mappájából `uv run jupyter nbconvert --to notebook --execute demo.ipynb --inplace`
  (kb. 8 perc 8 maggal). Ez újragenerálja az `assets/*.png` fájlokat. A számok rögzített seedekkel determinisztikusak
  **ennél a függőségkészletnél** (`uv.lock`: scikit-learn 1.9.1, pandas 3.0.6, xgboost 3.4.1, imbalanced-learn 0.14.2).
- **Demó-egyszerűsítések (szándékosak):** 30 000 soros minta (`SAMPLE_N`; `None` = teljes adat), **3-fold** CV mindenhol,
  kis hangolási keresés. Ezek zajosabbá teszik az eredményeket (a foldok szórása ~0,01 PR-AUC). Élesben 5–10 fold, a teljes adat, nagyobb keresés.
- **Slide-ellenőrzés:** `slide_check`. Állapot: 83 slide, nincs túlcsordulás; a #35 és #36 (Precision, Recall) „small-for-space”
  jelzést kap (27%), de a szöveg 34 px, szemrevételezve rendben. A `slide_check` **nem látja**, ha egy `visualLayout: "stack"`
  slide szövege ráfut a képre (a kép fix `40vh` magas): stack slide-oknál egysoros cím (~20 karakter), ≤ 80 karakteres kérdés,
  ≤ ~120 karakteres válasz.
- **`deck.css` módosítás (megosztott fájl):** két szűk szabály: a „kérdés + sima bekezdés” és a „kérdés + tension” diákon a
  válasz szövege nagyobb (ugyanaz a logika, mint a meglévő `:only-child` szabályoké). Ellenőrzés mind a négy leckén a `slide_check`-kel:
  nincs új jelzés, az 1. leckén egy megszűnt.
- **Táblázatok** a slide-okon képek (`assets/tbl_*.png`), mert a deck-motornak nincs táblázat-blokkja.
- Az adatfájl (`data/kick.csv.gz`) az OpenML 41162-es adatsor (CC0) gzipelt másolata.
