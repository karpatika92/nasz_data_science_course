# Data Science műhelykurzus

Egyetemi választható/műhelykurzus anyagai. Magyar nyelvű, szókratészi (vita-alapú)
felépítés — kevés frontális előadás, sok kérdés.

## Felépítés

Minden óra saját mappában, `lessons/<sorszám>-<téma>/`:

- `slides.md` — vetített anyag (Markdown, [Marp](https://marp.app/)-kompatibilis)
- `lesson-plan.md` — oktatói jegyzet: időzítés, szókratészi kérdések, várható
  válaszok, tudománytörténeti anyag
- `demo.ipynb` — órán kivetített élő kódos demók
- `homework.md` — házi feladat

## Órák

1. `01-statisztikai-alapok` — Monty Hall, Bayes-tétel, nagy számok törvénye, CLT,
   hipotézisvizsgálat, korreláció vs. kauzalitás, Simpson-paradoxon,
   dimenzió-átok, lineáris és logisztikus regresszió
2. *(tervben: gépi tanulás — bias-variance tradeoff, nem-lineáris modellek,
   Titanic-adatsor)*
3. *(tervben: analitika — adatvizualizáció, EDA, ügyfélérték-számítás)*

## Fejlesztői környezet

```bash
uv sync
uv run jupyter lab
```

A `slides.md` fájlokat [Marp](https://marp.app/) CLI-vel vagy VS Code Marp
kiegészítővel lehet prezentációvá renderelni.
