# 5. házi feladat — Építs saját regressziós modellt

Az adatsor: **King County házárak** (Kaggle „House Sales in King County, USA”; OpenML-en bejelentkezés nélkül letölthető). A beadandó **egyetlen notebook**.
Ugyanazt az utat járod be, mint az órán: nyers adat, EDA, tisztítás, modellek, **diagnosztika**, egy visszacsatolási kör, záró teszt. A házi arról szól, hogy a
mutatókat és a diagnosztikát a saját modelleden is alkalmazd.

```python
from sklearn.datasets import fetch_openml
df = fetch_openml(data_id=42092, as_frame=True).frame      # house_sales (CC0)
```

## Az adatsor (amit **ellenőriztem**)

| Tény | Érték |
|---|---|
| Sor × oszlop | 21 613 × 20 (19 jellemző + `price`), letöltöttem és megmértem |
| Hiányzó érték | nincs (összesen 0) |
| Eladási dátumok | 2014-05-02 – 2015-05-27 (az `date` oszlop szöveg: alakítsd dátummá) |
| Ár | átlag 540 088 USD, medián 450 000, maximum 7 700 000 (jobbra elnyúló); az eladások 6,8%-a 1 M USD fölött |
| Irányítószámok | 70 különböző (`zipcode`) |
| Különlegességek | `bedrooms` maximuma 33 (és 5 sor ≥ 10 hálószobával); `yr_renovated` 95,8%-ban 0 (nem „1-es évben felújított”, hanem hiányzó/nincs) |
| Ismétlődő ingatlanok | 392 sor osztozik azonos (`lat`, `long`, `sqft_living`, `sqft_lot`, `yr_built`, `zipcode`) kulcson, ez 195 ingatlan: valószínűleg **többször eladott házak**; ha véletlenszerűen vágsz, ugyanaz a ház a tanítóban és a tesztben is lehet |

**Tájékoztató előzetes mérések** (saját, nem a notebookban; teljes adat, véletlenszerű 3-fold CV, 3 seed, a lineáris modell irányítószám nélkül): XGBoost RMSE ≈ 120 ezer USD,
lineáris ≈ 203 ezer. Két lépcsőben bővítettem a jellemzőket: (1) kor, „felújított-e”, távolság a belvárostól (Seattle, Bellevue), `sqft_living / sqft_living15`; (2) ezek **plusz** egy „comps” jellemző (a **k = 20 legközelebbi**
eladás átlagos ár/m²-e a koordináták alapján, **csak a tanító adatból, a tanító sorokra önmaga nélkül**, és ez az ár/m² × `sqft_living`). Lineáris RMSE: ≈ 203 → 190 → **128 ezer**; XGBoost: ≈ 120 → 116 → **115 ezer**. A két lépcső hatását
nem választottam szét. Vagyis ezen az adaton a feature engineering a **lineáris** modellnek segít sokkal többet, mert a fa a koordinátákból már sokat kiolvas. Ez a házi egyik kérdése: **te találsz-e olyan jellemzőt, ami az XGBoostnak is segít?** Tipp: olyat keress, amit a fa nehezen tanul meg, mert **két oszlopból számolt** (hányados, különbség) vagy **elforgatott**
koordinátán él (pl. távolság a belvárostól). (Az előzetes mérés véletlenszerű vágással készült: az időrendi vágás számai eltérhetnek.)

## Mit kell tartalmaznia a notebooknak

1. **A kérdés és a célváltozó:** egy bekezdés. Mi a jósolt szám? Melyik hiba drágább: az alul- vagy a fölülbecslés? Ebből indokold a mutató(ka)t.
2. **EDA:** legalább két ábra; a célváltozó eloszlása (és mit kezdesz vele: log?).
3. **Tisztítás:** minden döntéshez egy indok (pl. a 33 hálószobás ház; a `yr_renovated` = 0; az irányítószám kategória, nem szám).
4. **A split előbb:** zárolt teszthalmaz. Az adat 13 hónapos: vedd fontolóra az **időrendi** vágást (és írd le, miért választod, vagy miért nem), és kezeld az ismétlődő ingatlanokat (ne kerüljön ugyanaz a ház tanítóba és tesztbe).
5. **Alapmodellek:** átlag; egy **naiv szabály** (pl. az irányítószám mediánja a tanítóból); **tisztességes lineáris modell** (log cél, irányítószám-dummyk, nem „egy szám az irányítószám”); plusz **legalább két** a következőkből: döntési fa, Random Forest, XGBoost. Ugyanazok a foldok mindenkinek.
6. **Mutatók:** legalább RMSE, MAE, egy arányos mutató (WAPE vagy RMSLE) és R²; írd le, melyik a fő mutatód, és miért. Ha a log-célt használod, mutasd meg a visszaalakítás torzítását (jósolt/tényleges összeg).
7. **Diagnosztika** a legjobb modell out-of-fold jóslatain, **legalább három** a következőkből, mindegyikhez két mondat arról, mit látsz és mit tennél: kalibráció (decilisek), reziduum vs becsült érték (tölcsér?), reziduum szegmensenként (irányítószám, ár-sáv, ház kora), **reziduum a térképen** (`lat`, `long` szerinti szóródás), lehetetlen jóslatok.
8. **Egy dokumentált visszacsatolási kör:** a diagnosztikából következő hipotézis, egy új jellemző, az eredmény **ugyanazokon a foldokon** (páros különbség foldonként ± szórás). **Legalább egy jellemzőt próbálj ki.** Ha nem segített, az is érvényes eredmény, ha őszintén leírod. **Tilos a szivárgás:** minden, ami a célváltozóból számolódik (célérték-átlag, „comps”), foldon belül, csak a tanítóból.
9. **A teszthalmaz egyszer:** add meg a bizonytalanságot is (pl. bootstrap konfidenciaintervallum az RMSE-re), és hasonlítsd az alapmodelledhez és a naiv szabályhoz. Ha van időrend, a bootstrap a kapcsolódó eladásokat ne szakítsa szét.
10. **Korlátok:** három őszinte mondat.

## Hogyan pontozunk

Az **indoklás** számít, nem a pontszám. Teljes pontot ér: nincs szivárgás, a mutatókat előre választottad, a diagnosztikából következik a jellemző, minden állítást szám támaszt alá, és világosan leírod, mi **nem** működött.
Alacsonyabb teszt-RMSE-ért nem jár többlet.

## Buktatók, amiket keresni fogunk

- Bármi, ami a célváltozóból tanul (célérték-átlag, „comps”, imputálás, skálázás), a **split előtt** vagy az egész adaton illesztve: szivárgás. Egy „comps” jellemző, amelyik a saját sort is beleszámolja, szintén szivárgás.
- Az irányítószám egyetlen **számként** a lineáris modellben (a 98 001 nem „nagyobb”, mint a 98 000).
- Egy gyenge lineáris baseline (nyers ár, dummyk nélkül), amelyet aztán „megver” a fa: nem tisztességes összehasonlítás.
- Modell- vagy mutatóválasztás a teszthalmazon.
- Ugyanaz az ingatlan a tanítóban és a tesztben.
- A nyers R² mint egyetlen mutató; a log-cél visszaalakítási torzításának figyelmen kívül hagyása.
- Egy különbség valódi javulásnak nevezése, miközben kisebb, mint a foldok közti szórás.

*(Miért ilyen a feladat? Az órán láttuk, hogy a „túl jó” szám a gyanú jele, és hogy a hiba szerkezete többet mond a mutatónál. A házi arról szól, hogy ezt a saját adatodon is megcsináld.)*
