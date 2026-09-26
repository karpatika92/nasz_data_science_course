# Üzleti analitika és cégértékelés (2×90 perc)

Oktatói jegyzet. **Ez MÁS formátum, mint a `lessons/` alatti workshopok**: itt
30-40 fős üzleti alapszakos hallgatóság van, egyszeri (nem féléves) alkalom,
és **frontális** előadás, nem szókratészi kiscsoportos munka. Ennek
következményei az órai stílusra:

- Az `ask`-diákon **ne várj** teljes csoportos vitát vagy páros megbeszélést —
  tedd fel a kérdést, adj 10-15 másodpercet, aztán **hívj fel 1-2 jelentkezőt**
  (vagy szólíts meg név szerint valakit, ha csend van), majd menj tovább.
- A hallgatóság már túl van matek/stat kurzusokon, DE ez nem statisztika óra —
  ha valaki a levezetés matematikai részletébe menne, tereld vissza az üzleti
  döntésre ("ez szép kérdés, beszéljük meg utána — mit jelent ez a cégnek?").
- Mindkét notebook **placeholder (szintetikus) adaton** fut egyelőre — lásd a
  notebookok tetején a figyelmeztetést. Ha a valós BigQuery-adat megjön, csak
  a CSV-ket kell cserélni, a kód és az órai menet nem változik.

**A teljes ív:** mi az adattudomány → üzleti analitika piramis →
checkers.com bemutatása → CLTV (1 előfizető értéke) → DAU Markov-előrejelzés
(hányan lesznek aktívak) → kohorsz-alapú előfizetőszám-előrejelzés (hányan
lesznek előfizetők) → vissza a nyitó kérdéshez: mennyit ér a cég?

---

## 1. rész (90 perc) — `session-1-alapok-es-cltv/slides.html`

| # | Téma | Perc | Kumulált |
|---|------|------|----------|
| 1 | Nyitó + mi az adattudomány (Venn-diagram) | 15 | 15 |
| 2 | Üzleti analitika piramisa | 15 | 30 |
| 3 | checkers.com bemutatása, a nyitó kérdés | 10 | 40 |
| 4 | CLTV — annuitás → perpetuitás → churn | 20 | 60 |
| 5 | CLTV — resubscription, zárt alak | 15 | 75 |
| 6 | Worked example (`demo_cltv.ipynb`) | 10 | 85 |
| 7 | Zárás, híd a 2. részhez | 5 | 90 |

Ha csúszik, vágj ebben a sorrendben:
1. **A resubscription 2×2-es rendszer levezetése (5. pont)** → csak a
   végeredményt (a zárt alak) és a π=0 ellenőrzést mutasd, a linearis
   egyenletrendszer felírását ugord.
2. **Worked example (6. pont)** → mutasd meg csak az eredményt (a CLTV
   számokat), a notebook részletes végigfuttatása helyett.

### 1. Nyitó + mi az adattudomány? (0–15 perc)

Kezdd a Venn-diagrammal (Drew Conway, 2010) — ez egy jól ismert, sokat idézett
ábra, valószínűleg páran már látták. **Kérdés a teremnek**: "Mi jut eszetekbe
arról, hogy 'adat'?" — hívj fel 1-2 embert, ne várj hosszú vitát.

Vezesd le: nyers adat → (struktúra+kontextus) → információ →
(döntésrelevancia) → **insight**. A záró állítás, amit hangsúlyozz: az
"adatvezérelt döntéshozatal" valójában insight-vezérelt döntéshozatalt
jelent, nem azt, hogy minél több számunk van.

### 2. Üzleti analitika piramisa (15–30 perc)

A piramis a sajátunk (nem másolat) — leíró/diagnosztikai/prediktív/
preskriptív, alulról felfelé nő az érték és a nehézség. Konkrét
checkers.com-példákkal illusztráld mind a 4 szintet (a diákon rajta vannak).

**Kérdés**: "A checkers.com melyik szinten áll ma egy adott döntésnél?" —
ha van valakinek tapasztalata egy hasonló cégnél (appok, előfizetéses
szolgáltatások), kérdezd meg konkrétan.

### 3. checkers.com bemutatása (30–40 perc)

Gyors, tényszerű bemutatás: online, havi (csak havi!) előfizetés, 2 árszint
(Alap/Prémium), nincs hirdetés, virálissá vált, most keres befektetőket.
**A nyitó kérdés, amit a következő 140 percben megválaszolunk**: mennyit ér a
cég?

### 4-5. CLTV (40–75 perc) — ez a nap technikailag legsűrűbb 35 perce

Menetrend: annuitás-felfrissítő (mértani sor) → perpetuitás (n→∞ határeset,
ELMOND a Lekdijk Bovendams holland örökjáradék-kötvény sztorit, ez mindig jól
megy) → churn beépítése (geometriai túlélés, E[hossz]=1/churn) → a zárt alak
levezetése → érzékenységvizsgálat (**a churn-derivált a kulcs pont**: minél
alacsonyabb már a churn, annál nagyobb az abszolút hatása egy további
csökkentésnek — ez egy konkrét, meglepő, memorizálható állítás).

Utána a resubscription-kiterjesztés: 2 állapot (Aktív/Lemorzsolódott), 2
érték-egyenlet, zárt alak. **Mindig mutasd meg a π=0 ellenőrzést** — ez
megmutatja, hogy a bonyolultabb formula tartalmazza az egyszerűbbet, ami
sokaknak megnyugtató.

### 6. Worked example (75–85 perc)

`demo_cltv.ipynb` — fusd le élőben, vagy ha nincs idő, mutasd az eredményt
(a notebook már le van futtatva, az outputok benne vannak). **Emeld ki**: a
zárt alak (állandó churn feltevéssel) és a numerikus (tényleges görbével
számolt) CLTV eltér egymástól — ez egy jó vitapont, hogy miért, és melyik a
"helyesebb".

### 7. Zárás (85–90 perc)

Recap + híd: "tudjuk, mennyit ér egy előfizető — most tudnunk kell, hányan
lesznek."

---

## 2. rész (90 perc) — `session-2-forecast-es-ertekeles/slides.html`

| # | Téma | Perc | Kumulált |
|---|------|------|----------|
| 1 | Recap | 5 | 5 |
| 2 | DAU/WAU Markov-modell — állapottér | 15 | 20 |
| 3 | Empirikus ráták (`demo_dau_markov.ipynb`) | 20 | 40 |
| 4 | Elmélet: miért van egyensúly? | 10 | 50 |
| 5 | Szezonalitás + forgatókönyv-tervezés | 20 | 70 |
| 6 | Előfizetőszám-előrejelzés (kohorszok) | 20 | 90† |
| 7 | Két út a cégértékeléshez, zárás | — | — |

†A táblázat 90 percnél kicsit túlfut (95) — ez szándékos puffer, mert a 3.
pont (empirikus ráták, live notebook) általában elcsúszik. Ha pontban kell
végezni, a 6. pontból a tier-upgrade/downgrade diszkussziót (a slide-ok
"vitatott pont" calloutja) rövidítsd egy mondatra.

Ha csúszik, vágj ebben a sorrendben:
1. **Szezonalitás-dekompozíció lépéseinek részletezése (5. pont)** → mutasd
   meg csak a before/after ábrát, a 4 lépést (nap-a-hetén → havi → trend →
   visszahelyezés) egy mondatban foglald össze.
2. **A Markov-lánc alaptételének 1906-os Puskin-történet** → kihagyható.

### 2. Állapottér (5–20 perc)

Hivatkozz a Duolingo blogposztra (blog.duolingo.com/growth-model-duolingo) —
ez a módszertan eredete, és a valós chess.com (itt "checkers.com" álnéven)
ezt implementálta. Mutasd a 4-node állapotdiagramot, majd hangsúlyozd: "Aktív
ma" maga is 4 alcsoport (új/jelenlegi/reaktivált/feltámasztott) — ez sokszor
meglepi őket, hogy ennyire granulárisan bontják a DAU-t.

### 3. Empirikus ráták (20–40 perc) — ez a nap technikailag legsűrűbb 20 perce

`demo_dau_markov.ipynb`: crosstab (state → next_state), a rátákat innen
olvassuk ki. **Mindenképp fusd le az ellenőrző assertet** (0 és 1 közötti
tartomány) — ez konkrétan idézi vissza a felhasználó saját "sose 100% fölött"
figyelmeztetését.

A "Ti jöttök" feladat (curr +2pp) **fontos csapda**: a heti növekedési RÁTA
alig változik, mert állandó új-felhasználó-beáramlás mellett a rendszer egy
fix SZINTHEZ konvergál, nem egy növekedési rátához — ezt a notebook explicit
ki is mondja. Ha valaki csak a growth rate-et nézné és "nincs hatása"
következtetést vonna le, ez pontosan a hiba, amit tanítani akarunk: **rossz
metrikát néztek**. A helyes összehasonlítás a végső DAU-SZINT (kb. +13%).

### 4. Elmélet: miért van egyensúly? (40–50 perc)

A Markov-láncok alaptétele (véges, irreducibilis, aperiodikus → stacionárius
eloszlás) + a csavar (exogén beáramlás → egyensúlyi növekedési RÁTA, nem
szint). Az 1906-os Puskin/Markov sztori jó, rövid becslés-történeti kitérő,
ha van rá idő.

### 5. Szezonalitás + forgatókönyvek (50–70 perc)

A before/after ábra (nap-a-hetén + havi dekompozíció) a valós checkers.com
módszertan — hangsúlyozd, hogy ez NEM szintetikus módszertan, csak a
bemutatáshoz használt idősor az (lásd terv "Nyitott pont" szakasza).

A forgatókönyv-chart a nap **egyik legjobb meglepetése**: egy szerény +1.5
százalékpontos napi megtartás-javulás 4 év alatt megelőzi a +40%-os
akvizíciós-növekedési forgatókönyvet. **Kérdezd meg, mielőtt megmutatod a
választ**: "Miért van ez így?" — a válasz: a megtartás minden nap, minden
MEGLÉVŐ felhasználóra hat, az akvizíció csak az aznapi új beáramlásra — ez a
klasszikus "compounding" érv retention-re alkalmazva.

Az egyensúly-TAM chart zárja: végtelen piac → egyensúlyi növekedési ráta;
véges piac → egyensúlyi szint. **Vitatott pont**: a valós chess.com is a
"végtelen piac" feltevéssel dolgozik hosszú távon — ez explicit döntés, nem
hanyagság, de egy befektetői pitchben ezt meg kell tudni védeni.

### 6. Előfizetőszám-előrejelzés (70–90 perc)

A kohorsz-modell: minden hónap egy új kohorszot indít (DAU-ból konvertálva),
minden kohorsz a saját tenure-jének megfelelő túlélési görbe szerint
morzsolódik (gyors churn az elején, majd lassul — "duration dependence").

`demo_subscriber_forecast.ipynb` utolsó cellája (**"Ti jöttök"**) a nap
záró szintézise: a meglévő kohorszok önmagukban ZSUGORODNAK (mert a legtöbb
kohorsz még a gyors lemorzsolódási szakaszban van), DE az új kohorszok
hozzáadása visszahozza (sőt meghaladja) a mai szintet. **Ez a lényeg**: a
folyamatos akvizíció nélkül a bázis zsugorodna, akármilyen jó is a
retenció a meglévőknél.

### 7. Két út a cégértékeléshez + zárás (90+ perc)

(a) explicit cash flow a kohorszokból, vagy (b) az 1. részben számolt CLTV
skálázása az új-előfizető-beáramlással. **Záró kérdés a teremnek**: "Ha
befektetők előtt kellene megvédenetek egyetlen feltevést a modellből,
melyiket választanátok?" — jó választások: a piacméret (TAM/TAMP), a
resub-ráta, vagy a tenure-görbe hosszú távú extrapolációja.
