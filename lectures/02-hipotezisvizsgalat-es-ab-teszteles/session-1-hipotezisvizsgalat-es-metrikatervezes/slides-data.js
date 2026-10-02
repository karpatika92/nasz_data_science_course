window.LESSON_LABEL = "Hipotézisvizsgálat · 1/2";

window.SLIDES = [
  {
    type: "title",
    eyebrow: "Hipotézisvizsgálat és A/B tesztelés",
    title: "Hipotézisvizsgálat és A/B tesztelés",
    kicker: "Hogyan dönthető el, hogy egy eredmény valódi — és hogyan mérhető úgy a hatása, hogy összehasonlítható legyen egy teljesen más kísérlettel? A checkers.com DAU-duplázási mandátumának példáján.",
    note: "Kárpáti András · 1. rész / 2",
  },

  // ============ MI TÖRTÉNT A CÉGGEL ============
  { type: "divider", index: "01", eyebrow: "A mai mandátum", title: "Mi történt a checkers.com-mal?" },
  {
    type: "content",
    eyebrow: "Recap",
    title: "Eladták a céget",
    blocks: [
      {
        kind: "list",
        items: [
          "A GameLeap Holdings megvette a checkers.com-ot — a vételi tézis: a web DAU két éven belül megduplázható",
          "Az új mandátum: <strong>200 000 → 400 000 web DAU, 24 hónap alatt</strong>",
          "Ma ez a #1 vállalati célszám — nem a bevétel, nem a CLTV",
          "Leszűkítés: <strong>csak a web platform</strong> számít ma",
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "A kérdés, amivel indulunk",
    title: "Honnan tudjuk, hogy egy változtatás tényleg működött?",
    blocks: [
      { kind: "ask", label: "Kérdés a teremnek", html: "Ha ti vezetnétek a termékcsapatot, honnan tudnátok meg, hogy egy változtatás <strong>tényleg</strong> működött — és nem csak véletlen ingadozás egyik napról a másikra?" },
    ],
  },

  // ============ CLT FELFRISSÍTŐ ============
  { type: "divider", index: "02", eyebrow: "Felfrissítő", title: "A centrális határeloszlás-tétel" },
  {
    type: "content",
    eyebrow: "A tétel",
    title: "Nagy minta esetén a mintaátlag közelítőleg normális",
    blocks: [
      { kind: "text", html: "Legyenek X₁, X₂, …, Xₙ függetlenek és azonos eloszlásúak, véges σ² varianciával. Ekkor nagy n-re:" },
      { kind: "plaque", step: 1, year: "CLT", html: "X̄ₙ ≈ Normális(μ, σ²/n)" },
      { kind: "text", step: 2, html: "Nem számít, milyen volt az eredeti eloszlás — a <strong>mintaátlag</strong> haranggörbe alakot vesz fel." },
    ],
  },
  {
    type: "content",
    eyebrow: "Három feltétel",
    title: "Amikor ez elromlik",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Független, azonos eloszlású", html: "Ha a felhasználók hatnak egymásra (pl. egy viral közösségi funkció), a megfigyelések korrelálnak — a CLT nem érvényes." },
          { heading: "Véges variancia", html: "Erősen ferde, nehéz-farkú metrikák (pl. egy feladvány megoldási ideje) lassan vagy egyáltalán nem konvergálnak." },
        ],
      },
      { kind: "text", step: 1, html: "A harmadik: <strong>elég nagy n</strong> — az „n ≥ 30 elég” ökölszabály gyakran téves ferde eloszlásoknál." },
    ],
  },
  {
    type: "content",
    eyebrow: "Miért számít ez nekünk",
    title: "A CLT az A/B tesztelés motorja",
    blocks: [
      { kind: "tension", label: "Enélkül nincs z-teszt", html: "A CLT miatt tudjuk, hogy egy mért arány (pl. „sikeres párkeresés aránya”) közelítőleg normális eloszlású a saját átlaga körül — <strong>ez teszi lehetővé</strong>, hogy standardizáljunk, és egy p-értéket számoljunk belőle." },
    ],
  },

  // ============ HIPOTÉZISVIZSGÁLAT KERETE ============
  { type: "divider", index: "03", eyebrow: "Keretrendszer", title: "A hipotézisvizsgálat kerete" },
  {
    type: "content",
    eyebrow: "Öt lépés",
    title: "Minden hipotézisvizsgálat ugyanazt az öt lépést követi",
    blocks: [
      {
        kind: "list",
        items: [
          "<strong>H₀</strong> — az unalmas, semleges világ: „a változtatásnak nincs hatása”",
          "<strong>H₁</strong> — amire bizonyítékot keresünk: „van hatás”",
          "<strong>α rögzítése az adatok látása ELŐTT</strong> — a megengedett fals riasztási arány (jellemzően 5%)",
          "A teszt-statisztika és a p-érték kiszámítása a megfigyelt adatból",
          "<strong>Döntés</strong>: elvetjük H₀-t, ha p &lt; α — egyébként nem vetjük el",
        ],
      },
      { kind: "tension", step: 1, label: "Fontos keret", html: "Soha nem <em>bizonyítjuk</em> H₁-et. Csak azt találjuk, hogy az adat <em>nem fér össze</em> H₀-val. „Nem vetjük el H₀-t” nem ugyanaz, mint „elfogadjuk H₀-t”." },
    ],
  },
  {
    type: "content",
    eyebrow: "A standardizálás és a kulcs-mennyiség",
    title: "A z-score és a p-érték",
    blocks: [
      { kind: "plaque", year: "z-score", html: "z = (megfigyelt hatás − H₀ alatti hatás) / standard hiba" },
      { kind: "text", html: "A z-score azt mondja meg, <strong>hány standard hiba</strong>-nyira van a megfigyelt különbség a nullától." },
      { kind: "plaque", step: 1, year: "p-érték", html: "p = P(legalább ekkora különbség&nbsp;|&nbsp;H₀ igaz)" },
      { kind: "text", step: 1, html: "Minél kisebb a p-érték, annál meglepőbb a megfigyelt adat — <em>feltéve, hogy H₀ igaz</em>." },
    ],
  },
  {
    type: "content",
    eyebrow: "A leggyakrabban félreértett szám",
    title: "Amit a p-érték NEM jelent",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Mi NEM", html: "❌ „H₀ igazságának valószínűsége”<br>❌ „Annak esélye, hogy véletlen”<br>❌ a hatás mérete vagy fontossága" },
          { heading: "Mi IGEN", html: "✅ Milyen meglepő az adat, <em>ha</em> H₀ igaz<br>✅ P(ekkora vagy nagyobb z-score, ha H₀ igaz)" },
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Előre rögzített küszöb",
    title: "A szignifikancia-szint (α)",
    blocks: [
      { kind: "text", html: "α = 0,05 a legelterjedtebb — R. A. Fisher javasolta 1925-ben, mint „kényelmes” küszöböt. Ez <strong>konvenció, nem matematikai törvény</strong>." },
      { kind: "ask", step: 1, html: "Mi történik, ha α-t 0,05-ről 0,01-re csökkentitek — könnyebb vagy nehezebb lesz elutasítani H₀-t?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Két irányban lehet tévedni",
    title: "Type I és Type II hiba",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Type I — fals pozitív", html: "Elvetjük H₀-t, pedig igaz — <strong>α = P(ez)</strong><br>checkers.com-nyelven: <strong>leszállítotok egy funkciót, ami semmit nem csinál</strong> — elvesztegetett fejlesztői idő a mandátumból." },
          { heading: "Type II — fals negatív", html: "Nem vetjük el H₀-t, pedig hamis — <strong>β = P(ez)</strong><br>checkers.com-nyelven: <strong>elszalasztotok egy valódi DAU-mozgató ötletet</strong> — lassabb út a duplázáshoz." },
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Nincs ingyen ebéd",
    title: "A mandátum alatt melyik hiba fáj jobban?",
    blocks: [
      { kind: "ask", label: "Kérdés a teremnek", html: "A GameLeap mandátum alatt melyik hiba fáj jobban — az, hogy leszállítotok valami hatástalant, vagy az, hogy elszalasztotok valami jót?" },
      { kind: "text", step: 1, html: "Nincs egyértelmű jó válasz — ez <strong>erőforrás-korlát</strong> kérdése (4-5 párhuzamos kísérleti szlot), ezért kell előre rögzített α <em>és</em> előre rögzített <strong>erő (power)</strong>." },
    ],
  },
  {
    type: "content",
    eyebrow: "A negyedik mennyiség",
    title: "Statisztikai erő (power)",
    blocks: [
      { kind: "text", html: "<strong>Power</strong> = annak valószínűsége, hogy egy valóban létező hatást ki is mutattok." },
      {
        kind: "list",
        step: 1,
        items: [
          "Nagyobb hatásméret → könnyebb kimutatni",
          "Nagyobb minta (n) → szűkebb standard hiba → nagyobb erő",
          "Lazább α → több erő, de több fals pozitív is",
        ],
      },
      { kind: "tension", step: 2, label: "Szabvány", html: "Legalább <strong>80% erő</strong> α = 0,05 mellett — ez határozza meg előre a szükséges mintaméretet. Egy alulméretezett kísérlet rosszabb, mint ha meg sem csináljátok: egy elfogyasztott kísérleti szlotot ad vissza egy eldönthetetlen eredménnyel." },
    ],
  },

  // ============ NUMERIKUS PÉLDA ============
  { type: "divider", index: "04", eyebrow: "Végigszámolva", title: "Gyorsított párkeresés" },
  {
    type: "content",
    eyebrow: "A kísérlet",
    title: "Csökkenti-e a gyorsabb matchmaking a lemorzsolódást?",
    blocks: [
      { kind: "text", html: "<strong>Hipotézis</strong>: a gyorsabb párkeresés-motor növeli a sikeresen elindított partik arányát azok között, akik elkezdik a párkeresést." },
      {
        kind: "columns",
        step: 1,
        columns: [
          { heading: "Control — régi motor", html: "n = 40 000<br>Sikeres indítás: 36 400<br><strong>p̂ = 91,00%</strong>" },
          { heading: "Treatment — gyors motor", html: "n = 40 000<br>Sikeres indítás: 36 520<br><strong>p̂ = 91,30%</strong>" },
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "1. lépés",
    title: "Pooled arány és standard hiba",
    blocks: [
      { kind: "text", html: "H₀ alatt a két csoport ugyanazt a p-t osztja — ezt a pooled (összevont) arányból becsüljük:" },
      { kind: "plaque", step: 1, year: "Pooled p̂", html: "(36 400 + 36 520) / 80 000 = 91,15%" },
      { kind: "plaque", step: 2, year: "SE", html: "√(0,9115 × 0,0885 × 2/40 000) ≈ 0,2008%" },
    ],
  },
  {
    type: "content",
    eyebrow: "2. lépés",
    title: "Z-score és p-érték",
    blocks: [
      { kind: "plaque", year: "z", html: "(91,30% − 91,00%) / 0,2008% ≈ 1,49" },
      { kind: "plaque", step: 1, year: "p-érték", html: "2 × Φ(−1,49) ≈ 0,135" },
    ],
  },
  {
    type: "content",
    eyebrow: "A döntés",
    title: "p = 0,135 — nem utasítjuk el H₀-t",
    blocks: [
      { kind: "tension", label: "A csattanó", html: "A látszólag biztató +0,30 százalékpontos különbség <strong>0,135-ös p-érték mellett simán lehet véletlen ingadozás</strong> ennél a mintaméretnél. 40 000 felhasználó soknak hangzik — egy ilyen kis hatáshoz mégsem elég." },
    ],
  },
  {
    type: "content",
    eyebrow: "Nyomás alatt",
    title: "Mit tennétek most?",
    blocks: [
      { kind: "ask", label: "Kérdés a teremnek", html: "Pénteken demó a GameLeap vezetőségnek, ti vezetitek ezt a kísérletet, és ez jött ki. Mit tennétek most?" },
    ],
  },

  // ============ A LEGGYAKORIBB HIBÁK ============
  { type: "divider", index: "05", eyebrow: "Három csapda", title: "A leggyakoribb hibák" },
  {
    type: "content",
    eyebrow: "Hiba #1",
    title: "P-hacking",
    blocks: [
      { kind: "text", html: "<strong>„Nézzük meg csak mobilon… csak az új usereknél… ship it!”</strong> — ha elég sok alcsoportot nézel át, előbb-utóbb találsz egyet p &lt; 0,05-tel, tisztán véletlenből." },
      { kind: "plaque", step: 1, year: "20 alcsoport", html: "P(legalább 1 fals pozitív) = 1 − (1 − 0,05)²⁰ ≈ <strong>64%</strong>" },
      { kind: "tension", step: 2, label: "A szabály", html: "A p-érték csak akkor kalibrált, ha a hipotézist az adatok látása <strong>előtt</strong> rögzítitek." },
    ],
  },
  {
    type: "content",
    eyebrow: "Hiba #2",
    title: "Multiple testing — ugyanez párhuzamosan",
    blocks: [
      { kind: "text", html: "A GameLeap mandátum miatt egyszerre 4-5 kísérlet fut. Ha mindegyiket α = 0,05-tel nézitek, a <strong>család-szintű</strong> fals pozitív ráta (FWER) gyorsan nő:" },
      {
        kind: "list",
        step: 1,
        items: [
          "1 teszt → 5%",
          "5 teszt → 23%",
          "10 teszt → 40%",
          "20 teszt → 64%",
        ],
      },
      { kind: "text", step: 2, html: "A fix: <strong>Bonferroni</strong> (α' = α/m, egyszerű, konzervatív) vagy <strong>Benjamini-Hochberg</strong> (FDR-kontroll, kevésbé konzervatív sok teszt esetén)." },
    ],
  },
  {
    type: "content",
    eyebrow: "Hiba #3",
    title: "Optional stopping — a legveszélyesebb, mert jónak érződik",
    blocks: [
      { kind: "text", html: "„Fusson tovább, amíg szignifikáns nem lesz” — ésszerűnek tűnik: leállunk, ha elég bizonyíték van, folytatjuk, ha bizonytalan vagyunk. <strong>Ez katasztrofálisan rossz.</strong>" },
      { kind: "tension", step: 1, label: "Armitage et al. (1969)", html: "Tisztességes érmén, minden lépésnél megnézve a p-értéket, leállva az első |z| &gt; 1,96-nál: a névleges <strong>5%-os</strong> hibaarány a valóságban <strong>26%</strong>-ra nő." },
      { kind: "text", step: 2, html: "A fix: <strong>rögzítsd előre a mintaméretet</strong> — vagy használj szekvenciális tesztet (SPRT, always-valid inference), ha tényleg kukkantani kell menet közben." },
    ],
  },
  {
    type: "content",
    eyebrow: "Összefoglalás",
    title: "A három hiba és a fix",
    blocks: [
      { kind: "plaque", year: "P-hacking", html: "Alcsoport-vadászat → fix: egy, előre rögzített hipotézis" },
      { kind: "plaque", year: "Multiple testing", html: "m teszt → FWER = 1−(1−α)ᵐ → fix: Bonferroni / BH" },
      { kind: "plaque", year: "Optional stopping", html: "Nincs rögzített n → fix: rögzített n vagy szekvenciális teszt" },
    ],
  },

  // ============ KÖZÖS MÉRŐSZÁM-TERVEZÉS ============
  { type: "divider", index: "06", eyebrow: "A nap fő szintézise", title: "Közös mérőszám-tervezés" },
  {
    type: "content",
    eyebrow: "Két lezárt kísérlet",
    title: "Két csapat, két eredmény",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "„Streaks” — napi sorozat-számláló", html: "D30-visszatérés: 42,0% → 42,6%<br><strong>+1,4% relatív</strong>" },
          { heading: "„Puzzle v2” — új feladvány-algoritmus", html: "D30-visszatérés: 55,0% → 60,0%<br><strong>+9,1% relatív</strong>" },
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "A pénteki szlot",
    title: "Melyiket választanátok?",
    blocks: [
      { kind: "ask", label: "Kérdés a teremnek", html: "Egy prezentációs szlotot kaptok a vezetőségnek, csak az egyiket tudjátok bemutatni mint a heti nagy sikert. Melyiket választjátok?" },
    ],
  },
  {
    type: "content",
    eyebrow: "A csapda-kérdés",
    title: "Kikre vonatkozik ez a szám?",
    blocks: [
      { kind: "ask", html: "Mire vonatkozik ez a %? Kik voltak a kísérletben?" },
      {
        kind: "columns",
        step: 1,
        columns: [
          { heading: "Streaks", html: "Mindenkinek megjelenik → <strong>200 000 fő</strong> (a DAU 100%-a)" },
          { heading: "Puzzle v2", html: "Csak a feladvány-funkció használóinak → <strong>20 000 fő</strong> (a DAU 10%-a)" },
        ],
      },
      { kind: "ask", step: 2, html: "Változtat ez a válaszotokon?" },
    ],
  },
  {
    type: "content",
    eyebrow: "1. lépés — közösen",
    title: "Hogyan fejezzük ki a TELJES, cégre nézett hatást?",
    blocks: [
      { kind: "ask", label: "Kérdés a teremnek", html: "Ha tudjátok a lift-et ÉS hogy kikre vonatkozik, hogyan fejeznétek ki egy kísérlet teljes, cégre nézett hatását?" },
      { kind: "plaque", step: 1, year: "Építőkocka", html: "nettó megnyert felhasználó = elért létszám × abszolút lift" },
    ],
  },
  {
    type: "content",
    eyebrow: "Számoljuk ki",
    title: "A sorrend már itt megfordul",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Streaks", html: "200 000 × 0,6pp = <strong>1 200 fő/nap</strong>" },
          { heading: "Puzzle v2", html: "20 000 × 5,0pp = <strong>1 000 fő/nap</strong>" },
        ],
      },
      { kind: "tension", step: 1, label: "Figyeljétek a csendet a teremben", html: "A „lenyűgözőbb” +9,1%-os kísérlet kevesebb nettó embert hoz, mint az „unalmas” +1,4%-os." },
    ],
  },
  {
    type: "content",
    eyebrow: "2. lépés — közösen",
    title: "De ez egy abszolút szám",
    blocks: [
      { kind: "ask", label: "Kérdés a teremnek", html: "Miért nem elég ez önmagában, ha hónapok múlva egy MÁSIK kísérletet akartok összehasonlítani vele, ami épp más induló DAU mellett vagy más platformon futott?" },
      { kind: "text", step: 1, html: "Mert az abszolút szám azt is méri, <strong>mekkora volt a cég aznap</strong> — nem csak azt, mekkora volt a hatás. Közös nevezőre kell hozni: a <strong>teljes DAU-ra</strong>." },
    ],
  },
  {
    type: "content",
    eyebrow: "A végső képlet",
    title: "Nettó konverzió / DAU",
    blocks: [
      { kind: "plaque", year: "A közös valuta", html: "Nettó konverzió / DAU = (elért létszám × Δp) / teljes DAU" },
      { kind: "text", step: 1, html: "<strong>Határeset</strong>: ha az elérés = a teljes DAU 100%-a, ez a képlet pont visszaadja az abszolút lift-et magát — ezért egyezett a Streaks 0,60%-a a bemeneti +0,6pp-vel." },
    ],
  },
  {
    type: "content",
    eyebrow: "A végeredmény",
    title: "Streaks nyer — nettó, cégre nézett hatásban",
    visual: {
      kind: "image",
      src: "../assets/net_conversions_per_dau.png",
      alt: "Oszlopdiagram: Streaks es Puzzle v2 netto beszamitott D30-visszateroket naponta, es a megfelelo netto konverzio per DAU szazalek",
    },
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Streaks", html: "1 200 / 200 000 = <strong>0,60%</strong>" },
          { heading: "Puzzle v2", html: "1 000 / 200 000 = <strong>0,50%</strong>" },
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Záró szintézis",
    title: "Miért jó közös valuta ez a mérőszám?",
    blocks: [
      {
        kind: "list",
        items: [
          "Helyesen hasonlít össze különböző <strong>ELÉRÉSŰ</strong> kísérleteket",
          "Helyesen hasonlít össze különböző <strong>IDŐPONTBAN / PLATFORMON</strong> futó kísérleteket — mert a teljes DAU-hoz van normálva, nem egy abszolút számhoz",
          "Közvetlenül a <strong>vállalati cél</strong> (DAU) nyelvén beszél",
        ],
      },
    ],
  },

  // ============ ZÁRÁS ============
  { type: "divider", index: "→", eyebrow: "A mai 1. rész vége", title: "Híd a 2. részhez" },
  {
    type: "content",
    eyebrow: "Most ti jöttök",
    title: "Most már tudjátok, hogyan döntitek el — és hogyan mérítek",
    blocks: [
      { kind: "ask", label: "A 2. rész fő kérdése", html: "Most már tudjátok, hogyan döntitek el, hogy egy kísérlet eredménye valódi-e, és hogyan mérhető úgy a hatása, hogy teljesen más kísérleteket is össze tudtok hasonlítani vele. A 2. részben ti találjátok ki a kísérleteket — és ugyanezzel a mérőszámmal fogjátok rangsorolni az ötleteiteket egy ütemtervvé." },
    ],
  },
];
