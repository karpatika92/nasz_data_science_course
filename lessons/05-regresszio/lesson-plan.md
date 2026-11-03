# 5. óra — Regresszió (90 perc)

Oktatói jegyzet, ugyanaz a formátum, mint a 4. óránál. A `slides.html` a vetített anyag (**58 slide**); a notebookot **nem vetítjük**
(`demo.ipynb`), a hallgatók az órán nem látják az adatot, ezért minden kell-nem-kell a slide-on van. **Az óra 58 slide, kb. 88 perc (a 69 slide-os változatból 12 slide-ot kivettünk, lásd lent).**

**Cél:** hogy a hallgatók ne egy szám (RMSE, R²) alapján higgyenek egy regressziós modellnek, hanem tudják, **mit mér** a mutató,
**hol téved** a modell (diagnosztika), és hogy egy „túl jó” javulás gyanús. Az óra súlypontja a **kiértékelés és a diagnosztika**: regressziónál
nincs „jó/rossz” válasz, a hiba szerkezete is információ.

**Végigvitt példa:** UCI Bike Sharing, óránkénti bontás (Capital Bikeshare, Washington D.C., 2011–2012; Fanaee-T és Gama; a dataset Readme-je
szerint). Feladat: egy óra kölcsönzésszáma (a rendszer egészében, nem állomásonként). **A jóslatot a jósolt óra előtti óra elején adjuk ki**: az utolsó ismert óra 2 órával korábbi (`lag2`), a `lag1` **nem használható**. Az időjárást előrejelzésnek tekintjük (az adatban a megfigyelt érték áll helyette: ez optimista, lásd Korlátok). **Előfeltétel:** az 1. óra (lineáris regresszió, feltevések) és a 2. óra
(bias-variance, fa/forest/boosting; a recap a gif-eket használja újra).

**Miért ez az adatsor** (a Kaggle-ről nem tudtam letölteni, az UCI-ról igen; három jelöltet mértem): a „gépi tanulás vs lineáris” különbség nagy
(40%), a késleltetett jellemzők kicsi, de valódi javulást adnak (−6%, a lag1 nélkül), a változás-célú fa pedig sodródásnál a lineárisnál is jobb, és az idő-dimenzió miatt a vágás, a sodródás és az autokorreláció természetes téma. A King County
házárak lett a házi (ott a lineáris is sokat nyer a térbeli jellemzőn, lásd `homework.md`).

**Kérdés-költségvetés: összesen 6 kérdés** (a `qa()` segédfüggvény), mindegyik válasza a *következő kattintásra* jelenik meg. A hat kérdés:
véletlen vs időrendi vágás (12), tisztességes lineáris (20), mi a teendő a tölcsérrel (30), „elhiszed?” a szivárgó jellemzőre (37), ki nyer 2012-ben (44),
jobb lett-e a modell a teszten (54). Az „Idő mint változó” (21–25) és az „új célváltozó” (47–52) blokk csupa állítás-slide, nincs bennük új kérdés.

---

## Időzítés

| Blokk | Slide | Perc |
|---|---|---|
| Cím + recap (gif-ek) | 1–4 | 4 |
| Feladat, adat, EDA, hiányzó órák | 5–10 | 7 |
| Kiértékelés: vágás, alapmodellek, mutatók | 11–18 | 15 |
| Modell-létra (óra számként, tisztességes lineáris; létra) | 19–20, 26 | 5 |
| Idő mint változó: kategória vs kör (sin/cos) | 21–25 | 5 |
| Diagnosztika | 27–34 | 15 |
| Visszacsatolási kör (szivárgó próba, késleltetések) | 35–42 | 15 |
| Sodródás (a fa nem extrapolál) | 43–46 | 6 |
| Új célváltozó: változás a múlt héthez képest | 47–52 | 6 |
| Záró teszt, bizonytalanság, ellenőrzőlista, házi | 53–58 | 10 |

Összesen kb. **88 perc** (egy állítás-slide 1 perc, a hat kérdés 2–3 perc), 3 perc tartalékkal. **Kivettük a 69 slide-os változatból** (a `slides-cut.js`-ben megvannak, visszarakhatók; a „Blokkonként” rész ezek tartalmát is leírja):
a gradient descent recap-et, a hőmérséklet szerinti és a célváltozó-eloszlás EDA-t, a „Miért nehezebb regressziónál?” keretet, az óralapos poláris ábrát, az „És a fának?” slide-ot (a 3,9 ± 1,1 a 25. slide-on maradt), a „Mit tanult a fa?”-t, a „mutatók vitatkoznak” táblát,
az „Egy rossz hét” slide-ot, a klasszikus feltevések táblázatát, a második autokorreláció-slide-ot (a 0,63 → 0,45 a 41. slide-on maradt) és a „Mibe kerül?” táblázatot (a számok az 50. és az 52. slide-on).
Ha még mindig csúszik, **ebben a sorrendben vághatsz tovább:** az „Arányos mutatók” (16), a „Melyik mutató kinek?” (18), a „Hány harmonikus kell?” (23). **Ne vágd:** a diagnosztikát (27–34), a visszacsatolási kört (35–42), az időrendi vágást (11–13),
az animációt (22), a kategória vs kör összevetést (24), az új célváltozó ábráját (50) és a „Hiányzó múlt hét” slide-ot (51). **Alternatíva: két alkalom** (1–34 | 35–58).

**Ami szándékosan nincs benne:** hiperparaméter-hangolás (a 4. órán volt; itt a hangolás egy sor a házi feladatban), SHAP és más
magyarázhatósági módszerek, Poisson-/negatív binomiális regresszió (a log-cél és a kvantilis-sáv viszi a témát), stacking.

---

## Blokkonként (minden szám a `results.json`-ból; rögzített seedek)

**Recap.** Négy gif a 2. óráról. A fa/forest/boosting gif osztályozás: a caption kimondja, hogy regressziónál ugyanez, csak a levélben szám áll
(átlag), és a boosting a reziduumra illeszt.

**Feladat, adat, EDA.** 17 379 óra, 2011-01-01 – 2012-12-31; az utolsó 2 hónap (2012-11, 12: 1 460 óra) **záró teszt**, a többi 15 919 óra a fejlesztés; az EDA csak
a fejlesztésen fut. A `casual` + `registered` = `cnt` minden sorban (legnagyobb eltérés 0): **szivárgás**, eldobjuk. Az óra szerinti átlag: munkanapon két csúcs (8, 17–18),
hétvégén egy délutáni púp. **Hőmérséklet:** közel lineáris (az egyenes és a sávátlagok alig térnek el), de a szórás nagy; **nem** állítjuk, hogy nemlineáris. **Idő:** jan–okt átlag 146,6 → 243,8
(+66%, azonos hónapok). A hetek átlagának mélypontja 2012 októberének végén: **a hiányzó órák nem véletlenek**: a 17 544 órából 165 hiányzik; okt. 29-én 1, 30-án 11 óra
van rögzítve (a Readme szerint ekkor volt a Sandy-hurrikán). Következmény: a késleltetést **időbélyeg** szerint számoljuk, a hiányzó lag NaN.

**Kiértékelés.** *Vágás:* kiterjedő ablak, 3 teszt-blokk (2012-05–06, 07–08, 09–10). **Véletlen vs időrendi, UGYANAZON a teszt-órákon** (csak a tanító halmaz más): XGBoost RMSE
**47,3 vs 66,0** (a véletlen vágás 28%-kal kisebb hibát mutat). *Alapmodellek:* átlag RMSE 255,0 (R² −0,25); a 2 órával korábbi óra 222,9 (R² 0,04); **múlt heti azonos óra 101,5 (R² 0,80)**.
*Mutatók:* RMSE vs MAE (négyzetes büntetés), WAPE, RMSLE, a MAPE csapdája (0 közeli tényleges érték), az R² csapdái. A csúcsórák RMSE-je 107 (átlag 544, 20%), az
éjszakaié 22,2 (átlag 37, 60%): **melyik mutató számít, üzleti döntés**.

**Modell-létra** (RMSE, 3 időrendi fold átlaga): lineáris, óra = szám **193,2**; tisztességes lineáris (óra × munkanap dummyk, hónap, időjárás; Ridge) **110,9**; fa (mélység 8) 91,9; Random Forest 70,1;
**XGBoost 66,0**. A „múlt heti azonos óra” (101,5) a tisztességes lineárisnál is jobb. Az XGBoost mind a 3 foldon veri a tisztességes lineárist (40%-kal). **A mutatók vitatkoznak:** az RMSE és R² az XGBoostot,
az MAE, WAPE és RMSLE a Random Forestet választja (RMSLE 0,299 vs 0,489; az XGBoost éjjel negatívat is jósol, az RMSLE-hez 0-ra vágtuk).
**Őszintén:** az „óra × munkanap” kölcsönhatást a tisztességes lineárisnak kézzel adtuk meg; hogy a maradék 40% mitől van (hőmérséklet × óra stb.), **hipotézis, nem mértük külön**.

**Idő mint változó** (21–25; a kategóriás példa a 20. slide válasza, itt a kör az új). Az órán kívüli jellemzők (hónap, időjárás, hőmérséklet stb.) minden kódolásnál ugyanazok; lineáris modell (Ridge), 3 időrendi fold.
*Távolság:* számként a 0. és 23. óra távolsága 23 (a legnagyobb), one-hot-nál minden pár √2, a körön 0,26 (két szomszédos óra). *Animáció* (22): a számegyenes körré hajlik, a mutató körbejár, az x és az y koordináta a sin és a cos (`assets/ora_kor.gif`, a `build_assets.py` generálja).
*Összevetés* (RMSE, óra × munkanap, azaz külön görbe a két napfajtára): **dummyk (48 paraméter) 110,9**; sin/cos k = 1 (4 paraméter) 173,8; k = 2 (8) 140,4; k = 4 (16) 126,7; **k = 6 (24) 114,2**; k = 8 (32) 111,5; **k = 12 (48) 110,6**. A k = 12 harmonikus ugyanazt a teret fedi,
mint a 24 dummy, ezért a határon azonos; a sin/cos előnye a **paraméter-takarékosság** és a sima görbe (k = 6: fele annyi paraméterrel 3 egységgel rosszabb). Egy harmonikus egy púpot tud, a munkanapi görbe két púpos: ezért gyenge a k = 1. Kontroll: a „számként” (1 paraméter) 190,8; dummyk a napfajta nélkül (24) 141,7.
*Fa:* az XGBoostnál az óra helyett sin/cos jobb mind az 5 seeden, páros különbség **3,9 ± 1,1** RMSE (a 3 fold együtt, a seed 0: 66,0 → 62,8). **Hipotézis, nem mértük:** a fa a 22–5 éjszakai sávot a körön egy vágással csoportosítja, a számegyenesen kettővel (a 23–0 átmenet miatt).
*Hónap* (ugyanazzal a kerettel, az óra: dummyk): hónap nélkül 116,1; one-hot (11 paraméter) 110,9; sin/cos k = 1 (2) 114,7; **k = 2 (4) 110,9**. A mintában csak 2 év van: a december–január átmenetet csak egyszer látjuk, tehát a hónap-állítás gyengébb, mint az óra-állítás.

**Diagnosztika** (az XGBoost out-of-fold jóslatán). *Kalibráció:* a legfelső decilisben 7%-kal alulbecsül (675 helyett 723). *Tölcsér:* a reziduum szórása 14 → 94 a becsült szinttel. *Log-cél:*
RMSE 66,0 → 63,8, RMSLE 0,489 → 0,275, **de** a jósolt/tényleges összforgalom 96,1% → 92,8% (a 96,1% már a növekedés/csúcs-simítás miatt <100%, tehát a log-visszaalakítás ára csak ~3 százalékpont, nem 7).
*Negatív jóslat:* 44 db (1,0%; az éjszakai órák 3,8%-a; min −37,4). *Szegmensek:* munkanapon a csúcsórákban +49…+64 (alulbecsül), hétvégén 7 órakor −60 (túlbecsül): a két napfajtát összemossa.
*Idő:* a legrosszabb hét (2012-10-15), a hibák egymás után ugyanabba az irányba; **autokorreláció** lag1 **0,63**, lag2 0,41, lag24 0,32. *Feltevések* táblázata: linearitás, állandó szórás, független hibák, azonos eloszlás.

**Visszacsatolási kör.** Hipotézis: a hiba ismétlődik → a közelmúlt hiányzik. **Szándékos hiba először:** `rolling(3, center=True).mean()` → RMSE **27,7**, R² 0,985: *túl jó*; a központosított ablak a következő órát is tartalmazza (szivárgás).
Javítás: csak az ISMERT múlt (`lag2, lag3, lag4, lag24, lag168, roll3`; a `roll3` a három legutóbbi ismert óra, lag2–4 átlaga; **lag1 nincs**): **66,0 → 61,9**, mindhárom foldon (−3,9; −2,0; −6,4); napi blokk-bootstrap: javulás **4,1 [0,7; 7,5]**: valódi, de kicsi és bizonytalan (a lag1 használata ennél sokkal többet adna: lásd a horizont-érzékenységet a Korlátoknál).
**Ablation:** a lag2 egyedül 62,0, a lag24 67,1, a lag168 69,8, a roll3 65,8, mind a hat együtt 61,9 → **döntetlen** a lag2 egyedül és a hat között (a különbség 0,1; foldonként +3,0, −2,9, +0,1). Az előre rögzített szabály (legkisebb CV-RMSE) a hatot választja; az egyszerűbb is ugyanennyit tud (a teszten 49,3, nem szelekcióra használva).
Újradiagnózis (mind a hat lag-gel): tölcsér 94 → 72; éjszakai RMSE 22,2 → 15,2, de **csúcsban nem javult** (107,0 → 108,0); az 1 órás autokorreláció csak **0,63 → 0,45** (a 24 órás 0,32 → 0,12): az előző óra hiánya miatt a hiba nagy része nem tüntethető el.
**A lineáris is javul:** tisztességes lineáris + lagok 75,3 (110,9-ről, −32%); az XGBoost 66,0 → 61,9 (−6%): a különbség 40% → 18%. Ez ellentétes a 4. óra tanulságával („csak a fának segít”): itt az idősoros szerkezetet bármely modell kihasználja, a lineáris sokkal jobban. A log-célú XGBoost lagekkel 68,2 (RMSE-ben rosszabb).
**Figyelem:** a kiválasztás öt jelölt közül, a dev foldokon történt (kis szelekciós torzítás); a teszten a lag2-es modell is megjelenik (nincs elrejtve).

**Sodródás.** Csak 2011-en tanulunk, 2012-01–10-et jósoljuk: **XGBoost alap 128,9 (az összforgalom 63%-át jósolja)**, XGBoost + lag2 115,0 (71%), XGBoost + hat lag 106,1 (82%), lineáris alap 144,4 (62%),
**lineáris + lagok 78,4 (91%)**. A fa nem extrapolál; a „gépi tanulás veri a lineárist” feltétele, hogy a jövő a tanítóra hasonlítson. (Egy ilyen próba egyetlen forgatókönyv: egy évnyi tanító adat, egy évnyi növekedés.)

**Új célváltozó: változás a múlt héthez képest** (47–52; a sodródás-blokk folytatása, a meglévő slide-okat nem váltja ki). A 47. slide definiálja a szint-, a változás- és a log-arány célt, valamint a jelöléseket (`wk`, `lag2`, `lag24`, `lag336`, `d2`); a 49. slide táblázatában (sorok: célváltozó × időszak, oszlopok: a három jellemzőkészlet) a „normál” sor az időrendi foldokat (2012-05–10, 1 seed), a „növekedés” sor a 2011-en tanult, 2012-re jósló próbát (3 seed átlaga) jelenti; a „mind az öt” = lag2, wk, d2, lag24, lag336. *Ötlet:* ne a szintet (`cnt`), hanem a múlt heti azonos órához képesti **változást** jósoljuk: `delta = cnt − wk`, vagy a **log-arányt** `log(1+cnt) − log(1+wk)`; a jóslat visszaalakítva `wk + modell`, illetve `expm1(log(1+wk) + modell)` (ez sosem negatív).
A szint nő (jan–okt átlag 150,1 → 244,1), a változás átlaga alig (2,0 → 4,1); a delta szórása nő a szinttel (72,4 → 100,9), a log-arányé nem (0,58 → 0,52): ez a log-forma érve.
*Jellemzők:* a múlt heti szintet (`wk`) **be kell adni jellemzőként is**, különben a változás-cél összeomlik: csak `lag2`-vel a delta 94,2, a log-arány 147,0 (normál foldok RMSE; a szint-cél 62,1). Teljes készlet: `BASE + lag2, wk, d2 (= lag2 − a lag2 óra múlt heti értéke), lag24, lag336`.
*Sodródás-próba* (2011-en tanul, 2012-01–10 teszt; XGBoost, a 3 seed átlaga): szint-cél **95,4** (az összforgalom 86%-a), **delta 73,1** (93%), **log-arány 74,6** (90%; RMSLE 0,325, a legjobb); lineáris + késleltetések 78,4 (91%), a „múlt heti azonos óra” szabály 101,0.
Vagyis a változás-cél 23%-kal csökkenti a hibát, és **a delta-s fa 6,8%-kal jobb a lineáris + késleltetésnél** (ez egyetlen forgatókönyv). *Normál időszakban* (2012-05–10 foldok): szint 63,6, delta 62,6, log-arány 65,4 (a log 3%-kal gyengébb RMSE-ben). A delta 8 negatív jóslatot ad, a log-arány 0-t.
*Hiányzó múlt heti érték (post-hoc):* a dev foldokon nincs hiányzó `lag168`, a sodródás-próbán 11 sor; **a záró teszten a Sandy utáni hét** (2012-11-05 és 06) hiányzik: a nyers `lag168`-as szint-modell 546-ot jósol 219 helyett (11-06: 429 helyett 237), a záró teszt RMSE 79,9 (a pre-regisztrált modellé 50,9).
A hibát tehát a záró teszten vettük észre, ezért **a záró teszt ezekre a modellekre már nem tiszta** (a slide is jelzi). *Szomszéd-kitöltés* (a múlt heti érték: 1) ugyanaz az óra múlt héten, 2) a múlt heti szomszéd órák átlaga, 3) ugyanaz az óra két hete): 2012-11-05-én 244 (22 óra a két héttel korábbi, 1 a szomszédokból), a záró teszt RMSE 52,9 (delta 52,9, log-arány 48,0) tartalék-modell nélkül; a tartalék-modellel (az egyszerű lag2-szintmodell) 54,1 (szint) — azonos pontosság, de nincs szükség másik modellre. A mechanizmus (miért jósol a nyers, NaN-os modell kétszeresét) **nincs vizsgálva**. Az első hipotézist (az ünnepnapok rontják a múlt heti jellemzőt) elvetettük: a hiba a két vihar utáni napra (11-05, 06) koncentrálódik, ahol a múlt heti érték 23, illetve 13 órában hiányzik (a tanítás során a hiányzó `lag168` főleg az adat első hetére esik, alacsony forgalommal: ez egy lehetséges, nem ellenőrzött magyarázat).
A pre-regisztrált modell (XGBoost + hat lag, teszt 50,9) változatlan marad; az új célváltozó a **sodródás-védelem eszköze**: normál időszakban egyenrangú, sodródásnál a leghasznosabb.

**Záró teszt.** Előre rögzített szabály: a legkisebb CV-RMSE a jelöltek közül → XGBoost + hat késleltetés (CV 61,9; a lag2 egyedül 62,0: döntetlen). Teszt (1 460 óra): RMSE **50,9** [45,5; 56,5] (napi blokk-bootstrap), MAE 32,5, WAPE 0,172, R² 0,915. Összevetés (teszt RMSE):
múlt heti óra 120,8; tisztességes lineáris 91,0; lineáris + lagok 66,3; XGBoost alap 67,8; XGBoost + lag2 49,3 (nem szelekcióra használva). **A teszt-RMSE kisebb a CV-nél, de a modell relatíve rosszabb:** novemberben-decemberben alacsonyabb a szint (az RMSE-t a szint húzza le), a WAPE viszont nagyobb: 0,172 a teszten, 0,140 a CV-ben (az alapnál 0,228 vs 0,161: az időszak mindegyik modellnek nehezebb).
Javulás: XGBoost + hat lag vs alap **16,9** [7,5; 25,5]; vs lineáris + lagok **15,4** [10,2; 20,9]. **Kvantilis-sáv** (5.–95. percentilis, XGBoost): a teszten az órák **82,8%**-a esik bele (a névleges 90% alatt: a sáv túl keskeny), a sáv átlagos szélessége 78 (jóslat < 100) → 180 (≥ 100).

---

## Korlátok (őszintén)

- A modell-létra és a diagnosztika **egyetlen időrendi vágássorozaton** (3 teszt-blokk, 2012-05–10), egy seeden fut; a foldok közti szórás (pl. 62,0 / 65,9 / 70,1) 3 pontból áll. A javulás-intervallumok napi blokk-bootstrapek, nem független ismétlések.
- A záró teszt csak 2 hónap (1 460 óra, kb. 61 nap): kicsi n, egyetlen évszak; a CI-k szélesek.
- A hőmérséklet-tengelyen a kapcsolat közel lineáris (nincs ilyen állítás a slide-okon). Az óra × munkanap kölcsönhatáson túli nemlinearitásról (mi adja a maradék 40%-ot) nincs mérés.
- Az „Idő mint változó” összevetés egyetlen időrendi vágássorozaton fut (3 fold); csak az XGBoost-os különbségre van 5 seedes ismétlés (a seedek csak az XGBoost véletlenjét változtatják, a foldokat nem). A „Hány harmonikus kell?” ábra illusztráció: a teljes fejlesztési adatra illesztve (nem out-of-fold).
- A lineáris modell Ridge (alpha = 1, nem hangolt); a dummyk és a sin/cos eltérő regularizáció-érzékenysége itt nincs vizsgálva.
- **A jóslás időzítése (tervezői döntés):** a jóslatot a jósolt óra előtti óra elején adjuk ki, ezért a lag1 nem használható, a lag2 igen. Ez kimondva szerepel az 5. slide-on. Az érzékenység (mért, `results.json` → `horizon`; XGBoost, a h az utolsó ismert óra távolsága a jósolt órától): h = 1 (lenne a lag1): **52,5**, **h = 2: 63,6**, h = 3: 65,6, h = 6: 67,8, h = 12: 68,2, h = 24: 68,0. Vagyis a lag-ek nyeresége a lead-time-mal gyorsan fogy; 2 órás előre-jelzésnél kicsi (66,0 → 61,9), 6 órástól nincs.
  Az adat a teljes rendszer óránkénti összforgalma (nem állomásonkénti): az állomás-szintű készletterv ebből nem következik. A lag-ek azt is feltételezik, hogy a 2 órával korábbi forgalom a jóslat kiadásakor már az adatban van (éles rendszerben késhet).
- **A megfigyelt időjárás előrejelzésként (tervezői döntés: így kezeljük):** az adatban a megfigyelt érték van, ami optimista. Mért érzékenység (az időjárás-jellemzők elhagyásával): h = 1: 54,4 (+2), h = 2: 72,2 (+9), h = 6: 87,0 (+19), h = 24: 91,8 (+24). Valódi előrejelzési hibával a számok a „megfigyelt” és az „időjárás nélküli” között lennének (nem mértük, hol).
- A „Kaggle Bike Sharing Demand” verseny ennek az adatnak egy részhalmaza (emlékezetből, nem ellenőriztem: a slide-ok nem állítják).

## Futtatás

```bash
cd lessons/05-regresszio
uv run python results.py        # results.json (20 mp): minden slide-szám
uv run python build_assets.py   # assets/*.png (kb. 30 mp), results.json frissítése
uv run jupyter lab demo.ipynb   # a bike.py-t használja (kb. 15 mp)
```
