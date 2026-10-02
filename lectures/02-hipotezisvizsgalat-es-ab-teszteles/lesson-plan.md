# Hipotézisvizsgálat és A/B tesztelés (2×90 perc)

Oktatói jegyzet. Ugyanaz a formátum, mint az 1. előadásnál (`01-uzleti-analitika-es-cegertekeles`):
30-40 fős üzleti alapszakos hallgatóság, egyszeri (nem féléves) alkalom. Az
`ask`-diákon **ne várj** teljes csoportos vitát — tedd fel a kérdést, adj
10-15 másodpercet, **hívj fel 1-2 jelentkezőt**, menj tovább. A hallgatóság
már túl van matek/stat kurzusokon és **az 1. előadáson is** — ismerik a
checkers.com-ot, de ma más a kérdés: nem "mennyit ér a cég", hanem "hogyan
duplázzuk meg a DAU-t". Ha valaki a matek levezetésébe menne bele mélyebben,
tereld vissza az üzleti döntésre.

**Kivétel a formátum alól: a 2. rész dereka valódi kiscsoportos munka**, nem
csak Szókratészi kérdés-felelet — lásd ott.

**A teljes ív:** mi történt a checkers.com-mal (eladták, DAU-duplázási
mandátum) → CLT-felfrissítő → hipotézisvizsgálat kerete → egy valós(szerű)
kísérlet végigszámolása → a leggyakoribb hibák (p-hacking, multiple testing,
optional stopping) → **közösen megtervezett mérőszám** (nettó
konverzió/DAU), ami összehasonlíthatóvá tesz két, teljesen különböző
kísérletet → a 2. részben ez lesz a közös valuta, amivel a hallgatók saját
ötleteiket rangsorolják egy ütemtervvé.

Minden szám (DAU, kísérleti eredmények) a `business-case.md`-ből jön vagy
arra épül — azt érdemes kiosztani/kivetíteni a nap elején.

---

## 1. rész (90 perc) — `session-1-hipotezisvizsgalat-es-metrikatervezes/slides.html`

| # | Téma | Perc | Kumulált |
|---|------|------|----------|
| 1 | Nyitás — mi változott, mi a mai mandátum | 5 | 5 |
| 2 | CLT — felfrissítő | 10 | 15 |
| 3 | Hipotézisvizsgálat kerete | 20 | 35 |
| 4 | Numerikus példa — "Gyorsított párkeresés" | 15 | 50 |
| 5 | A leggyakoribb hibák | 20 | 70 |
| 6 | Közös mérőszám-tervezés: nettó konverzió / DAU | 20 | 90 |
| 7 | Zárás, híd a 2. részhez | 5 | 95† |

†Szándékos ~5 perces puffer, mint az 1. előadásnál.

Ha csúszik, vágj ebben a sorrendben:
1. **Numerikus példa (4. pont)** → ne vezesd le táblán a pooled SE
   képletet lépésről lépésre, csak mutasd az eredményt (z≈1.49, p≈0.135) és
   a döntést.
2. **Multiple testing / FWER-tábla (5. pont egyik alpontja)** → egy
   mondatban foglald össze ("minél több tesztet futtatsz egyszerre, annál
   nagyobb eséllyel talál valamelyik véletlenül szignifikánsat"), a
   Bonferroni/BH-részletet hagyd ki.

### 1. Nyitás (0–5 perc)

Gyors emlékeztető a `business-case.md`-ből: a checkers.com-ot megvette a
GameLeap Holdings, a mandátum a web DAU duplázása 24 hónap alatt (200k →
400k). **Kérdés a teremnek**: "Ha ti vezetnétek a termékcsapatot, honnan
tudnátok meg, hogy egy változtatás TÉNYLEG működött, és nem csak véletlen
ingadozás egyik napról a másikra?" — ne áruld el a választ, csak vezesd be:
ez pontosan a hipotézisvizsgálat kérdése, és ma erről lesz szó.

### 2. CLT — felfrissítő (5–15 perc)

Csak a lényeg, nincs új anyag ehhez képest, amit egy stat-kurzuson már
láttak: $\bar X_n \approx \mathcal N(\mu, \sigma^2/n)$ nagy $n$-re, a három
feltétel (i.i.d., véges variancia, elég nagy $n$) egy táblázatban, és **miért
ez az A/B tesztelés motorja** — enélkül nincs z-teszt, nincs konfidencia-
intervallum. Egy mondat arról, hogy a checkers.com-metrikák egy része
(pl. egy feladvány megoldási ideje) erősen ferde eloszlású, ott a
"$n\geq30$ elég" ökölszabály megbízhatatlan.

### 3. Hipotézisvizsgálat kerete (15–35 perc) — ez a rész technikailag legsűrűbb 20 perce

Az öt lépés ($H_0$, $H_1$, $\alpha$ előre rögzítve, teszt-statisztika +
p-érték, döntés), a z-score definíciója, a p-érték definíciója **és az,
amit NEM jelent** (nem "$H_0$ igaz valószínűsége", nem "a hatás mérete").
Type I/Type II hiba tábla — **fordítsd le checkers.com-nyelvre**: Type I =
leszállítasz egy funkciót, ami valójában semmit nem csinál (elvesztegetett
fejlesztői idő, ami a 2 éves mandátumból vész el); Type II = elszalasztasz
egy valódi DAU-mozgató ötletet (lassabb út a duplázáshoz). **Kérdés a
teremnek**: "A mandátum alatt melyik hiba fáj jobban — az, hogy leszállítotok
valami hatástalant, vagy az, hogy elszalasztotok valami jót?" — jó válasz:
nincs egyértelmű jó válasz, ez erőforrás-korlát (4-5 párhuzamos kísérlet)
kérdése, ezért kell előre rögzített $\alpha$ és **power** (80% szabvány).

### 4. Numerikus példa — "Gyorsított párkeresés" (35–50 perc)

**A kísérlet**: csökken-e a párkeresés közbeni várakozás, ha gyorsabb a
matchmaking motor — mérve a sikeresen elindított partik arányán (akik
elkezdik a párkeresést, hányan jutnak el ténylegesen egy induló partiig).

| Csoport | $n$ | Sikeres indítás | $\hat p$ |
|---|---|---|---|
| Control (régi motor) | 40 000 | 36 400 | 91,00% |
| Treatment (gyors motor) | 40 000 | 36 520 | 91,30% |

Vezesd le (vagy mutasd a `demo_hipotezisvizsgalat.ipynb`-ből, ha nincs idő
táblán): pooled $\hat p = 91{,}15\%$, $\mathrm{SE}_{\text{pool}} \approx
0{,}2008\%$, $z \approx 1{,}49$, kétoldali $p \approx 0{,}135$.

**A csattanó**: $p = 0{,}135 > 0{,}05$ → **nem utasítjuk el $H_0$-t**. A
látszólag biztató +0,30pp különbség simán lehet véletlen ingadozás ennél a
mintaméretnél. **Kérdés a teremnek**: "Pénteken van a demo a GameLeap
vezetőségnek, ti vezetitek ezt a kísérletet, és ez jött ki. Mit tennétek
most?" — hagyd, hogy felmerüljenek az ösztönös válaszok ("nézzük meg csak
mobilon", "nézzük meg csak az új felhasználóknál", "fusson tovább, amíg
szignifikáns nem lesz") — **ne minősítsd még**, csak jegyezd meg táblán,
aztán menj a következő szekcióba: pont ezek a három ösztön a mai nap három
hibája.

### 5. A leggyakoribb hibák (50–70 perc)

**P-hacking**: pontosan azokat az ösztönöket vedd elő a 4. pontból, amiket a
terem mondott ("nézzük meg csak mobilon... csak az új usereknél... ship it!").
Számold ki velük együtt: 20 független alcsoport-teszt esetén, ha valójában
nincs hatás sehol, $P(\text{legalább 1 fals pozitív}) = 1-(1-0{,}05)^{20}
\approx 64\%$. **A csattanó**: a p-érték csak akkor kalibrált, ha a
hipotézist a adatok látása ELŐTT rögzítettétek.

**Multiple testing / FWER**: ugyanez más tesztek PÁRHUZAMOS futtatásakor —
ha a GameLeap mandátum miatt egyszerre 4-5 kísérlet fut, és mindegyiket
$\alpha=0{,}05$-tel nézitek, a család-szintű fals pozitív ráta már az 5.
tesztnél ~23%. Egy mondat Bonferroni ($\alpha' = \alpha/m$) és
Benjamini-Hochberg (FDR-kontroll, kevésbé konzervatív) nevéről, nem kell
levezetni.

**Optional stopping**: a harmadik ösztön ("fusson tovább, amíg szignifikáns
nem lesz") a legveszélyesebb, mert nem is érzi hibának. Mutasd az Armitage
et al. (1969) eredményt: tisztességes érmén, ha minden lépésnél megnézed a
p-értéket és leállsz az első $|z|>1{,}96$-nál, a névleges 5%-os hibaarány a
valóságban **26%**-ra nő. **A fix**: a mintaméretet előre rögzíteni (vagy
szekvenciális tesztet használni, ha tényleg kukkantani kell — ez külön
téma, csak említsd meg a nevét: SPRT, always-valid inference).

Zárd egy táblázattal (3 hiba, mi romlik el, mi a fix) — ugyanaz a szerkezet,
mint a Chess.com-os forrásanyagban, csak checkers.com-os kerettel.

### 6. Közös mérőszám-tervezés: nettó konverzió / DAU (70–90 perc) — a nap fő szintézise

**Ez a legfontosabb 20 perc, és ez a leginkább közösen levezetendő rész —
ne csak felolvasd a diákat, tényleg kérdezz.**

Mutasd be két, MÁR lefutott kísérlet nyers eredményét (csak a relatív
lift-et, a elérést még NE):

- **"Streaks" (napi sorozat-számláló, mindenkinek megjelenik)**: D30-
  visszatérési arány 42,0% → 42,6% (**+1,4% relatív**)
- **"Puzzle v2" (új, adaptív feladvány-algoritmus)**: D30-visszatérési
  arány 55,0% → 60,0% (**+9,1% relatív**)

**Kérdés a teremnek**: "Péntek van, egy prezentációs szlotot kaptok a
vezetőségnek, csak az egyik kísérletet tudjátok bemutatni mint a heti nagy
sikert. Melyiket választjátok?" — a terem valószínűleg a Puzzle v2-t
mondja (6x nagyobb relatív szám). **Ne cáfold még.**

Most tedd fel a csapda-kérdést: "Ez a szám kikre vonatkozik?" — majd fedd
fel az elérést: Streaks a DAU **100%-ának** (200 000 fő) jelenik meg, Puzzle
v2 csak a feladvány-funkciót használóknak, azaz a DAU **10%-ának**
(20 000 fő). **Kérdés a teremnek**: "Változtat ez a válaszotokon?"

Most építsétek fel KÖZÖSEN a képletet — kérdezz, ne mondd ki:
1. "Hogyan fejeznétek ki egy kísérlet TELJES, cégre nézett hatását, ha
   tudjátok a lift-et ÉS hogy kikre vonatkozik?" → vezesd a termet oda, hogy
   *nettó megnyert felhasználó = elért létszám × abszolút lift (pp-ben)*.
2. Számoltassátok ki mindkettőre: Streaks = 200 000 × 0,6pp = **1 200
   fő/nap**; Puzzle v2 = 20 000 × 5,0pp = **1 000 fő/nap**. Már itt
   megfordul a sorrend — hangsúlyozd a csendet a teremben, ha megtörténik.
3. "Ez egy abszolút szám. Miért nem elég ez önmagában, ha hónapok múlva egy
   MÁSIK kísérletet akartok összehasonlítani vele, ami épp akkor futott,
   amikor a DAU más volt, vagy a mobilplatformon futott?" → vezesd oda,
   hogy normálni kell egy közös nevezőre: a **teljes DAU-ra**.
4. Írjátok fel közösen a végső képletet:

$$\text{Nettó konverzió / DAU} = \frac{\text{elért létszám} \times \Delta p}{\text{teljes DAU}}$$

Mutasd meg az érdekes határesetet: **ha az elérés = 100% a teljes DAU-ból,
ez a képlet pont visszaadja az abszolút lift-et magát** — a Streaks-nél
ezért egyezik a 0,60% a bemeneti +0,6pp-vel.

**A végeredmény**: Streaks = 1 200 / 200 000 = **0,60%**; Puzzle v2 = 1 000
/ 200 000 = **0,50%**. A "lenyűgözőbb" kísérlet (+9,1% relatív) valójában
**kevesebb** nettó felhasználót hoz a cégnek, mint az "unalmas" (+1,4%
relatív), mert tízszer annyi embert ér el. Mutasd meg a
`net_conversions_per_dau.png` ábrát (a `demo_hipotezisvizsgalat.ipynb`
generálja).

**Záró szintézis, mondd ki expliciten**: ez a metrika pont azért jó közös
valuta, mert (1) különböző ELÉRÉSŰ kísérleteket hasonlít össze
helyesen, (2) különböző IDŐPONTBAN/PLATFORMON futó kísérleteket is, mert a
teljes DAU-hoz van normálva, nem egy abszolút számhoz, (3) közvetlenül a
vállalati cél (DAU) nyelvén beszél. **Ez lesz a 2. rész közös valutája.**

### 7. Zárás (90–95 perc)

Híd a 2. részhez: "most már tudjátok, hogyan döntitek el, hogy egy
kísérlet eredménye valódi-e, és hogyan mérhető úgy a hatása, hogy teljesen
más jellegű kísérleteket is össze tudtok hasonlítani vele. A 2. részben ti
találjátok ki a kísérleteket — és ugyanezzel a mérőszámmal fogjátok
rangsorolni az ötleteiteket egy ütemtervvé."

---

## 2. rész (90 perc) — `session-2-otlettol-utemtervig/slides.html`

**Formátum-eltérés a nap többi részéhez (és az 1. előadáshoz) képest: ez
VALÓDI kiscsoportos munka**, nem csak Szókratészi kérdés-felelet. Oszd a
termet **6-8, kb. 4-5 fős csoportra** a nyitás után — ha teheted, ügyelj
rá, hogy a 4 funkcióterület (Matchmaking, Tartalom, Tréning, Oktatás)
mindegyikére jusson legalább 1 csoport, vagy hagyd választani őket, de
biztasd a kevésbé "kézenfekvő" területeket (Oktatás, Tartalom) is, mert
magától mindenki a Matchmaking felé fog húzni (az a legnagyobb DAU-jú
funkció).

| # | Téma | Perc | Kumulált |
|---|------|------|----------|
| 1 | Recap + a mai feladat felvezetése | 5 | 5 |
| 2 | Kalibráció: a Streaks/Puzzle v2 számok mint viszonyítási pont | 8 | 13 |
| 3 | Ötletelés kiscsoportban | 20 | 33 |
| 4 | Kísérletterv-dokumentum — bemutató + csoportmunka | 25 | 58 |
| 5 | Rangsorolás: hatás ÷ fejlesztői ráfordítás | 10 | 68 |
| 6 | Ütemterv összeállítása | 12 | 80 |
| 7 | Csoport-megosztás (2-3 csoport) + szintézis | 10 | 90 |

Ha csúszik, vágj ebben a sorrendben:
1. **Csoport-megosztás (7. pont)** → 3 helyett csak 2 csoportot hallgass
   meg, a többit kérd be írásban/Slack-en utólag.
2. **Ötletelés (3. pont)** → 20 helyett 12 perc, és mondd ki explicit,
   hogy a cél MOST mennyiség, nem minőség — a szűkítés a 4. pontban jön.

### 1. Recap (0–5 perc)

Egy mondat: "Ma ti vagytok a termékcsapat. A mandátum: 200k → 400k web DAU,
24 hónap. Van egy közös mérőszámotok (nettó konverzió/DAU) és tudjátok,
hogyan kell egy kísérletet szigorúan kiértékelni. Most jön a nehezebb rész:
mit csináljatok, és milyen sorrendben?"

### 2. Kalibráció (5–13 perc)

Mutasd meg újra a Streaks/Puzzle v2 táblázatot, de most mint
**viszonyítási pontot**: "amikor a saját ötleteiteknél elérést és várható
hatást becsültök, ezek a számok (100%/10% elérés; +0,6pp/+5,0pp hatás)
legyenek a mérce arra, mi számít 'reálisnak'." **Fontos figyelmeztetés,
mondd ki**: a hallgatók hajlamosak minden saját ötletükre 20-30%-os
relatív hatást becsülni ("ez tuti bejön") — ez pont a mai nap elején látott
hiba (túlbecsült, naiv optimizmus). Kérj tőlük **konzervatív** becslést, és
kérdezd meg mindegyik csoporttól: "a Puzzle v2 +9,1%-a volt a nap 'nagy'
száma — a tiétek ennél nagyobb? Miért hinnétek el magatoknak?"

### 3. Ötletelés kiscsoportban (13–33 perc)

Csoportonként: 5 perc egyéni ötletelés (csendben, mindenki ír), majd 15
perc csoportos megosztás + szűrés **2-3 ötletre csoportonként**. Korlátok,
amiket ki kell vetíteni (a `business-case.md`-ből): **csak web platform**,
a csoport válasszon **1 funkcióterületet** (Matchmaking / Tartalom /
Tréning / Oktatás) a saját ötleteihez — ne szóródjanak szét mind a 4
területen egy csoporton belül.

### 4. Kísérletterv-dokumentum (33–58 perc)

Mutasd be a sablont (`experiment-design-doc-template.md`) **egy saját,
demo-ötleten**, amit a csoportok NEM használhatnak fel sajátként:

> **"Folytasd a leckét" emlékeztető** (Oktatás terület) — azoknak a
> felhasználóknak, akik elkezdtek, de nem fejeztek be egy leckét, egy
> emlékeztető banner jelenik meg a következő bejelentkezéskor.
> Becsült elérés: 10 000 fő/nap (félbehagyott leckés felhasználók, a teljes
> DAU 5%-a). Becsült hatás: D7-visszatérés +3pp (konzervatív, a meglévő
> push-infrastruktúrát újrahasznosítja). Fejlesztői ráfordítás: **S** (2
> hét). Becsült nettó konverzió/DAU = 10 000 × 0,03 / 200 000 = **0,15%**.

Ezután a csoportok 25 perc alatt kitöltik a sablont a saját 2-3 ötletükre:
mezők — ötlet neve, funkcióterület, hipotézis, becsült elért létszám (a
`business-case.md` DAU-bontásából induljanak ki), becsült hatás (pp és %
relatív), fejlesztői ráfordítás (S=1-2 hét / M=3-5 hét / L=6-8 hét),
**számolt nettó konverzió/DAU**. Járj körbe, és minden csoportnál kérdezd
meg: "honnan ez a becsült elérés-szám?" — sokan ki fogják hagyni ezt, és
puszta megérzésből fognak hatást becsülni.

### 5. Rangsorolás (58–68 perc)

Vezesd be a pontszámot:

$$\text{Pontszám} = \frac{\text{Nettó konverzió / DAU}}{\text{Fejlesztői ráfordítás (hét)}}$$

**Kérdés a teremnek, mielőtt kiszámoltatnád**: "Miért osztunk, és nem csak
rangsorolunk a nyers hatás szerint?" — jó válasz: 2 éves, véges fejlesztői
kapacitás mellett (4-5 párhuzamos kísérlet) a kérdés nem "mi a legnagyobb
hatás", hanem "mi hozza a legtöbb hatást az elkölthető idő arányában" —
ugyanaz a logika, mint egy befektetési portfólió választásánál (hozam a
kockázat/tőke arányában, nem abszolút hozam). Csoportok pontozzák a saját
2-3 ötletüket.

### 6. Ütemterv összeállítása (68–80 perc)

Gyűjtsd össze a táblára (vagy közös dokumentumba) **minden csoport**
legjobb pontszámú ötletét — ez adja a nyers rangsort. Beszéljétek meg:
hány ilyen kísérlet fér el 24 hónap alatt, ha egyszerre 4-5 fut és egyenként
2-8 hét? (Durva becslés: kb. 15-25 kísérlet összesen, hullámokban.)

**Zárd egy fontos, őszinte csavarral, kösd vissza az 1. előadáshoz**: a
nettó konverzió/DAU számok **nem adódnak** egyszerűen össze egy végső
DAU-számmá. Egy kísérlet, ami egy EGYSZERI visszatérési eseményt mér (mint
a mai két példa), egy múló kohorsz-hatás — nem biztos, hogy tartós
szint-emelkedést jelent. Ami TARTÓSAN összeadódik, az egy olyan
változtatás, ami a **megtartási görbét magát** tolja el (pont úgy, ahogy az
1. előadás CLTV-részében a churn-görbe lassulása composite hatású volt,
nem egyszeri). **Kérdés a teremnek**: "A mai két példa közül — Streaks
vagy Puzzle v2 — melyikről hinnétek el inkább, hogy TARTÓS
megtartás-javulás, nem csak egy 30 napos kohorsz-kiugrás?" — nincs
egyértelmű "helyes" válasz, a lényeg a gondolkodásmód.

### 7. Csoport-megosztás + szintézis (80–90 perc)

2-3 csoport mutassa be a top ötletét (1 perc/csoport: ötlet, becsült
pontszám, miért ez). Zárd a nappal: "ma megtanultátok eldönteni, hogy egy
eredmény valódi-e, mérni a hatását úgy, hogy összehasonlítható legyen más
kísérletekkel, és ebből ütemtervet építeni egy konkrét üzleti cél alá — ez
a teljes ív a 'van egy ötletem'-től a 'ez legyen a következő negyedév
roadmapje'-ig."
