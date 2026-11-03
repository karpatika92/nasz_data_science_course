# 5. óra — Regresszió (90 perc)

Oktatói jegyzet, ugyanaz a formátum, mint a 4. óránál. A `slides.html` a vetített anyag (**56 slide**); a notebookot **nem vetítjük**
(`demo.ipynb`), a hallgatók az órán nem látják az adatot, ezért minden kell-nem-kell a slide-on van.

**Cél:** hogy a hallgatók ne egy szám (RMSE, R²) alapján higgyenek egy regressziós modellnek, hanem tudják, **mit mér** a mutató,
**hol téved** a modell (diagnosztika), és hogy egy „túl jó” javulás gyanús. Az óra súlypontja a **kiértékelés és a diagnosztika**: regressziónál
nincs „jó/rossz” válasz, a hiba szerkezete is információ.

**Végigvitt példa:** UCI Bike Sharing, óránkénti bontás (Capital Bikeshare, Washington D.C., 2011–2012; Fanaee-T és Gama; a dataset Readme-je
szerint). Feladat: a **következő óra** kölcsönzésszáma. **Előfeltétel:** az 1. óra (lineáris regresszió, feltevések) és a 2. óra
(bias-variance, fa/forest/boosting; a recap a gif-eket használja újra).

**Miért ez az adatsor** (a Kaggle-ről nem tudtam letölteni, az UCI-ról igen; három jelöltet mértem): a „gépi tanulás vs lineáris” különbség nagy
(40%), a feature engineering valódi javulást ad (−23%), és az idő-dimenzió miatt a vágás, a sodródás és az autokorreláció természetes téma. A King County
házárak lett a házi (ott a lineáris is sokat nyer a térbeli jellemzőn, lásd `homework.md`).

**Kérdés-költségvetés: összesen 6 kérdés** (a `qa()` segédfüggvény), mindegyik válasza a *következő kattintásra* jelenik meg. A hat kérdés:
véletlen vs időrendi vágás (16), tisztességes lineáris (24), mi a teendő a tölcsérrel (31), „elhiszed?” a szivárgó jellemzőre (40), ki nyer 2012-ben (48),
jobb lett-e a modell a teszten (52).

---

## Időzítés

| Blokk | Slide | Perc |
|---|---|---|
| Cím + recap (gif-ek) | 1–5 | 5 |
| Feladat, adat, EDA, hiányzó órák | 6–13 | 9 |
| Kiértékelés: vágás, alapmodellek, mutatók | 14–22 | 17 |
| Modell-létra | 23–27 | 8 |
| Diagnosztika | 28–37 | 18 |
| Visszacsatolási kör (szivárgó próba, késleltetések) | 38–46 | 17 |
| Sodródás (a fa nem extrapolál) | 47–50 | 6 |
| Záró teszt, bizonytalanság, ellenőrzőlista, házi | 51–56 | 10 |

Ha csúszik, **ebben a sorrendben vágd:** az autokorreláció második slide-ja (45), a „mutatók vitatkoznak” (27), az „Arányos mutatók” (20), a feltevések
táblázata (37), a „Mit tanult a fa?” (26). A **diagnosztikát**, a **visszacsatolási kört** és az **időrendi vágást** ne vágd.

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
**47,3 vs 66,0** (a véletlen vágás 28%-kal kisebb hibát mutat). *Alapmodellek:* átlag RMSE 255,0 (R² −0,25); előző óra 137,3 (R² 0,64); **múlt heti azonos óra 101,5 (R² 0,80)**.
*Mutatók:* RMSE vs MAE (négyzetes büntetés), WAPE, RMSLE, a MAPE csapdája (0 közeli tényleges érték), az R² csapdái. A csúcsórák RMSE-je 107 (átlag 544, 20%), az
éjszakaié 22,2 (átlag 37, 60%): **melyik mutató számít, üzleti döntés**.

**Modell-létra** (RMSE, 3 időrendi fold átlaga): lineáris, óra = szám **193,2**; tisztességes lineáris (óra × munkanap dummyk, hónap, időjárás; Ridge) **110,9**; fa (mélység 8) 91,9; Random Forest 70,1;
**XGBoost 66,0**. A „múlt heti azonos óra” (101,5) a tisztességes lineárisnál is jobb. Az XGBoost mind a 3 foldon veri a tisztességes lineárist (40%-kal). **A mutatók vitatkoznak:** az RMSE és R² az XGBoostot,
az MAE, WAPE és RMSLE a Random Forestet választja (RMSLE 0,299 vs 0,489; az XGBoost éjjel negatívat is jósol, az RMSLE-hez 0-ra vágtuk).
**Őszintén:** az „óra × munkanap” kölcsönhatást a tisztességes lineárisnak kézzel adtuk meg; hogy a maradék 40% mitől van (hőmérséklet × óra stb.), **hipotézis, nem mértük külön**.

**Diagnosztika** (az XGBoost out-of-fold jóslatán). *Kalibráció:* a legfelső decilisben 7%-kal alulbecsül (675 helyett 723). *Tölcsér:* a reziduum szórása 14 → 94 a becsült szinttel. *Log-cél:*
RMSE 66,0 → 63,8, RMSLE 0,489 → 0,275, **de** a jósolt/tényleges összforgalom 96,1% → 92,8% (a 96,1% már a növekedés/csúcs-simítás miatt <100%, tehát a log-visszaalakítás ára csak ~3 százalékpont, nem 7).
*Negatív jóslat:* 44 db (1,0%; az éjszakai órák 3,8%-a; min −37,4). *Szegmensek:* munkanapon a csúcsórákban +49…+64 (alulbecsül), hétvégén 7 órakor −60 (túlbecsül): a két napfajtát összemossa.
*Idő:* a legrosszabb hét (2012-10-15), a hibák egymás után ugyanabba az irányba; **autokorreláció** lag1 **0,63**, lag2 0,41, lag24 0,32. *Feltevések* táblázata: linearitás, állandó szórás, független hibák, azonos eloszlás.

**Visszacsatolási kör.** Hipotézis: a hiba ismétlődik → a közelmúlt hiányzik. **Szándékos hiba először:** `rolling(3, center=True).mean()` → RMSE **27,7**, R² 0,985: *túl jó*; a központosított ablak a következő órát is tartalmazza (szivárgás).
Javítás: csak a múlt (`lag1, lag2, lag3, lag24, lag168, roll3`; a `roll3` az előző 3 óra átlaga): **66,0 → 50,9**, mindhárom foldon (−14,1; −16,2; −15,3); napi blokk-bootstrap: javulás 15,2 [12,1; 18,5].
**Ablation:** az `lag1` egyedül 49,2 (jobb mind a 3 foldon, mint a hat együtt: 50,9), a lag24 67,1 és a lag168 69,8 nem segít (a lag24 gyakorlatilag nulla), roll3 56,8 → **az egyszerűbbet tartjuk (lag1)**.
Újradiagnózis (mind a hat lag-gel): tölcsér 94 → 73; éjszakai RMSE 22,2 → 15,2, csúcs 107,0 → 84,7; lag1 autokorreláció 0,63 → 0,21 (csak lag1-gyel 0,16).
**A lineáris is javul:** tisztességes lineáris + lagok 58,3 (110,9-ről); a különbség az XGBoost + lag1-hez 40% → 16%. Ez ellentétes a 4. óra tanulságával („csak a fának segít”): itt az idősoros szerkezetet bármely modell kihasználja.
**Figyelem:** a lag1 kiválasztása öt jelölt közül, a dev foldokon történt (kis szelekciós torzítás); a teszten a hat-lag-es modell is megjelenik (nincs elrejtve).

**Sodródás.** Csak 2011-en tanulunk, 2012-01–10-et jósoljuk: **XGBoost alap 128,9 (az összforgalom 63%-át jósolja)**, XGBoost + lag1 88,8 (82%), XGBoost + hat lag 95,2 (86%), lineáris alap 144,4 (62%),
**lineáris + lagok 59,5 (94%)**. A fa nem extrapolál; a „gépi tanulás veri a lineárist” feltétele, hogy a jövő a tanítóra hasonlítson. (Egy ilyen próba egyetlen forgatókönyv: egy évnyi tanító adat, egy évnyi növekedés.)

**Záró teszt.** Előre rögzített szabály: a legkisebb CV-RMSE a jelöltek közül → XGBoost + lag1 (CV 49,2). Teszt (1 460 óra): RMSE **35,4** [30,8; 40,1] (napi blokk-bootstrap), MAE 22,2, WAPE 0,117, R² 0,959. Összevetés (teszt RMSE):
múlt heti óra 120,8; tisztességes lineáris 91,0; lineáris + lagok 47,6; XGBoost alap 67,8; XGBoost + hat lag 36,5. **A teszt-RMSE kisebb a CV-nél, de nem jobb a modell:** novemberben-decemberben alacsonyabb a szint; a WAPE ugyanaz (0,117 teszt, 0,116 CV).
Javulás: XGBoost + lag1 vs alap **32,4** [23,4; 41,0]; vs lineáris + lagok **12,2** [8,0; 16,5]. **Kvantilis-sáv** (5.–95. percentilis, XGBoost): a teszten az órák 92,9%-a esik bele (névleges 90%), a sáv átlagos szélessége 74 (jóslat < 100) → 185 (≥ 100).

---

## Korlátok (őszintén)

- A modell-létra és a diagnosztika **egyetlen időrendi vágássorozaton** (3 teszt-blokk, 2012-05–10), egy seeden fut; a foldok közti szórás (pl. 62,0 / 65,9 / 70,1) 3 pontból áll. A javulás-intervallumok napi blokk-bootstrapek, nem független ismétlések.
- A záró teszt csak 2 hónap (1 460 óra, kb. 61 nap): kicsi n, egyetlen évszak; a CI-k szélesek.
- A hőmérséklet-tengelyen a kapcsolat közel lineáris (nincs ilyen állítás a slide-okon). Az óra × munkanap kölcsönhatáson túli nemlinearitásról (mi adja a maradék 40%-ot) nincs mérés.
- A lag-ek használata azt feltételezi, hogy a jóslás pillanatában az előző óra forgalma ismert (éles rendszerben késhet az adat). Az időjárás-előrejelzést ismertnek vesszük (itt a megfigyelt érték áll helyette: kicsit optimista).
- A „Kaggle Bike Sharing Demand” verseny ennek az adatnak egy részhalmaza (emlékezetből, nem ellenőriztem: a slide-ok nem állítják).

## Futtatás

```bash
cd lessons/05-regresszio
uv run python results.py        # results.json (20 mp): minden slide-szám
uv run python build_assets.py   # assets/*.png (kb. 30 mp), results.json frissítése
uv run jupyter lab demo.ipynb   # a bike.py-t használja (kb. 15 mp)
```
