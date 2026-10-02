window.LESSON_LABEL = "Üzleti analitika · 1/2";

window.SLIDES = [
  {
    type: "title",
    eyebrow: "Analitika és vállalatértékelés",
    title: "Analitika és vállalatértékelés",
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
  { type: "divider", index: "03", eyebrow: "Mielőtt belevágnánk", title: "Miért mozog ennyit egy részvényárfolyam?" },
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

  // ============ A CÉG BEMUTATÁSA ============
  { type: "divider", index: "04", eyebrow: "A mai eset", title: "checkers.com" },
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
    eyebrow: "Egy fontos árnyalat",
    title: "A churn valójában nem állandó",
    visual: { kind: "image", src: "../assets/churn_curve_simple.png", alt: "Illusztracios tulelesi gorbe: a churn gyors az elso honapokban, majd lassul" },
    blocks: [
      { kind: "text", html: "Az imént <strong>állandó</strong> havi churn-rátát tételeztünk fel (egyszerűsítés). A valóságban a lemorzsolódás <strong>gyors az első hónapokban, majd lassul</strong> — aki túléli a kezdeti időszakot, egyre stabilabb előfizetővé válik." },
      { kind: "ask", step: 1, html: "Milyen üzleti okok állhatnak amögött, hogy a korai hónapokban ilyen magas a lemorzsolódás?" },
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
  { type: "divider", index: "06", eyebrow: "Egy lépéssel tovább", title: "Mi van, ha vissza is jöhet?" },
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
    eyebrow: "Az egyszerű logika",
    title: "Amit már tudunk, azt újra felhasználjuk",
    blocks: [
      { kind: "text", html: "Ha már előfizető vagy, a jelenértéked <strong>V</strong> — ezt már kiszámoltuk (a resub nélküli zárt alak)." },
      { kind: "text", step: 1, html: "Egy „epizód” (aktív szakasz + az utána következő lemorzsolódott szakasz) átlagos hossza: az előfizetés átlagosan <strong>1/c</strong> ideig tart (ezt már láttuk!), utána átlagosan <strong>1/π</strong> ideig tart, míg valaki visszatér." },
      { kind: "text", step: 2, html: "Amikor visszatér, <strong>újra megkapja ugyanazt a V értéket</strong> — csak diszkontálva, mert a jövőben történik." },
    ],
  },
  {
    type: "content",
    eyebrow: "Megint egy mértani sor",
    title: "Perpetuitás perpetuitásokból",
    blocks: [
      { kind: "text", html: "Ez a ciklus (átlagosan g = 1/c + 1/π hónap egy teljes epizód) elvileg végtelen sokszor megismétlődhet — ismét egy mértani sor, csak most az „epizódok” szintjén:" },
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
