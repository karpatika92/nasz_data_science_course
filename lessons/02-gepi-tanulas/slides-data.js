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
    title: "Polinom illesztés, növekvő fokszámmal",
    visual: { kind: "image", src: "assets/polynomial_overfit.gif", alt: "Polinom illesztés animáció", caption: "→ demo.ipynb — élőben futtatva" },
    blocks: [
      { kind: "ask", step: 1, html: "Melyik illesztés a „legjobb”? Mi a baj a magas fokszámúval, ha egyszer minden ponton áthalad?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Overfitting",
    title: "A teszthiba egy ponton túl nő",
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

  // ---------------- SVM ----------------
  { type: "divider", index: "04", eyebrow: "Nem-lineáris modellek", title: "Support Vector Machine" },
  {
    type: "content",
    eyebrow: "SVM",
    title: "A legszélesebb utca",
    blocks: [
      { kind: "text", html: "Nem akármilyen elválasztó vonalat húzunk két osztály közé — hanem azt, ami a <strong>legtávolabb</strong> van mindkét osztály legközelebbi pontjaitól (support vectorok)." },
      { kind: "plaque", step: 1, year: "1960–70-es évek", html: "Vapnik & Chervonenkis a Szovjetunióban dolgozza ki a statisztikai tanuláselmélet alapjait — a hidegháború miatt évekig visszhang nélkül Nyugaton." },
      { kind: "plaque", step: 2, year: "1995", html: "Vapnik emigrál, és Cortes-szal a Bell Labs-nál publikálja a modern „soft margin” SVM-et." },
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
      { kind: "text", step: 2, html: "A fa mélysége itt a komplexitás-csavar — ugyanaz a történet, mint a polinom fokszámánál." },
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
      { kind: "tension", step: 2, label: "Ez is overfittelhet", html: "Túl sok kör után a boosting is elkezdi a zajt tanulni — a „hány kört futtatunk” itt a komplexitás-csavar." },
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
    ],
  },

  // ---------------- Model comparison ----------------
  { type: "divider", index: "06", eyebrow: "Végigvitt példa", title: "Modellösszehasonlítás" },
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

  // ---------------- Wrap-up ----------------
  { type: "divider", index: "07", eyebrow: "Összefoglalás", title: "Stats vs. ML" },
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
