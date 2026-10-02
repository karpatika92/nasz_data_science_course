# Házi feladat — Hipotézisvizsgálat és A/B tesztelés

Két rész: (1) egy rövid, ellenőrzött forrás + reflexió, (2) gyakorlati
feladat a notebookon és a kísérletterv-sablonon.

## 1. rész — Források + reflexió

Csak azokat a forrásokat listázom, amiket ténylegesen ellenőriztem (megnyitva
vagy kereséssel megerősítve), nem tippeltem linkeket.

| Téma | Forrás | Link |
|---|---|---|
| Optional stopping / "peeking problem" | Evan Miller — "How Not To Run an A/B Test" | https://www.evanmiller.org/how-not-to-run-an-ab-test.html |
| Ötlet-rangsorolás (RICE keretrendszer) | Intercom — "RICE: Simple prioritization for product managers" | https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/ |

**Reflexió (4-6 mondat):**

1. Az Evan Miller cikk a "peeking problem"-et írja le — ugyanaz-e, amit az
   órán "optional stopping"-ként tárgyaltunk, vagy van eltérés a
   hangsúlyban? Vessétek össze a cikkben szereplő konkrét számot (hányszori
   peek mellett mennyire torzul a névleges szignifikancia-szint) az órán
   látott Armitage et al. (1969) 26%-os eredménnyel — ugyanazt a jelenséget
   írják le két különböző szögből?
2. A RICE-pontszám (Reach × Impact × Confidence ÷ Effort) és az órán közösen
   levezetett pontszám (Nettó konverzió/DAU ÷ Fejlesztői ráfordítás) között
   mi a kapcsolat? A RICE-ban külön szerepel egy "Confidence" (bizonyosság)
   tényező — a mi pontszámunkból ez hiányzik explicit módon. Hol bújik meg
   nálunk mégis a becslés bizonytalansága, és mi történne, ha egy csapat
   szisztematikusan túlbecsülné a hatást minden ötletére (gondoljatok
   vissza a "kalibráció" szekcióra)?

## 2. rész — Gyakorlati feladat

**A. Fejezzétek be a notebookot.** A `demo_hipotezisvizsgalat.ipynb` "Ti
jöttök" cellájában a "Lecke-ajánló" kísérletet kell kiszámolnotok a
`net_conversions_per_dau` függvénnyel, és beilleszteni a `results_df`
táblázatba a Streaks és a Puzzle v2 mellé. Írjatok 2-3 mondatot: hova
került a rangsorban, és ha a GameLeap vezetőségnek csak egyet
engedélyeznétek országos kiterjesztésre a három közül, melyiket
választanátok?

**B. Önálló kísérletterv — egy MÁSIK funkcióterületre.** Az órai
kiscsoportos munkában a csapatotok egyetlen funkcióterületet dolgozott ki
(Matchmaking / Tartalom / Tréning / Oktatás). Most, **egyedül**, töltsétek
ki az `experiment-design-doc-template.md` sablont egy **másik**
funkcióterületre — olyanra, amivel órán nem foglalkoztatok. Számoljátok ki
a nettó konverzió/DAU-t és a pontszámot, és írjatok 3-4 mondatot: hogyan
viszonyul ez az ötlet ahhoz, amit a csoportotok órán kidolgozott — ha
mindkettőt be kéne vinnetek a rangsorba, melyik nyerne?

*(Miért fontos ez? A kiscsoportos munka alatt könnyű csak egy
funkcióterületre fókuszálni — a valódi roadmap-építés viszont pont azért
nehéz, mert minden területről jönnek versengő ötletek, és azokat is
ugyanazzal a közös mérőszámmal kell összemérni.)*
