window.LESSON_LABEL = "Üzleti analitika · 1/2";

window.SLIDES = [
  {
    type: "title",
    eyebrow: "Üzleti analitika és cégértékelés",
    title: "Mennyit ér egy cég?",
    kicker: "Adattudomány, üzleti analitika és egy előfizetéses cég értékelése — a checkers.com példáján",
    note: "Kárpáti András · 1. rész / 2",
  },

  // ============ MI AZ ADATTUDOMÁNY? ============
  { type: "divider", index: "01", eyebrow: "Nyitó kérdés", title: "Mi az adattudomány?" },
  {
    type: "content",
    eyebrow: "Adat",
    title: "Mit jelent az, hogy 'adat'?",
    blocks: [
      { kind: "ask", label: "Kérdés a teremnek", html: "Mi jut eszetekbe arról, hogy 'adat'? Mondjatok konkrét példákat egy olyan cégből, mint a checkers.com." },
    ],
  },
  {
    type: "content",
    eyebrow: "Adat → információ → insight",
    title: "A nyers adat önmagában nem sokat ér",
    blocks: [
      { kind: "text", html: "A <strong>nyers adat</strong> (pl. egy log-sor: felhasználó X, 14:32-kor, lépett egyet egy játszmában) struktúra és kontextus nélkül szinte használhatatlan." },
      { kind: "text", step: 1, html: "Struktúrával és kontextussal <strong>információ</strong> lesz belőle: 'a felhasználók 40%-a mobilon regisztrál'." },
      { kind: "text", step: 2, html: "De az információ még nem döntés. Amikor egy információ <strong>döntésrelevánssá</strong> válik — amikor tudjuk, mit kezdjünk vele —, azt hívjuk <strong>insightnak</strong>." },
    ],
  },
  {
    type: "content",
    eyebrow: "A lánc vége",
    title: "Adatvezérelt döntéshozatal = insight-vezérelt döntéshozatal",
    blocks: [
      { kind: "ask", label: "A mai óra fő állítása", html: "Nem az a cél, hogy sok adatunk legyen. Az a cél, hogy a döntéseinket <em>insightok</em> vezéreljék — és az adat csak az út odáig." },
    ],
  },
  {
    type: "content",
    eyebrow: "A klasszikus ábra",
    title: "Hol él az adattudomány?",
    visual: {
      kind: "image",
      src: "../assets/venn_data_science.png",
      alt: "Drew Conway adattudomány Venn-diagramja: Hacking Skills, Math & Stats Knowledge, Substantive Expertise metszetében a Data Science",
      caption: "Drew Conway (2010) — az adattudomány a három kör metszetében él",
    },
    blocks: [
      { kind: "text", html: "<strong>Hacking skills</strong>: meg tudod szerezni és formázni az adatot. <strong>Matek/statisztika</strong>: helyesen tudsz belőle következtetni. <strong>Terület-specifikus tudás</strong>: tudod, mi számít a checkers.com üzletében." },
      { kind: "text", step: 1, html: "Csak matek+hacking, terület-tudás nélkül? <strong>'Danger zone'</strong> — technikailag helyes, üzletileg értelmetlen (vagy káros) következtetések." },
    ],
  },

  // ============ ÜZLETI ANALITIKA PIRAMIS ============
  { type: "divider", index: "02", eyebrow: "Keretrendszer", title: "Az üzleti analitika piramisa" },
  {
    type: "content",
    eyebrow: "Négy szint",
    title: "Ugyanaz az adat, négyféle kérdés",
    visual: {
      kind: "image",
      src: "../assets/uzleti_analitika_piramis.png",
      alt: "Négyszintes piramis: leíró, diagnosztikai, prediktív, preskriptív analitika, növekvő érték és nehézség",
    },
    blocks: [
      { kind: "text", html: "Ahogy felfelé haladunk a piramison, <strong>nő az üzleti érték</strong> — de nő a <strong>nehézség</strong> is. A legtöbb cég a piramis alján tölti a legtöbb idejét, pedig a tetején van a legnagyobb tét." },
    ],
  },
  {
    type: "content",
    eyebrow: "checkers.com példákkal",
    title: "A négy szint a gyakorlatban",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Leíró + diagnosztikai", html: "'Hány napi aktív felhasználónk (DAU) volt tegnap?' — 'Miért esett vissza a konverziós rátánk múlt héten?'" },
          { heading: "Prediktív + preskriptív", html: "'Hány előfizetőnk lesz jövő negyedévben?' — 'Melyik árazási stratégia maximalizálja a bevételt?'" },
        ],
      },
      { kind: "ask", step: 1, html: "A checkers.com melyik szinten áll ma, egy konkrét döntésnél, amit ismertek egy hasonló cégtől?" },
    ],
  },

  // ============ A CÉG BEMUTATÁSA ============
  { type: "divider", index: "03", eyebrow: "A mai eset", title: "checkers.com" },
  {
    type: "content",
    eyebrow: "A cég",
    title: "Egy online, előfizetéses játékcég",
    blocks: [
      {
        kind: "list",
        items: [
          "Online sakkoktatás és -platform — nem triviális belépni, de legutóbb virálissá vált a közösségi médiában",
          "Egyetlen bevételi forrás: <strong>előfizetés</strong>. Nincs hirdetés.",
          "Havi (csak havi!) díjfizetés, <strong>2 árszint</strong>: Alap és Prémium",
          "Most keres befektetőket egy tőkebevonási körhöz",
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "A kérdés",
    title: "Mennyit ér a checkers.com?",
    blocks: [
      { kind: "ask", label: "A ma hátralévő rész fő kérdése", html: "Ha be akarnátok fektetni — vagy el akarnátok adni a céget —, hogyan kezdenétek hozzá a fair ár meghatározásához?" },
      { kind: "text", step: 1, html: "A válasz három építőkockán fog múlni: (1) <strong>mennyit ér egy előfizető</strong>, (2) <strong>hány előfizetőnk lesz</strong> a jövőben, és a kettő ötvözése: (3) egy <strong>teljes cash flow-előrejelzés</strong>." },
    ],
  },
  {
    type: "content",
    eyebrow: "Építőkocka #1",
    title: "Kezdjük az elsővel: mennyit ér egy előfizető?",
    blocks: [
      { kind: "plaque", year: "CLTV", html: "<strong>Customer Lifetime Value</strong> — egy átlagos előfizető várható, jelenértékre diszkontált teljes hozzájárulása a céghez, a teljes (várható) kapcsolat alatt." },
    ],
  },

  // ============ CLTV — ANNUITÁS/PERPETUITÁS FELFRISSÍTŐ ============
  { type: "divider", index: "04", eyebrow: "Esettanulmány 1", title: "Customer Lifetime Value" },
  {
    type: "content",
    eyebrow: "Felfrissítő",
    title: "Annuitás: fix ideig tartó, fix kifizetés",
    blocks: [
      { kind: "text", html: "Ha egy befektetés <strong>C</strong> összeget fizet minden periódus végén, <strong>n</strong> perióduson át, és a diszkontráta periódusonként <strong>r</strong>, a jelenérték egy mértani sor összege:" },
      { kind: "text", step: 1, html: "<code>PV = C/(1+r) + C/(1+r)² + … + C/(1+r)ⁿ</code>" },
      { kind: "text", step: 2, html: "Zárt alakban: <strong>PV = C · [1 − (1+r)⁻ⁿ] / r</strong>" },
    ],
  },
  {
    type: "content",
    eyebrow: "Felfrissítő",
    title: "Perpetuitás: a végtelenbe tartó annuitás",
    blocks: [
      { kind: "text", html: "Ha n → ∞, és r > 0, akkor (1+r)⁻ⁿ → 0. Az annuitás-formula lecsupaszodik:" },
      { kind: "text", step: 1, html: "<strong>PV = C / r</strong> — a klasszikus perpetuitás-formula." },
      { kind: "plaque", step: 2, year: "1648", html: "Hollandiában kibocsátják az első ismert örökjáradék-kötvényeket (perpetual bonds) gátak finanszírozására. Az egyik — a Lekdijk Bovendams-kötvény — a mai napig létezik, és a Yale Egyetem 2003-ban ténylegesen behajtotta rajta a kamatot." },
    ],
  },

  // ============ CLTV — CHURN BEÉPÍTÉSE ============
  {
    type: "content",
    eyebrow: "Az előfizetés nem fix n hónapra szól",
    title: "Mi van, ha nem tudjuk előre, meddig marad valaki?",
    blocks: [
      { kind: "ask", html: "Egy előfizetőnek nincs szerződésben rögzített 'n hónapja'. Bármikor lemorzsolódhat (churn). Hogyan írjuk le ezt matematikailag?" },
      { kind: "text", step: 1, html: "Tegyük fel, hogy minden hónapban, egymástól függetlenül, <strong>c</strong> valószínűséggel lemorzsolódik (churn rate), és (1−c) = <strong>ρ</strong> valószínűséggel marad (retention rate)." },
    ],
  },
  {
    type: "content",
    eyebrow: "Geometriai túlélés",
    title: "A várható aktív hossz: 1/churn",
    blocks: [
      { kind: "text", html: "Annak valószínűsége, hogy valaki még a <em>t</em>-edik hónapban is aktív: <strong>ρᵗ</strong> (geometriai eloszlás)." },
      { kind: "text", step: 1, html: "A várható aktív hónapok száma: <strong>E[hossz] = Σ ρᵗ = 1/(1−ρ) = 1/c</strong>." },
      { kind: "tension", step: 2, label: "Gyors ellenőrzés", html: "5%-os havi churn → várható aktív hossz = 1/0.05 = <strong>20 hónap</strong>. Ez NEM azt jelenti, hogy mindenki pontosan 20 hónapig marad — sokan hamarabb, néhányan sokkal tovább." },
    ],
  },
  {
    type: "content",
    eyebrow: "Az annuitás perpetuitássá válik",
    title: "Miért lesz ebből (majdnem) perpetuitás-formula?",
    blocks: [
      { kind: "text", html: "A jelenérték most: <strong>V = Σ P·ρᵗ / (1+r)ᵗ</strong> (t = 0, 1, 2, …, a hónap elején fizetve) — ez ismét egy mértani sor, csak a hányados most <strong>ρ/(1+r)</strong>." },
      { kind: "text", step: 1, html: "Nincs fix felső határ (n) — a sor a végtelenig fut, mert bármelyik hónapban <em>lehetne</em> még aktív, csak egyre csökkenő valószínűséggel. Ezért lesz a végeredmény szerkezetileg egy perpetuitás." },
      { kind: "text", step: 2, html: "Zárt alak: <strong>V = P · (1+r) / (r + c)</strong>" },
    ],
  },
  {
    type: "content",
    eyebrow: "Érzékenységvizsgálat",
    title: "Hogyan mozog a CLTV a paraméterekkel?",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Ár (P) és WACC (r)", html: "V lineáris P-ben. r-ben monoton csökkenő — magasabb elvárt hozam, alacsonyabb jelenérték." },
          { heading: "Churn (c) — a legérdekesebb", html: "∂V/∂c = −P(1+r)/(r+c)² — minél <em>alacsonyabb</em> már a churn, annál <strong>nagyobb</strong> az abszolút hatása egy további csökkentésnek." },
        ],
      },
      { kind: "ask", step: 1, html: "Mit jelent ez üzletileg? Melyik terméknél éri meg jobban 1 százalékpontot faragni a churn-ön: egy magas (15%) vagy egy alacsony (2%) churn-nel rendelkező terméknél?" },
    ],
  },

  // ============ CLTV — RESUBSCRIPTION ============
  { type: "divider", index: "05", eyebrow: "Egy lépéssel tovább", title: "Mi van, ha vissza is jöhet?" },
  {
    type: "content",
    eyebrow: "A valóság bonyolultabb",
    title: "A lemorzsolódás nem feltétlenül végleges",
    blocks: [
      { kind: "text", html: "Sokan, akik lemondják az előfizetést, <strong>hónapokkal később visszatérnek</strong> (resubscription). Ha ezt figyelmen kívül hagyjuk, alulbecsüljük az ügyfél teljes értékét." },
      { kind: "ask", step: 1, html: "Ha a lemorzsolódás nem végleges — hogyan épül fel most a teljes ügyfélérték?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Két állapot",
    title: "Modellezzük két állapottal",
    blocks: [
      { kind: "text", html: "<strong>Aktív</strong>: fizeti a P díjat, minden hónapban ρ valószínűséggel marad, c = 1−ρ valószínűséggel <em>Lemorzsolódottá</em> válik." },
      { kind: "text", step: 1, html: "<strong>Lemorzsolódott</strong>: nem fizet, de minden hónapban π valószínűséggel <em>visszatér</em> Aktívba (resubscription rate), különben marad Lemorzsolódott." },
    ],
  },
  {
    type: "content",
    eyebrow: "Érték-egyenletek",
    title: "Két egyenlet, két ismeretlen",
    blocks: [
      { kind: "text", html: "Legyen <strong>V</strong> a teljes várható jelenérték Aktív állapotból indulva, <strong>W</strong> ugyanez Lemorzsolódott állapotból indulva. δ = 1/(1+r)." },
      { kind: "text", step: 1, html: "<code>V = P + δ·(ρ·V + c·W)</code>  —  ma megkapod P-t, jövő hónaptól a várható folytatás" },
      { kind: "text", step: 2, html: "<code>W = δ·(π·V + (1−π)·W)</code>  —  ma nincs fizetés, jövő hónaptól a várható folytatás" },
    ],
  },
  {
    type: "content",
    eyebrow: "Megoldás",
    title: "A zárt alak",
    blocks: [
      { kind: "text", html: "A W-egyenletből kifejezve és V-be helyettesítve:" },
      { kind: "text", step: 1, html: "<strong>V = P·(1 − δ(1−π)) / [(1 − δρ)(1 − δ(1−π)) − δ²cπ]</strong>" },
      { kind: "tension", step: 2, label: "Ellenőrzés π = 0-nál", html: "Ha π = 0 (sosem tér vissza), a formula pontosan visszaadja az előző, resub nélküli eredményt: <strong>V = P(1+r)/(r+c)</strong>. Ez egy jó szanity-check minden ilyen levezetésnél." },
    ],
  },
  {
    type: "content",
    eyebrow: "Vissza az üzleti kérdéshez",
    title: "Mit nyerünk ezzel?",
    blocks: [
      { kind: "list", items: [
        "A CLTV nem egy szám, hanem egy <strong>formula</strong> — 4 bemenettel: ár, churn, resub-ráta, WACC",
        "Minden bemenet <strong>mérhető</strong> a saját, felhasználó-szintű adatunkból",
        "A resub-ráta beépítése strukturálisan nem változtat a logikán — csak egy 2×2-es rendszert kell megoldani",
      ]},
      { kind: "ask", step: 1, html: "Ha egy versenytárs csak az 'egyszerű' (resub nélküli) CLTV-t számolja, alul- vagy felülbecsüli a saját ügyfeleik értékét?" },
    ],
  },

  // ============ NOTEBOOK / WORKED EXAMPLE ============
  { type: "divider", index: "06", eyebrow: "Számoljunk", title: "Worked example" },
  {
    type: "content",
    eyebrow: "demo_cltv.ipynb",
    title: "Valós (névtelenített, zajosított) mintán",
    blocks: [
      { kind: "text", html: "A notebookban egy kis, névtelenített és zajosított minta van checkers.com-előfizetőkről (dátumok eltolva, azonosítók törölve): <code>data/cltv_subscriptions.csv</code>." },
      { kind: "list", step: 1, items: [
        "1. lépés: empirikus churn-ráta becslése a mintából (hónapok / lemorzsolódás aránya)",
        "2. lépés: a zárt alak (P, r, c) behelyettesítése",
        "3. lépés: ellenőrzés Monte Carlo-szimulációval — egyezik-e a két eredmény?",
      ]},
    ],
  },
  {
    type: "content",
    eyebrow: "Próbáljátok ki",
    title: "Ti jöttök",
    blocks: [
      { kind: "ask", label: "Feladat a notebookban", html: "Számoljátok ki a CLTV-t mindkét árszintre (Alap, Prémium) — melyik ügyfél ér TÖBBET, és ez egyezik-e azzal, amit a bevétel alapján gondolnátok?" },
    ],
  },

  // ============ ZÁRÁS ============
  { type: "divider", index: "07", eyebrow: "Összefoglalás", title: "Hol tartunk?" },
  {
    type: "content",
    eyebrow: "Recap",
    title: "Amit ma megnéztünk",
    blocks: [
      { kind: "list", items: [
        "Adat → információ → insight, és mit jelent az adatvezérelt döntéshozatal",
        "A négyszintes üzleti analitika piramis",
        "CLTV: annuitás → perpetuitás → churn-korrekció → resubscription zárt alakban",
      ]},
    ],
  },
  {
    type: "content",
    eyebrow: "Híd a következő részhez",
    title: "Tudjuk, mennyit ér egy előfizető. De hányan lesznek?",
    blocks: [
      { kind: "text", html: "A CLTV megmondja, mennyit ér <strong>egy</strong> előfizető. A cégértékeléshez tudnunk kell, <strong>hány</strong> előfizetőnk lesz a jövőben — ehhez előbb azt kell megbecsülnünk, hány napi aktív felhasználónk (DAU) lesz." },
      { kind: "ask", step: 1, html: "A 2. részben: Markov-modell a DAU-előrejelzésre, majd egy kohorsz-alapú előfizetőszám-előrejelzés — és végül vissza a cégértékeléshez." },
    ],
  },
];
