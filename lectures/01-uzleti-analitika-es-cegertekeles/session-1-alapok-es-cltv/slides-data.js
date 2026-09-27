window.LESSON_LABEL = "Üzleti analitika · 1/2";

// Ugyanaz a jelölés-panel fut végig minden CLTV/churn dián (1/churn-től a
// resub-perpetuitásig) -- konzisztensen, hogy ne kelljen diánként újra
// kitalálni, melyik betű mit jelent.
const CLTV_LEGEND = [
  { symbol: "P", meaning: "havi előfizetési díj (ár)" },
  { symbol: "r", meaning: "diszkontráta (WACC), periódusonként" },
  { symbol: "c", meaning: "churn ráta — havi lemorzsolódás valószínűsége" },
  { symbol: "ρ", meaning: "retention ráta = 1 − c" },
  { symbol: "t", meaning: "periódus (hónap) sorszáma" },
  { symbol: "V", meaning: "előfizető jelenértéke (CLTV, resub nélkül)" },
  { symbol: "π", meaning: "resub ráta — visszatérés valószínűsége" },
  { symbol: "δ", meaning: "diszkontfaktor = 1/(1+r)" },
  { symbol: "g", meaning: "egy epizód várható hossza = 1/c + 1/π" },
];

window.SLIDES = [
  {
    type: "title",
    eyebrow: "Analitika és vállalatértékelés",
    title: "Analitika és vállalatértékelés",
    kicker: "Adattudomány, üzleti analitika és egy előfizetéses cég értékelése — a checkers.com példáján",
    note: "Kárpáti András · 1. rész / 2",
  },

  // ============ A CÉG BEMUTATÁSA ============
  { type: "divider", index: "01", eyebrow: "A mai eset", title: "checkers.com" },
  {
    type: "content",
    eyebrow: "A cég",
    title: "Egy online, előfizetéses játékcég",
    blocks: [
      {
        kind: "list",
        items: [
          "Online dámaoktatás és -platform — nem triviális belépni, de legutóbb virálissá vált a közösségi médiában",
          "Egyetlen bevételi forrás: <strong>előfizetés</strong>. Nincs hirdetés.",
          "Havi (csak havi!) díjfizetés, <strong>2 árszint</strong>: Alap és Prémium",
          "Most keres befektetőket egy tőkebevonási körhöz",
        ],
      },
      { kind: "text", step: 1, html: "Kvázi-monopólium a dáma-térben: a domain-név miatt gyakorlatilag <strong>ők az egyetlen jelentős szereplő</strong> a dáma-piacon. (Verseny persze VAN — de az emberek FIGYELMÉÉRT, nem a dáma-játékosokért: más játékok, közösségi média, bármi más szórakozás.)" },
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

  // ============ MI AZ ADATTUDOMÁNY? ============
  { type: "divider", index: "02", eyebrow: "Nyitó kérdés", title: "Mi az adattudomány?" },
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
      src: "../assets/venn_adattudomany.png",
      alt: "Adattudomany Venn-diagramja: Hacking Skills, Matek & Statisztika, Terulet-specifikus tudas metszeteben az Adattudomany",
      caption: "Drew Conway (2010) nyomán — az adattudomány a három kör metszetében él",
    },
    blocks: [
      { kind: "text", html: "<strong>Hacking skills</strong>: meg tudod szerezni és formázni az adatot. <strong>Matek/statisztika</strong>: helyesen tudsz belőle következtetni. <strong>Terület-specifikus tudás</strong>: tudod, mi számít a checkers.com üzletében." },
      { kind: "text", step: 1, html: "Csak matek+hacking, terület-tudás nélkül? <strong>'Danger zone'</strong> — technikailag helyes, üzletileg értelmetlen (vagy káros) következtetések." },
    ],
  },

  // ============ ÜZLETI ANALITIKA PIRAMIS ============
  { type: "divider", index: "03", eyebrow: "Keretrendszer", title: "Az üzleti analitika piramisa" },
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
      { kind: "plaque", year: "Leíró", html: "„Hány napi aktív felhasználónk (DAU) volt tegnap?”" },
      { kind: "plaque", year: "Diagnosztikai", html: "„Miért esett vissza a konverziós rátánk múlt héten?”" },
      { kind: "plaque", year: "Prediktív", html: "„Hány előfizetőnk lesz jövő negyedévben?”" },
      { kind: "plaque", year: "Preskriptív", html: "„Melyik árazási stratégia maximalizálja a bevételt?”" },
    ],
  },
  {
    type: "content",
    eyebrow: "Diagnosztikai analitika — élő példa",
    title: "Egy konkrét eset",
    blocks: [
      { kind: "ask", label: "Kérdés a teremnek", html: "A checkers.com decemberi első heti churn-je 3-szor magasabb, mint az azt megelőző héten. Mi okozhatja ezt?" },
    ],
  },

  // ============ NETFLIX — MIÉRT SZÁMÍT EZ ANNYIRA? ============
  { type: "divider", index: "04", eyebrow: "Mielőtt belevágnánk", title: "Miért mozog ennyit egy részvényárfolyam?" },
  {
    type: "content",
    eyebrow: "Valós adat — Netflix (NFLX)",
    title: "A cégérték nagy része a jövőben van",
    visual: { kind: "image", src: "../assets/nflx_price_chart.png", alt: "Netflix reszvenyarfolyam 2016-2026, split-adjusztalt, valos adat, a 2022-es elofizeto-vesztes es a kesobbi felfutas felannotalva" },
    blocks: [
      { kind: "text", html: "2022 elején a Netflix bejelentette az <strong>első előfizető-vesztését egy évtizedben</strong> — a piac egyetlen hét alatt kb. 37%-kal árazta le a céget." },
    ],
  },
  {
    type: "content",
    eyebrow: "A tanulság",
    title: "Várakozások mozgatják az árat, nem a mai bevétel",
    blocks: [
      { kind: "ask", html: "A Netflix aznapi bevétele gyakorlatilag nem változott — mégis eltűnt a piaci érték harmada. Miért?" },
      { kind: "text", step: 1, html: "Mert egy előfizetéses cég értékének <strong>túlnyomó része a JÖVŐBELI cash flow-kban van</strong> — és az a jövő a churn-re és a növekedésre vonatkozó VÁRAKOZÁSOKON alapul. Ha ezek a várakozások megváltoznak, az árfolyam drasztikusan mozoghat." },
      { kind: "tension", step: 2, label: "Ezért számít ez nekünk", html: "A ma hátralévő részben pontosan ezeket a feltevéseket (churn, növekedés, piacméret) fogjuk megbecsülni a checkers.com-ra — ezek nem akadémiai finomítás, hanem valós dollármilliárdokat mozgató paraméterek." },
    ],
  },

  {
    type: "content",
    eyebrow: "Miért 3 külön modell?",
    title: "Miért nem elég egy trendvonal?",
    blocks: [
      { kind: "text", html: "A leggyorsabb út: vegyük a múltbeli bevételt, illesszünk rá egy trendvonalat, extrapoláljunk. Ez gyors — de <strong>törékeny</strong>: bármilyen történelmi anomália vagy trend-illesztési döntés közvetlenül beépül az értékelésbe, kereszt-ellenőrzés nélkül." },
      { kind: "tension", step: 1, label: "Ehelyett: 3 független becslés, ami összeadva robusztusabb", html: "A CLTV (unit economics), a DAU-előrejelzés (viselkedési modell) és az előfizetőszám (kohorsz-modell) egymástól FÜGGETLENÜL készül — más adatból, más módszertannal. A hibáik nem korrelálnak tökéletesen, ezért a kombinált becslés részben kiátlagolja őket, és minden darabja külön-külön megvédhető egy befektető előtt." },
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
  { type: "divider", index: "05", eyebrow: "Esettanulmány 1", title: "Customer Lifetime Value" },
  {
    type: "content",
    eyebrow: "Felfrissítő",
    title: "Perpetuitás: örökké tartó, fix kifizetés",
    blocks: [
      { kind: "text", html: "Ha egy befektetés <strong>C</strong> összeget fizet minden periódus végén, ÖRÖKKÉ, és a diszkontráta periódusonként <strong>r</strong>, a jelenérték egy mértani sor összege:" },
      { kind: "text", step: 1, html: "<code>PV = C/(1+r) + C/(1+r)² + C/(1+r)³ + …</code>" },
      { kind: "text", step: 2, html: "Zárt alakban (a mértani sor összegképletével): <strong>PV = C / r</strong>" },
      { kind: "plaque", step: 3, year: "1648", html: "Hollandiában kibocsátják az első ismert örökjáradék-kötvényeket (perpetual bonds) gátak finanszírozására. Az egyik — a Lekdijk Bovendams-kötvény — a mai napig létezik, és a Yale Egyetem 2003-ban ténylegesen behajtotta rajta a kamatot." },
    ],
  },
  {
    type: "content",
    eyebrow: "Egy trükk",
    title: "Az annuitás = két perpetuitás különbsége",
    blocks: [
      { kind: "text", html: "Mi van, ha a kifizetés nem örökké tart, csak <strong>n</strong> perióduson át (ez az annuitás)? Nem kell újra levezetni — két perpetuitás különbsége!" },
      { kind: "text", step: 1, html: "<strong>A perpetuitás</strong>: fizet C-t t=1-től örökké → PV_A = C/r. <strong>B perpetuitás</strong>: fizet C-t t=(n+1)-től örökké — ugyanaz, csak n perióddal később kezdve → PV_B = (C/r) / (1+r)ⁿ." },
      { kind: "text", step: 2, html: "A − B pontosan az 1. és n. periódus közötti kifizetéseket adja vissza (minden ami utána jön, kiesik): <strong>PV = C/r − (C/r)/(1+r)ⁿ = C · [1 − (1+r)⁻ⁿ] / r</strong>" },
      { kind: "ask", step: 3, html: "Miért praktikus ez a trükk? (Gondoljatok arra: bármilyen véges cash flow-sorozatot fel tudtok bontani perpetuitások különbségeként — nem kell mindig új mértani sort levezetni.)" },
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
    legend: CLTV_LEGEND,
    blocks: [
      { kind: "text", html: "Annak valószínűsége, hogy valaki még a <em>t</em>-edik hónapban is aktív: <strong>ρᵗ</strong> (geometriai eloszlás)." },
      { kind: "text", step: 1, html: "A várható hossz felírható úgy, mint annak összege, hogy hány hónapig van esély aktívnak maradni: <strong>E[hossz] = P(aktív a 0. hónapban) + P(aktív az 1. hónapban) + P(aktív a 2. hónapban) + … = ρ⁰ + ρ¹ + ρ² + …</strong> — ugyanaz a trükk, mint a perpetuitásnál: egy végtelen mértani sor." },
      { kind: "text", step: 2, html: "Zárt alakban, ugyanazzal a mértani sor összegképlettel, mint az imént: <strong>Σ ρᵗ = 1/(1−ρ) = 1/c</strong> (hiszen ρ = 1 − c)." },
      { kind: "tension", step: 3, label: "Gyors ellenőrzés", html: "5%-os havi churn → várható aktív hossz = 1/0.05 = <strong>20 hónap</strong>. Ez NEM azt jelenti, hogy mindenki pontosan 20 hónapig marad — sokan hamarabb, néhányan sokkal tovább." },
    ],
  },
  {
    type: "content",
    eyebrow: "Egy fontos árnyalat",
    title: "A churn valójában nem állandó",
    visual: { kind: "image", src: "../assets/churn_curve_simple.png", alt: "Illusztracios tulelesi gorbe: a churn gyors az elso honapokban, majd lassul" },
    legend: CLTV_LEGEND,
    blocks: [
      { kind: "text", html: "Az imént <strong>állandó</strong> havi churn-rátát tételeztünk fel (egyszerűsítés). A valóságban a lemorzsolódás <strong>gyors az első hónapokban, majd lassul</strong> — aki túléli a kezdeti időszakot, egyre stabilabb előfizetővé válik." },
      { kind: "ask", step: 1, html: "Milyen üzleti okok állhatnak amögött, hogy a korai hónapokban ilyen magas a lemorzsolódás?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Vissza az annuitáshoz",
    title: "Miért kezelhetjük ezt (majdnem) annuitásként?",
    legend: CLTV_LEGEND,
    blocks: [
      { kind: "text", html: "Tudjuk már: a várható aktív hossz <strong>n = 1/c</strong> hónap. Egyszerűsítsünk: tegyük fel, MINDENKI pontosan ennyi ideig marad — a cash flow ekkor egy sima <strong>n hosszú, C = P annuitás</strong>." },
      { kind: "text", step: 1, html: "Az imént levezetett annuitás-képlettel: <strong>V ≈ P · [1 − (1+r)⁻ⁿ] / r</strong>, ahol n = 1/c." },
      { kind: "tension", step: 2, label: "Ez egy közelítés", html: "Nem mindenki marad pontosan n hónapig. Az átlaggal helyettesíteni a teljes eloszlást torzít (a diszkontálás konvexitása miatt): mindig <strong>felülbecsül</strong> — kb. 1-2%-kal magas (15%) churn-nél, de akár 10-15%-kal is alacsony (2%) churn-nél." },
    ],
  },
  {
    type: "content",
    eyebrow: "Érzékenységvizsgálat",
    title: "Hogyan mozog a CLTV a paraméterekkel?",
    legend: CLTV_LEGEND,
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Ár (P) és WACC (r)", html: "V lineáris P-ben. r-ben monoton csökkenő — magasabb elvárt hozam, alacsonyabb jelenérték." },
          { heading: "Churn (c) — a legérdekesebb", html: "Minél <em>alacsonyabb</em> már a churn (azaz minél hosszabb az átlagos n = 1/c), annál <strong>nagyobb</strong> az abszolút hatása egy további csökkentésnek — ugyanaz az 1 százalékpont sokkal többet ér, ha a churn már amúgy is alacsony." },
        ],
      },
      { kind: "ask", step: 1, html: "Mit jelent ez üzletileg? Melyik terméknél éri meg jobban 1 százalékpontot faragni a churn-ön: egy magas (15%) vagy egy alacsony (2%) churn-nel rendelkező terméknél?" },
    ],
  },

  // ============ CLTV — RESUBSCRIPTION ============
  { type: "divider", index: "06", eyebrow: "Egy lépéssel tovább", title: "Mi van, ha vissza is jöhet?" },
  {
    type: "content",
    eyebrow: "A valóság bonyolultabb",
    title: "A lemorzsolódás nem feltétlenül végleges",
    legend: CLTV_LEGEND,
    blocks: [
      { kind: "text", html: "Sokan, akik lemondják az előfizetést, <strong>hónapokkal később visszatérnek</strong> (resubscription). Ha ezt figyelmen kívül hagyjuk, alulbecsüljük az ügyfél teljes értékét." },
      { kind: "ask", step: 1, html: "Ha a lemorzsolódás nem végleges — hogyan épül fel most a teljes ügyfélérték?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Az egyszerű logika",
    title: "Amit már tudunk, azt újra felhasználjuk",
    legend: CLTV_LEGEND,
    blocks: [
      { kind: "text", html: "Ha már előfizető vagy, a jelenértéked <strong>V</strong> — ezt már kiszámoltuk, mint egy <strong>n = 1/c</strong> hosszú annuitást." },
      { kind: "text", step: 1, html: "Egy „epizód” átlagos hossza: az előfizetés átlagosan <strong>1/c</strong> ideig tart (ezt már láttuk!), utána átlagosan <strong>1/π</strong> ideig tart, míg valaki visszatér." },
      { kind: "text", step: 2, html: "Amikor visszatér, <strong>újra megkapja ugyanazt a V értéket</strong> — csak diszkontálva, mert a jövőben történik." },
    ],
  },
  {
    type: "content",
    eyebrow: "Megint egy mértani sor",
    title: "Perpetuitás annuitásokból",
    legend: CLTV_LEGEND,
    blocks: [
      { kind: "text", html: "Minden „epizód” maga egy annuitás (V), és ez a ciklus (átlagosan g = 1/c + 1/π hónap egy teljes epizód) elvileg végtelen sokszor megismétlődhet — ismét egy mértani sor, csak most az „epizódok” szintjén:" },
      { kind: "text", step: 1, html: "<strong>Teljes érték = V · (1 + δᵍ + δ²ᵍ + …) = V / (1 − δᵍ)</strong>, ahol δ = 1/(1+r) és g = 1/c + 1/π." },
      { kind: "tension", step: 2, label: "Ez egy közelítés", html: "Az „átlagosan g hónap” kezelése egyszerűsítés — a pontos várható érték egy véletlen hosszú időszakra technikailag kicsit magasabb lenne (a diszkontálás konvex). A notebookban egy Monte Carlo szimulációval ellenőrizzük, mekkora ez az eltérés — 3-13% körüli, mindig ugyanabba az irányba." },
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
        "A resub-ráta beépítése ugyanazt a mértani-sor logikát ismétli meg, egy szinttel feljebb",
      ]},
      { kind: "ask", step: 1, html: "Ha egy versenytárs csak az 'egyszerű' (resub nélküli) CLTV-t számolja, alul- vagy felülbecsüli a saját ügyfeleik értékét?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Egy lépéssel tovább",
    title: "Mi van, ha nem előfizetőből indulunk?",
    blocks: [
      { kind: "ask", label: "Nyitott kérdés", html: "Mi van, ha nem egy már ELŐFIZETŐ állapotból indulunk, hanem egy REGISZTRÁLT, de még nem fizető állapotból? Mit kellene még megbecsülnünk a modellhez?" },
      { kind: "text", step: 1, html: "(Ez pontosan az a bővítés — regisztrált→előfizető konverziós ráta —, amire a 2. részben, a kohorsz-modellnél visszatérünk.)" },
    ],
  },

  // ============ NOTEBOOK / WORKED EXAMPLE ============
  { type: "divider", index: "07", eyebrow: "Számoljunk", title: "Worked example" },
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
  { type: "divider", index: "08", eyebrow: "Összefoglalás", title: "Hol tartunk?" },
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
