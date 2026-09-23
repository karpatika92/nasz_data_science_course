# 2. óra — Gépi tanulás (90 perc)

Oktatói jegyzet, ugyanaz a formátum, mint az 1. óránál: időzítés, szókratészi
kérdések, tudománytörténet. A `slides.html` a vetített anyag.

**A mai óra végcélja:** hogy lássák, mi a *tényleges* különbség a hagyományos
statisztikai módszerek és a gépi tanulás között — nem a matek bonyolultsága,
hanem a **feltevések és a rugalmasság közti csere**, és ennek ára: az overfitting.

**Végigvitt példa:** a Kaggle Titanic adatsor (túlélés predikció) — mindenhol
ehhez térünk vissza, a lineáris modellektől a gradient boostingig.

---

## Időzítés (realisztikusan túlfut, mint az 1. órán)

| # | Téma | Perc | Kumulált |
|---|------|------|----------|
| 1 | Recap: lineáris & logisztikus regresszió | 5 | 5 |
| 2 | Bias-variance tradeoff & overfitting (polinom-illesztés) | 20 | 25 |
| 3 | Titanic adatsor bemutatása | 5 | 30 |
| 4 | Neurális hálók + gradient descent, learning rate | 12 | 42 |
| 5 | Support Vector Machine | 8 | 50 |
| 6 | Fa → Random Forest → Gradient Boosting | 20 | 70 |
| 7 | Modellösszehasonlítás a Titanicon | 12 | 82 |
| 8 | Stats vs. ML — mi változott? | 5 | 87 |
| 9 | Házi | 3 | 90 |

Ha csúszik (valószínű), vágj ebben a sorrendben:
1. **SVM (5. pont)** → 4 percre húzható: margó + support vector fogalmi
   szinten, a matek (kernel trükk) csak említés.
2. **Neurális háló AI-winter történeti kitérő** → egy mondatra húzható.
3. **Stats vs. ML záródiszkusszió (8. pont)** → ha nagyon szorul az idő, ez
   akár házi feladat gondolkodtatóként is kiadható.

---

## 1. Recap — lineáris & logisztikus regresszió (0–5 perc)

Gyors, csak felidézés: „Mit csinál a lineáris regresszió? Mit csinál a
logisztikus, és miért nem elég rá a lineáris (LPM)?" — hagyd, hogy ők mondják
vissza, ne te magyarázd újra.

---

## 2. Bias-variance tradeoff & overfitting (5–25 perc)

**Ne mondd ki a fogalmat előre.** Vetítsd ki (`demo.ipynb` / a gif-eket): pontok
egy zajos, enyhén hullámzó függvényből, és illessz rájuk polinomokat növekvő
fokszámmal (1, 2, 3, ... 15).

- Fokszám 1 (egyenes): látszik, hogy nem követi a pontokat — **alulillesztés**.
- Fokszám ~3-4: szépen követi a mintázatot.
- Fokszám 15: **áthalad szinte minden ponton**, de vadul kilengeni kezd a pontok
  között.

**Kérdés, mielőtt kimondod a szavakat:** „Melyik illesztés a 'legjobb'? Mi a baj
a 15-öd fokúval, ha egyszer minden ponton áthalad?"

Vezesd le: a magas fokszámú modell a **zajt** is megtanulta, nem csak a
mintázatot — ha új pontot húznál ugyanabból az eloszlásból, a 15-öd fokú modell
sokkal rosszabbul jósolna, mint a 3-4-ed fokú. Ez az **overfitting**.

Formalizálj: **bias** (mennyire téved rendszeresen a modell — az egyenes
magas biasú, mert nem tudja követni a görbét) vs. **variance** (mennyire
változna a modell, ha más mintát húznánk — a 15-öd fokú magas varianciájú,
mert két különböző zajos mintán teljesen más görbét adna). A kettő között
kell egyensúlyozni — innen a "tradeoff."

**A kérdés, amit mindenképp fel kell tenni:**

> Overfittelhet-e egy **lineáris regresszió**?

Hagyd, hogy vitatkozzanak — a legtöbben azt hiszik, overfitting csak "bonyolult"
modelleknél (neurális háló, mély fa) fordulhat elő. **A válasz: igen** — ha sok
feature-öd van a mintaméretedhez képest (pl. 10 adatpont, 8 feature), vagy ha
magas fokú polinom-tagokat adsz hozzá (ami technikailag még mindig *lineáris* a
paraméterekben!). Az overfitting nem egy algoritmuscsalád tulajdonsága, hanem a
**modell komplexitása és a mintaméret viszonyának** kérdése.

- 🌱-nak: „Ha 5 adatpontod van, és egy 4-ed fokú polinomot illesztesz rájuk, mi
  történik?" (tökéletesen átmegy mind az 5 ponton — nulla hiba, semmi
  általánosítás.)
- 🎓-nak: „Hogyan mérnéd meg számszerűen az overfittinget, ha nincs külön
  teszthalmazod?" (kereszt-validáció; regularizáció mint alternatíva a
  fokszám csökkentésére.)

**Tudománytörténet:** a "bias-variance dilemma" kifejezést Stuart Geman,
Elie Bienenstock és René Doursat formalizálta **1992-ben** egy híres cikkben
("Neural networks and the bias/variance dilemma") — pont azért, mert a kora
90-es évek neurálisháló-kutatói nem értették, miért teljesítenek rosszul néha
a nagyon rugalmas hálóik új adaton. A jelenség maga sokkal régebbi (lásd:
Gauss és a legkisebb négyzetek, előző óra), de a nevet és a formális keretet
csak itt kapta meg.

---

## 3. Titanic adatsor (25–30 perc)

Mutasd be gyorsan az oszlopokat: utasosztály, nem, kor, viteldíj, túlélt
(0/1). **Ez a mai óra végigvitt példája** — minden modellt ezen futtatunk.

**Történelmi kontextus (nem tudománytörténet, hanem a *téma* története):** 1912
április, a Titanic elsüllyed — a "nők és gyerekek előre" protokoll és az
osztálybeli egyenlőtlenségek (ki fért fel a mentőcsónakokba) **valódi,
történelmi torzítást** visznek az adatba. Ez jó belépő egy fél mondatos
megjegyzésre: a gépi tanulási modell **megtanulja és visszaadja** a történelmi
egyenlőtlenségeket, ha azok megjelennek az adatban — ez nem "hiba" a modellben,
hanem a modell pontosan azt csinálja, amire kérted (mintázatot tanulni).

---

## 4. Neurális hálók, gradient descent, learning rate (30–42 perc)

**Intuíció, ne matek:** egy neuron: bemenetek súlyozott összege + egy
nemlinearitás. Sok neuron, rétegekbe szervezve. A "tanulás" = a súlyok
állítása, hogy a hiba csökkenjen.

**Gradient descent — kérdés:** „Ha egy dombos tájon állsz köddel (nem látod a
teljes tájat), és le akarsz jutni a legmélyebb pontra, mit csinálnál?" →
vezesd le: nézd meg, merre lejt legjobban *itt*, lépj arra, ismételd. Ez a
gradient descent.

**GIF (`demo.ipynb`):** gradient descent egy hullámzó felületen, **3 különböző
learning rate-tel**:
- túl kicsi → örökké tart, alig mozdul,
- jó → szépen konvergál,
- túl nagy → **túllő a célon, oszcillál, vagy szétrobban.**

- 🌱-nak: „Miért nem állítjuk mindig a lehető legnagyobb learning rate-et, hogy
  gyorsabb legyen?" (túllövés, instabilitás.)
- 🎓-nak: „Mi történne egy nem-konvex felületen (mint egy valódi neurális
  hálónál)? Miért nem probléma a gyakorlatban annyira a lokális minimum, mint
  gondolnánk?" (magas dimenzióban a legtöbb kritikus pont nyeregpont, nem lokális
  minimum — csak említés szinten, ha van rá idő.)

**Tudománytörténet — egy teljes hullámvasút:**
- **1943**: McCulloch & Pitts — az első matematikai neuron-modell.
- **1958**: Frank Rosenblatt megépíti a Perceptront — a New York Times azt
  írja, hamarosan járni, beszélni, látni fog.
- **1969**: Minsky & Papert *Perceptrons* c. könyve megmutatja, hogy egyetlen
  perceptronréteg **nem tudja megtanulni az XOR-t** — ez (részben) elindítja
  az első "AI winter"-t, a finanszírozás kiszárad.
- **1986**: Rumelhart, Hinton, Williams publikálja a backpropagation
  algoritmust (bár a matematikai mag korábban is létezett) — újraindul a
  terület.

---

## 5. Support Vector Machine (42–50 perc, *vágható 4 percre*)

**Intuíció:** két osztály közé húzod a **legszélesebb lehetséges utcát**
(margót) — nem akármilyen elválasztó vonalat, hanem azt, ami a legtávolabb van
mindkét osztály legközelebbi pontjaitól (ezek a "support vector"-ok).

- 🌱-nak: „Miért a legszélesebb utcát akarjuk, nem csak egy tetszőleges
  elválasztó vonalat?" (jobban general izál, kevésbé érzékeny egy-egy határeset
  pontra.)
- 🎓-nak: „Mi történik, ha az osztályok nem választhatók szét egyenessel?"
  (kernel trükk — csak névként, nem vezetjük le.)

**Tudománytörténet:** Vladimir Vapnik és Alexey Chervonenkis a **Szovjetunióban**
dolgozta ki a statisztikai tanuláselmélet (VC-elmélet) alapjait már az
1960-70-es években — a hidegháború miatt évekig szinte visszhang nélkül
Nyugaton. Vapnik az USA-ba emigrált a Szovjetunió összeomlása után, és
**1995-ben**, a Bell Labs-nál Corinna Cortes-szal közösen publikálta a modern,
"soft margin" SVM-et — a szovjet elméleti matek és a nyugati gyakorlati gépi
tanulás összeérésének egyik legszebb példája.

---

## 6. Fa → Random Forest → Gradient Boosting (50–70 perc)

### 6a. Egyszerű döntési fa

Rekurzív particionálás: minden lépésben azt a kérdést teszi fel (pl. "nem =
férfi?"), ami a legjobban szétválasztja az osztályokat.

**GIF:** egyetlen fa döntési határa, ahogy a **mélység** nő (1, 2, 3... 8) —
ugyanaz a történet, mint a polinomnál: sekély fa alulillesztő, mély fa minden
egyes edzési pontot külön "skatulyáz be" — overfitting.

**Kérdés:** „Ez ismerős — hol láttunk ma már ugyanezt a mintázatot?" (a
polinom-fokszámnál — a fa mélysége itt a "komplexitás csavar.")

### 6b. Random Forest

**Kérdés, mielőtt levezeted:** „Ha egyetlen mély fa overfittel, mi lenne, ha
sok, egymástól kicsit *különböző* fát tanítanánk, és **átlagolnánk** a
predikcióikat?"

Vezesd le a két trükköt, amitől a fák tényleg különböznek:
1. **Bagging**: minden fa az adat egy véletlen, visszatevéses mintáján tanul.
2. **Random feature subset**: minden osztásnál csak a feature-ök egy véletlen
   részhalmazát nézi a fa.

**A kulcskérdés:** „Miért csökkenti az átlagolás a varianciát, ha az egyes fák
maguk overfittelnek?" — vezesd le: ha a fák hibái *nem korrelálnak
tökéletesen* egymással (mert más adaton, más feature-ökön tanultak), az
átlagolás kioltja a véletlen zajt, és csak a valódi mintázat marad. **Ezért
kell a fáknak *különbözőnek* lenniük** — ha mind ugyanazt az adatot, ugyanazokat
a feature-öket látná, az átlagolás nem segítene semmit.

- 🌱-nak: konkrét analógia — „Miért kérdezel meg 10 embert egy döntés előtt,
  ahelyett hogy csak egyre hallgatnál, még ha az az egy okos is?"
- 🎓-nak: „Mi történne, ha a fák tökéletesen korrelálnának egymással?" (az
  átlagolás semmit nem javítana a varianciát — a variancia-csökkenés mértéke a
  fák közti korrelációtól függ.)

**Tudománytörténet:** Leo Breiman — aki előtte évekig **statisztikai
tanácsadóként dolgozott az akadémián kívül**, mielőtt visszatért és forradalmasította
a területet — publikálta a "bagging"-et 1996-ban, majd 2001-ben a **Random
Forest** algoritmust, Tin Kam Ho korábbi (1995) "random subspace" ötletét is
beépítve.

### 6c. Gradient Boosting

**Más stratégia, ugyanaz a cél (sok gyenge tanuló → egy erős):** ahelyett, hogy
egymástól *független* fákat tanítanánk párhuzamosan (mint az RF-nél), itt
**egymás után**, szekvenciálisan tanítjuk őket — minden új fa a **előző fák
együttes hibáját (rezidum)** próbálja korrigálni.

**GIF:** ahogy nő a fák száma (boosting round), a predikció egyre jobban
követi az adatot — de **túl sok round után ez is overfittelni kezd** (megint
ugyanaz a komplexitás-történet, más csavarral: itt a "hány kört futtatunk" a
csavar, nem a fák mélysége).

- 🎓-nak: „Miért nevezzük *gradient* boostingnak — mi köze van a korábban
  látott gradient descent-hez?" (minden új fa a hibafüggvény gradiensének
  negatívja irányába lép — funkcionális gradient descent.)

**Tudománytörténet:** a kérdést — "lehet-e sok, egyenként gyenge tanulóból egy
erős tanulót építeni?" — Michael Kearns és Leslie Valiant vetette fel
elméletileg **1988-ban**. Robert Schapire és Yoav Freund válaszolt rá
gyakorlatban az **AdaBoost** algoritmussal (1995-96, később Gödel-díjat kaptak
érte). Jerome Friedman (igen, ugyanő, aki a CART-ot is jegyzi Breimannel) adta
meg **1999-2001** körül az általános "gradient boosting" keretet. A modern,
mindenhol használt implementáció, az **XGBoost** (Chen & Guestrin, 2016) azóta
Kaggle-versenyek tucatjait nyerte meg.

---

## 7. Modellösszehasonlítás a Titanicon (70–82 perc)

`demo.ipynb`: futtasd le egyben az összes modellt (logisztikus regresszió,
neurális háló, SVM, egyszerű fa, Random Forest, Gradient Boosting) ugyanazon a
Titanic train/test felosztáson, és nézzétek meg együtt a pontossági
táblázatot.

**Kérdés:** „Melyik nyert? Meglep-e valakit az eredmény?" (tipikusan a
fa-alapú módszerek — RF/GBM — viszik a Titanicon, mert az adat tele van
nemlineáris, kategorikus interakciókkal — pl. "nő ÉS 1. osztály" együtt sokkal
erősebb jelzés, mint külön-külön.)

**Kérdés:** „Melyik modellt választanátok, ha egy banki hitelbírálati
rendszert kellene építenetek, ahol meg kell tudni magyarázni az elutasítás
okát?" — vezesd be az **interpretálhatóság vs. teljesítmény** csereviszonyt
(lineáris regresszió/egyszerű fa: átlátható; RF/GBM/NN: fekete doboz).

---

## 8. Stats vs. ML — mi változott? (82–87 perc, *vágható, ld. fent*)

Zárókérdés, hagyd, hogy ők fogalmazzák meg: „A mai óra alapján, mi a
*tényleges* különbség a hagyományos statisztika (amit tavaly héten csináltunk)
és a gépi tanulás között?"

Vezesd oda, ha nem jön ki maguktól:
- **Feltevések**: a lineáris/logisztikus regresszió explicit feltevésekkel
  dolgozik (linearitás, függetlenség) — az ML-modellek rugalmasabbak, kevesebb
  feltevéssel, cserébe hajlamosabbak overfittelni.
- **Cél**: a hagyományos statisztika gyakran **inferenciáról** szól (mekkora és
  szignifikáns-e egy hatás?), az ML gyakran tisztán **predikcióról** (mennyire
  pontos az előrejelzés, mindegy hogyan jutott oda).
- **Interpretálhatóság vs. teljesítmény** — lásd fent.

---

## Házi feladat

Lásd: `homework.md`.

---

## Ötletek a következő órához (NEM ennek az órának a része)

- **Klasszifikációs metrikák mélyebben** (precision/recall, ROC/PR görbe) —
  ma csak pontosságot néztünk a Titanic-összehasonlításnál; a 3. óra
  esettanulmányához (konverzió előrejelzés) hasznos lenne egy fél mondat arról,
  hogy a pontosság félrevezető torz osztályok esetén.
- **Feature engineering** — a Titanic névmezőjéből (cím: "Mr.", "Miss.",
  "Master.") kinyerhető infó jó előzetes a 3. óra adat-wrangling részéhez.
