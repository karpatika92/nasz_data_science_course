window.LESSON_LABEL = "4. óra · Klasszifikáció";

// Minden szám a demo.ipynb-ből jön (rögzített seedek, 5-fold CV a train halmazon; a teszthalmaz csak a végén).
// A 2. órás gif-eket újrahasznosítjuk: a hallgatók már látták őket.
const L2 = "../02-gepi-tanulas/assets/";

window.SLIDES = [
  {
    type: "title",
    eyebrow: "Data Science műhelykurzus",
    title: "Klasszifikáció",
    kicker: "A nyers adattól a hangolt modellig — és hogyan higgyünk el egy számot?",
    note: "Kárpáti András · 4. óra",
  },

  // ---------------- Recap ----------------
  { type: "divider", index: "00", eyebrow: "Felfrissítés", title: "Mit tudunk már a modellekről?" },
  {
    type: "content",
    eyebrow: "Recap",
    title: "A 2. óráról",
    blocks: [
      { kind: "ask", label: "Mondjátok vissza", html: "Mi a különbség a döntési fa, a Random Forest és a Gradient Boosting között? Melyik hibázik <strong>másképp</strong>?" },
      { kind: "text", step: 1, html: "Ma ugyanezeket a modelleket egy <strong>valódi, kicsit koszos adaton</strong> próbáljuk ki, nyers fájltól a hangolásig — és közben azt is megnézzük, <strong>mikor hazudik egy szám</strong>." },
    ],
  },
  {
    type: "content",
    eyebrow: "Recap · logisztikus regresszió",
    title: "Egy egyenes a két osztály között",
    visual: { kind: "image", src: L2 + "gradient_descent_lr.gif", alt: "Gradient descent három learning rate-tel", caption: "a 2. órán látott animáció: túl kicsi, jó, túl nagy learning rate" },
    blocks: [
      { kind: "ask", html: "Mit tanul meg a logisztikus regresszió, és mi az, amit <strong>nem tud</strong> megtanulni?" },
      { kind: "text", step: 1, html: "Egy súlyozott összeget tanul a feature-ökből, és valószínűséggé alakítja. A határa <strong>egyenes</strong> (hipersík) — ami nem fér bele, azt kézzel kell beletenni (interakció)." },
    ],
  },
  {
    type: "content",
    eyebrow: "Recap · döntési fa",
    title: "Kérdések sorozata — és a memorizálás",
    visual: { kind: "image", src: L2 + "tree_depth.gif", alt: "Döntési fa növekvő mélységgel", caption: "a 2. órán látott animáció: növekvő max_depth" },
    blocks: [
      { kind: "ask", html: "Mi történik, ha a fa mélységét nem korlátozzuk?" },
      { kind: "text", step: 1, html: "Minden pontot külön megtanul: a tanuló adaton tökéletes, újon <strong>rossz</strong>. Ezt ma számokkal is látni fogjuk." },
    ],
  },
  {
    type: "content",
    eyebrow: "Recap · Random Forest",
    title: "Sok különböző fa átlaga",
    visual: { kind: "image", src: L2 + "random_forest_ensemble.gif", alt: "Random Forest egyre több fával", caption: "a 2. órán látott animáció: egyre több fa" },
    blocks: [
      { kind: "ask", html: "Miért simább a határ, ha több fát átlagolunk?" },
      { kind: "text", step: 1, html: "A fák hibái nem korrelálnak tökéletesen, az átlag kioltja a zajt: a <strong>variance</strong> csökken, a <strong>bias</strong> nem." },
    ],
  },
  {
    type: "content",
    eyebrow: "Recap · Gradient Boosting",
    title: "Kis fák, amelyek a hibákat javítják",
    visual: { kind: "image", src: L2 + "gradient_boosting_rounds.gif", alt: "Gradient Boosting körönként", caption: "a 2. órán látott animáció: körről körre élesedik" },
    blocks: [
      { kind: "ask", html: "Miben más a boosting, mint a Random Forest, ha mindkettő fák együttese?" },
      { kind: "text", step: 1, html: "A forest fái <strong>párhuzamosan</strong> és függetlenül tanulnak; a boosting fái <strong>egymás után</strong>, mindegyik az előző maradék hibáját javítja. Az XGBoost ennek gyors, regularizált megvalósítása." },
      { kind: "plaque", step: 2, year: "2016", html: "Tianqi Chen és Carlos Guestrin publikálja az XGBoostot („XGBoost: A Scalable Tree Boosting System”)." },
    ],
  },
  {
    type: "content",
    eyebrow: "Recap · összefoglaló",
    title: "Négy modell, négy jellegzetes hiba",
    blocks: [
      { kind: "ask", html: "Tipp: melyik fog nyerni a mai adaton? <strong>Jegyezzétek fel</strong>, a 4. blokkban visszatérünk rá." },
      {
        kind: "columns", step: 1,
        columns: [
          { heading: "Logisztikus regresszió", html: "Egyenes határ. Nem tud hajlani." },
          { heading: "Döntési fa", html: "Memorizál, ha mély." },
          { heading: "Random Forest", html: "Stabil, de kevésbé éles." },
          { heading: "XGBoost", html: "Erős, de hangolni kell." },
        ],
      },
    ],
  },

  // ---------------- EDA ----------------
  { type: "divider", index: "01", eyebrow: "Végigvitt példa", title: "Nyers adat és EDA" },
  {
    type: "content",
    eyebrow: "A feladat",
    title: "Churn: ki mond le?",
    blocks: [
      { kind: "text", html: "Egy telekommunikációs cég: a megtartó csapat <strong>fel tud hívni</strong> néhány ügyfelet. Kiket hívjon?" },
      { kind: "ask", step: 1, html: "Mi legyen a „pozitív” osztály? És <strong>melyik hiba drágább</strong>: egy fölöslegesen felhívott ügyfél, vagy egy elveszített?" },
      { kind: "text", step: 2, html: "Pozitív = lemond (churn). A két hiba ára <strong>különböző</strong> — ez dönti el később, hová tegyük a küszöböt." },
    ],
  },
  {
    type: "content",
    eyebrow: "Az adat",
    title: "IBM Telco Customer Churn",
    blocks: [
      {
        kind: "list",
        items: [
          "<strong>7 043</strong> ügyfél, <strong>21</strong> oszlop (demográfia, szolgáltatások, szerződés, számlázás)",
          "Címke: lemondott-e (<code>Churn</code>) — <strong>1 869</strong> igen, vagyis <strong>26,5%</strong>",
          "Forrás: az IBM mintaadata (github.com/IBM/telco-customer-churn-on-icp4d)",
        ],
      },
      { kind: "ask", step: 1, html: "Egy modell, ami <strong>mindenkire</strong> azt mondja: „marad”. Mennyi a pontossága?" },
      { kind: "tension", step: 2, label: "73,5%", html: "Ez az a „modell”, amit minden valódi modellnek meg kell vernie — és a pontosság önmagában nem fogja megmondani, hogy sikerült-e." },
    ],
  },
  {
    type: "content",
    eyebrow: "EDA",
    title: "Szerződés szerint",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/eda_szerzodes.png", alt: "Churn-arány szerződéstípus szerint", caption: "az egész fájlon; a szaggatott vonal az átlag (26,5%)" },
    blocks: [
      { kind: "ask", html: "Melyik szerződéstípusnál mondanak le a legtöbben — és mekkora a különbség?" },
      { kind: "text", step: 1, html: "Havi szerződés: <strong>43%</strong>. Egyéves: <strong>11%</strong>. Kétéves: <strong>3%</strong>." },
    ],
  },
  {
    type: "content",
    eyebrow: "EDA",
    title: "Internet és fizetés",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/eda_internet_fizetes.png", alt: "Churn-arány internetszolgáltatás és fizetési mód szerint", caption: "szaggatott vonal: átlag" },
    blocks: [
      { kind: "ask", html: "Mit olvastok ki ezekből? Mi az a két szegmens, ahol a legmagasabb a lemondás?" },
      { kind: "text", step: 1, html: "<strong>Fiber optic</strong> (42%) és <strong>elektronikus csekk</strong> (45%)." },
    ],
  },
  {
    type: "content",
    eyebrow: "EDA",
    title: "Tenure szerint",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/eda_tenure.png", alt: "Tenure-hisztogram marad és lemond szerint", caption: "ügyfelek száma tenure (hónap) szerint" },
    blocks: [
      { kind: "ask", html: "Hol a legmagasabb a narancssárga (lemondók) aránya a kék mellett?" },
      { kind: "text", step: 1, html: "A legelső hónapokban: az új ügyfelek lépnek ki a legnagyobb arányban." },
    ],
  },
  {
    type: "content",
    eyebrow: "EDA · tanulság",
    title: "Új, havi, fiber, e-csekk",
    blocks: [
      { kind: "text", html: "Hipotézis még modell nélkül: a lemondás <strong>új, havi szerződéses, fiber optic, elektronikus csekkes</strong> ügyfeleknél koncentrálódik." },
      { kind: "tension", step: 1, label: "Jegyezzük meg", html: "A hosszú szerződéseken szinte <strong>senki</strong> nem mond le. Egy modell, ami ezt tanulja meg, az 5. blokkban egy furcsa dologban fog hibázni." },
    ],
  },

  // ---------------- Tisztítás ----------------
  { type: "divider", index: "02", eyebrow: "Adatkoszolás", title: "Adattisztítás" },
  {
    type: "content",
    eyebrow: "Tisztítás",
    title: "Miért szöveg a TotalCharges?",
    blocks: [
      { kind: "ask", html: "Egy pénzösszeg-oszlop, amit a pandas <code>object</code> (szöveg) típusúnak olvas be. Mit gyanítotok?" },
      { kind: "text", step: 1, html: "<strong>11 sor</strong>ban üres karakterlánc áll szám helyett." },
      { kind: "ask", step: 2, html: "Véletlen hiányzás ez? Mi a közös ebben a 11 ügyfélben?" },
      { kind: "tension", step: 3, label: "A mechanizmus", html: "Mind a 11 ügyfél <code>tenure = 0</code>: még <strong>nem számlázták</strong> őket. Közülük egy sem mondott le. A hiányzásnak oka van — előbb ezt keressük meg, aztán pótolunk." },
    ],
  },
  {
    type: "content",
    eyebrow: "Tisztítás",
    title: "Nulla, nem medián",
    blocks: [
      { kind: "ask", html: "Mivel töltenétek ki a 11 üres értéket — mediánnal, vagy mással?" },
      {
        kind: "columns", step: 1,
        columns: [
          { heading: "Hibás: medián", html: "Egy teljesen új ügyfélnek adna egy tipikus élettartam-számlát, amit sosem fizetett ki. <strong>Adatot talál ki.</strong>" },
          { heading: "Helyes: nulla", html: "A tényleges eddigi számla 0. Az érték sosem hiányzott, csak nem volt beírva." },
        ],
      },
      { kind: "text", step: 2, html: "Ez egy <strong>kézzel írt, adatfüggetlen szabály</strong>, ezért a split előtt is alkalmazható. Egy medián-imputert viszont már csak a train részen szabad illeszteni." },
    ],
  },
  {
    type: "content",
    eyebrow: "Tisztítás",
    title: "Minden lépésnek oka van",
    blocks: [
      {
        kind: "list",
        items: [
          "<strong>Típusok:</strong> TotalCharges lebegőpontos; a SeniorCitizen 0/1 jelző, kategória lesz",
          "<strong>Azonosító:</strong> a <code>customerID</code>-t eldobjuk — nincs benne jel, a fák memorizálnának vele",
          "<strong>Redundáns szintek:</strong> „No internet service” megismétli egy másik jelzőt — ártalmatlan, tudomásul vesszük",
          "<strong>Kódolás:</strong> a szöveges oszlopok one-hot kódolva, a pipeline-on belül",
          "<strong>Skálázás:</strong> a logisztikus regressziónak kell, a fáknak nem",
          "<strong>Ellenőrizve:</strong> 0 duplikált azonosító, a TotalCharges-javítás után 0 valódi NaN",
        ],
      },
      { kind: "ask", step: 1, html: "Mit <strong>nem</strong> néztünk meg? (Pl. kiugró értékek — ezt ma nem vizsgáltuk, egy <code>describe()</code> az első lépés.)" },
    ],
  },
  {
    type: "content",
    eyebrow: "Tisztítás",
    title: "Előbb szétválasztunk",
    blocks: [
      { kind: "ask", html: "Mi történik, ha az imputálást, a skálázást vagy a mintavételezést a <strong>split előtt</strong>, az egész adaton illesztjük?" },
      { kind: "text", step: 1, html: "A teszt-sorok információja beszivárog a tanításba. Ezért: <strong>5 634 train</strong> és <strong>1 409 teszt</strong> sor, rétegzett felosztással (mindkettőben 26,5% lemondó)." },
      { kind: "tension", step: 2, label: "Szabály", html: "Ami az adatból <strong>tanul</strong> (imputer, scaler, encoder, resampler), csak a train foldokon illeszthető — ezért <strong>pipeline-ban</strong> él. A teszthalmaz a 7. blokkig <strong>zárolva</strong> van." },
    ],
  },

  // ---------------- Értékelés ----------------
  { type: "divider", index: "03", eyebrow: "A mai óra fő pontja", title: "Hogyan értékeljünk egy klasszifikátort?" },
  {
    type: "content",
    eyebrow: "Értékelés",
    title: "A pontosság csapdája",
    blocks: [
      { kind: "ask", html: "A „senki nem mond le” modell 73,5%-ot ér el. Egy olyan célváltozónál, ahol a pozitívok <strong>1%</strong>-ot tesznek ki, mennyit érne el ugyanez?" },
      { kind: "tension", step: 1, label: "99,1%", html: "Ugyanaz a hasznavehetetlen modell: pontosság 99,1%, <strong>kiegyensúlyozott pontosság 0,50</strong>, recall 0. A pontosságot a többségi osztály uralja." },
      { kind: "text", step: 2, html: "Az 1%-os eset szintetikus (véletlen címkék), a 73,5% a mi adatunkon számolt, 5-fold out-of-fold." },
    ],
  },
  {
    type: "content",
    eyebrow: "Értékelés",
    title: "Kiegyensúlyozott pontosság",
    blocks: [
      { kind: "ask", html: "Hogyan lehetne olyan számot csinálni, amelyik a konstans modellt <strong>mindig 0,5-re</strong> teszi, akármilyen ferde az adat?" },
      { kind: "text", step: 1, html: "<strong>Kiegyensúlyozott pontosság = (a lemondók recallja + a maradók recallja) / 2.</strong>" },
      { kind: "text", step: 2, html: "A „senki nem mond le”: (0,00 + 1,00) / 2 = <strong>0,50</strong>. A logisztikus regresszió 0,5-es küszöbön: (0,55 + 0,90) / 2 = <strong>0,72</strong> — miközben a nyers pontossága 0,80." },
      { kind: "tension", step: 3, label: "Szabály a kurzuson", html: "Ferde célváltozónál <strong>kiegyensúlyozott pontosságot, PR-AUC-t és konfúziós mátrixot</strong> jelentünk, nyers pontosságot nem." },
    ],
  },
  {
    type: "content",
    eyebrow: "Értékelés",
    title: "Konfúziós mátrix",
    blocks: [
      { kind: "text", html: "Logisztikus regresszió, 0,5-es küszöb, out-of-fold a train halmazon:" },
      {
        kind: "columns",
        columns: [
          { heading: "Valójában lemondott", html: "<strong>TP 822</strong> (megjelöltük)<br><strong>FN 673</strong> (kihagytuk)" },
          { heading: "Valójában maradt", html: "<strong>FP 431</strong> (fölöslegesen megjelöltük)<br><strong>TN 3 708</strong> (jól hagytuk békén)" },
        ],
      },
      { kind: "ask", step: 1, html: "Melyik cella a <strong>fölöslegesen elköltött hívás</strong>, és melyik az <strong>elveszett ügyfél</strong>?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Értékelés",
    title: "Precision és recall",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Precision = TP / (TP + FP) = 0,66", html: "A megjelölt ügyfelek közül <strong>hány</strong> mond le tényleg?" },
          { heading: "Recall = TP / (TP + FN) = 0,55", html: "A lemondók közül <strong>hányat</strong> fogunk meg?" },
        ],
      },
      { kind: "ask", step: 1, html: "Ha a megtartó csapat <strong>olcsó</strong> hívásokat tud, melyiket érdemes feljebb tolni? És ha minden hívás drága?" },
      { kind: "text", step: 2, html: "Ez nem statisztikai, hanem <strong>üzleti</strong> kérdés — a két mutató a küszöb állításával cserélhető egymásra." },
    ],
  },
  {
    type: "content",
    eyebrow: "Értékelés",
    title: "A küszöb nem 0,5",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/tbl_kuszob_lr.png", alt: "Küszöbtáblázat a logisztikus regresszióra", caption: "logisztikus regresszió, out-of-fold, train halmaz" },
    blocks: [
      { kind: "ask", html: "Mi történik a precisionnel és a recallal, ha lejjebb visszük a küszöböt?" },
      { kind: "text", step: 1, html: "Pontosság: csúcs 0,5 körül. Kiegyensúlyozott pontosság: <strong>0,3 körül</strong>. Ugyanaz a modell." },
    ],
  },
  {
    type: "content",
    eyebrow: "Értékelés",
    title: "ROC és PR görbe",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/metrics_roc_pr.png", alt: "ROC és precision-recall görbe a logisztikus regresszióra", caption: "ugyanazok a jóslatok; a PR alapvonala a pozitívok aránya (0,27)" },
    blocks: [
      { kind: "ask", html: "A görbék 0,85-öt és 0,66-ot mutatnak. Melyik <strong>árul el többet</strong>?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Értékelés",
    title: "Miért PR-AUC elsődlegesen?",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "ROC-AUC", html: "Annak az esélye, hogy egy véletlen lemondó előrébb kerül egy véletlen maradónál. Alapvonal: 0,5. A rengeteg negatív miatt a hamis pozitív arány kicsi marad — <strong>hízelgő</strong> lehet." },
          { heading: "PR-AUC (average precision)", html: "A precision átlaga az összes recall-szinten. Alapvonal: a <strong>pozitívok aránya</strong> (itt 0,27). A ritka osztályra érzékeny." },
        ],
      },
      { kind: "plaque", step: 1, year: "II. világháború", html: "A ROC-görbe a radarjel-felismerés (signal detection theory) munkájából ered: a kezelő döntése, hogy egy folt ellenséges gép-e, ugyanilyen küszöb-kérdés." },
    ],
  },
  {
    type: "content",
    eyebrow: "Értékelés",
    title: "Precision@K: amit az üzlet olvas",
    blocks: [
      { kind: "ask", html: "Ha a megtartó csapat csak <strong>K ügyfelet</strong> tud felhívni, hányat találunk el a legkockázatosabb K közül?" },
      {
        kind: "list", step: 1,
        items: [
          "K = 100: <strong>0,88</strong>",
          "K = 300: <strong>0,79</strong>",
          "K = 500: <strong>0,77</strong>",
          "K = 1000: <strong>0,70</strong> (a véletlen alapvonal: 0,27)",
        ],
      },
      { kind: "text", step: 2, html: "Logisztikus regresszió, out-of-fold, train halmaz. Egy menedzser ezt érti meg elsőre." },
    ],
  },
  {
    type: "content",
    eyebrow: "Értékelés",
    title: "Hogyan hasonlítsunk modelleket?",
    blocks: [
      { kind: "ask", html: "Két modell PR-AUC-ja 0,66 és 0,65. Melyik jobb?" },
      {
        kind: "list", step: 1,
        items: [
          "A mérőszámot <strong>előre</strong> választjuk, nem utólag",
          "<strong>Ugyanazok a foldok</strong> minden modellnek; mindig legyen dummy és egyszerű alapmodell",
          "<strong>Átlag ± szórás</strong> a foldokon: a szórásnál kisebb különbség <strong>döntetlen</strong>",
          "Modellt vagy küszöböt <strong>soha</strong> nem a teszthalmazon választunk",
        ],
      },
    ],
  },

  // ---------------- Modell-létra ----------------
  { type: "divider", index: "04", eyebrow: "Végigvitt példa", title: "A modell-létra" },
  {
    type: "content",
    eyebrow: "Modell-létra",
    title: "Ugyanaz a verseny mindenkinek",
    blocks: [
      { kind: "text", html: "Hat versenyző, ugyanaz a tisztított tábla, ugyanazok az 5 fold: dummy, logisztikus regresszió, korlátlan fa, 4 mélységű fa, Random Forest, XGBoost (alapbeállítással)." },
      { kind: "ask", step: 1, html: "Visszatérünk az óra eleji tippre: <strong>melyik nyer</strong>? Mennyivel?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Modell-létra",
    title: "Az eredmény",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/tbl_letra.png", alt: "A modellek PR-AUC, ROC-AUC, kiegyensúlyozott pontosság és pontosság értékei átlag ± szórással", caption: "5-fold CV a train halmazon, átlag ± szórás a foldokon" },
    blocks: [
      { kind: "ask", html: "Mit olvastok ki a táblázatból? Mi lep meg?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Modell-létra",
    title: "Fold-onként nézve",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/ladder_folds.png", alt: "PR-AUC foldonként minden modellre", caption: "egy pont = egy fold; átfedő tartományok = nincs egyértelmű nyertes" },
    blocks: [
      { kind: "ask", html: "Melyik modellek tartománya fed át? Mit jelent ez a „nyertesről”?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Modell-létra",
    title: "Nem az nyer, amit vártunk",
    blocks: [
      {
        kind: "list",
        items: [
          "A <strong>korlátlan fa</strong> memorizál: PR-AUC 0,38 — csak kicsivel jobb a véletlen alapvonalnál (0,27)",
          "A 4 mélységű fa (0,60) és a Random Forest (0,61) sokkal jobb",
          "A <strong>logisztikus regresszió (0,66)</strong> legalább olyan jó, mint az XGBoost (0,65) — és a szórás (~0,03) nagyobb a különbségnél",
        ],
      },
      { kind: "tension", step: 1, label: "Tanulság", html: "Kis, táblázatos adaton a bonyolultabb modell <strong>nem automatikusan jobb</strong>. Mindig legyen egyszerű alapmodell — és az együttesek hangolás nélkül gyakran elmaradnak." },
    ],
  },
  {
    type: "content",
    eyebrow: "Modell-létra · belülről",
    title: "A regresszió súlyai",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/lr_egyutthatok.png", alt: "A logisztikus regresszió legnagyobb pozitív és negatív együtthatói", caption: "a hat legnagyobb pozitív és negatív együttható (a numerikus feature-ök skálázva)" },
    blocks: [
      { kind: "ask", html: "Egyezik ez az EDA-val? Mi a gyanús a havidíj és a teljes számla előjelében?" },
      { kind: "text", step: 1, html: "A havidíj, a teljes számla és a tenure összefügg: az együtthatókat <strong>nem külön-külön</strong> olvassuk." },
    ],
  },
  {
    type: "content",
    eyebrow: "Modell-létra · belülről",
    title: "Egy 3 mélységű fa",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/tree_depth3.png", alt: "3 mélységű döntési fa a Telco adaton", caption: "az első kérdés a szerződéstípus — pont az, amit az EDA mutatott" },
    blocks: [
      { kind: "ask", html: "Melyik levélben a legmagasabb a lemondás aránya, és milyen szabály vezet oda?" },
      { kind: "text", step: 1, html: "Havi szerződés, fiber optic, tenure legfeljebb 13 hónap: itt <strong>71%</strong> a lemondó." },
    ],
  },

  // ---------------- Visszacsatolási kör ----------------
  { type: "divider", index: "05", eyebrow: "A mai óra szíve", title: "Visszacsatolási kör" },
  {
    type: "content",
    eyebrow: "Visszacsatolás",
    title: "Hibák → hipotézis → változtatás → újramérés",
    blocks: [
      { kind: "ask", html: "Hol nézzük a hibákat: a <strong>teszthalmazon</strong>, vagy máshol? Miért?" },
      { kind: "text", step: 1, html: "A train halmaz <strong>out-of-fold</strong> jóslatain: minden jóslat olyan modelltől jön, amely azt a sort sosem látta. A teszthalmaz zárolva marad." },
      {
        kind: "list", step: 2,
        items: [
          "megnézzük a hibákat és szegmensekre bontjuk őket",
          "megfogalmazunk <strong>egy</strong> hipotézist",
          "változtatunk (jellemző, minta vagy működési pont)",
          "<strong>ugyanazokon a foldokon</strong> újra mérünk",
        ],
      },
      { kind: "tension", step: 3, label: "Figyelem", html: "Ma szándékosan <strong>két hibát is elkövetünk</strong> a körben — mindkettőt könnyű valóban elkövetni." },
    ],
  },
  {
    type: "content",
    eyebrow: "Visszacsatolás · kiindulás",
    title: "Az XGBoost alapbeállítással",
    blocks: [
      { kind: "text", html: "Out-of-fold a train halmazon, 0,5-es küszöb:" },
      {
        kind: "list",
        items: [
          "pontosság <strong>0,791</strong>, kiegyensúlyozott pontosság <strong>0,702</strong>",
          "recall <strong>0,513</strong>, precision <strong>0,629</strong>",
          "PR-AUC <strong>0,651</strong>",
        ],
      },
      { kind: "ask", step: 1, html: "Ez a modell a lemondók <strong>felét</strong> találja el. Hol hibázik, és kikről feledkezik meg?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Visszacsatolás · hibaelemzés",
    title: "Hol hibázik?",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/loop_hibak.png", alt: "Kihagyott lemondók aránya és álriasztások aránya szerződés és tenure szerint", caption: "narancs: a lemondók hányadát hagyta ki; kék: a maradók hányadát jelölte meg fölöslegesen" },
    blocks: [
      { kind: "ask", html: "Mit mutat a bal oldali ábra az egy- és kétéves szerződésekről?" },
      { kind: "text", step: 1, html: "Az egyéves lemondók <strong>96%</strong>-át, a kétévesek <strong>mindegyikét</strong> kihagyja: az alapvalószínűségük túl alacsony." },
    ],
  },
  {
    type: "content",
    eyebrow: "Visszacsatolás · hipotézis",
    title: "A modell túl félénk",
    blocks: [
      { kind: "text", html: "Nem tudja, ki lép le a hosszú szerződésekből, a havi szerződéses ügyfelek közt pedig a maradók <strong>közel 25%</strong>-át is megjelöli. A kockázatos szegmenseket megtanulta, de azon belül nem szór." },
      { kind: "ask", step: 1, html: "Két ötlet jön: <strong>(a)</strong> a pontosság legyen nagyobb, ezért állítsuk át a küszöböt arra, ahol a legnagyobb; <strong>(b)</strong> kevés a lemondó, ezért sokszorozzuk meg őket. Melyik működik?" },
      { kind: "tension", step: 2, label: "Szándékos hibák", html: "Mindkettő rossz — de a hiba tanulságos. Próbáljuk ki őket, mintha nem tudnánk." },
    ],
  },
  {
    type: "content",
    eyebrow: "1. szándékos hiba",
    title: "„Állítsuk be a küszöböt a pontosságra”",
    blocks: [
      { kind: "ask", html: "A pontosságot már ismerjük, azt is látjuk, hogy a modell többször téved, mint szeretnénk. Mi történik, ha azt a küszöböt választjuk, ahol a <strong>pontosság a legnagyobb</strong>?" },
      { kind: "text", step: 1, html: "Megkeressük: a pontosság csúcsa a <strong>0,56</strong>-os küszöbnél van." },
    ],
  },
  {
    type: "content",
    eyebrow: "1. szándékos hiba",
    title: "Három mutató",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/loop_kuszob_gorbek.png", alt: "Pontosság, kiegyensúlyozott pontosság és recall a küszöb függvényében", caption: "XGBoost, out-of-fold, train halmaz" },
    blocks: [
      { kind: "ask", html: "Mi történik a kékkel és a narancssárgával?" },
    ],
  },
  {
    type: "content",
    eyebrow: "1. szándékos hiba",
    title: "Jobb lett a modell?",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/tbl_hiba1.png", alt: "Az alap XGBoost és a pontosságra állított küszöb mutatói", caption: "ugyanaz a modell, két küszöb" },
    blocks: [
      { kind: "tension", label: "Mit optimalizáltunk?", html: "A pontosság <strong>0,791 → 0,793</strong> (+0,2 pont), de a recall <strong>0,513 → 0,448</strong>, a kiegyensúlyozott pontosság 0,702 → 0,683. Kevesebb lemondót találunk meg." },
      { kind: "plaque", step: 1, year: "1975 / 1997", html: "Goodhart-törvény (Strathern megfogalmazásában): ha egy mérőszám céllá válik, megszűnik jó mérőszámnak lenni." },
    ],
  },
  {
    type: "content",
    eyebrow: "2. szándékos hiba",
    title: "„Sokszorozzuk meg a lemondókat”",
    blocks: [
      { kind: "ask", html: "Kevés a lemondó. Mi lenne, ha a lemondókat <strong>megkettőznénk</strong>, amíg a két osztály egyenlő nem lesz, és <strong>utána</strong> futtatnánk a keresztvalidációt?" },
      { kind: "text", step: 1, html: "Az adat 8 278 sorra nő, 50%-nyi lemondóval. Futtatjuk az 5-fold CV-t ugyanazzal az XGBoosttal." },
    ],
  },
  {
    type: "content",
    eyebrow: "2. szándékos hiba",
    title: "PR-AUC: 0,65 → 0,87",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/loop_szivargas.png", alt: "PR-AUC: tisztességes alap, szivárgó mintavétel, mintavétel a foldon belül", caption: "keresztvalidált PR-AUC ugyanazzal az XGBoosttal" },
    blocks: [
      { kind: "ask", html: "Új információ nélkül lett sokkal jobb a modell. <strong>Higgyetek neki?</strong>" },
    ],
  },
  {
    type: "content",
    eyebrow: "2. szándékos hiba",
    title: "Az ikrek",
    blocks: [
      { kind: "ask", html: "Hogyan <strong>ellenőriznéd</strong>, hogy a validációs sorokat látta-e már a modell?" },
      { kind: "text", step: 1, html: "Megszámoltuk: a validációs foldok lemondó soraiból <strong>88%</strong>-nak ott van a pontos másolata a tanító foldban. A maradók közül <strong>0,4%</strong>-nak." },
      { kind: "tension", step: 2, label: "Szivárgás (leakage)", html: "A másolatok a split <strong>előtt</strong> készültek, így ugyanaz a lemondó mindkét oldalra került: a modellt olyan soron osztályozzuk, amit már megjegyzett." },
    ],
  },
  {
    type: "content",
    eyebrow: "2. szándékos hiba · javítás",
    title: "Javított mintavétel",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/tbl_hiba2.png", alt: "Alap, szivárgó és foldon belüli felülmintavételezés mutatói", caption: "imblearn pipeline: a mintavételezés csak a train foldon fut" },
    blocks: [
      { kind: "ask", html: "A PR-AUC nem változott, a recall nőtt. Mit csinált valójában a felülmintavételezés?" },
      { kind: "text", step: 1, html: "Feljebb tolta a valószínűségeket: mintha <strong>lejjebb vittük volna a küszöböt</strong>. Nem tanított semmi újat." },
    ],
  },
  {
    type: "content",
    eyebrow: "Visszacsatolás · jellemzők",
    title: "Új jellemző?",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/tbl_jellemzok.png", alt: "Három új jellemző PR-AUC-ja és páros különbsége az alaphoz képest", caption: "n_addons: kiegészítő szolgáltatások száma · price_gap: árváltozás · m2m_fiber: havi+fiber jelző · 3×5-fold CV, páros különbség" },
    blocks: [
      { kind: "ask", html: "Három jellemzőt próbáltunk. Javított valamelyik?" },
      { kind: "text", step: 1, html: "<strong>Egyik sem:</strong> a különbségek a szóráson belül vannak. Egy negatív eredmény is eredmény." },
    ],
  },
  {
    type: "content",
    eyebrow: "Visszacsatolás · a valódi javítás",
    title: "A működési pont",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/tbl_utazas.png", alt: "A kör négy lépésének mutatói egymás mellett", caption: "a kiemelt sor: a küszöb a kiegyensúlyozott pontosságra állítva (0,30)" },
    blocks: [
      { kind: "ask", html: "A modell félénk. <strong>Milyen mérőszám</strong> szerint állítsuk a küszöböt?" },
      { kind: "text", step: 1, html: "Kiegyensúlyozott pontosságra: küszöb <strong>0,30</strong> → recall <strong>0,739</strong>, kiegyens. pontosság <strong>0,754</strong>, PR-AUC változatlan (0,651)." },
    ],
  },
  {
    type: "content",
    eyebrow: "Visszacsatolás · tanulságok",
    title: "Mit tanultunk a körből?",
    blocks: [
      {
        kind: "list",
        items: [
          "A hibaelemzés <strong>konkrét hipotézist</strong> adott (a modell félénk, a hosszú szerződéseket nem látja)",
          "Két „javulás” <strong>illúzió</strong> volt: az egyiket a rossz mérőszám, a másikat a szivárgás okozta",
          "A jellemző-ötletek <strong>nem segítettek</strong> — és ezt le is írjuk",
          "Az egyetlen valódi javítás egy <strong>üzleti döntés</strong> (hová tesszük a küszöböt), nem egy nagyobb modell",
        ],
      },
      { kind: "tension", step: 1, label: "Költség", html: "Minden kör-iteráció elhasznál egy kicsit a validációs „költségvetésből” (többszörös összehasonlítás). Ezért állunk meg egy körnél, és a teszthalmaz érintetlen marad." },
    ],
  },

  // ---------------- Hangolás ----------------
  { type: "divider", index: "06", eyebrow: "Finomhangolás", title: "Hiperparaméter-hangolás" },
  {
    type: "content",
    eyebrow: "Hangolás",
    title: "Véletlen keresés, PR-AUC-ra",
    blocks: [
      { kind: "ask", html: "Hét hiperparaméter van az XGBoostban. Rácsot vagy véletlen mintavételt használnánk, és miért?" },
      { kind: "text", step: 1, html: "<strong>Véletlen keresés:</strong> ha csak néhány paraméter számít, a véletlen minták több különböző értéket próbálnak ki belőlük, mint egy rács. 30 jelölt az XGBoostra, 25 a Random Forestre, 5-fold CV, <strong>PR-AUC</strong> a célfüggvény." },
      { kind: "text", step: 2, html: "A nyertes XGBoost kicsi és óvatos: 122 fa, mélység 3, learning rate 0,038, <code>min_child_weight</code> 14." },
    ],
  },
  {
    type: "content",
    eyebrow: "Hangolás",
    title: "Előtte és utána",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/tuning_elotte_utana.png", alt: "PR-AUC alapértelmezett és hangolt beállítással, új CV-foldokon", caption: "átlag ± szórás, a kereséstől független foldokon" },
    blocks: [
      { kind: "ask", html: "Melyik modellen segített a hangolás a legtöbbet — és melyiken semmit?" },
      { kind: "text", step: 1, html: "Random Forest: 0,62 → 0,67. XGBoost: 0,65 → 0,67. Hangolás után a három modell a <strong>zajon belül</strong> egyforma." },
    ],
  },
  {
    type: "content",
    eyebrow: "Hangolás",
    title: "Optimista a keresés saját pontszáma?",
    blocks: [
      { kind: "ask", html: "A keresés „legjobb pontszáma” 30 próba <strong>maximuma</strong> ugyanazokon a foldokon. Mit várnátok: a valódi teljesítménynél magasabb vagy alacsonyabb?" },
      { kind: "text", step: 1, html: "Elvileg <strong>magasabb</strong> (kiválasztási torzítás: a maximumot választottuk). Ezért újra mérjük új foldokon." },
      { kind: "tension", step: 2, label: "A mi esetünkben", html: "A keresés saját pontszáma 0,671, az új foldokon 0,672 — <strong>itt nem látszik torzítás</strong>. Ez nem általános: kisebb adaton és több próbával nagyobb lehet, ezért mindig ellenőrizzük." },
    ],
  },

  // ---------------- Záró teszt ----------------
  { type: "divider", index: "07", eyebrow: "Egyetlen alkalom", title: "A záró kiértékelés" },
  {
    type: "content",
    eyebrow: "Záró teszt",
    title: "Előre rögzített szabály",
    blocks: [
      { kind: "ask", html: "Mielőtt kinyitjuk a teszthalmazt: <strong>mi dönti el</strong>, hogy melyik modell a végső — és hol van a küszöb?" },
      {
        kind: "list", step: 1,
        items: [
          "Végső modell: a logisztikus regresszió és a hangolt XGBoost közül <strong>az új CV-foldokon jobb PR-AUC</strong> (0,672 vs 0,661 → XGBoost)",
          "Küszöb: a végső modell train out-of-fold jóslataiból, kiegyensúlyozott pontosságra → <strong>0,23</strong>",
          "Illesztés az egész train halmazon, aztán a teszthalmaz <strong>egyszer</strong>",
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Záró teszt",
    title: "A teszthalmazon",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/tbl_vegso.png", alt: "A végső modell mutatói a teszthalmazon 0,5-ös és 0,23-as küszöbnél", caption: "1 409 ügyfél, ebből 374 lemondó" },
    blocks: [
      { kind: "ask", html: "Hasonlítsd össze a két sort. Mit nyertünk, és mit adtunk érte?" },
      { kind: "text", step: 1, html: "Küszöb 0,5 → 0,23: recall 0,51 → <strong>0,84</strong>, kiegyens. pontosság 0,71 → <strong>0,76</strong>, de precision 0,68 → 0,49." },
    ],
  },
  {
    type: "content",
    eyebrow: "Záró teszt",
    title: "A működési pont a görbén",
    visual: { kind: "image", src: "assets/final_pr_gorbe.png", alt: "Precision-recall görbe a teszthalmazon a választott küszöbbel", caption: "a narancs pont: a 0,23-as küszöb" },
    blocks: [
      { kind: "text", html: "Konfúziós mátrix a 0,23-as küszöbnél: <strong>TP 313</strong>, <strong>FP 320</strong>, <strong>FN 61</strong>, <strong>TN 715</strong>." },
      { kind: "ask", step: 1, html: "A 374 lemondóból 313-at megfogunk, de 320 fölösleges hívással. Megéri ez? Mitől függ?" },
      { kind: "text", step: 2, html: "A <strong>hívás költségétől</strong> és egy megmentett ügyfél értékétől. Ezt nem a modell, hanem az üzlet tudja." },
    ],
  },
  {
    type: "content",
    eyebrow: "Záró teszt",
    title: "Mennyit tudunk valójában?",
    blocks: [
      { kind: "text", html: "A teszt PR-AUC <strong>0,663</strong>, 95%-os bootstrap konfidenciaintervallum: <strong>[0,615; 0,714]</strong>. Ugyanazon a teszthalmazon a logisztikus regresszió 0,634." },
      { kind: "ask", step: 1, html: "A páros bootstrap szerint az XGBoost +0,029-cel jobb ([+0,010; +0,048]), az intervallum nem tartalmazza a nullát. Akkor <strong>az XGBoost jobb</strong>?" },
      { kind: "tension", step: 2, label: "Óvatosan", html: "A CV szerint a két modell közel döntetlen (0,672 vs 0,661), a teszten a különbség nagyobb. A bootstrap csak a <strong>teszt-sorok mintavételi zaját</strong> méri két rögzített modellre; a tanító halmaz véletlenjét és ennek az egy splitnek a szerencséjét nem. Józan olvasat: valószínűleg kissé jobb, a mértéke bizonytalan." },
      { kind: "ask", step: 3, html: "Hogyan ellenőriznéd? (Ismételd meg a teljes split–hangolás–kiértékelés folyamatot több seeddel.)" },
    ],
  },
  {
    type: "content",
    eyebrow: "Összefoglaló",
    title: "Ellenőrzőlista",
    blocks: [
      {
        kind: "list",
        items: [
          "Először szétválasztunk; ami tanul, az pipeline-ban él",
          "Alapmodell és dummy mindig; ugyanazok a foldok minden modellnek",
          "Mérőszám előre: kiegyensúlyozott pontosság, PR-AUC, konfúziós mátrix, precision@K",
          "Hibaelemzés out-of-fold jóslatokon, és gyanakvás minden túl nagy (vagy rossz mérőszám szerinti) javulásra",
          "Hangolás CV-n, ellenőrzés új foldokon",
          "A teszthalmaz: egyszer, bootstrap konfidenciaintervallummal",
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Házi",
    title: "Építs saját klasszifikátort",
    blocks: [
      { kind: "text", html: "Válassz <strong>egy</strong> adatsort (lehetőleg mindenki mást), és építs rá bináris klasszifikátort — egyetlen notebookban." },
      {
        kind: "list", step: 1,
        items: [
          "Adatsor-választék: Bank Marketing (UCI), Default of Credit Card Clients (UCI), Adult / Census Income (UCI), Give Me Some Credit (Kaggle)",
          "Kötelező: split előbb, dummy és alapmodell, legalább három modell, a mai mutatók, <strong>egy dokumentált visszacsatolási kör</strong>, hangolás, a teszthalmaz egyszer",
          "Pontozás: az <strong>indoklás</strong> számít, nem a pontszám — a sikertelen próbálkozás is érték, ha őszintén leírod",
        ],
      },
      { kind: "text", step: 2, html: "A részletek, az adatsorok linkjei és a buktatók: <code>homework.md</code>." },
    ],
  },
];
