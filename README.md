# Data Science műhelykurzus

Egyetemi választható/műhelykurzus anyagai. Magyar nyelvű, szókratészi (vita-alapú)
felépítés — kevés frontális előadás, sok kérdés.

## Felépítés

Minden óra saját mappában, `lessons/<sorszám>-<téma>/`:

- `slides.html` + `slides-data.js` — vetített anyag, egy közös JS deck-motorral
  (`assets/deck/`) renderelve: billentyűzet/kattintás-navigáció, progress bar,
  fokozatos ("fragment") megjelenítés a szókratészi kérdésekhez
- `lesson-plan.md` — oktatói jegyzet: időzítés, szókratészi kérdések, várható
  válaszok, tudománytörténeti anyag
- `demo.ipynb` — órán kivetített élő kódos demók (némelyik generálja is a
  slide-okban használt gif-eket, a lecke saját `assets/` mappájába)
- `homework.md` — házi feladat

A `slides.html` egy sima statikus fájl — böngészőben nyitva (vagy
`python3 -m http.server`-rel kiszolgálva) working, nincs build lépés.

## Órák

1. `01-statisztikai-alapok` — Monty Hall, Bayes-tétel, nagy számok törvénye, CLT,
   hipotézisvizsgálat, korreláció vs. kauzalitás, Simpson-paradoxon,
   dimenzió-átok, lineáris és logisztikus regresszió
2. `02-gepi-tanulas` — bias-variance tradeoff (polinom-illesztés), neurális
   hálók, SVM, döntési fa → Random Forest → Gradient Boosting,
   modellösszehasonlítás a Titanic-adatsoron
3. *(tervben: analitika — adatvizualizáció, EDA, ügyfélérték-számítás)*

## Előadások (`lectures/`)

A `lessons/` mellett egy külön, top-level `lectures/` ág **más formátumú**
anyagokat tartalmaz: nem féléves, kiscsoportos szókratészi workshop, hanem
egyszeri, frontális előadás nagyobb (30-40 fős) hallgatóságnak. Ugyanazt a
deck-motort (`assets/deck/`) és fájlszerkezetet használja, de session-enként
külön `slides.html`/`slides-data.js` párral (mivel egy előadás több
alkalomra bomlik).

1. `01-uzleti-analitika-es-cegertekeles` (2×90 perc) — adattudomány
   alapjai, üzleti analitika piramis, majd három összefüggő esettanulmány egy
   fiktív ("checkers.com") előfizetéses cégen: CLTV (annuitás → perpetuitás →
   churn → resubscription), DAU-előrejelzés Markov-modellel (szezonalitás,
   forgatókönyv-tervezés, egyensúlyi növekedési ráta), és egy kohorsz-alapú
   előfizetőszám-előrejelzés — végül vissza a nyitó kérdéshez: mennyit ér a
   cég? Minden esettanulmányhoz tartozik egy notebook és egy (jelenleg
   `_PLACEHOLDER` jelzésű, szintetikus, BigQuery-jóváhagyásra váró) adatsor a
   `data/` almappában — lásd az adott lecke `lesson-plan.md`-jét a
   részletekért.
2. `02-hipotezisvizsgalat-es-ab-teszteles` (2×90 perc) — ugyanaz a fiktív
   checkers.com, egy fejezettel később: eladták, az új mandátum a web DAU
   duplázása 24 hónap alatt (lásd a lecke `business-case.md`-jét). 1. rész:
   CLT-felfrissítő, a hipotézisvizsgálat kerete, egy végigszámolt kétmintás
   arány-z-teszt, a három leggyakoribb hiba (p-hacking, multiple testing,
   optional stopping), majd egy közösen levezetett mérőszám (nettó
   konverzió/DAU), ami két, teljesen különböző elérésű kísérletet (egy
   mindenkit érintő, kis hatású és egy szűk, nagy hatású) tesz
   összehasonlíthatóvá. 2. rész: valódi kiscsoportos workshop — a
   hallgatók saját termékötleteket terveznek, kísérletterv-dokumentumot
   töltenek ki, és az előbbi mérőszámmal rangsorolva ütemtervet állítanak
   össze a mandátum alá.

## Fejlesztői környezet

```bash
uv sync
uv run python -m ipykernel install --user --name nasz-data-science-course \
  --display-name "Python (nasz-data-science-course)"
uv run jupyter lab
```

A kernel-regisztrációs lépés azért kell, hogy a notebookok a projekt saját,
`uv`-vel kezelt környezetében fussanak, ne egy véletlenül elérhető rendszer-
Python/anaconda alatt.
