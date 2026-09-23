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
      { kind: "text", step: 2, html: "<span style='font-family:var(--font-mono); font-size:1.3em; color:var(--accent)'>X̄ₙ ≈ Normal(μ, σ²/n), ha n elég nagy</span><br><span style='color:var(--ink-dim)'>Ez a <strong>mintaátlagra (X̄ₙ)</strong> vonatkozik, nem az egyedi megfigyelésekre — az eredeti adat maradhat tetszőlegesen ferde.</span>" },
    ],
    visual: { kind: "image", step: 2, src: "assets/normal_distribution.png", alt: "A mintaátlag (X̄ₙ) mintavételi eloszlása, nem az egyedi adatok eloszlása", caption: "Ez X̄ₙ eloszlása — nem az eredeti adaté" },
    note: "→ demo.ipynb: exponenciális eloszlás → mintaátlagok",
  },
  {
    type: "content",
    eyebrow: "CLT",
    title: "170 év a szigorú bizonyításig",
    visual: { kind: "image", step: 1, src: "assets/galton_board.png", alt: "Galton-deszka (quincunx), Galton 1889-es diagramja", caption: "Francis Galton, 1889 — a quincunx eredeti diagramja" },
    blocks: [
      { kind: "plaque", year: "1733", html: "de Moivre közelíti a binomiálist normálissal." },
      { kind: "plaque", step: 1, year: "1889", html: "Galton megépíti a „bean machine”-t — fizikai CLT-demonstrátor, ma is kapható játékként." },
      { kind: "plaque", step: 2, year: "1901", html: "Ljapunov adja az <strong>általános, szigorú</strong> bizonyítást." },
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
      {
        kind: "text", step: 2,
        html: "<span style='font-family:var(--font-mono); color:var(--accent)'>p̂_A = 84/1000 = 8.4%<br>p̂_B = 103/1000 = 10.3%<br>p̂_B − p̂_A = 10.3% − 8.4% = <strong>+1.9 százalékpont</strong></span>",
      },
      { kind: "ask", step: 3, html: "Tényleg jobb az új oldal ezzel a +1.9 pontos különbséggel, vagy ez csak véletlen ingadozás?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Hipotézisvizsgálat",
    title: "A permutációs teszt — lépésről lépésre",
    visual: { kind: "image", step: 2, src: "assets/checkers_ab_test.png", alt: "Permutációs teszt eredménye", caption: "→ demo.ipynb — szürke: 10 000 kevert különbség; piros: a megfigyelt +1.9pp" },
    blocks: [
      { kind: "text", html: "Ha H0 igaz (nincs valódi különbség), az A/B címke csak egy véletlen cédula a 2000 látogatón — <strong>felcserélhető</strong>." },
      {
        kind: "list", step: 1,
        items: [
          "Keverd össze véletlenül a 2000 címkét (1000 „A”, 1000 „B”)",
          "Számold ki az új „B” − „A” különbséget",
          "Ismételd 10 000-szer",
        ],
      },
      {
        kind: "text", step: 2,
        html: "<span style='font-family:var(--font-mono); color:var(--accent)'>p = (hányszor |kevert különbség| ≥ 1.9pp) / 10 000 = <strong>0.170</strong></span>",
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Hipotézisvizsgálat",
    title: "Amit a p-érték NEM jelent",
    blocks: [
      { kind: "tension", label: "Leggyakoribb tévhit", html: "❌ „Annak a valószínűsége, hogy a nullhipotézis igaz.”" },
      { kind: "text", step: 1, html: "✅ „Milyen valószínű, hogy <em>legalább ilyen extrém</em> adatot látnék, HA a nullhipotézis igaz volna.”" },
      { kind: "text", step: 2, html: "A checkers.com adatán ez pontosan <strong>17%</strong> — nem elég ritka ahhoz, hogy kizárjuk a véletlent. <em>Nem</em> mondanánk, hogy az új oldal szignifikánsan jobb." },
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
    ],
  },
  {
    type: "content",
    eyebrow: "Hipotézisvizsgálat",
    title: "Még a founderek is vitáztak",
    blocks: [
      { kind: "plaque", year: "1933", html: "Neyman és Pearson kidolgozza saját keretét (alternatív hipotézis, I./II. típusú hiba)." },
      { kind: "tension", step: 1, label: "Még a founderek is vitáztak", html: "Fisher és a Neyman–Pearson páros évtizedekig vitatkozott azon, mit is jelent egy szignifikanciateszt. A ma tanított „p < 0.05” recept a két, egymással vitázó iskola hibridje." },
      { kind: "plaque", step: 2, year: "1935", html: "Fisher közzéteszi saját módszerét az <em>The Design of Experiments</em>-ben — ebből születik a modern szignifikanciavizsgálat." },
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
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/simpsons_paradox.png", alt: "Simpson-paradoxon: összesített vs. tanszékenkénti felvételi arány", caption: "→ demo.ipynb — toy admissions adat" },
    blocks: [
      { kind: "text", html: "Minden tanszéken a nők felvételi aránya <strong>magasabb</strong> volt." },
      { kind: "ask", step: 1, html: "Hogyan lehet minden alcsoportban jobb az arány, mégis összesítve rosszabb?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Simpson-paradoxon",
    title: "A számítás",
    blocks: [
      {
        kind: "list",
        items: [
          "A tanszék (könnyű, 60-65%): 800 férfi, 200 nő jelentkezik",
          "B tanszék (nehéz, 30-35%): 200 férfi, 800 nő jelentkezik",
        ],
      },
      {
        kind: "text", step: 1,
        html: "<span style='font-family:var(--font-mono); font-size:1.05em; color:var(--accent)'>férfi összesített = (800×60% + 200×30%) / 1000 = 54%<br>nő összesített&nbsp;&nbsp;&nbsp;&nbsp;= (200×65% + 800×35%) / 1000 = 41%</span><br><span style='color:var(--ink-dim)'>A súlyozás — nem a diszkrimináció — húzza le a nők összesített számát.</span>",
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Simpson-paradoxon",
    title: "Régebbi, mint a neve",
    blocks: [
      { kind: "plaque", year: "1951 / 1972", html: "Pearson (1899) és Yule (1903) már leírta — a nevét mégis Edward Simpson 1951-es cikke után kapta, Colin Blyth elnevezésében (1972)." },
    ],
  },

  // ---------------- 8. Dimenzió-átok ----------------
  { type: "divider", index: "08", eyebrow: "Előrejelzés a 2. órára", title: "Dimenzió-átok" },
  {
    type: "content",
    eyebrow: "Dimenzió-átok",
    title: "Mindenki egyformán távol",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/curse_of_dimensionality.png", alt: "Dimenzió-átok: távolságarány, gömb/kocka térfogatarány, véletlen vektorok szöge", caption: "→ demo.ipynb — három nézet ugyanarra a jelenségre" },
    blocks: [
      { kind: "text", html: "Ahogy nő a feature-ök száma, minden pont egyre „egyformábban” távol kerül minden más ponttól." },
      { kind: "ask", step: 1, html: "Ha mindenki kb. ugyanolyan távol van tőled — van-e még értelme a „legközelebbi szomszédnak”?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Dimenzió-átok",
    title: "Két meglepő következmény",
    blocks: [
      {
        kind: "list",
        items: [
          "Egy egységgömb térfogata <strong>eltűnik</strong> a körülírt kockájához képest, ahogy nő a dimenzió",
          "Két <strong>véletlen</strong> vektor szöge nagy dimenzióban ~90°-hoz tart — majdnem mindig merőlegesek",
        ],
      },
      { kind: "plaque", step: 1, year: "1957", html: "Richard Bellman alkotja meg a kifejezést — eredetileg <strong>nem</strong> statisztikában, hanem a dinamikus programozás exponenciálisan növekvő állapotterére." },
    ],
  },

  // ---------------- 9. Lineáris regresszió ----------------
  { type: "divider", index: "09", eyebrow: "Első modell", title: "Lineáris regresszió" },
  {
    type: "content",
    eyebrow: "Lineáris regresszió",
    title: "Legkisebb négyzetek",
    visual: { kind: "image", step: 1, src: "assets/linear_regression.png", alt: "Lineáris regresszió: illesztett egyenes és reziduumok", caption: "→ demo.ipynb — y = ŷ + ε, R² kiszámolva" },
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
    ],
  },
  {
    type: "content",
    eyebrow: "Lineáris regresszió",
    title: "Miért a négyzet, és mi az R²?",
    blocks: [
      { kind: "ask", html: "Miért a hiba <em>négyzetét</em> minimalizáljuk, nem az abszolút értékét?" },
      { kind: "text", step: 1, html: "<strong>R²</strong>: a kimenet varianciájának hányad része magyarázható a modellel — 0 és 1 között, minél nagyobb, annál jobban illeszkedik." },
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
      { kind: "tension", label: "Elsőbbségi vita", html: "Gauss szerint már 1795 óta használja a legkisebb négyzetek módszerét — Legendre publikálja először, 1805-ben." },
      { kind: "plaque", step: 1, year: "1801", html: "Gauss a módszerrel <strong>helyesen megjósolja</strong>, hol tűnik fel újra a „elveszett” Ceres törpebolygó." },
      { kind: "plaque", step: 2, year: "1886", html: "Galton publikálja a jelenséget — innen a „regresszió” szó a statisztikában." },
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
    title: "A szigmoid függvény",
    blocks: [
      { kind: "text", html: "Ez a függvény szorítja a predikciót mindig [0,1] közé:" },
      { kind: "text", step: 1, html: "<span style='font-family:var(--font-mono); font-size:1.3em; color:var(--accent)'>σ(z) = 1 / (1 + e⁻ᶻ)</span><br><span style='color:var(--ink-dim)'>ahol z = β₀ + β₁x — ugyanaz a lineáris predikció, mint eddig, csak ezen a függvényen átengedve.</span>" },
      { kind: "text", step: 2, html: "Bármekkora is z (−∞-től +∞-ig), σ(z) mindig (0,1) közé esik — sosem megy 0 alá vagy 1 fölé." },
    ],
  },
  {
    type: "content",
    eyebrow: "Logisztikus regresszió",
    title: "Log-odds és együtthatók",
    blocks: [
      { kind: "text", html: "A szigmoid <strong>inverze</strong> a logit (log-odds) függvény — ez a valódi „lineáris” rész:" },
      { kind: "text", step: 1, html: "<span style='font-family:var(--font-mono); font-size:1.2em; color:var(--accent)'>logit(p) = ln(p / (1−p)) = β₀ + β₁x</span>" },
      {
        kind: "list", step: 2,
        items: [
          "<strong>β₁</strong>: mennyivel változik a <em>log-odds</em>, ha x eggyel nő",
          "<strong>e^β₁</strong> (odds ratio): mennyivel <em>szorzódik</em> az esély (odds), ha x eggyel nő",
        ],
      },
      { kind: "text", step: 3, html: "<span style='color:var(--ink-dim)'>Konkrétan a lemorzsolódás-modellünkön (→ demo.ipynb): β₁ = −0.83, e^β₁ = 0.435 — minden plusz heti használati óra <strong>0.435-szörösére</strong> viszi a lemorzsolódás esélyét (odds).</span>" },
    ],
  },
  {
    type: "content",
    eyebrow: "Gyakorlat",
    title: "Standardizált együtthatók",
    blocks: [
      { kind: "ask", label: "Gondolkodjatok el rajta", html: "Ha standardizáljuk a bemeneti változót (x), mit jelent a standardizált együttható lineáris regresszióban — és mit logisztikus regresszióban? Ugyanazt jelenti-e a kettő?" },
    ],
    note: "→ a válasz a következő dián",
  },
  {
    type: "content",
    eyebrow: "Gyakorlat — válasz",
    title: "Nem ugyanazt jelenti",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Lineáris regresszió", html: "y <em>is</em> folytonos, standardizálható. A standardizált β: „hány szórásnyit változik y, ha x egy szórásnyit nő” — tiszta, egyenes jelentés." },
          { heading: "Logisztikus regresszió", html: "y bináris — nincs „szórása” ugyanabban az értelemben. Csak x-et standardizáljuk: β „hány log-odds egységgel változik logit(p), ha x egy szórásnyit nő”." },
        ],
      },
      { kind: "text", step: 1, html: "Mindkettő jó arra, hogy <strong>egymáshoz viszonyítva</strong> rangsoroljuk a prediktorok fontosságát — de a logisztikus esetben nincs „y szórása”, amihez az eredményt visszakötnéd." },
    ],
  },
  {
    type: "content",
    eyebrow: "Gyakorlat",
    title: "Melyik javulás jobb?",
    blocks: [
      { kind: "ask", label: "A kérdés", html: "Mi a helyes módja egy „5%-os konverziós javulás” értelmezésének? Melyik jobb: +5 százalékpont egy 20%-os alapesélyen, vagy +1 százalékpont egy 95%-os alapesélyen?" },
    ],
    note: "→ a válasz a következő dián",
  },
  {
    type: "content",
    eyebrow: "Gyakorlat — válasz",
    title: "Attól függ, mit mérsz",
    blocks: [
      {
        kind: "text",
        html: "<span style='font-family:var(--font-mono); font-size:0.95em; color:var(--ink-dim)'>20%→25%: odds 0.25→0.333 (OR=1.33, +33%) · siker +25% · hiba −6.25%<br>95%→96%: odds 19→24 (OR=1.26, +26%) · siker +1.05% · hiba −20%</span>",
      },
      { kind: "text", step: 1, html: "<strong>Nincs egyetlen helyes válasz</strong> — attól függ, mit optimalizálsz: a nyert konverziók számát (akkor a 20%-os alap nyer), vagy az elmaradt esetek arányának csökkentését (akkor a 95%-os alap nyer)." },
      { kind: "tension", step: 2, label: "Ezért dolgozik odds-skálán a logisztikus regresszió", html: "A nyers százalékpont félrevezető, mert a jelentése a bázisaránytól függ. Az odds/log-odds egy <strong>szimmetrikus, konzisztens</strong> keret — ez nem esztétikai választás, hanem pont ezt a problémát oldja meg." },
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
