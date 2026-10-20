# 4. házi feladat — Építs saját klasszifikátort

Válassz **egy** adatsort (lehetőleg mindenki mást), és építs rá bináris klasszifikátort. A beadandó **egyetlen notebook**.
Ugyanazt az utat járod be, mint az órán: nyers adat, EDA, tisztítás, modellek, egy visszacsatolási kör, hangolás, záró teszt.

Az adatsorok mind letölthetők bejelentkezés nélkül, az OpenML-ről:

```python
from sklearn.datasets import fetch_openml
df = fetch_openml(data_id=46911, as_frame=True).frame      # Bank Customer Churn
```

## Adatsorok

| Adatsor | OpenML `data_id` | Sor × oszlop | Pozitív arány | Amit **ellenőriztem** | Amit nem |
|---|---|---|---|---|---|
| Bank Customer Churn | 46911 | 10 000 × 11 | 20,4% | letöltöttem, a méretet és az arányt megmértem, nincs hiányzó érték | — |
| Online Shoppers (vásárlási szándék) | 46947 | 12 330 × 18 | 15,5% | letöltöttem, megmértem, nincs hiányzó érték | — |
| Give Me Some Credit | 46929 | 150 000 × 11 | 6,7% | letöltöttem, megmértem; a `MonthlyIncome` ~20%-a hiányzik | — |
| Telco Customer Churn | 42178 | 7 043 × 20 | 26,5% | csak az OpenML-listázás adata | nem töltöttem le; két OpenML-verzió van (42178, 45568), a listázás szerint csak a 45568-ban van hiányzó érték (11): ellenőrizd, melyikkel dolgozol |

A **pozitívak arányát az EDA-ban neked kell megmérni és leírni**.

**Tájékoztató előzetes mérések** (saját, nem a notebookban; teljes adat, 5-fold CV): az első háromnál az XGBoost erősen
veri a logisztikus regressziót, **de a feature engineering a fa-alapú modellnek ott nem segített, a lineárisnak igen**
(pl. Bank Churn: egyetlen `products ≥ 3` jelző a logisztikus PR-AUC-ját ~0,47-ről ~0,60-ra vitte). Ez a házi egyik
kérdése: **te találsz-e olyan jellemzőt, ami az XGBoostnak is segít?** Tipp: olyat keress, amely **két oszlopból számol**
(hányados, különbség), nem egyből.

## Mit kell tartalmaznia a notebooknak

1. **A kérdés és a célváltozó:** egy bekezdés. Mi a pozitív? Mibe kerül egy álriasztás, és mibe egy kihagyott pozitív?
2. **EDA:** legalább két ábra, és a célváltozó aránya.
3. **Tisztítás:** minden döntéshez egy indok; ha találtál hiányzás-mechanizmust, írd le. Kérdezd meg: a hiányzás **jel** vagy **szivárgás**?
4. **A split előbb:** zárolt teszthalmaz; írd le, hogyan osztottál (rétegzés, seed).
5. **Alapmodellek:** dummy és logisztikus regresszió, plusz **legalább két** a következőkből: döntési fa, Random Forest, XGBoost. Ugyanazok a foldok mindenkinek. A kódolást (one-hot vagy sorszám) indokold.
6. **Mutatók:** kiegyensúlyozott pontosság, PR-AUC, konfúziós mátrix, és a legkockázatosabb X% találati aránya egy választott küszöbnél. Írd le, miért **nem** a nyers pontosságra támaszkodtál.
7. **Egy dokumentált visszacsatolási kör** a tanító halmaz out-of-fold jóslatain: milyen hibákat néztél meg, mi volt a hipotézis, mit változtattál, mi lett az eredmény **ugyanazokon a foldokon** (páros különbség ± szórás). **Legalább egy új jellemzőt próbálj ki.** Ha nem segített, az is érvényes eredmény, ha őszintén leírod.
8. **Hangolás** a legjobb modellre, CV-n; az eredményt ellenőrizd olyan foldokon, amelyeket a keresés nem látott. Ha nem javult, tartsd meg az egyszerűbbet, és írd le.
9. **A teszthalmaz egyszer:** add meg a bizonytalanságot is (pl. bootstrap konfidenciaintervallum a PR-AUC-ra: ha nem ismered, nézz utána), és hasonlítsd az alapmodelledhez.
10. **Korlátok:** három őszinte mondat.

## Hogyan pontozunk

Az **indoklás** számít, nem a pontszám. Teljes pontot ér: nincs szivárgás, a mutatókat előre választottad, minden állítást szám
támaszt alá, és világosan leírod, mi **nem** működött. Magasabb teszt-pontszámért nem jár többlet.

## Buktatók, amiket keresni fogunk

- Bármi, ami az adatból tanul (imputálás, skálázás, **célérték-átlag kódolás**, mintavételezés), a **split előtt** vagy az egész adaton illesztve: szivárgás.
- Modell- vagy küszöbválasztás a teszthalmazon.
- A nyers pontosság mint fő mutató (a pontosság a hasznos küszöböt „bünteti”).
- Időbeli adatnál véletlenszerű vágás: a múltból kell jósolni a jövőre.
- Egy különbség valódinak nevezése, miközben kisebb, mint a foldok közti szórás.
- Egy üres cella eldobása vagy észrevétlen kitöltése, anélkül hogy megnéznéd, jelent-e valamit (és hogy nem szivárgás-e).

*(Miért ilyen a feladat? Az órán láttuk, milyen könnyű félrevezető számot kapni. A házi arról szól, hogy ezeket a saját adatodon már ne kövesd el, és ha mégis, vedd észre.)*
