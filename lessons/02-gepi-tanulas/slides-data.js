window.LESSON_LABEL = "2. óra · Gépi tanulás";

window.SLIDES = [
  {
    type: "title",
    eyebrow: "Data Science műhelykurzus",
    title: "Gépi tanulás",
    kicker: "Mi a tényleges különbség a hagyományos statisztika és a gépi tanulás között?",
    note: "Kárpáti András · 2. óra",
  },
  {
    type: "content",
    eyebrow: "Recap",
    title: "Múlt héten",
    blocks: [
      { kind: "ask", label: "Mondjátok vissza", html: "Mit csinál a lineáris regresszió? Miért nem elég a logisztikushoz a lineáris valószínűségi modell (LPM)?" },
    ],
  },

  // ---------------- Bias-variance ----------------
  { type: "divider", index: "01", eyebrow: "A mai óra fő pontja", title: "Bias-variance tradeoff" },
  {
    type: "content",
    eyebrow: "Overfitting",
    title: "Mi az overfitting (túlillesztés)?",
    blocks: [
      { kind: "text", html: "Amikor a modell nem csak a valódi mintázatot tanulja meg, hanem a <strong>tanuló adat véletlen zaját is</strong> — ezért kiválóan teljesít a tanuló adaton, de rosszul az újakon." },
      { kind: "text", step: 1, html: "Nézzük meg élőben, hogyan néz ki ez, ha egyre bonyolultabb modellt engedünk ugyanarra az adatra." },
    ],
  },
  {
    type: "content",
    eyebrow: "Overfitting",
    title: "Polinom illesztés, növekvő fokszámmal",
    visual: { kind: "image", src: "assets/polynomial_overfit.gif", alt: "Polinom illesztés animáció", caption: "→ demo.ipynb — élőben futtatva" },
    blocks: [
      { kind: "ask", step: 1, html: "Melyik illesztés a „legjobb”? Mi a baj a magas fokszámúval, ha egyszer minden ponton áthalad?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Overfitting",
    title: "Honnan tudjuk, melyik a legjobb?",
    blocks: [
      { kind: "ask", html: "Ha csak ránézünk a görbékre — honnan tudjuk objektíven, melyik illesztés a „legjobb”?" },
      { kind: "text", step: 1, html: "Nem a tanuló adaton mérünk. Félreteszünk egy részt a modellépítés <strong>előtt</strong>, amit a modell sosem lát tanuláskor — ez a <strong>holdout / teszt halmaz</strong>. A „legjobb” modell az, amelyik ezen teljesít a legjobban." },
    ],
  },
  {
    type: "content",
    eyebrow: "Overfitting",
    title: "A teszthiba egy ponton túl nő",
    visual: {
      kind: "image-sequence",
      items: [
        { step: 0, src: "assets/train_test_error_by_degree.png", alt: "Tanuló és teszt hiba a polinom fokszáma szerint, log skálán", caption: "→ demo.ipynb — a mi konkrét példánk" },
        { step: 1, src: "assets/bias_variance_conceptual.png", alt: "Bias-variance felbontás elvi ábrája", caption: "ugyanez, elvi ábrán: bias² + variance = teljes hiba" },
      ],
    },
    blocks: [
      { kind: "text", html: "Tanuló hiba: monoton csökken. Teszt hiba: egy pont után <strong>drasztikusan nő</strong> — nyolc nagyságrenddel a 7. és a 14. fokszám között." },
      { kind: "text", step: 1, html: "<strong>Bias</strong>: mennyire téved rendszeresen a modell. <strong>Variance</strong>: mennyire változna, ha más mintát húznánk. A kettő között kell egyensúlyozni." },
    ],
  },
  {
    type: "content",
    eyebrow: "Overfitting",
    title: "A kérdés, amit fel kell tenni",
    blocks: [
      { kind: "ask", label: "A kérdés", html: "Overfittelhet-e egy lineáris regresszió?" },
      { kind: "tension", step: 1, label: "A válasz: igen", html: "Ha sok feature-öd van a mintaméretedhez képest, vagy magas fokú polinom-tagokat adsz hozzá — ami technikailag még mindig <em>lineáris a paraméterekben</em>. Az overfitting nem egy algoritmuscsalád tulajdonsága, hanem a <strong>modell komplexitása és a mintaméret viszonyának</strong> kérdése." },
      { kind: "plaque", step: 2, year: "1992", html: "Geman, Bienenstock & Doursat formalizálja a „bias-variance dilemma” fogalmát — a kora 90-es évek neurálisháló-kutatói nem értették, miért teljesítenek rosszul néha a nagyon rugalmas hálóik." },
    ],
  },

  // ---------------- Titanic ----------------
  { type: "divider", index: "02", eyebrow: "Végigvitt példa", title: "Titanic" },
  {
    type: "content",
    eyebrow: "Titanic adatsor",
    title: "1912. április",
    blocks: [
      { kind: "text", html: "Utasosztály, nem, kor, viteldíj → túlélt (0/1). A „nők és gyerekek előre” protokoll és az osztálybeli egyenlőtlenségek <strong>valódi, történelmi torzítást</strong> visznek az adatba." },
      { kind: "ask", step: 1, html: "Ha a modell megtanulja és visszaadja ezt a torzítást — az a modell hibája, vagy pontosan azt csinálja, amire kértük?" },
    ],
  },

  // ---------------- Neural networks ----------------
  { type: "divider", index: "03", eyebrow: "Nem-lineáris modellek", title: "Neurális hálók" },
  {
    type: "content",
    eyebrow: "Neurális hálók",
    title: "Gradient descent",
    visual: { kind: "image", step: 1, src: "assets/gradient_descent_lr.gif", alt: "Gradient descent animáció", caption: "3 learning rate — túl kicsi, jó, túl nagy" },
    blocks: [
      { kind: "ask", html: "Ha egy dombos tájon állsz köddel — nem látod a teljes tájat —, és le akarsz jutni a legmélyebb pontra, mit csinálnál?" },
      { kind: "text", step: 1, html: "Minden lépésnél a lejtő irányába lépsz — a lépés <strong>méretét</strong> a <strong>learning rate</strong> hiperparaméter szabja meg. Túl kicsi: örökké tart. Túl nagy: átugorja a völgyet." },
    ],
  },
  {
    type: "content",
    eyebrow: "Neurális hálók",
    title: "Egy teljes hullámvasút",
    visual: { kind: "image", step: 3, src: "assets/neural_network_training.gif", alt: "Neurális háló tanulása", caption: "→ demo.ipynb — döntési határ, ahogy tanul" },
    blocks: [
      { kind: "plaque", year: "1958", html: "Rosenblatt megépíti a Perceptront — a NYT azt írja, hamarosan járni, beszélni, látni fog." },
      { kind: "tension", step: 1, label: "Első AI winter", html: "1969 — Minsky & Papert megmutatja: egyetlen perceptronréteg nem tudja megtanulni az XOR-t. A finanszírozás kiszárad." },
      { kind: "plaque", step: 2, year: "1986", html: "Rumelhart, Hinton & Williams publikálja a backpropagation-t — újraindul a terület." },
    ],
  },
  {
    type: "content",
    eyebrow: "Neurális hálók",
    title: "Mit csinál valójában a backpropagation?",
    blocks: [
      { kind: "text", html: "A gradient descent-hez <strong>minden egyes súlyra</strong> kell egy gradiens: „ha ezt a súlyt kicsit módosítom, hogyan változik a hiba?”" },
      { kind: "text", step: 1, html: "A backpropagation ezt számolja ki hatékonyan, a <strong>láncszabállyal</strong> (chain rule): a kimeneti hibát rétegről rétegre <strong>visszafelé</strong> terjeszti, és útközben minden súlyra megkapja a saját gradiensét." },
      { kind: "text", step: 2, html: "Anélkül, hogy minden súlyt egyenként, külön-külön kellene kipróbálgatni — ez teszi lehetővé, hogy egy milliónyi paraméteres hálót is tudjunk tanítani." },
    ],
  },

  // ---------------- SVM ----------------
  { type: "divider", index: "04", eyebrow: "Nem-lineáris modellek", title: "Support Vector Machine" },
  {
    type: "content",
    eyebrow: "SVM",
    title: "A legszélesebb utca",
    visual: { kind: "image", step: 3, src: "assets/svm_kernels.gif", alt: "SVM döntési határ különböző kernelekkel és gamma értékekkel", caption: "→ demo.ipynb — lineáris nem elég, az RBF gamma-ja szabja az élességet" },
    blocks: [
      { kind: "text", html: "Nem akármilyen elválasztó vonalat húzunk két osztály közé — hanem azt, ami a <strong>legtávolabb</strong> van mindkét osztály legközelebbi pontjaitól (support vectorok)." },
      { kind: "plaque", step: 1, year: "1960–70-es évek", html: "Vapnik & Chervonenkis a Szovjetunióban dolgozza ki a statisztikai tanuláselmélet alapjait — a hidegháború miatt évekig visszhang nélkül Nyugaton." },
      { kind: "plaque", step: 2, year: "1995", html: "Vapnik emigrál, és Cortes-szal a Bell Labs-nál publikálja a modern „soft margin” SVM-et." },
      { kind: "text", step: 3, html: "Ha az adat nem lineárisan választható szét, egy <strong>kernel</strong> (polinom, RBF) magasabb dimenzióba képezi le, ahol már igen. A <strong>gamma</strong> hiperparaméter szabja meg, milyen „élesen” hajlik a határ az egyes pontok köré." },
    ],
  },

  // ---------------- Trees ----------------
  { type: "divider", index: "05", eyebrow: "Nem-lineáris modellek", title: "Fák" },
  {
    type: "content",
    eyebrow: "Egyszerű döntési fa",
    title: "Ismerős mintázat",
    visual: { kind: "image", src: "assets/tree_depth.gif", alt: "Döntési fa mélység animáció", caption: "→ demo.ipynb — döntési határ, növekvő mélységgel" },
    blocks: [
      { kind: "ask", step: 1, html: "Hol láttunk ma már ugyanezt a mintázatot?" },
      { kind: "text", step: 2, html: "A fa <strong>mélysége</strong> (a <code>max_depth</code> hiperparaméter) itt a komplexitás-csavar — ugyanaz a történet, mint a polinom fokszámánál." },
    ],
  },
  {
    type: "content",
    eyebrow: "Random Forest",
    title: "Sok, egymástól különböző fa",
    visual: { kind: "image", step: 2, src: "assets/random_forest_ensemble.gif", alt: "Random Forest animáció", caption: "→ demo.ipynb — egyre több fa, simább határ" },
    blocks: [
      { kind: "ask", html: "Ha egyetlen mély fa overfittel, mi lenne, ha sok, kicsit különböző fát tanítanánk, és átlagolnánk a predikcióikat?" },
      {
        kind: "columns", step: 1,
        columns: [
          { heading: "Bagging", html: "Minden fa az adat egy véletlen, visszatevéses mintáján tanul." },
          { heading: "Random feature subset", html: "Minden osztásnál csak a feature-ök egy véletlen részhalmazát nézi." },
        ],
      },
      { kind: "text", step: 2, html: "A fák száma (<code>n_estimators</code>) a komplexitás-csavar itt — ahogy a gif is mutatja, egyre simább lesz a döntési határ, ahogy nő." },
    ],
  },
  {
    type: "content",
    eyebrow: "Random Forest",
    title: "Miért segít az átlagolás?",
    blocks: [
      { kind: "ask", html: "Miért csökkenti az átlagolás a varianciát, ha az egyes fák maguk overfittelnek?" },
      { kind: "text", step: 1, html: "Ha a fák hibái <strong>nem korrelálnak tökéletesen</strong> egymással, az átlagolás kioltja a véletlen zajt, és csak a valódi mintázat marad." },
      { kind: "plaque", step: 2, year: "1996 / 2001", html: "Leo Breiman — aki évekig statisztikai tanácsadóként dolgozott az akadémián kívül — publikálja a bagginget (1996), majd a Random Forestet (2001)." },
    ],
  },
  {
    type: "content",
    eyebrow: "Gradient Boosting",
    title: "Más stratégia, ugyanaz a cél",
    visual: { kind: "image", step: 1, src: "assets/gradient_boosting_rounds.gif", alt: "Gradient Boosting animáció", caption: "→ demo.ipynb — egyre több boosting kör" },
    blocks: [
      { kind: "text", html: "A fák nem <em>egymástól függetlenül</em>, hanem <strong>egymás után</strong> épülnek — minden új fa az eddigi együttes hibáját (rezidumát) próbálja korrigálni." },
      { kind: "tension", step: 2, label: "Ez is overfittelhet", html: "Túl sok kör után (a <code>n_estimators</code> hiperparaméter) a boosting is elkezdi a zajt tanulni. A <code>learning_rate</code> itt azt szabja meg, mekkora lépést tegyen minden körben a maradék hiba (rezidum) felé — ugyanaz a fogalom, mint a gradient descentnél." },
    ],
  },
  {
    type: "content",
    eyebrow: "Gradient Boosting",
    title: "Egy kérdésre 3 válasz, 3 évtized alatt",
    blocks: [
      { kind: "plaque", year: "1988", html: "Kearns & Valiant felveti elméletileg: lehet-e sok gyenge tanulóból egy erőset építeni?" },
      { kind: "plaque", step: 1, year: "1995–96", html: "Schapire & Freund válaszol gyakorlatban: AdaBoost (később Gödel-díj)." },
      { kind: "plaque", step: 2, year: "1999–2001", html: "Friedman megadja az általános „gradient boosting” keretet." },
      { kind: "plaque", step: 3, year: "2016", html: "XGBoost (Chen & Guestrin) — azóta Kaggle-versenyek tucatjait nyeri." },
      { kind: "text", step: 4, html: "Emlékeztek Galton ökör-becslés-történetére (835 laikus becslés mediánja majdnem pontos)? Ugyanaz az elv: sok, egymástól kicsit eltérő, <strong>gyengén korreláló</strong> becslés összesítve jobb, mint bármelyik egyénileg — legyen szó tömegről vagy gyenge tanulókból épített együttesről." },
    ],
  },

  // ---------------- Model comparison ----------------
  { type: "divider", index: "06", eyebrow: "Végigvitt példa", title: "Modellösszehasonlítás" },
  {
    type: "content",
    eyebrow: "Metrikák",
    title: "Konfúziós mátrix",
    blocks: [
      { kind: "text", html: "4 eset van: valóban túlélt / nem túlélt × a modell szerint túlélt / nem túlélt. <strong>TP, FP, TN, FN</strong> — ebből épül fel minden metrika, amit ma használunk." },
      { kind: "text", step: 1, html: "<span style='font-family:var(--font-mono)'>A logisztikus regresszió (baseline) a teszthalmazon: TP=59, FP=24, TN=113, FN=27</span>" },
      { kind: "text", step: 2, html: "<strong>Accuracy</strong> = (TP+TN) / összes = 77,1%. Egyszerű, de <strong>félrevezető</strong>, ha a két osztály nagyon egyenlőtlen — a Titanicon egy „mindenki meghalt” modell is 62%-ot érne el, anélkül, hogy bármit tanult volna." },
    ],
  },
  {
    type: "content",
    eyebrow: "Metrikák",
    title: "Precision, recall, F1",
    blocks: [
      { kind: "text", html: "<strong>Precision</strong> = TP/(TP+FP): a „túlélt”-nek jósoltak közül hány volt valóban az? Itt: 59/83 = 71,1%." },
      { kind: "text", step: 1, html: "<strong>Recall</strong> = TP/(TP+FN): a valóban túlélők közül hányat talált meg a modell? Itt: 59/86 = 68,6%." },
      { kind: "ask", step: 2, html: "Egy rákszűrő tesztnél melyik hiba rosszabb: egy beteget egészségesnek mondani (FN), vagy egy egészségeset továbbküldeni vizsgálatra (FP)?" },
      { kind: "text", step: 3, html: "Ez a kérdés dönti el, melyiket optimalizáld — nincs univerzálisan „jó” válasz. <strong>F1</strong> a kettő harmonikus közepe, ha egyformán fontos mindkettő: itt 69,8%." },
    ],
  },
  {
    type: "content",
    eyebrow: "Titanic",
    title: "Melyik nyert?",
    blocks: [
      { kind: "text", html: "Ugyanazon a train/test felosztáson: logisztikus regresszió, SVM, döntési fa, Random Forest, Gradient Boosting, neurális háló." },
      { kind: "ask", step: 1, html: "Meglep-e valakit az eredmény? (→ demo.ipynb)" },
    ],
  },
  {
    type: "content",
    eyebrow: "Titanic",
    title: "Interpretálhatóság vs. teljesítmény",
    blocks: [
      { kind: "ask", html: "Melyik modellt választanátok egy banki hitelbírálati rendszerhez, ahol meg kell tudni magyarázni az elutasítás okát?" },
      { kind: "text", step: 1, html: "Lineáris regresszió / egyszerű fa: <strong>átlátható</strong>. Random Forest / Gradient Boosting / neurális háló: <strong>fekete doboz</strong>, cserébe gyakran pontosabb." },
    ],
  },

  // ---------------- Shapley-értékek / SHAP ----------------
  { type: "divider", index: "07", eyebrow: "Interpretálhatóság", title: "Shapley-értékek" },
  {
    type: "content",
    eyebrow: "Játékelmélet",
    title: "Egy egyszerű játék: két bal kesztyű, egy jobb",
    blocks: [
      { kind: "text", html: "3 játékos. 1-nek és 2-nek bal kesztyűje van, 3-nak jobb. Egy <strong>pár</strong> (bal+jobb) 10 pontot ér, bármi más 0-t." },
      { kind: "ask", step: 1, html: "Hogyan osszuk szét méltányosan a 10 pontot a három játékos között?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Játékelmélet",
    title: "A Shapley-érték: átlagos határhozzájárulás",
    blocks: [
      { kind: "text", html: "Vegyük az összes lehetséges sorrendet, ahogyan a játékosok „csatlakoznak”, és nézzük, mennyit <strong>ad hozzá</strong> mindenki éppen akkor, amikor belép." },
      { kind: "text", step: 1, html: "<span style='font-family:var(--font-mono); font-size:0.95em'>6 sorrend van. A 3. játékos (jobb kesztyű) 4-ben ő zárja le a párt (+10 a saját belépésekor), a másik 2-ben a hozzájárulása 0 (a pár már előtte megvolt vagy utána sem lesz meg).</span>" },
      { kind: "text", step: 2, html: "Játékos 1 és 2 átlaga: <strong>10/6 ≈ 1,67</strong> pont. Játékos 3 átlaga: <strong>40/6 ≈ 6,67</strong> pont — <em>kétharmada</em> az egész értéknek, mert ő az egyetlen szűk keresztmetszet." },
      { kind: "tension", step: 3, label: "Nem egyenlő osztás, nem is arányos", html: "Sem a „mindenki egyformán” (3,33–3,33–3,33), sem a „mindenki egy kesztyűt birtokol, tehát egyenlő” logika nem stimmel — a Shapley-érték a <strong>tényleges, kontextusfüggő hozzájárulást</strong> méri, nem a nyers birtoklást." },
      { kind: "plaque", step: 4, year: "1953", html: "Lloyd Shapley megadja az általános értékfogalmat kooperatív játékokra (<em>Contributions to the Theory of Games II</em>)." },
    ],
  },
  {
    type: "content",
    eyebrow: "Játékelmélet",
    title: "Ugyanez éles tétben: az ENSZ Biztonsági Tanács",
    blocks: [
      { kind: "text", html: "15 tag, 9 szavazat kell egy határozathoz — <strong>de</strong> az 5 állandó tag bármelyike vétózhat. Súlyozott szavazási játékként: minden állandó tag súlya 7, minden választott tagé 1, a kvóta 39 (35 + 4)." },
      { kind: "ask", step: 1, html: "A nyers szavazati súly aránya 7:1 (állandó : választott tag). Mekkora a <strong>tényleges</strong> hatalmi arány, ha a fenti kesztyű-logikával (minden lehetséges sorrend, átlagos határhozzájárulás) számoljuk?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Játékelmélet — válasz",
    title: "7:1 helyett kb. 100:1",
    blocks: [
      { kind: "text", html: "A Shapley–Shubik index szerint egy állandó tag kb. <strong>19,6%</strong>, egy választott tag kb. <strong>0,19%</strong> hatalommal bír — a nyers súlyarány (7:1) drasztikusan alábecsüli a valódi különbséget." },
      { kind: "text", step: 1, html: "A vétójog miatt egy állandó tag szinte <strong>minden</strong> sorrendben pivotális (ő zárja le a győztes koalíciót); egy választott tag csak akkor, ha épp ő adja az utolsó hiányzó szavazatot — ez sokkal ritkább." },
      { kind: "plaque", step: 2, year: "1954", html: "Shapley & Shubik alkalmazza az értékfogalmat szavazati hatalom mérésére (<em>American Political Science Review</em>) — innen a Shapley–Shubik index neve. A Biztonsági Tanácsra való alkalmazás azóta a módszer egyik legidézettebb illusztrációja." },
    ],
  },
  {
    type: "content",
    eyebrow: "Vissza a modellekhez",
    title: "SHAP: ugyanez a logika, feature-ökre",
    blocks: [
      { kind: "text", html: "A „játékosok” a <strong>feature-ök</strong>, a „kifizetés” a <strong>predikció</strong>. Egy feature SHAP-értéke: mennyit módosít átlagosan a predikción, az összes lehetséges sorrendben, ahogy „belép” a modellbe." },
      { kind: "text", step: 1, html: "Ez teszi lehetővé, hogy egy fekete doboz (Random Forest, Gradient Boosting, neurális háló) predikcióját is <strong>egyenként, feature-önként</strong> megmagyarázzuk — anélkül, hogy fel kéne adnunk a pontosságát." },
      { kind: "plaque", step: 2, year: "2017", html: "Lundberg & Lee egyesíti a korábbi feature-attribúciós módszereket a Shapley-érték alatt — ebből lesz a SHAP (SHapley Additive exPlanations), a ma legelterjedtebb interpretálhatósági eszköz." },
    ],
  },

  // ---------------- Wrap-up ----------------
  { type: "divider", index: "08", eyebrow: "Összefoglalás", title: "Stats vs. ML" },
  {
    type: "content",
    eyebrow: "Zárókérdés",
    title: "Mi a tényleges különbség?",
    blocks: [
      { kind: "ask", html: "A mai óra alapján, mi a tényleges különbség a hagyományos statisztika és a gépi tanulás között?" },
      {
        kind: "columns", step: 1,
        columns: [
          { heading: "Hagyományos statisztika", html: "Explicit feltevések (linearitás, függetlenség). Gyakran <strong>inferenciáról</strong> szól: mekkora és szignifikáns-e egy hatás?" },
          { heading: "Gépi tanulás", html: "Kevesebb feltevés, rugalmasabb — cserébe hajlamosabb overfittelni. Gyakran tisztán <strong>predikcióról</strong> szól." },
        ],
      },
    ],
  },

  // ---------------- Mielőtt bevetnéd ----------------
  { type: "divider", index: "09", eyebrow: "Mielőtt bevetnéd", title: "A helyes sorrend és a gyakori csapdák" },
  {
    type: "content",
    eyebrow: "Mielőtt bevetnéd",
    title: "A helyes sorrend",
    blocks: [
      { kind: "text", html: "Mielőtt gépi tanulási modellt építenél — építs egy <strong>lineáris modellt</strong>. Mielőtt lineáris modellt építenél — végezz <strong>feltáró elemzést (EDA-t)</strong>. Mielőtt EDA-t végeznél — legyen egy <strong>hipotézised</strong>." },
      {
        kind: "columns", step: 1,
        columns: [
          { heading: "Az EDA szerepe", html: "Meggyőzni egy <strong>laikust</strong>, hogy a hipotézisednek van értelme — mielőtt egy sort is kódolnál a modellhez." },
          { heading: "A lineáris modell szerepe", html: "Meggyőzni <strong>saját magadat</strong>, hogy a hipotézis valóban működik, és az adat helyesen van felépítve — mielőtt egy bonyolultabb, kevésbé átlátható modellbe fektetnél." },
        ],
      },
      { kind: "tension", step: 2, label: "Ami ebből következik", html: "Ha egy egyszerű, átlátható lineáris modell nem működik az adatodon, egy bonyolultabb, fekete doboz modell <strong>nem fogja megoldani</strong> — csak elrejti a problémát, amíg éles környezetben elő nem bukkan." },
    ],
  },
  {
    type: "content",
    eyebrow: "Gyakori csapdák",
    title: "Nem csak az overfitting a veszély",
    blocks: [
      { kind: "text", html: "Overfittinget ma már felismeritek: tanuló hiba lent, teszt hiba fent. De van egy <strong>alattomosabb</strong> csapda, amit a teszt hiba sem mindig fog megmutatni." },
      { kind: "tension", step: 1, label: "Data leakage", html: "Amikor egy feature titokban <strong>a jövőből szivárog be</strong> — olyan információt tartalmaz, ami a predikció pillanatában a valóságban még nem állna rendelkezésre. A modell a teszthalmazon is kiválóan teljesít, mert ott is „csalhat” — és <strong>éles környezetben</strong> derül ki, amikor a valós adatban ez az információ már nincs jelen." },
      { kind: "ask", step: 2, html: "Milyen más példákat tudtok mondani, amikor egy feature titokban a jövőből szivárog be?" },
    ],
  },

  { type: "divider", index: "→", eyebrow: "A mai óra vége", title: "Házi feladat", kicker: "Két rész — mindkettő kötelező, beadás a következő óra előtt." },
  {
    type: "content",
    eyebrow: "Házi feladat 1/2",
    title: "Videók + reflexió",
    blocks: [
      { kind: "text", html: "8 ellenőrzött videólink a mai témákhoz (3Blue1Brown + StatQuest) — a pontos címek és URL-ek a <code>homework.md</code>-ben." },
      {
        kind: "list", step: 1,
        items: [
          "Válassz ki <strong>3 videót</strong> a 8 közül",
          "Mindegyikhez írj 2-3 mondatot: mi <strong>lepett meg</strong>?",
          "Hogyan kapcsolódik a mai <strong>Titanic-példához</strong>?",
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Házi feladat 2/2",
    title: "Hiperparaméter-vadászat",
    blocks: [
      { kind: "text", html: "A Titanic-összehasonlítás alapértelmezett hiperparaméterekkel futott — próbáld megverni ezt." },
      {
        kind: "list", step: 1,
        items: [
          "Válassz <strong>2 modellt</strong> a hatból, próbálj <strong>3-3 hiperparaméter-beállítást</strong>",
          "Nézd <strong>külön</strong> a tanuló és a teszt pontosságot — a rés = overfitting jele",
          "Írj 4-6 mondatot: melyik nyert, és <strong>miért</strong>?",
        ],
      },
      { kind: "text", step: 2, html: "<strong>Bónusz (nem kötelező):</strong> próbáld ki K-legközelebbi-szomszéd modellel is — mi köze a dimenzió-átokhoz?" },
    ],
  },
];
