window.LESSON_LABEL = "Hipotézisvizsgálat · 2/2";

window.SLIDES = [
  {
    type: "title",
    eyebrow: "Hipotézisvizsgálat és A/B tesztelés",
    title: "Ötlettől ütemtervig",
    kicker: "Ti vagytok ma a checkers.com termékcsapata — tervezzetek kísérleteket, rangsoroljátok őket, és építsetek belőlük egy ütemtervet a DAU-duplázási mandátum alá.",
    note: "Kárpáti András · 2. rész / 2",
  },

  // ============ RECAP ============
  { type: "divider", index: "01", eyebrow: "Indulás előtt", title: "Amit idáig tudtok" },
  {
    type: "content",
    eyebrow: "Az 1. rész öröksége",
    title: "Két eszköz van most a kezetekben",
    blocks: [
      {
        kind: "list",
        items: [
          "Tudjátok <strong>szigorúan eldönteni</strong>, hogy egy megfigyelt különbség valódi-e, vagy csak véletlen ingadozás (H₀/H₁, z-score, p-érték) — és ismeritek a három csapdát, ami ezt elronthatja",
          "Van egy <strong>közös mérőszámotok</strong>, a nettó konverzió/DAU, ami összehasonlíthatóvá tesz két, teljesen különböző kísérletet",
        ],
      },
      { kind: "tension", step: 1, label: "A mai nehezebb kérdés", html: "Eddig KÉSZ kísérleteket elemeztetek. Most <strong>ti találjátok ki</strong> őket — és el kell döntenetek, melyiket érdemes elsőként megcsinálni." },
    ],
  },
  {
    type: "content",
    eyebrow: "A mai feladat",
    title: "200k → 400k web DAU, 24 hónap",
    blocks: [
      { kind: "ask", label: "A keret", html: "Ma ti vagytok a termékcsapat. A mandátum: megduplázni a web DAU-t 24 hónap alatt. Mit csináltok, és milyen sorrendben?" },
    ],
  },

  // ============ KALIBRÁCIÓ ============
  { type: "divider", index: "02", eyebrow: "Mielőtt becsültök", title: "Kalibráció" },
  {
    type: "content",
    eyebrow: "A viszonyítási pont",
    title: "Ezek a számok legyenek a mércétek",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Streaks", html: "Elérés: <strong>100%</strong> (200 000 fő)<br>Hatás: <strong>+0,6pp</strong> (+1,4% relatív)<br>Nettó konverzió/DAU: <strong>0,60%</strong>" },
          { heading: "Puzzle v2", html: "Elérés: <strong>10%</strong> (20 000 fő)<br>Hatás: <strong>+5,0pp</strong> (+9,1% relatív)<br>Nettó konverzió/DAU: <strong>0,50%</strong>" },
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Figyelmeztetés, mielőtt elkezditek",
    title: "A saját ötletünket mindig túlbecsüljük",
    blocks: [
      { kind: "tension", label: "Legyetek konzervatívak", html: "A Puzzle v2 <strong>+9,1%</strong>-a volt a mai nap „nagy” száma egy élesben futó kísérletnél. Ha a saját ötletetekre 20-30% relatív hatást becsültök — kérdezzétek meg magatoktól: <em>miért hinnétek el ezt magatoknak?</em>" },
    ],
  },

  // ============ ÖTLETELÉS ============
  { type: "divider", index: "03", eyebrow: "Kiscsoportban", title: "Ötletelés" },
  {
    type: "content",
    eyebrow: "A keretek",
    title: "Négy funkcióterület, egyet válasszatok",
    blocks: [
      {
        kind: "list",
        items: [
          "<strong>Matchmaking</strong> (190 000 DAU, 95%) — élő parti bot vagy másik felhasználó ellen",
          "<strong>Tartalom</strong> (50 000 DAU, 25%) — cikkek, hírek, videók, közösségi feed",
          "<strong>Tréning</strong> (20 000 DAU, 10%) — taktikai feladvány-gyakorló",
          "<strong>Oktatás</strong> (16 000 DAU, 8%) — strukturált leckék, kurzusok",
        ],
      },
      { kind: "tension", step: 1, label: "Fontos korlát", html: "<strong>Csak web platform</strong> számít ma — és a csoport egyetlen funkcióterületet válasszon, ne szóródjatok szét mind a négyen." },
    ],
  },
  {
    type: "content",
    eyebrow: "A folyamat",
    title: "5 perc egyénileg, 15 perc csoportban",
    blocks: [
      {
        kind: "list",
        items: [
          "<strong>5 perc</strong> — csendben, mindenki ír saját ötleteket",
          "<strong>15 perc</strong> — megosztjátok, megbeszélitek, és leszűkítitek <strong>2-3 ötletre</strong> csoportonként",
        ],
      },
    ],
  },

  // ============ KÍSÉRLETTERV-DOKUMENTUM ============
  { type: "divider", index: "04", eyebrow: "Mielőtt rangsoroltok", title: "A kísérletterv-dokumentum" },
  {
    type: "content",
    eyebrow: "Demo — ezt nem használhatjátok sajátként",
    title: "„Folytasd a leckét” emlékeztető",
    blocks: [
      { kind: "text", html: "<strong>Funkcióterület</strong>: Oktatás. <strong>Hipotézis</strong>: egy emlékeztető banner a félbehagyott leckékhez növeli a D7-visszatérést." },
      {
        kind: "columns",
        step: 1,
        columns: [
          { heading: "Becslések", html: "Elért létszám: <strong>10 000</strong> fő/nap (félbehagyott leckés felhasználók, DAU 5%-a)<br>Becsült hatás: <strong>+3pp</strong> D7-visszatérésen<br>Fejlesztői ráfordítás: <strong>S</strong> (2 hét)" },
          { heading: "Számolva", html: "Nettó konverzió/DAU =<br>10 000 × 0,03 / 200 000 =<br><strong>0,15%</strong>" },
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "A sablon mezői",
    title: "`experiment-design-doc-template.md`",
    blocks: [
      {
        kind: "list",
        items: [
          "Ötlet neve + funkcióterület",
          "Hipotézis (mit vár a csapat, és miért)",
          "Becsült elért létszám (induljatok ki a `business-case.md` DAU-bontásából)",
          "Becsült hatás (pp-ben és relatív %-ban)",
          "Fejlesztői ráfordítás: <strong>S</strong> (1-2 hét) / <strong>M</strong> (3-5 hét) / <strong>L</strong> (6-8 hét)",
          "Számolt nettó konverzió / DAU",
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Most ti",
    title: "25 perc — töltsétek ki a saját 2-3 ötletetekre",
    blocks: [
      { kind: "ask", label: "Munkára fel", html: "Töltsétek ki a sablont mind a 2-3 kiválasztott ötletetekre. Minden becsült számnál tegyétek fel: honnan ez a szám — megérzés, vagy a mai kalibrációs adatokhoz viszonyított, védhető becslés?" },
    ],
  },

  // ============ RANGSOROLÁS ============
  { type: "divider", index: "05", eyebrow: "Szűk erőforrás, sok ötlet", title: "Rangsorolás" },
  {
    type: "content",
    eyebrow: "Mielőtt kiszámoljátok",
    title: "Miért osztunk, és nem csak rangsorolunk a nyers hatás szerint?",
    blocks: [
      { kind: "ask", label: "Kérdés a teremnek", html: "Miért osztunk a fejlesztői ráfordítással, és nem csak a nyers nettó konverzió/DAU szerint rangsorolunk?" },
      { kind: "text", step: 1, html: "Mert a 2 éves mandátum alatt a fejlesztői kapacitás véges (4-5 párhuzamos kísérlet) — a kérdés nem „mi a legnagyobb hatás”, hanem <strong>„mi hozza a legtöbbet az elkölthető idő arányában”</strong>. Ugyanaz a logika, mint egy befektetési portfóliónál: hozam a ráfordított tőke arányában, nem abszolút hozam." },
      { kind: "plaque", step: 2, year: "Pontszám", html: "Nettó konverzió/DAU ÷ Fejlesztői ráfordítás (hét)" },
      { kind: "text", step: 2, html: "Pontozzátok ki vele a saját 2-3 ötleteteket." },
    ],
  },

  // ============ ÜTEMTERV ============
  { type: "divider", index: "06", eyebrow: "A nagy kép", title: "Ütemterv összeállítása" },
  {
    type: "content",
    eyebrow: "A kapacitás-korlát",
    title: "Mennyi fér el 24 hónap alatt?",
    blocks: [
      { kind: "text", html: "Egyszerre <strong>4-5 kísérlet</strong> fut, egyenként <strong>2-8 hét</strong> — durva becslés: <strong>15-25 kísérlet</strong> összesen, hullámokban, 24 hónap alatt." },
      { kind: "text", step: 1, html: "Gyűjtsétek a táblára minden csoport legjobb pontszámú ötletét — ez adja a nyers rangsort." },
    ],
  },
  {
    type: "content",
    eyebrow: "Egy őszinte csavar, mielőtt lezárjuk",
    title: "A számok nem adódnak csak úgy össze",
    blocks: [
      { kind: "tension", label: "Kösd vissza az 1. előadáshoz", html: "A nettó konverzió/DAU számok <strong>nem adódnak</strong> egyszerűen össze egy végső DAU-számmá. Egy EGYSZERI visszatérési eseményt mérő kísérlet (mint a mai két példa) egy múló kohorsz-hatás — nem biztos, hogy tartós szint-emelkedés. Ami TARTÓSAN összeadódik, az egy olyan változtatás, ami magát a <strong>megtartási görbét</strong> tolja el — pont úgy, ahogy az 1. előadás CLTV-részében a churn-görbe lassulása volt összetett (compounding) hatású, nem egyszeri." },
    ],
  },
  {
    type: "content",
    eyebrow: "Záró kérdés",
    title: "Streaks vagy Puzzle v2 — melyik tartósabb?",
    blocks: [
      { kind: "ask", label: "Kérdés a teremnek", html: "A mai két példa közül — Streaks vagy Puzzle v2 — melyikről hinnétek el inkább, hogy TARTÓS megtartás-javulás, nem csak egy 30 napos kohorsz-kiugrás? Nincs egyértelmű 'helyes' válasz." },
    ],
  },

  // ============ MEGOSZTÁS + SZINTÉZIS ============
  { type: "divider", index: "07", eyebrow: "Zárás", title: "Csoport-megosztás és szintézis" },
  {
    type: "content",
    eyebrow: "2-3 csoport",
    title: "Mutassátok be a top ötleteteket",
    blocks: [
      { kind: "ask", label: "1 perc / csoport", html: "Ötlet neve, becsült pontszám, és miért pont ez — 1 perc csoportonként." },
    ],
  },
  {
    type: "content",
    eyebrow: "A teljes ív",
    title: "Egy ötlettől egy roadmapig",
    blocks: [
      { kind: "text", html: "Ma megtanultátok eldönteni, hogy egy eredmény valódi-e, mérni a hatását úgy, hogy összehasonlítható legyen más kísérletekkel, és ebből ütemtervet építeni egy konkrét üzleti cél alá." },
      { kind: "tension", step: 1, label: "A teljes ív", html: "„Van egy ötletem” → szigorú kiértékelés → közös mérőszám → rangsorolt ütemterv a következő negyedévre." },
    ],
  },
];
