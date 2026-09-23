window.LESSON_LABEL = "1. óra · Statisztikai alapok";

window.SLIDES = [
  {
    type: "title",
    eyebrow: "Data Science műhelykurzus",
    title: "Statisztikai alapok",
    kicker: "Miért téved az intuíciónk szisztematikusan — és mit kezdünk ezzel.",
    note: "Kárpáti András · 1. óra",
  },
  {
    type: "content",
    eyebrow: "Mielőtt elkezdenénk",
    title: "Ez nem előadás.",
    blocks: [
      { kind: "text", html: "Minden témát egy <strong>kérdéssel vagy játékkal</strong> nyitunk, és csak utána jön a formalizmus." },
      { kind: "text", step: 1, html: "Mert az intuíciónk — és a mezőt megalapozó tudósoké is — itt szinte mindig téved. Ez a mai óra fő üzenete." },
    ],
  },

  // ---------------- 1. Monty Hall ----------------
  { type: "divider", index: "01", eyebrow: "Nyitójáték", title: "Váltasz ajtót?" },
  {
    type: "content",
    eyebrow: "Monty Hall",
    title: "A játék",
    visual: { kind: "doors" },
    blocks: [
      { kind: "text", html: "3 ajtó. Az egyik mögött főnyeremény, kettő mögött semmi. Választasz egyet." },
      { kind: "text", step: 1, html: "A műsorvezető — <strong>aki tudja, hol a nyeremény</strong> — kinyit egy másik, üres ajtót." },
      { kind: "ask", step: 2, label: "A kérdés", html: "Váltasz ajtót, vagy maradsz az eredetinél?" },
    ],
    note: "✋ szavazzunk, mielőtt bármit levezetünk",
  },
  {
    type: "content",
    eyebrow: "Monty Hall",
    title: "1990, Parade magazin",
    blocks: [
      { kind: "plaque", year: "1990", html: "<strong>Marilyn vos Savant</strong> megírta a helyes választ (válts ajtót) a Parade magazin rovatában." },
      {
        kind: "list", step: 1,
        items: [
          "~10 000 olvasó írt neki, hogy téved",
          "közülük ~1000-en doktori fokozattal rendelkeztek",
          "Erdős Pált is csak egy szimuláció győzte meg",
        ],
      },
      { kind: "ask", step: 2, html: "Miért téved itt szinte mindenki — beleértve a matematikusokat is?" },
    ],
  },

  // ---------------- 2. Bayes ----------------
  { type: "divider", index: "02", eyebrow: "Formalizmus", title: "Bayes-tétel" },
  {
    type: "content",
    eyebrow: "Bayes-tétel",
    title: "Amit épp csináltatok",
    blocks: [
      { kind: "text", html: "Új infó (a felfedett ajtó) hatására <strong>megváltozott a hitünk</strong> egy esemény valószínűségéről." },
      { kind: "text", step: 1, html: "<span style='font-family:var(--font-mono); font-size:1.3em; color:var(--accent)'>P(A|B) = P(B|A) · P(A) / P(B)</span>" },
      {
        kind: "list", step: 2,
        items: [
          "<strong>posterior</strong> — P(A|B): amit tudni akarunk, <em>miután</em> megláttuk B-t",
          "<strong>prior</strong> — P(A): amit A-ról hittünk, <em>mielőtt</em> bármit megláttunk",
          "<strong>likelihood</strong> — P(B|A): mennyire valószínű B, ha A igaz",
          "<strong>evidence</strong> — P(B): mennyire valószínű B, A-tól függetlenül (minden esetben)",
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Bayes-tétel",
    title: "Monty Hall, formálisan",
    visual: { kind: "doors", openIndex: 3 },
    blocks: [
      { kind: "text", html: "Az 1-es ajtót választottad. A műsorvezető kinyitja a 3-ast — üres." },
      { kind: "text", step: 1, html: "<span style='font-family:var(--font-mono); color:var(--ink-dim)'>Kiindulás: P(nyer.=1) = P(nyer.=2) = P(nyer.=3) = 1/3</span>" },
      { kind: "text", step: 2, html: "<span style='font-family:var(--font-mono); color:var(--ink-dim)'>Mennyi eséllyel nyitja pont a 3-ast, ha ott lenne a nyeremény?<br>P(nyit 3 | nyer 1) = 1/2 &nbsp;·&nbsp; P(nyit 3 | nyer 2) = 1 &nbsp;·&nbsp; P(nyit 3 | nyer 3) = 0</span>" },
      { kind: "ask", step: 3, label: "Bayes-tétellel", html: "P(nyer 2 | nyitotta a 3-ast) = 2/3 — pontosan amit a szimulációban láttunk." },
    ],
  },
  {
    type: "content",
    eyebrow: "Bayes-tétel",
    title: "A teszt paradoxona",
    visual: { kind: "image", src: "assets/bayes-area-diagram.png", alt: "Bayes-tétel területarányos ábrázolása", caption: "Forrás: 3Blue1Brown — Bayes theorem, the geometry of changing beliefs" },
    blocks: [
      { kind: "text", html: "Egy ritka betegség prevalenciája <strong>1%</strong>. A teszt 99%-ban helyesen jelez pozitívat betegnél, és 99%-ban helyesen jelez negatívat egészségesnél." },
      { kind: "ask", step: 1, html: "Pozitív lettél. Mekkora eséllyel vagy <em>tényleg</em> beteg?" },
      { kind: "text", step: 2, html: "→ tippelj, mielőtt levezetjük a <code>demo.ipynb</code>-ben (a legtöbben ~99%-ot mondanak)." },
    ],
  },
  {
    type: "content",
    eyebrow: "Bayes-tétel",
    title: "Bayes a történelemben",
    blocks: [
      { kind: "plaque", year: "1763", html: "Thomas Bayes tiszteletes sosem publikálta életében — barátja, Richard Price adta ki <strong>posztumusz</strong>." },
      { kind: "plaque", step: 1, year: "≈1780", html: "Laplace <strong>függetlenül újra felfedezi</strong>, és jóval általánosabb formában alkalmazza." },
      { kind: "plaque", step: 2, year: "1939–45", html: "Turing & Good bayesi módszerekkel törik fel az Enigmát Bletchley Parkban." },
    ],
  },

  // ---------------- 3. Nagy számok törvénye ----------------
  { type: "divider", index: "03", eyebrow: "Formalizmus", title: "Nagy számok törvénye" },
  {
    type: "content",
    eyebrow: "Nagy számok törvénye",
    title: "„Esedékes” az írás?",
    blocks: [
      { kind: "text", html: "Szabályos érme. 8-szor egymás után fej jön ki." },
      { kind: "ask", step: 1, html: "Mennyi az esélye, hogy a 9. dobás írás?" },
      { kind: "tension", step: 2, label: "Gambler's fallacy", html: "Az érmének nincs memóriája — a valószínűség 50% marad. A múltbeli kilengés egyre kisebb súlyú lesz egy egyre hosszabb sorozatban, de nem „kompenzál”." },
      { kind: "text", step: 3, html: "<span style='font-family:var(--font-mono); font-size:1.3em; color:var(--accent)'>x̄ₙ → μ, ha n → ∞</span><br><span style='color:var(--ink-dim)'>A tétel maga: a mintaátlag (x̄ₙ) a valódi várható értékhez (μ) tart, ahogy a megfigyelések száma (n) végtelenhez tart.</span>" },
    ],
    visual: { kind: "image", step: 3, src: "assets/lln_running_mean.png", alt: "Futó átlag konvergenciája", caption: "→ demo.ipynb — 2000 érmedobás futó átlaga" },
  },
  {
    type: "content",
    eyebrow: "Nagy számok törvénye",
    title: "20 év egy bizonyításra",
    blocks: [
      { kind: "plaque", year: "1713", html: "Jakob Bernoulli <em>Ars Conjectandi</em> — unokaöccse, Nicolaus adja ki <strong>posztumusz</strong>, ~20 év munka után." },
      { kind: "text", step: 1, html: "Az első szigorú bizonyítéka egy addig csak minden szerencsejátékos által <em>ösztönösen</em> tudott ténynek." },
    ],
  },

  // ---------------- 4. CLT ----------------
  { type: "divider", index: "04", eyebrow: "Formalizmus", title: "Centrális határeloszlás-tétel" },
  {
    type: "content",
    eyebrow: "CLT",
    title: "Kérdés, mielőtt megnézzük",
    blocks: [
      { kind: "text", html: "Ha <strong>bármilyen</strong> — akár nagyon ferde — eloszlásból sokszor mintát veszünk, és mindig kiszámoljuk a mintaátlagot —" },
      { kind: "ask", step: 1, html: "milyen alakú lesz maguknak az átlagoknak az eloszlása?" },
      { kind: "text", step: 2, html: "<span style='font-family:var(--font-mono); font-size:1.3em; color:var(--accent)'>X̄ₙ ≈ Normal(μ, σ²/n), ha n elég nagy</span><br><span style='color:var(--ink-dim)'>A tétel maga: a mintaátlagok eloszlása — <em>függetlenül</em> az eredeti eloszlás alakjától — normális eloszláshoz tart, ahogy n nő.</span>" },
    ],
    visual: { kind: "image", step: 2, src: "assets/normal_distribution.png", alt: "Normális eloszlás haranggörbéje", caption: "Normal(μ, σ²) — a haranggörbe" },
    note: "→ demo.ipynb: exponenciális eloszlás → mintaátlagok",
  },
  {
    type: "content",
    eyebrow: "CLT",
    title: "170 év a szigorú bizonyításig",
    visual: { kind: "image", step: 2, src: "assets/galton_board.png", alt: "Galton-deszka (quincunx), Galton 1889-es diagramja", caption: "Francis Galton, 1889 — a quincunx eredeti diagramja" },
    blocks: [
      { kind: "plaque", year: "1733", html: "de Moivre közelíti a binomiálist normálissal." },
      { kind: "plaque", step: 1, year: "1901", html: "Ljapunov adja az <strong>általános, szigorú</strong> bizonyítást." },
      { kind: "plaque", step: 2, year: "1889", html: "Galton megépíti a „bean machine”-t — fizikai CLT-demonstrátor, ma is kapható játékként." },
      { kind: "text", step: 3, html: "<strong>Ezért működik szinte minden hipotézisvizsgálat</strong> — nem az egyedi adatpontoktól, hanem a mintaátlagok kiszámítható viselkedésétől." },
    ],
  },

  // ---------------- 5. Hipotézisvizsgálat ----------------
  { type: "divider", index: "05", eyebrow: "Formalizmus", title: "Hipotézisvizsgálat" },
  {
    type: "content",
    eyebrow: "Hipotézisvizsgálat",
    title: "A/B teszt a checkers.com-on",
    blocks: [
      { kind: "text", html: "A checkers.com új regisztrációs oldalt tesztel." },
      {
        kind: "list", step: 1,
        items: [
          "Kontroll (A): 1000 látogatóból <strong>84</strong> regisztrált (8.4%)",
          "Új verzió (B): 1000 látogatóból <strong>103</strong> regisztrált (10.3%)",
        ],
      },
      { kind: "ask", step: 2, html: "Tényleg jobb az új oldal, vagy ez csak véletlen ingadozás?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Hipotézisvizsgálat",
    title: "Amit a p-érték NEM jelent",
    visual: { kind: "image", step: 2, src: "assets/checkers_ab_test.png", alt: "Permutációs teszt eredménye", caption: "→ demo.ipynb — checkers.com A/B teszt, permutációs eloszlás" },
    blocks: [
      { kind: "tension", label: "Leggyakoribb tévhit", html: "❌ „Annak a valószínűsége, hogy a nullhipotézis igaz.”" },
      { kind: "text", step: 1, html: "✅ „Milyen valószínű, hogy <em>legalább ilyen extrém</em> adatot látnék, HA a nullhipotézis igaz volna.”" },
      { kind: "text", step: 2, html: "A checkers.com adatán: <strong>p = 0.17</strong> — a megfigyelt +1.9 százalékpontos különbség simán előfordulhat puszta véletlenből is. <em>Nem</em> mondanánk, hogy az új oldal szignifikánsan jobb." },
    ],
  },
  {
    type: "content",
    eyebrow: "Hipotézisvizsgálat",
    title: "Lady Tasting Tea",
    blocks: [
      { kind: "plaque", year: "1920-as évek", html: "Ronald Fisher, Rothamsted — Muriel Bristol kolléganője állítja: meg tudja mondani, a teát vagy a tejet öntötték-e előbb a csészébe." },
      {
        kind: "text", step: 1,
        html: "Fisher megtervezi a kísérletet: <strong>8 csésze</strong> teát készít — 4-et tej-előbb, 4-et tea-előbb módszerrel —, véletlen sorrendben adja oda. Bristolnak <strong>pontosan 4-4-re</strong> kell szétválogatnia őket.",
      },
      {
        kind: "text", step: 2,
        html: "<span style='font-family:var(--font-mono); font-size:1.2em; color:var(--accent)'>C(8,4) = 70</span><br><span style='color:var(--ink-dim)'>Ennyiféleképp választhat ki 4 csészét a 8-ból — ha csak <em>tippel</em>, 1/70 eséllyel (≈1.4%) találja el mind a 8-at helyesen.</span>",
      },
      { kind: "ask", step: 3, html: "(A kísérlet végén: Bristol mind a 8 csészét helyesen azonosította.)" },
      { kind: "plaque", step: 4, year: "1935", html: "Fisher közzéteszi a módszert az <em>The Design of Experiments</em>-ben — ebből születik a modern szignifikanciavizsgálat." },
      { kind: "tension", step: 5, label: "Még a founderek is vitáztak", html: "Fisher és a Neyman–Pearson páros (1933) évtizedekig vitatkozott azon, mit is jelent egy szignifikanciateszt. A ma tanított „p < 0.05” recept a két, egymással vitázó iskola hibridje." },
    ],
  },

  // ---------------- 6. Korreláció vs kauzalitás ----------------
  { type: "divider", index: "06", eyebrow: "Gondolkodásmód", title: "Korreláció vs. kauzalitás" },
  {
    type: "content",
    eyebrow: "Korreláció vs. kauzalitás",
    title: "Spurious correlations",
    visual: { kind: "image", src: "assets/spurious_correlation.png", alt: "Nicolas Cage filmek és fulladásos halálesetek grafikonja", caption: "Valódi adat, 1980–2013 (forrás: tylervigen.com), r = 0.559" },
    blocks: [
      { kind: "text", html: "Nicolas Cage filmjeinek száma évente ↔ fulladásos halálesetek száma az USA-ban. <strong>Ez valódi, publikált adat</strong> — nem vicc, nem szimuláció." },
      { kind: "ask", step: 1, html: "Ha A és B együtt mozog — mi lehet a magyarázat A→B okozáson kívül?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Korreláció vs. kauzalitás",
    title: "Három lehetséges magyarázat",
    visual: { kind: "causal" },
    blocks: [
      { kind: "text", html: "Amikor A és B korrelál, legalább három versengő magyarázat van — a puszta korreláció nem dönti el, melyik igaz." },
      { kind: "ask", step: 1, html: "Mondj egy-egy saját, valódi példát mindhárom típusra!" },
      { kind: "text", step: 2, html: "<span style='color:var(--ink-dim)'>Pl. fagylaltfogyasztás ↔ vízbefulladás: nem egymás okozói — a közös ok a nyári hőség (confounder).</span>" },
    ],
  },
  {
    type: "content",
    eyebrow: "Korreláció vs. kauzalitás",
    title: "Dohányzás és tüdőrák, 1950-es évek",
    blocks: [
      { kind: "tension", label: "Kényes pont", html: "<strong>Ronald Fisher</strong> — a modern statisztika atyja, akit épp az előbb mutattunk be — <strong>a dohányipar fizetett tanácsadójaként</strong> érvelt, hogy egy meg nem figyelt genetikai konfounder magyarázhatja a korrelációt." },
      { kind: "text", step: 1, html: "A tudomány nem tekintélyi alapon dől el — még a legnagyobb statisztikusok is tévedhetnek, vagy elfogultak lehetnek." },
      { kind: "plaque", step: 2, year: "1965", html: "Austin Bradford Hill kauzalitási kritériumai segítenek végül lezárni a vitát." },
    ],
  },

  // ---------------- 7. Simpson ----------------
  { type: "divider", index: "07", eyebrow: "Gondolkodásmód", title: "Simpson-paradoxon" },
  {
    type: "content",
    eyebrow: "Simpson-paradoxon",
    title: "UC Berkeley, 1973",
    blocks: [
      { kind: "text", html: "Az egyetem ellen nemi diszkriminációs pert indítottak: az <strong>összesített</strong> felvételi arány férfiaknál magasabb volt, mint nőknél." },
      { kind: "ask", step: 1, html: "Ez bizonyítja a diszkriminációt?" },
    ],
    note: "→ demo.ipynb: toy admissions adat",
  },
  {
    type: "content",
    eyebrow: "Simpson-paradoxon",
    title: "Tanszékenkénti bontás",
    visual: { kind: "image", src: "assets/simpsons_paradox.png", alt: "Simpson-paradoxon: összesített vs. tanszékenkénti felvételi arány", caption: "→ demo.ipynb — toy admissions adat" },
    blocks: [
      { kind: "text", html: "A legtöbb tanszéken a nők felvételi aránya <strong>egyenlő vagy magasabb</strong> volt — mert aránytalanul sok jelentkezést adtak be a legversenyzőbb tanszékekre." },
      { kind: "ask", step: 1, html: "Hogyan lehet minden alcsoportban jobb az arány, mégis összesítve rosszabb?" },
      { kind: "plaque", step: 2, year: "1951 / 1972", html: "Pearson (1899) és Yule (1903) már leírta — a nevét mégis Edward Simpson 1951-es cikke után kapta, Colin Blyth elnevezésében (1972)." },
    ],
  },

  // ---------------- 8. Dimenzió-átok ----------------
  { type: "divider", index: "08", eyebrow: "Előrejelzés a 2. órára", title: "Dimenzió-átok" },
  {
    type: "content",
    eyebrow: "Dimenzió-átok",
    title: "Mindenki egyformán távol",
    visual: { kind: "image", src: "assets/curse_of_dimensionality.png", alt: "Dimenzió-átok: távolságarány, gömb/kocka térfogatarány, véletlen vektorok szöge", caption: "→ demo.ipynb — három nézet ugyanarra a jelenségre" },
    blocks: [
      { kind: "text", html: "Ahogy nő a feature-ök száma, minden pont egyre „egyformábban” távol kerül minden más ponttól." },
      { kind: "ask", step: 1, html: "Ha mindenki kb. ugyanolyan távol van tőled — van-e még értelme a „legközelebbi szomszédnak”?" },
      {
        kind: "list", step: 2,
        items: [
          "Egy egységgömb térfogata <strong>eltűnik</strong> a körülírt kockájához képest, ahogy nő a dimenzió",
          "Két <strong>véletlen</strong> vektor szöge nagy dimenzióban ~90°-hoz tart — majdnem mindig merőlegesek",
        ],
      },
      { kind: "plaque", step: 3, year: "1957", html: "Richard Bellman alkotja meg a kifejezést — eredetileg <strong>nem</strong> statisztikában, hanem a dinamikus programozás exponenciálisan növekvő állapotterére." },
    ],
  },

  // ---------------- 9. Lineáris regresszió ----------------
  { type: "divider", index: "09", eyebrow: "Első modell", title: "Lineáris regresszió" },
  {
    type: "content",
    eyebrow: "Lineáris regresszió",
    title: "Legkisebb négyzetek",
    visual: { kind: "image", step: 2, src: "assets/linear_regression.png", alt: "Lineáris regresszió: illesztett egyenes és reziduumok", caption: "→ demo.ipynb — y = ŷ + ε, R² kiszámolva" },
    blocks: [
      { kind: "text", html: "<span style='font-family:var(--font-mono); font-size:1.2em; color:var(--accent)'>y = β₀ + β₁x + ε</span>" },
      {
        kind: "list", step: 1,
        items: [
          "<strong>β₀</strong> (tengelymetszet): a modell predikciója, ha x = 0",
          "<strong>β₁</strong> (meredekség): mennyit változik y, ha x eggyel nő",
          "<strong>ε</strong> (hiba/reziduum): amit a modell <em>nem</em> magyaráz meg",
        ],
      },
      { kind: "ask", step: 2, html: "Miért a hiba <em>négyzetét</em> minimalizáljuk, nem az abszolút értékét?" },
      { kind: "text", step: 3, html: "<strong>R²</strong>: a kimenet varianciájának hányad része magyarázható a modellel — 0 és 1 között, minél nagyobb, annál jobban illeszkedik." },
    ],
  },
  {
    type: "content",
    eyebrow: "Lineáris regresszió",
    title: "Regresszió a középszerűséghez",
    blocks: [
      { kind: "text", html: "Galton észrevette: a <strong>magas szülők</strong> gyerekei átlagosan alacsonyabbak a szülőknél, az <strong>alacsony szülők</strong> gyerekei pedig magasabbak." },
      { kind: "ask", step: 1, html: "Ez azt jelenti, hogy a populáció idővel „ellaposodik”, mindenki egyforma magas lesz?" },
      {
        kind: "tension", step: 2, label: "Nem — ez statisztikai, nem oksági jelenség",
        html: "Ha egy mérés részben <strong>véletlenből</strong> is áll, a szélsőséges eredmény részben szerencse — egy megismételt/kapcsolódó mérés valószínűleg kevésbé lesz szélsőséges, <em>anélkül</em> hogy bármi ok-okozati történne. (Ugyanez a jelenség: egy kiemelkedő rookie szezon után jövő évre a legtöbb sportoló „visszaesik” az átlaga felé — nem mert rosszabb lett, hanem mert az első szezon részben szerencse volt.)",
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Lineáris regresszió",
    title: "Két név, két történet",
    blocks: [
      { kind: "plaque", year: "1886", html: "Galton publikálja a jelenséget — innen a „regresszió” szó a statisztikában." },
      { kind: "tension", step: 1, label: "Elsőbbségi vita", html: "Legendre publikálja először a legkisebb négyzetek módszerét (1805) — Gauss szerint ő már 1795 óta használta." },
      { kind: "plaque", step: 2, year: "1801", html: "Gauss a módszerrel <strong>helyesen megjósolja</strong>, hol tűnik fel újra a „elveszett” Ceres törpebolygó." },
    ],
  },

  // ---------------- 10. Logisztikus regresszió ----------------
  { type: "divider", index: "10", eyebrow: "Második modell", title: "Logisztikus regresszió" },
  {
    type: "content",
    eyebrow: "Logisztikus regresszió",
    title: "Bináris kimenet — miért ne lineáris?",
    blocks: [
      { kind: "text", html: "Meg akarod jósolni: lemorzsolódik-e a felhasználó (igen/nem)." },
      { kind: "ask", step: 1, html: "Miért ne futtatnátok le rajta egyszerűen a most tanult lineáris regressziót?" },
      { kind: "text", step: 2, html: "→ ez a <strong>lineáris valószínűségi modell (LPM)</strong>." },
    ],
  },
  {
    type: "content",
    eyebrow: "Logisztikus regresszió",
    title: "Amikor az LPM elromlik",
    visual: { kind: "image", step: 1, src: "assets/lpm_vs_logistic.png", alt: "LPM vs. logisztikus regresszió görbe összehasonlítása", caption: "→ demo.ipynb — LPM (piros) vs. szigmoid (arany)" },
    blocks: [
      { kind: "text", html: "Az LPM predikciói <strong>0 alá és 1 fölé</strong> mennek. Mit jelent egy „-12%-os esély”?" },
      { kind: "ask", step: 1, html: "Milyen függvény szorítaná a predikciót mindig [0,1] közé, bármi is legyen a bemenet?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Logisztikus regresszió",
    title: "Száz év a névadásig",
    blocks: [
      {
        kind: "columns",
        items: null,
        columns: [
          { heading: "1830–40-es évek", html: "Verhulst bevezeti a <strong>logisztikus függvényt</strong> — korlátozott népességnövekedés, Malthus korlátlan modelljével szemben. Innen a név." },
          { heading: "1958", html: "David Cox dolgozza ki a logisztikus <strong>regressziót</strong> mint statisztikai módszert." },
        ],
      },
      { kind: "text", step: 1, html: "Ma egy lineáris modellt egy nem-lineáris transzformációval bővítettetek ki — jövő héten innen indulunk, és rendesen nem-lineárissá válunk." },
    ],
  },

  {
    type: "divider",
    index: "→",
    eyebrow: "A mai óra vége",
    title: "Házi feladat",
    kicker: "Lásd: homework.md",
  },
];
