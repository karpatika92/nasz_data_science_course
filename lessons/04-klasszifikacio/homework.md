# 4. házi feladat — Építs saját klasszifikátort

Válassz **egy** adatsort (lehetőleg mindenki mást), és építs rá bináris klasszifikátort.
A beadandó **egyetlen notebook**. Ugyanazt az utat járod be, mint az órán a Telco-adaton: nyers adat, EDA,
tisztítás, modellek, egy visszacsatolási kör, hangolás, záró teszt.

## Adatsorok

| Adatsor | Hol | Amit ellenőriztem | Amit nem |
|---|---|---|---|
| Bank Marketing | https://archive.ics.uci.edu/dataset/222/bank+marketing | 45 211 sor, célváltozó `y` (lekötött betét: igen/nem), CC BY 4.0 | a pozitívak aránya |
| Default of Credit Card Clients | https://archive.ics.uci.edu/dataset/350/default+of+credit+card+clients | 30 000 sor, célváltozó: nem fizetés (1/0), az oldal szerint nincs hiányzó érték | a pozitívak aránya |
| Adult / Census Income | https://archive.ics.uci.edu/dataset/2/adult | 48 842 sor, célváltozó: jövedelem > 50K, hiányzó értékek (workclass, occupation) | a pozitívak aránya |
| Give Me Some Credit | https://www.kaggle.com/c/GiveMeSomeCredit | csak a verseny címe | minden más (bejelentkezés, sorok száma, pozitívak aránya) |

**A pozitívak arányát az EDA-ban neked kell megmérni és leírni**; ne az én emlékezetemre építs.

**Megjegyzések:**
- **Bank Marketing:** van egy `duration` oszlop (a hívás hossza másodpercben). Az érvelés: ez az érték
  csak a hívás **után** ismert, ezért egy valós előrejelzésben nem használható. Döntsd el, megtartod-e, és **indokold meg**.
  (Ez a saját érvelésünk; az UCI-oldal ezt nem emeli ki.)
- **Adult:** ha a `sex` vagy `race` oszlopot használod, írj pár mondatot arról, miért érdemes ezen elgondolkodni.
- **Give Me Some Credit:** kaggle-fiók kell hozzá; ha nincs, válassz mást.

## Mit kell tartalmaznia a notebooknak

1. **A kérdés és a célváltozó:** egy bekezdés. Mi a pozitív? Mibe kerül egy álpozitív, és mibe egy álnegatív?
2. **EDA:** legalább két ábra, és a célváltozó aránya.
3. **Tisztítás:** minden döntéshez egy indok; ha találtál hiányzás-mechanizmust, írd le.
4. **A split előbb:** zárolt teszthalmaz; írd le, hogyan osztottál (rétegzés, seed).
5. **Alapmodellek:** dummy és logisztikus regresszió, plusz **legalább két** a következőkből: döntési fa, Random Forest, XGBoost. Ugyanazok a foldok mindenkinek.
6. **Mutatók:** kiegyensúlyozott pontosság, PR-AUC, konfúziós mátrix és precision@K egy választott küszöbnél. Írd le, miért **nem** a nyers pontosságra támaszkodtál.
7. **Egy dokumentált visszacsatolási kör** a train out-of-fold jóslatain: milyen hibákat néztél meg, mi volt a hipotézis, mit változtattál, mi lett az eredmény **ugyanazokon a foldokon**. Ha a változtatás **nem** segített, az is érvényes eredmény, ha őszintén leírod.
8. **Hangolás:** a legjobb modellre, CV-n; az eredményt ellenőrizd olyan foldokon, amelyeket a keresés nem látott.
9. **A teszthalmaz egyszer:** bootstrap konfidenciaintervallummal a PR-AUC-ra, és páros összehasonlítás az alapmodelleddel.
10. **Korlátok:** három őszinte mondat.

## Hogyan pontozunk

Az **indoklás** számít, nem a pontszám. Teljes pontot ér: nincs szivárgás, a mutatókat előre választottad, minden állítást szám támaszt alá,
és világosan leírod, mi **nem** működött. Magasabb teszt-pontszámért nem jár többlet.

## Buktatók, amiket keresni fogunk

- Újramintavételezés vagy imputálás a **split előtt** (ahogy az órán a 2. szándékos hibánál).
- Küszöb- vagy modellválasztás a teszthalmazon.
- A nyers pontosság mint fő mutató.
- Egy különbség valódinak nevezése, miközben kisebb, mint a foldok közti szórás.
- Egy mérőszámra optimalizálás anélkül, hogy megnéznéd, mi történik a többivel (ahogy az 1. szándékos hibánál).

*(Miért ilyen a feladat? Az órán két hibát szándékosan elkövettünk, hogy lássuk, milyen könnyű valóban elkövetni. A házi arról szól, hogy ezeket a saját adatodon már ne kövesd el, és ha mégis, vedd észre.)*
