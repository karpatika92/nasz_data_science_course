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
