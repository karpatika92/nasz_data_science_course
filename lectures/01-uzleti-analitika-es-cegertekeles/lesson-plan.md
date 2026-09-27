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
| 1 | Nyitó + mi az adattudomány (Venn-diagram) | 12 | 12 |
| 2 | Üzleti analitika piramisa + 4 nagy kérdés | 13 | 25 |
| 3 | Netflix — miért mozog ennyit egy árfolyam? | 10 | 35 |
| 4 | checkers.com bemutatása, nyitó kérdés, "miért nem 1 trendvonal" | 12 | 47 |
| 5 | CLTV — annuitás → perpetuitás → churn (+churn-görbe) | 20 | 67 |
| 6 | CLTV — resubscription (egyszerűsített levezetés) | 13 | 80 |
| 7 | Worked example (`demo_cltv.ipynb`) | 10 | 90 |
| 8 | Zárás, híd a 2. részhez | 5 | 95† |

†Ugyanaz a szándékos ~5 perces puffer, mint a 2. részben.

Ha csúszik, vágj ebben a sorrendben:
1. **A resubscription levezetés (6. pont)** → csak a végeredményt (V/(1−δᵍ),
   g=1/c+1/π) mutasd, a lépésenkénti indoklást (V ismert → átlagos epizódhossz
   → diszkontált ismétlődés) egy mondatban foglald össze.
2. **Worked example (7. pont)** → mutasd meg csak az eredményt (a CLTV
   számokat), a notebook részletes végigfuttatása helyett.

### 1. Nyitó + mi az adattudomány? (0–12 perc)

Kezdd a Venn-diagrammal (Drew Conway, 2010 nyomán, saját grafikával
újrarajzolva) — ez egy jól ismert, sokat idézett ábra, valószínűleg páran már
látták. **Kérdés a teremnek**: "Mi jut eszetekbe arról, hogy 'adat'?" — hívj
fel 1-2 embert, ne várj hosszú vitát.

Vezesd le: nyers adat → (struktúra+kontextus) → információ →
(döntésrelevancia) → **insight**. A záró állítás, amit hangsúlyozz: az
"adatvezérelt döntéshozatal" valójában insight-vezérelt döntéshozatalt
jelent, nem azt, hogy minél több számunk van.

### 2. Üzleti analitika piramisa + 4 nagy kérdés (12–25 perc)

A piramis a sajátunk (nem másolat) — leíró/diagnosztikai/prediktív/
preskriptív, alulról felfelé nő az érték és a nehézség. A 4 példakérdés most
egyenként, nagyban van kiírva (nem 2 oszlopba tömörítve) — hagyj időt, hogy
elolvassák, mielőtt továbblépnél.

**Kérdés a teremnek** (külön diaként): "A checkers.com decemberi első heti
churn-je 3-szor magasabb, mint az azt megelőző héten. Mi okozhatja ezt?" —
ez egy konkrét diagnosztikai-analitika gyakorlat; jó válaszok: szezonalitás
(karácsonyi/ünnepi minta), egy termékhiba bevezetése, árváltozás, egy
versenytárs promóció. Ne áruld el a "helyes" választ — a lényeg a
gondolkodásmód, nem egy konkrét válasz.

### 3. Netflix — miért mozog ennyit egy árfolyam? (25–35 perc)

Ez ÚJ szakasz, valós adaton (nem szintetikus!) — lásd a terv "Netflix-szekció"
pontját. Mutasd meg a 2022-es összeomlást (első előfizető-vesztés egy
évtizedben, ~−37% egy hét alatt), majd a 2023–2025-ös felfutást minden
korábbi csúcs fölé. **A tanulság, amit ki kell mondani**: egy előfizetéses
cég értékének nagy része a JÖVŐBELI cash flow-kban van, ami VÁRAKOZÁSOKON
alapul — ezért lesz tétje annak, amit ma hátralévő részben csinálunk (churn,
növekedés, piacméret-feltevések).

### 4. checkers.com bemutatása (35–47 perc)

Gyors, tényszerű bemutatás: online, havi (csak havi!) előfizetés, 2 árszint
(Alap/Prémium), nincs hirdetés, virálissá vált, most keres befektetőket.
**FONTOS**: a checkers.com egy DÁMA-cég (nem sakk!) — a "Dáma" magyarul.

**A nyitó kérdés, amit a következő 130 percben megválaszolunk**: mennyit ér a
cég? A válasz 3 építőkockán múlik (CLTV, DAU, előfizetőszám). **Itt jön a nap
egyik legfontosabb diája**: miért nem elég egyszerűen trendvonalat illeszteni
a múltbeli cash flow-ra? Mert 3 független becslés hibái nem korrelálnak
tökéletesen — a kombinált becslés robusztusabb. Ezt a gondolatot a 2. rész
legvégén idézzük vissza.

### 5. CLTV — alapok (47–67 perc) — ez a nap technikailag legsűrűbb 20 perce

Menetrend: annuitás-felfrissítő (mértani sor) → perpetuitás (n→∞ határeset,
ELMOND a Lekdijk Bovendams holland örökjáradék-kötvény sztorit, ez mindig jól
megy) → churn beépítése (geometriai túlélés, E[hossz]=1/churn) → **ÚJ: a
churn-görbe dia** (a churn nem állandó, gyors az elején majd lassul — ez
előrevetíti a 2. rész kohorsz-túlélési görbéjét) → a zárt alak levezetése →
érzékenységvizsgálat (**a churn-derivált a kulcs pont**: minél alacsonyabb
már a churn, annál nagyobb az abszolút hatása egy további csökkentésnek — ez
egy konkrét, meglepő, memorizálható állítás).

### 6. CLTV — resubscription (67–80 perc)

**Ez EGYSZERŰSÖDÖTT a korábbi verzióhoz képest** — nincs többé 2×2-es
lineáris egyenletrendszer a diákon. Az új logika: "ha már előfizető vagy, az
értéked V (ismert). Egy epizód (előfizetés + utána a visszatérésig tartó
várakozás) átlagosan g = 1/c + 1/π hónapig tart — FONTOS, hogy mindkét tag
benne van, ne csak a resub-várakozás! Amikor visszatér, újra V-t kap, csak
diszkontálva — ez megint egy mértani sor." Zárt alak: V/(1−δᵍ). **Mondd ki
explicit, hogy ez közelítés** (az átlagos hossz kezelése nem ugyanaz, mint a
pontos várható érték) — a notebook Monte Carlóval ellenőrzi az eltérést
(jellemzően 3-13%, mindig ugyanabba az irányba, ahogy π nő, az eltérés
csökken).

Zárd egy nyitott kérdéssel: "mi van, ha nem előfizetőből indulunk, hanem
regisztráltból?" — ez előrevetíti a 2. rész kohorsz-konverziós modelljét.

### 7. Worked example (80–90 perc)

`demo_cltv.ipynb` — fusd le élőben, vagy ha nincs idő, mutasd az eredményt
(a notebook már le van futtatva, az outputok benne vannak). **Emeld ki**: a
zárt alak (állandó churn feltevéssel) és a numerikus (tényleges görbével
számolt) CLTV eltér egymástól — ez egy jó vitapont, hogy miért, és melyik a
"helyesebb".

### 8. Zárás (90–95 perc)

Recap + híd: "tudjuk, mennyit ér egy előfizető — most tudnunk kell, hányan
lesznek."

---

## 2. rész (90 perc) — `session-2-forecast-es-ertekeles/slides.html`

| # | Téma | Perc | Kumulált |
|---|------|------|----------|
| 1 | Recap | 5 | 5 |
| 2 | Legegyszerűbb Markov-modell (2 állapot + egyensúly) | 10 | 15 |
| 3 | DAU/WAU Markov-modell — gazdagabb állapottér | 10 | 25 |
| 4 | Empirikus ráták (`demo_dau_markov.ipynb`) | 20 | 45 |
| 5 | Elmélet: miért van egyensúly? | 8 | 53 |
| 6 | Szezonalitás + forgatókönyv-tervezés | 18 | 71 |
| 7 | Előfizetőszám-előrejelzés (kohorszok) | 18 | 89 |
| 8 | Két út a cégértékeléshez, zárás | 6 | 95† |

†A táblázat 90 percnél kicsit túlfut (95) — ez szándékos puffer, mert a 4.
pont (empirikus ráták, live notebook) általában elcsúszik. Ha pontban kell
végezni, a 7. pontból a tier-upgrade/downgrade diszkussziót (a slide-ok
"vitatott pont" calloutja) rövidítsd egy mondatra.

Ha csúszik, vágj ebben a sorrendben:
1. **Szezonalitás-dekompozíció lépéseinek részletezése (6. pont)** → mutasd
   meg csak a before/after ábrát, a 4 lépést (nap-a-hetén → havi → trend →
   visszahelyezés) egy mondatban foglald össze.
2. **A Markov-lánc alaptételének 1906-os Puskin-történet** → kihagyható.

### 2. Legegyszerűbb Markov-modell (5–15 perc)

Csak 2 állapot (Aktív/Inaktív) + állandó napi regisztráció. **A cél**: minél
hamarabb megmutatni, hogy MÁR EZ is egyensúlyhoz vezet, mielőtt a
bonyolultabb, valós modellbe belemennétek — a flow-balance érv (c·Aktív =
π·Inaktív) egyszerű algebra, nem kell hozzá lineáris algebra vagy
sajátérték-számítás a diákoknak. A szimulációs ábra jól mutatja az érdekes
túllövés-majd-konvergencia dinamikát is — érdemes rákérdezni, miért lő túl.

### 3. Gazdagabb állapottér (15–25 perc)

Hivatkozz a Duolingo blogposztra (blog.duolingo.com/growth-model-duolingo) —
ez a módszertan eredete, és egy valós, nagy növekedésű social/mobile termék
publikus DAU-modellezési gyakorlatát követi. Mutasd a 4-node állapotdiagramot,
és kösd vissza az előző, egyszerű modellhez: "ugyanaz a logika, csak az
'Inaktív' most szét van bontva finomabb fokozatokra." Hangsúlyozd: "Aktív
ma" maga is 4 alcsoport (új/jelenlegi/reaktivált/feltámasztott) — ez sokszor
meglepi őket, hogy ennyire granulárisan bontják a DAU-t.

### 4. Empirikus ráták (25–45 perc) — ez a nap technikailag legsűrűbb 20 perce

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

### 5. Elmélet: miért van egyensúly? (45–53 perc)

A Markov-láncok alaptétele (véges, irreducibilis, aperiodikus → stacionárius
eloszlás) + a csavar (exogén beáramlás → egyensúlyi növekedési RÁTA, nem
szint). Az 1906-os Puskin/Markov sztori jó, rövid becslés-történeti kitérő,
ha van rá idő.

### 6. Szezonalitás + forgatókönyvek (53–71 perc)

A before/after ábra (nap-a-hetén + havi dekompozíció) a valós checkers.com
módszertan — hangsúlyozd, hogy ez NEM szintetikus módszertan, csak a
bemutatáshoz használt idősor az (lásd terv "Nyitott pont" szakasza).

A forgatókönyv-chart a nap **egyik legjobb meglepetése**: egy szerény +1.5
százalékpontos napi megtartás-javulás 4 év alatt megelőzi a +10%-os
akvizíciós-növekedési forgatókönyvet. **Kérdezd meg, mielőtt megmutatod a
választ**: "Miért van ez így?" — a válasz: a megtartás minden nap, minden
MEGLÉVŐ felhasználóra hat, az akvizíció csak az aznapi új beáramlásra — ez a
klasszikus "compounding" érv retention-re alkalmazva.

Az egyensúly-TAM chart zárja: végtelen piac → egyensúlyi növekedési ráta;
véges piac → egyensúlyi szint. **Vitatott pont**: az ökölszabály, amit a
diákon adunk — ha az elérhető piac mérete legalább 10-szerese a jelenlegi
méretnek, ésszerű "végtelennek" kezelni modellezési célra —, egy befektetői
pitchben megvédhető állításnak kell lennie, nem csak kényelmes feltevésnek.

### 7. Előfizetőszám-előrejelzés (71–89 perc)

A kohorsz-modell: minden hónap egy új kohorszot indít (DAU-ból konvertálva),
minden kohorsz a saját tenure-jének megfelelő túlélési görbe szerint
morzsolódik (gyors churn az elején, majd lassul — "duration dependence").

`demo_subscriber_forecast.ipynb` utolsó cellája (**"Ti jöttök"**) a nap
záró szintézise: a meglévő kohorszok önmagukban ZSUGORODNAK (mert a legtöbb
kohorsz még a gyors lemorzsolódási szakaszban van), DE az új kohorszok
hozzáadása visszahozza (sőt meghaladja) a mai szintet. **Ez a lényeg**: a
folyamatos akvizíció nélkül a bázis zsugorodna, akármilyen jó is a
retenció a meglévőknél.

### 8. Két út a cégértékeléshez + zárás (89–95 perc)

(a) explicit cash flow a kohorszokból, vagy (b) az 1. részben számolt CLTV
skálázása az új-előfizető-beáramlással. **Záró kérdés a teremnek**: "Ha
befektetők előtt kellene megvédenetek egyetlen feltevést a modellből,
melyiket választanátok?" — jó választások: a piacméret (TAM/TAMP), a
resub-ráta, vagy a tenure-görbe hosszú távú extrapolációja.

Az utolsó dia visszaköti a nap egészét az 1. rész elején feltett kérdéshez
("miért nem elég egy trendvonal") — ez a lecture fő tétele, érdemes szó
szerint felidézni: 3 független modell (CLTV, DAU, előfizetőszám), aminek a
hibái nem korrelálnak tökéletesen, ezért a kombinált becslés robusztusabb.
