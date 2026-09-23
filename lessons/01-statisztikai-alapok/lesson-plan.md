# 1. óra — Statisztikai alapok (90 perc)

Oktatói jegyzet: időzítés, szókratészi kérdések, várható válaszok, tudománytörténeti
anyag. A `slides.md` a vetített anyag, ez a fájl a "mit mondj / mit kérdezz" script.

**Csoport:** 10 fő, megosztva — kb. 5 fő közgazdász/statisztikus háttérrel (jelölés
alább: 🎓), kb. 5 fő kevesebb módszertani előképzettséggel (jelölés: 🌱). A kérdéseknél
mindkét szintre van variáns; hívj fel tudatosan vegyesen.

**A pedagógiai íve az órának:** minden témát *előbb* rossz/naiv intuícióval, egy
konkrét kérdéssel vagy játékkal nyitunk, és csak *utána* jön a formalizmus. A cél nem
az, hogy ők mondják ki a képletet elsőre — hanem hogy lássák, miért van szükség rá,
mert az intuíciójuk (vagy a híres tudósoké) tévedett.

---

## Időzítés (realisztikus, nem 90 percre jön ki — lásd a vágási pontokat!)

| # | Téma | Perc | Kumulált |
|---|------|------|----------|
| 1 | Monty Hall (nyitójáték) | 15 | 15 |
| 2 | Bayes-tétel | 10 | 25 |
| 3 | Nagy számok törvénye | 8 | 33 |
| 4 | Centrális határeloszlás-tétel | 12 | 45 |
| 5 | Hipotézisvizsgálat alapjai | 12 | 57 |
| 6 | Korreláció vs. kauzalitás | 8 | 65 |
| 7 | Simpson-paradoxon | 8 | 73 |
| 8 | Dimenzió-átok | 6 | 79 |
| 9 | Lineáris regresszió | 8 | 87 |
| 10 | Logisztikus regresszió (LPM-ből) | 10 | 97 |

**Ez 97 perc volt eredetileg — és azóta tovább nőtt.** Utólag bekerült: a Monty
Hall Bayes-tételes levezetése, a prior/likelihood/evidence/posterior szótár, a
nagy számok törvényének és a CLT-nek a formális kimondása, a checkers.com konkrét
A/B teszt + valódi p-érték, a Lady Tasting Tea kísérlet számszerű levezetése
(C(8,4)=70), a három-oksági-magyarázat diagram, és a regresszió-a-középhez
jelenség rendes levezetése. **Ez most már inkább egy "menü", amiből válogass, mint
egy percre pontos script** — a fenti táblázat sorrendje és aránya nagyjából
stimmel, de minden szakasz kb. 20-30%-kal hosszabb lett. Reális Szókratész-tempóban
ez mindig túlfut — ha az órán ez történik, ebben a sorrendben vágj:
1. **Dimenzió-átok (8. pont)** → 3 percre húzható: mondd ki a lényeget, ne nyisd meg
   vitának, csak linkeld előre a 2. órához (overfitting sok feature esetén).
2. **Simpson-paradoxon (7. pont)** → a Berkeley-sztori bemutatása maradjon, de a
   nyílt vita ("ti mit gondoltok, miért?") rövidüljön 3 percesre.
3. **Hipotézisvizsgálat Neyman–Pearson-történeti kitérője** → kihagyható, csak Fisher
   marad.
Ha ezek után is csúszik: a logisztikus regressziót (10. pont) át lehet vinni a 2. óra
elejére recap gyanánt — nem ideális, de nem tragédia, mert a 2. óra úgyis kezd egy
lineáris/logisztikus reggel-el.

---

## 1. Monty Hall — nyitójáték (0–15 perc)

**Ne mondj el semmit előre.** Rajzolj 3 ajtót a táblára (vagy 3 kártyát/poharat fizikailag,
ha van kellék). Játsszatok le 4-5 kört úgy, hogy te vagy a műsorvezető (tudod, hol a kecske),
egy-egy önkéntes választ ajtót, te felfeded az egyik rossz ajtót a maradék kettőből, és a
játékos dönt: vált vagy marad. **Írd fel a táblára az eredményeket** (váltott/nyert,
maradt/nyert), hogy legyen empirikus adat, mire a formalizmushoz érünk.

**Kérdezd meg a teljes csoportot szavazással, MIELŐTT bármit levezetnétek:**
„Ha te lennél a játékos — váltanál ajtót, vagy maradnál? Kezet fel."

Várd meg, hogy megosztott legyen a szavazat (általában az). Ez a lényeg: az intuíció
itt szinte mindenkit cserben hagy.

- 🌱-nak segítő kérdés: „Mennyi az esélye, hogy elsőre jól választottál 3 ajtóból? Ez
  változik-e attól, hogy a műsorvezető kinyit egy rossz ajtót, amiről *ő* előre tudta,
  hogy rossz?"
- 🎓-nak mélyítő kérdés: „Mi változna, ha a műsorvezető véletlenszerűen nyitna ajtót
  (és néha véletlenül a nyereményt fedné fel)? Ugyanaz-e a válasz?" (Nem — ez a kulcs,
  hogy a műsorvezető *tudása* viszi be az extra információt.)

**Tudománytörténet:** 1990-ben Marilyn vos Savant (a Guinness szerint akkoriban a
legmagasabb mért IQ-jú ember) leírta a helyes választ (válts ajtót!) a *Parade*
magazin rovatában. Kb. **10 000 olvasó** írt neki válaszlevelet, hogy téved — közülük
kb. **1000-en doktori fokozattal** rendelkeztek, néhányan matematikából. Erdős Pált,
a XX. század egyik legtermékenyebb matematikusát is csak egy számítógépes szimuláció
győzte meg. **Ez a lesson 1 központi üzenete: az intuíció itt szisztematikusan
téved, ezért kellenek formális eszközök — ez az egész óra ürügye.**

*(A `slides.html`-en a Monty Hall-diákon most már 3 ajtó is látszik vizuálisan —
ne csak mondd el, mutasd is.)*

**Híd a következő témához:** „Amit most csináltatok — új infó hatására megváltoztattátok
(vagy nem) a hitünket egy esemény valószínűségéről — pontosan ezt formalizálja a
Bayes-tétel."

---

## 2. Bayes-tétel (15–25 perc)

Ne a képlettel indíts. Vezesd le velük **alulról-fölfelé** a Monty Hall-on:
„Mi volt P(nyeremény az 1-es ajtó mögött)? Mi lett ez, miután megnyílt a 3-as ajtó?
Mi változott — az esemény, vagy a *tudásunk* róla?" Csak ezután írd fel formálisan:
P(A|B) = P(B|A)·P(A) / P(B).

**Utána azonnal vezesd le számszerűen magán a Monty Hall-on** (külön dia,
`slides.html`): a 3-as ajtó felnyitásának valószínűsége attól függ, hogy hol a
nyeremény — P(nyit 3|nyer 1)=1/2, P(nyit 3|nyer 2)=1, P(nyit 3|nyer 3)=0 — és
ebből Bayes-szel P(nyer 2|nyitotta a 3-ast) = 2/3. Ez az a pillanat, amikor a
diákok látják, hogy a formalizmus **pontosan visszaadja** a szimuláció (és a
táblás játék) eredményét — ne csak elvi szinten hagyd a Bayes-tételt, kösd
vissza a konkrét számokhoz.

**Fő diszkussziós példa** — most jön a *második*, önálló Bayes-példa (a
betegségteszt), ami már nem Monty Hall: a diákon van egy vizuális, területarányos
ábra is (3Blue1Brown-tól) a P(A|B) vs. P(B|A) szemléltetésére — érdemes rámutatni,
melyik terület melyik valószínűségnek felel meg, mielőtt a konkrét számokat
levezetitek. (klasszikus, direktbe kötődik a 2. órához):** ritka betegség,
prevalencia 1%, a teszt 99%-ban helyesen jelez pozitívat beteg esetén (szenzitivitás)
és 99%-ban helyesen jelez negatívat egészséges esetén (specificitás). Valaki pozitív
lesz — mekkora eséllyel *tényleg* beteg?

- Hagyd, hogy előbb **tippeljenek** (a legtöbben ~99%-ot mondanak — ez a "base rate
  fallacy").
- Vezesd le táblán: 10 000 emberből 100 beteg, abból 99 pozitív lesz; 9900 egészséges,
  abból ~99 hamis pozitív lesz. Tehát a pozitívak fele sem beteg valójában (~50%,
  pontosan 99/198).
- 🎓-nak: „Mi történne ezzel a számmal, ha a prevalencia 1‰ lenne?" (Még rosszabb —
  jó bevezetés, miért kritikus a "base rate" minden osztályozó kiértékelésénél, ezt a
  2. órán a klasszifikációs modellek kiértékelésénél élesben visszahozzuk.)
- 🌱-nak: „Mi a különbség aközött, hogy 'a teszt megbízható' és 'ha pozitív lettem,
  tényleg beteg vagyok'?" — a két állítás összemosása a leggyakoribb hiba, ezt hangosan
  nevezzétek meg.

**Tudománytörténet:** Thomas Bayes tiszteletes (1701–1761) sosem publikálta életében a
tételt — a barátja, Richard Price találta meg a jegyzetei közt és adta ki posztumusz,
1763-ban. Pierre-Simon Laplace néhány évtizeddel később **egymástól függetlenül újra
felfedezte**, és jóval általánosabb formában alkalmazta (pl. Párizs férfi/nő
születési arányának becslésére). A II. világháborúban Alan Turing és Jack Good
bayesi statisztikai módszerekkel ("Banburismus") törték fel a német Enigma-kódot
Bletchley Parkban — az egyik legkorábbi nagy horderejű, gyakorlati bayesi
alkalmazás.

---

## 3. Nagy számok törvénye (25–33 perc)

**Nyitókérdés (gambler's fallacy csapda):** „Feldobok egy szabályos érmét, és 8-szor
egymás után fej jön ki. Mennyi az esélye, hogy a 9. dobás írás?" Várd, hogy valaki
mondja: „nagyobb, mint 50%, mert 'esedékes' az írás." Ez a hiba — vitassátok meg,
miért 50% marad mindig (az érmének nincs memóriája).

**A tétel maga:** ha elég sokszor ismétled a kísérletet, a mintaátlag konvergál a
valódi várható értékhez — de ez **nem** azt jelenti, hogy a jövőbeli dobások
"kompenzálnak" a múltbeliekért, hanem hogy a múltbeli kilengés egyre kisebb súlyú
lesz egy egyre hosszabb sorozatban.

- 🌱-nak: „Ha 10 dobásból 8 fej jön ki, az azt jelenti, hogy csalás az érme?" (Nem
  feltétlenül — kis mintán a kilengés normális; ez már a hipotézisvizsgálat felé
  mutat.)
- 🎓-nak: „Miért *gyenge* törvény a nagy számok gyenge törvénye — mi különbözteti meg
  az erős változattól?" (konvergencia típusa: valószínűségben vs. majdnem biztosan —
  ha van idő, csak említsd meg, ne vezesd le.)

**Tudománytörténet:** Jakob Bernoulli bő 20 évig dolgozott a bizonyításon, és sosem
látta kiadva — az *Ars Conjectandi* (A sejtés művészete) című munkáját unokaöccse,
Nicolaus Bernoulli adta ki posztumusz, 1713-ban. Ez volt az első szigorú matematikai
bizonyítéka egy addig csak "minden szerencsejátékos által ösztönösen tudott" ténynek.

---

## 4. Centrális határeloszlás-tétel (33–45 perc)

**Nyitókérdés:** „Ha bármilyen — akár nagyon ferde, akár teljesen szabálytalan —
eloszlásból sokszor mintát veszek, és mindig kiszámolom a mintaátlagot, milyen alakú
lesz *ezeknek az átlagoknak* az eloszlása?" Hagyd, hogy tippeljenek, mielőtt
megmutatod a notebookot.

**Élő demó (`demo.ipynb`, CLT szekció):** vetítsd ki, ahogy egy erősen ferde
(exponenciális) eloszlásból vett minták átlagainak hisztogramja n növelésével egyre
inkább normális alakot vesz fel. Ez a lecke vizuális csúcspontja — hagyj rá időt.

- 🌱-nak: „Mi a gyakorlati jelentősége ennek? Miért jó hír, hogy a mintaátlagok
  normális eloszlásúak, ha maguk az adatok nem azok?"
- 🎓-nak: „Milyen feltétele van a CLT-nek? Mikor sérülhet (pl. végtelen szórás,
  erős autokorreláció)?"

**Híd a hipotézisvizsgáláshoz:** „Ez az oka annak, hogy a legtöbb hipotézisvizsgálat
működik: NEM az egyedi adatpontok eloszlásától függnek, hanem a mintaátlagok
kiszámítható (normális) viselkedésétől."

**Tudománytörténet:** Abraham de Moivre 1733-ban közelítette először a binomiális
eloszlást normálissal. Laplace általánosította. A szigorú, általános bizonyítást
Alekszandr Ljapunov adta 1901-ben — közel 170 évvel az első megsejtés után. Francis
Galton 1889-ben megépítette a "bean machine"-t (Galton-deszka) — egy fizikai
eszközt, ami golyók leejtésével *vizuálisan* demonstrálja a CLT-t; ma is kapható
játékként. Ha van rá mód, érdemes egy videót vetíteni róla (l. homework linkek).

*(A `slides.html`-en most már mindkét diának van saját ábrája: a kérdés-dián egy
tiszta Normal(μ,σ²) haranggörbe a formális kimondáshoz, a történeti dián pedig
Galton 1889-es eredeti quincunx-diagramja — ne csak szóban meséld, mutasd is.)*

---

## 5. Hipotézisvizsgálat alapjai (45–57 perc)

**Konkrét eset, ne elvont A/B teszt:** a checkers.com új regisztrációs oldalt
tesztel. Kontroll (A): 1000 látogatóból 84 regisztrált (8.4%). Új verzió (B): 1000
látogatóból 103 regisztrált (10.3%). **Nyitókérdés:** „Tényleg jobb az új oldal,
vagy ez csak véletlen ingadozás?"

Vezesd le: nullhipotézis (nincs különbség), alternatív hipotézis, p-érték.
**Explicit debunkolandó tévhit** (mondd ki hangosan, mert szinte mindenki rosszul
tanulja meg): a p-érték **NEM** "annak a valószínűsége, hogy a nullhipotézis igaz."
A p-érték: "milyen valószínű, hogy *legalább ilyen extrém* adatot látnék, HA a
nullhipotézis igaz volna." Ez a leggyakoribb hiba a szakirodalomban is.

**A checkers.com adatán (`demo.ipynb`, permutációs teszt): p = 0.170.** Ez
**nem** szignifikáns a szokásos 5%-os küszöbön — a megfigyelt +1.9 százalékpontos
különbség simán előfordulhat puszta véletlenből. Szándékosan nem "szép,
egyértelmű" eredményt választottam: ez a valósághű tanulság — a legtöbb A/B teszt
NEM hoz egyértelmű győztest, és pont ez a p-érték lényege.

- 🌱-nak: „Mi a különbség aközött, hogy 'statisztikailag szignifikáns' és
  'gyakorlatilag fontos'?" (nagy mintán apró, lényegtelen hatás is szignifikáns
  lehet.)
- 🎓-nak: „Mi az I. és II. típusú hiba, és milyen üzleti/etikai döntés van a
  szignifikanciaszint (α) megválasztása mögött?" (pl. gyógyszertesztnél máshogy
  súlyozzuk a hibákat, mint egy A/B tesztnél a weboldalon.)

**Tudománytörténet — "Lady Tasting Tea":** Ronald Fisher a Rothamsted kutatóállomáson
az 1920-as években egy kollégájával, Muriel Bristollal vitatkozott, aki állította,
hogy meg tudja mondani ízlelés alapján, a teát vagy a tejet töltötték-e előbb a
csészébe. Fisher erre tervezett egy randomizált kísérletet — ebből született meg a
modern szignifikanciavizsgálat kerete (*The Design of Experiments*, 1935).
**Csavart is érdemes megemlíteni:** Fisher kerete és a Jerzy Neyman + Egon Pearson
által (1933-ban) kidolgozott keret (alternatív hipotézis, I./II. típusú hiba) **nem
ugyanaz**, és a szerzőik évtizedekig vitatkoztak arról, mit is jelent valójában egy
szignifikanciateszt. A ma tanított "p < 0.05, elvetjük H0-t" recept valójában a két,
egymással vitázó iskola hibrid keveréke. (Jó Szókratész-pont: ha még a mezőt
megalapozó tudósok sem értettek egyet, nem szégyen kritikusan gondolkodni a
"p < 0.05" szabályról, nem kell vakon követni.)

**A kísérlet konkrét számai (mondd is el, ne csak a nevét):** Fisher **8 csészét**
készített — 4-et tej-előbb, 4-et tea-előbb módszerrel —, véletlen sorrendben adta
Bristolnak, akinek pontosan 4-4-re kellett szétválogatnia őket. Ha csak tippel,
C(8,4) = **70** féleképp választhatja ki a "tej-előbb" négyest — tehát 1/70
(≈1.4%) eséllyel találja el mind a nyolcat pusztán véletlenül. Bristol **mind a
8-at eltalálta.** Ez a lecke saját, kézzelfogható p-értéke — vezesd le a táblán,
ne csak mondd ki a végeredményt.

---

## 6. Korreláció vs. kauzalitás (57–65 perc)

Mutasd meg a Nicolas Cage-filmek és a fulladásos halálesetek grafikonját —
**ez valódi, publikált adat** (tylervigen.com, r = 0.559), nem kitaláció.
Nevettessétek el magatokat, aztán:

**Kérdés:** „Mi kellene ahhoz, hogy A okozza B-t, szemben azzal, hogy B okozza A-t,
vagy hogy egy harmadik C okozza mindkettőt?" A `slides.html`-en ezután megjelenik a
három forgatókönyv (közvetlen ok, fordított ok, közös ok) diagramként —
**kérd meg mindenkit, hogy mondjon egy-egy saját, valódi példát mindhárom
típusra**, mielőtt a fagylalt/hőség példát megmutatnád (az csak backup, ha
elakadnak).

- 🌱-nak: konkrét, hétköznapi példa kérése tőlük (pl. "fagylaltfogyasztás és
  vízbefulladás nyáron együtt nő" — a közös ok a meleg időjárás).
- 🎓-nak: „Milyen kísérleti vagy kvázi-kísérleti módszer különböztetné meg a
  korrelációt a kauzalitástól itt?" (RCT, instrumentális változó, diff-in-diff — csak
  említés szintjén, nem levezetés.)

**Tudománytörténet (fontos, mert árnyalt):** az 1950-es években dúlt a vita a
dohányzás és a tüdőrák kapcsolatáról. Ronald Fisher — akit épp az előbb mint a modern
statisztika atyját mutattunk be — **a dohányipar fizetett tanácsadójaként**
komolyan amellett érvelt, hogy egy meg nem figyelt genetikai konfounder
magyarázhatja mind a dohányzási hajlamot, mind a rákkockázatot, tehát a korreláció
nem bizonyít kauzalitást. **Ez szándékosan kényes példa: még a legnagyobb
statisztikusok is tévedhetnek (vagy elfogultak lehetnek), a tudomány nem tekintélyi
alapon dől el.** A kérdést végül Austin Bradford Hill 1965-ös kauzalitási
kritériumrendszere segített lezárni — több, egymástól független bizonyítékvonal
együttes mérlegelésével.

---

## 7. Simpson-paradoxon (65–73 perc)

**Mutasd meg ELŐSZÖR csak az összesített adatot, vita nélkül fedd fel a bontást:**
UC Berkeley, 1973 — az egyetem ellen nemi diszkriminációs pert indítottak, mert az
összesített felvételi arány férfiaknál magasabb volt, mint nőknél. Kérdezd meg:
„Ez bizonyítja a diszkriminációt?" Hagyd, hogy vitatkozzanak.

Utána mutasd meg a **tanszékenkénti** bontást: a legtöbb tanszéken a nők felvételi
aránya *egyenlő vagy magasabb* volt, mint a férfiaké — az összesített különbséget az
okozta, hogy a nők aránytalanul sok jelentkezést adtak be a legversenyzőbb (alacsony
felvételi arányú) tanszékekre.

- 🌱-nak: „Hogyan lehet, hogy minden alcsoportban jobb (vagy egyenlő) az arány, mégis
  összesítve rosszabbnak tűnik?" — rajzoljátok fel közösen egy 2×2-es toy példával.
- 🎓-nak: „Milyen adatgyűjtési/aggregálási döntés vezet ide, és hogyan védekeznél
  ellene elemzőként?" (mindig nézz szegmentált bontást is, ne csak összesítést.)

**A `slides.html`-en most már a konkrét számok is szerepelnek** (800 férfi/200 nő
az A, könnyű tanszéken; 200 férfi/800 nő a B, nehéz tanszéken; 60/65% ill. 30/35%
felvételi arány) — vezesd le a súlyozott átlagot a táblán is (54% vs. 41%
összesítve), ez teszi kézzelfoghatóvá, hogy a "paradoxon" pusztán számolási
súlyozás, nem rejtett diszkrimináció.

**Tudománytörténet:** a jelenséget már Karl Pearson (1899) és Udny Yule (1903) is
leírta — a hivatalos nevet mégis Edward H. Simpson 1951-es cikke után kapta, majd
Colin Blyth nevezte el "Simpson-paradoxonnak" 1972-ben. Vagyis a "Simpson-paradoxon"
igazából korábban ismert volt, mint Simpson cikke — jó apropó arra, hogy a
tudománytörténetben a névadás gyakran esetleges.

---

## 8. Dimenzió-átok (73–79 perc, *vágható 3 percre, ld. fent*)

Tartsd rövidre és fogalmi szinten: ahogy nő a dimenziók (feature-ök) száma, az adat
egyre "ritkábbá" válik a térben, és a távolságmértékek (pl. legközelebbi szomszéd)
egyre kevésbé informatívak, mert minden pont kb. egyformán távol kerül mindenki
mástól.

**Egyetlen kérdés, ha kevés az idő:** „Ha mindenki kb. ugyanolyan távol van tőled,
van-e még értelme annak, hogy 'legközelebbi szomszéd'?"

**Tudománytörténet:** a kifejezést Richard Bellman alkotta meg **1957-ben**, a
*Dynamic Programming* című könyvében — eredetileg **nem** statisztikai vagy
geometriai kontextusban, hanem azért, mert a dinamikus programozásban az
állapottér mérete exponenciálisan nő a dimenziók számával. A statisztika/gépi
tanulás csak később, a ritkás nagy-dimenziós terek problémájára vette át a
kifejezést. **Előremutatás a 2. órára:** ez az oka annak, hogy sok feature-rel
könnyű overfittelni.

---

## 9. Lineáris regresszió (79–87 perc)

Gyors, mert várhatóan a fele csoport már látta. Írd fel az egyenletet:
**y = β₀ + β₁x + ε**. Kérdezd meg, mielőtt te mondanád: „Mit jelent β₀? Mit jelent
β₁? Mi az ε?" — β₀ a tengelymetszet (predikció x=0-nál), β₁ a meredekség (mennyit
változik y, ha x eggyel nő), ε a hiba/reziduum (amit a modell nem magyaráz meg).
Vezesd le a legkisebb négyzetek elvét: keressük azt az egyenest, ami minimalizálja
a hibák **négyzetösszegét**.

**`demo.ipynb`/`slides.html` ábra:** illesztett egyenes + néhány pont
reziduumvonala kiemelve (y = ŷ + ε vizuálisan szétbontva) + a modell **R²**-je
kiírva. Mondd ki: R² = a kimenet varianciájának hányad része magyarázható a
modellel, 0 és 1 között.

**Kérdés (jó szintkülönböztető):** „Miért a hiba *négyzetét* minimalizáljuk, nem az
abszolút értékét?"
- 🌱 szintű válasz: a nagy hibákat aránytalanul jobban bünteti, és mindig pozitív.
- 🎓 szintű válasz: differenciálható mindenhol (szemben az abszolút értékkel),
  zárt alakú megoldás létezik, és MLE-ként adódik normális eloszlású hibák
  feltevése mellett.

**Regresszió a középszerűséghez — vezesd le rendesen, ne csak nevezd meg:**
Galton észrevette, hogy a magas szülők gyerekei átlagosan alacsonyabbak a
szülőknél, az alacsony szülők gyerekei pedig magasabbak. **Kérdés:** „Ez azt
jelenti, hogy a populáció idővel 'ellaposodik'?" — **Nem.** Ha egy mérés részben
véletlenből (zajból) is áll, egy szélsőséges megfigyelés részben szerencse — egy
megismételt/kapcsolódó mérés valószínűleg kevésbé lesz szélsőséges, **anélkül,
hogy bármi oksági történne**. Ez pusztán statisztikai artefaktum, nem valódi
"visszahúzó erő". **Konkrét, relatable példa:** egy kiemelkedő rookie szezon után
a legtöbb sportoló "visszaesik" a következő évben ("sophomore slump") — nem mert
rosszabb lett, hanem mert a kiugró első szezon részben szerencse volt. Ugyanez:
egy kiváló vizsgaeredmény után a következő vizsga valószínűleg "gyengébb" lesz,
anélkül hogy bármit rosszul csinálnál.

**Tudománytörténet:** magát a "regresszió" szót Francis Galton adta a
jelenségnek 1886-ban — "regresszió a középszerűséghez" (ma: "regresszió az
átlaghoz"). Magát a legkisebb négyzetek módszerét Adrien-Marie Legendre publikálta
először (1805), de Carl Friedrich Gauss azt állította, ő már 1795 óta használta —
az elsőbbségi vita mindmáig lezáratlan. Gauss híres demonstrációja: 1801-ben a
legkisebb négyzetek módszerével **helyesen megjósolta**, hol fog újra feltűnni az
égen a Ceres törpebolygó, miután Giuseppe Piazzi felfedezése után az égitest a Nap
mögé került és "elveszett" — ez volt a módszer első nagy, látványos gyakorlati
igazolása.

---

## 10. Logisztikus regresszió — a lineáris valószínűségi modellből (87–97 perc)

**Ne a logisztikus regresszióval indíts.** Kérdezd meg: „Bináris kimenetet
(igen/nem) szeretnétek megjósolni — mondjuk, hogy egy felhasználó lemorzsolódik-e.
Miért ne futtatnátok le rajta egyszerűen a most tanult lineáris regressziót?"
Hagyd, hogy megpróbálják — ez a **lineáris valószínűségi modell (LPM)**.

**Notebook demó:** vetítsd ki, hogy az LPM predikciói **0 alá és 1 fölé** mennek —
ilyenkor mit jelent egy "-12%-os" vagy "140%-os" esélyt? Ez konkrétan, vizuálisan
mutatja meg a problémát, nem csak elméletben.

**Kérdés:** „Milyen függvény tudná a lineáris predikciónkat mindig [0,1] közé
szorítani, bármi is legyen a bemenet?" Hagyd, hogy javasoljanak (pl. levágás,
normalizálás) — majd mutasd meg, miért jobb egy sima, S-alakú (szigmoid) függvény.

- 🌱-nak: intuíció szinten elég, hogy "van egy görbénk, ami sosem megy 0 alá vagy 1
  fölé."
- 🎓-nak: „Mi történik ilyenkor a hibatag varianciájával az LPM-ben, és miért sérti
  ez a lineáris regresszió alapfeltevéseit (homoszkedaszticitás)?"

**Tudománytörténet:** maga a **logisztikus függvény** száz évvel a regressziós
alkalmazása előtt született: Pierre François Verhulst belga matematikus vezette be
az 1830-40-es években, hogy a **korlátozott** népességnövekedést modellezze (szemben
Malthus korlátlan, exponenciális modelljével) — innen a "logisztikus" név. A
logisztikus *regressziót* statisztikai módszerként David Cox dolgozta ki 1958-as
cikkében ("The Regression Analysis of Binary Sequences").

**Zárás (utolsó ~3 perc):** „Ma egy lineáris modellt egy nem-lineáris
transzformációval bővítettetek ki — jövő héten innen indulunk, és rendesen
nem-lineárissá válunk."

---

## Házi feladat

Lásd: `homework.md`.

---

## Ötletek a következő órákhoz (NEM ennek az órának a része — csak jelzés)

Ezeket **nem** vettem fel az órai anyagba, mert szétfeszítenék a 90 percet, de
érdemes lehet egy fél oldalas "0. dia" jellegű összefoglalóban vagy a házi
kiegészítéseként megemlíteni, mert a 2. és 3. óra rájuk épít:

- **Várható érték és szórás** — kell a 2. óra bias-variance tradeoffjához és a
  3. óra CLTV-számításához (annuitás/perpetuitás jelenértéke várható értékek
  összege).
- **Populáció vs. minta** megkülönböztetése — implicit már ott van a nagy
  számok törvényénél és a CLT-nél, de explicit kimondása segítene.
- **Standard hiba / mintavételi eloszlás** — a CLT és a hipotézisvizsgálat közti
  hidat erősítené, ha külön kimondanátok, hogy a hipotézisvizsgálat pontosan a
  mintaátlag mintavételi eloszlására épül.
- **Alapvető eloszlások szótára** (Bernoulli, binomiális, normális) — egységes
  szókincs, ami a logisztikus regressziónál (Bernoulli-kimenet) és a 3. óra
  konverziós/churn-görbéinél is előjön.
