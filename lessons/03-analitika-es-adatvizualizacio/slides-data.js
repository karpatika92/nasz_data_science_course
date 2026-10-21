window.LESSON_LABEL = "3. óra · Analitika és adatvizualizáció";

// ---------------------------------------------------------------------------
// Kézzel válogatott Reddit-példák (r/dataisbeautiful, r/dataisugly) — CSAK a kép,
// a poszt nem. A Redditet scriptből nem érjük el (403), ezért ezeket kézzel kell
// letölteni: tedd a képet az assets/reddit/ mappába, és vedd fel ide egy sorban.
// Üres tömb = nem jelenik meg dia (nincs törött kép).
//   { src: "assets/reddit/jo_1.png", why: "Mitől jó / mi a baj vele — 1-2 mondat" }
// ---------------------------------------------------------------------------
const PICKS_GOOD = [];
const PICKS_BAD = [];

const pickSlides = (picks, eyebrow, titlePrefix, askHtml) =>
  picks.map((p, i) => ({
    type: "content",
    eyebrow,
    title: `${titlePrefix} ${i + 1}.`,
    visual: { kind: "image", src: p.src, alt: `${titlePrefix} ${i + 1}.`, caption: "forrás: Reddit (csak a kép)" },
    blocks: [
      { kind: "ask", html: askHtml },
      { kind: "text", step: 1, html: p.why },
    ],
  }));

window.SLIDES = [
  {
    type: "title",
    eyebrow: "Data Science műhelykurzus",
    title: "Analitika és adatvizualizáció",
    kicker: "Egy ábra legyen önmagában érthető — és meséljen történetet.",
    note: "Kárpáti András · 3. óra",
  },

  // ---------------- Házi beszámoló ----------------
  { type: "divider", index: "00", eyebrow: "Mielőtt belevágunk", title: "A házikról" },
  {
    type: "content",
    eyebrow: "1. házi · kódoló ügynök",
    title: "Kifaggatott az ügynökötök",
    blocks: [
      { kind: "ask", label: "Mondjátok el", html: "Mit kérdezett tőletek az ügynök? Miről beszélgettetek?" },
      { kind: "ask", step: 1, label: "Kézzel fogható", html: "Volt-e kimenet — fájl, jegyzet, kód, repo? Mit tartalmazott?" },
    ],
  },
  {
    type: "content",
    eyebrow: "2. házi · Kaggle adatsor",
    title: "Saját ötlet, valódi javulás?",
    blocks: [
      { kind: "ask", label: "Mondjátok el", html: "Melyik adatsort választottátok? Milyen <strong>saját ötletet</strong> próbáltatok ki (új feature, modell, hiperparaméter, validáció)?" },
      { kind: "ask", step: 1, label: "Találtatok javulást?", html: "Mihez képest, és <strong>melyik halmazon mértétek</strong> — amin hangoltatok, vagy egy félretett teszthalmazon?" },
      { kind: "tension", step: 2, label: "Emlékeztető a 2. órából", html: "Az a javulás ér valamit, amit olyan adaton mértél, amit a hangolás közben nem láttál." },
    ],
  },

  // ---------------- Adatvizualizáció ----------------
  { type: "divider", index: "01", eyebrow: "Első rész", title: "Adatvizualizáció" },
  {
    type: "content",
    eyebrow: "A fő tézis",
    title: "Egy ábra legyen önmagában érthető",
    blocks: [
      { kind: "text", html: "Egy jó kép többet mond ezer szónál — de csak ha <strong>a szöveg nélkül is elmondja</strong>, mit látunk, és miért érdekes." },
      { kind: "ask", step: 1, label: "5 másodperces teszt", html: "Ha valaki csak ezt az egy ábrát kapja meg e-mailben, minden más nélkül — érteni fogja?" },
      {
        kind: "list", step: 2,
        items: [
          "<strong>A cím az állítás</strong>, nem a téma („Netflix: −75%, majd 7,5×”, nem „Netflix árfolyam”)",
          "<strong>Tengelycím + egység</strong> (mi van a tengelyen, miben mérjük)",
          "<strong>Forrás</strong> az ábra alján",
          "<strong>Annotáció</strong> a történet fordulópontjain",
          "Egy ábra — egy üzenet",
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Miért kell egyáltalán ábra?",
    title: "Ugyanaz az átlag, szórás, korreláció",
    visual: { kind: "image", step: 1, src: "assets/anscombe.png", alt: "Anscombe négyese", caption: "→ Anscombe (1973)" },
    blocks: [
      { kind: "ask", html: "Négy adatsor: ugyanaz az x és y átlaga, szórása, korrelációja, ugyanaz az illesztett egyenes. <strong>Ugyanaz az adat?</strong>" },
      { kind: "text", step: 1, html: "Nem. Egy parabola, egy outlier, egy függőleges oszlop egy kiugró ponttal. A számok nem látják, amit a szem igen." },
    ],
  },
  {
    type: "content",
    eyebrow: "Miért kell egyáltalán ábra?",
    title: "A Datasaurus",
    visual: { kind: "image", step: 1, src: "assets/datasaurus.png", alt: "Datasaurus: négy alakzat azonos statisztikákkal", caption: "→ Matejka & Fitzmaurice, 2017" },
    blocks: [
      { kind: "ask", html: "Mit gondoltok, mekkora korrelációja van egy dinoszaurusznak?" },
      { kind: "text", step: 1, html: "−0,06 — mint a csillagnak, a céltáblának és az X-nek. <strong>Előbb nézd meg, aztán számolj.</strong> (Ez az EDA lényege.)" },
    ],
  },
  ...pickSlides(PICKS_GOOD, "Jó példák", "Jó ábra", "Mit tud ez az ábra, amit a többi nem? (cím, tengelyek, forrás, annotáció)"),

  // ---- rossz példák, trükkök ----
  { type: "divider", index: "01b", eyebrow: "Mi megy félre", title: "Rossz ábrák és vizuális trükkök" },
  {
    type: "content",
    eyebrow: "Trükk 1",
    title: "Csonkolt tengely",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/lie_truncated_axis.png", alt: "Csonkolt és nulláról induló oszlopdiagram", caption: "szintetikus illusztráció" },
    blocks: [
      { kind: "ask", html: "Ugyanaz a +2%. Melyik képen „duplázódott” a bevétel — és <strong>mi változott</strong> a két ábra között?" },
      { kind: "text", step: 1, html: "Az oszlop <em>hosszát</em> olvassuk értéknek, ezért az oszlopdiagram tengelye <strong>nullánál kezdődik</strong>. (Vonaldiagramnál a csonkolás elfogadható — ott a változás a lényeg, nem a hossz.)" },
    ],
  },
  {
    type: "content",
    eyebrow: "Trükk 2",
    title: "Két y-tengely",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/lie_dual_axis.png", alt: "Két y-tengelyes vonaldiagram és pontdiagram", caption: "szintetikus illusztráció" },
    blocks: [
      { kind: "ask", html: "Úgy tűnik, a két sor együtt mozog. Mi a gyanús?" },
      { kind: "text", step: 1, html: "A két tengely skáláját <strong>bármire be lehet állítani</strong>, hogy a görbék ráfeküdjenek egymásra. Két független, trendes sor „korrelál” — ez a 1. órás álkorreláció." },
    ],
  },
  {
    type: "content",
    eyebrow: "Trükk 3",
    title: "Terület vagy hossz?",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/lie_area.png", alt: "Két kör, a sugár az értékkel skálázva", caption: "szintetikus illusztráció" },
    blocks: [
      { kind: "ask", html: "Az érték megduplázódott. Hányszor nagyobbnak látjátok a narancssárga kört?" },
      { kind: "text", step: 1, html: "A szem a <strong>területet</strong> olvassa. Ha a sugarat skálázod az értékkel, a terület négyszeres. Aránynál: a <em>terület</em> legyen arányos az értékkel." },
    ],
  },
  ...pickSlides(PICKS_BAD, "Rossz példák", "Rossz ábra", "Mi a baj ezzel az ábrával? Sorold fel, amit találsz."),
  {
    type: "content",
    eyebrow: "Rossz példa · élő átalakítás",
    title: "Mi a baj ezzel az ábrával?",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/makeover_bad.png", alt: "Szándékosan rossz árfolyamábra", caption: "szándékosan rossz — a saját adatunkból" },
    blocks: [
      { kind: "ask", label: "Közösen", html: "Egy cég árfolyama. <strong>Mi hiányzik, mi zavar, mit hallgat el?</strong>" },
    ],
  },
  {
    type: "content",
    eyebrow: "Rossz példa · élő átalakítás",
    title: "Mit találtunk — és most javítsuk meg",
    blocks: [
      {
        kind: "list",
        items: [
          "Se cím, se tengelycím, se egység, se forrás",
          "<strong>Kiválogatott ablak</strong> (mélypont → csúcs): „mindig csak felfelé megy”",
          "Kövér rács, telített háttér: az adat a díszítésben elvész",
        ],
      },
      { kind: "ask", step: 1, label: "Ti jöttök (5 perc)", html: "Az ügynökötökkel <strong>javítsátok meg</strong> (<code>nflx_weekly_price.csv</code>). Mi lesz a <em>cím</em>?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Rossz példa · az átalakítás eredménye",
    title: "Ugyanaz az adat — most önmagában érthető",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/makeover_good.png", alt: "Javított árfolyamábra", caption: "cím = állítás · annotált fordulópontok · forrás" },
    blocks: [
      { kind: "text", html: "Teljes idősor (nem kiválogatott ablak), a <strong>cím maga az insight</strong>, tengelycímek és egység, három annotált pont, forrás." },
      { kind: "ask", step: 1, label: "Vessétek össze", html: "A tiétek mit csinált másképp? Melyik cím mond többet?" },
    ],
  },

  // ---------------- Diagramtípusok ----------------
  { type: "divider", index: "02", eyebrow: "Második rész", title: "Melyik diagram mire jó?" },
  {
    type: "content",
    eyebrow: "Diagramtípusok",
    title: "Először a kérdés, aztán a forma",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/chart_types.png", alt: "Hat diagramtípus", caption: "szintetikus adatok, csak a forma kedvéért" },
    blocks: [
      { kind: "ask", html: "Párosítsátok a hat diagramot a hat kérdéssel." },
    ],
  },
  {
    type: "content",
    eyebrow: "Diagramtípusok",
    title: "Melyik kérdéshez melyik forma?",
    blocks: [
      {
        kind: "list",
        items: [
          "<strong>Időbeli változás?</strong> → vonal",
          "<strong>Melyik nagyobb?</strong> → oszlop (nulláról)",
          "<strong>Eloszlás alakja?</strong> → hisztogram",
          "<strong>Összefügg-e a kettő?</strong> → pont",
          "<strong>Több csoport eloszlása?</strong> → boxplot",
          "<strong>Két dimenzió × érték?</strong> → hőtérkép (pl. kohorsz-megtartás)",
        ],
      },
      { kind: "text", step: 1, html: "<strong>Szabály:</strong> ha nem tudod a kérdést, amire az ábra válaszol, még nem diagramot kell választanod." },
    ],
  },

  // ---------------- Színelmélet ----------------
  { type: "divider", index: "03", eyebrow: "Harmadik rész", title: "Színelmélet" },
  {
    type: "content",
    eyebrow: "Színek",
    title: "A szivárvány hazudik",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/color_rainbow.png", alt: "Ugyanaz az adat szivárvány és egyszínű skálán", caption: "ugyanaz az adat, két színskála" },
    blocks: [
      { kind: "ask", html: "Ugyanaz a két domb. Hány „csúcsot” és „határvonalat” láttok a bal oldali képen — és hányat az adatban?" },
      { kind: "text", step: 1, html: "A szivárványban a szem <strong>élesen elváló sávokat</strong> lát ott, ahol az érték simán változik, és a sárga „kiugrik”, pedig nem nagyobb. Sorrendet a világosság hordoz, nem a színárnyalat." },
    ],
  },
  {
    type: "content",
    eyebrow: "Színek",
    title: "A szín kódolás, nem dísz",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/color_types.png", alt: "Szekvenciális, divergáló és kategoriális skála", caption: "három feladat, három skála" },
    blocks: [
      { kind: "ask", html: "Három feladatot adhat a szín egy ábrán. Mi lehet a három?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Színek",
    title: "Három feladat, három skála",
    blocks: [
      {
        kind: "list",
        items: [
          "<strong>Mennyiség</strong> → szekvenciális: <em>egy</em> színárnyalat, a kis értéktől a nagyig egyre világosabb",
          "<strong>Eltérés egy középponttól</strong> → divergáló: két árnyalat + semleges közép",
          "<strong>Azonosság</strong> (melyik csoport) → kategoriális: kevés, jól megkülönböztethető szín, mindig ugyanabban a sorrendben",
        ],
      },
      { kind: "tension", step: 1, label: "Miért számít?", html: "A piros–zöld „jó–rossz” skála kulturálisan magától értetődő, de aki nem különbözteti meg a kettőt, annak üres. A szín mellé mindig kell másik jel is (címke, forma, pozíció)." },
    ],
  },

  // ---------------- Történetmesélés ----------------
  { type: "divider", index: "04", eyebrow: "Negyedik rész", title: "Történetmesélés" },
  {
    type: "content",
    eyebrow: "Történetmesélés",
    title: "Az ábra és a történet különbsége",
    blocks: [
      { kind: "ask", html: "Mi a különbség egy <em>ábra</em> és egy <em>történet</em> között?" },
      {
        kind: "columns", step: 1,
        columns: [
          { heading: "Ábra", html: "Megmutatja, <strong>mi van</strong>: értékek, görbék, összehasonlítások." },
          { heading: "Történet", html: "Megmondja, <strong>miért számít</strong>: van <strong>kontextusa</strong> (hol tartunk), <strong>fordulata</strong> (mi változott) és <strong>tanulsága</strong> (mit kezdjünk vele)." },
        ],
      },
      { kind: "tension", step: 2, label: "Ugyanaz az adat, két cím", html: "„Netflix árfolyam, 2016–2026” — ez <em>ábra</em>.<br>„Netflix: −75%, majd 7,5-szeres, azóta ismét −46%” — ez <em>történet</em>." },
    ],
  },
  {
    type: "content",
    eyebrow: "Egy árfolyam története",
    title: "Netflix, 2016–2026",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/makeover_good.png", alt: "Netflix árfolyam, annotálva", caption: "ugyanaz az ábra, most történetként olvasva" },
    blocks: [
      { kind: "ask", label: "30 másodperc", html: "Mondjátok el a történetet az ábra alapján: kontextus, fordulat, tanulság." },
      { kind: "ask", step: 1, label: "És a miért?", html: "2022 áprilisában egyetlen hét alatt −37%. <strong>Mi történhetett?</strong> Honnan tudnánk meg?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Magyarázat nélkül is érthető",
    title: "Várható élettartam, 1770–2015",
    visual: { kind: "image", src: "assets/classics/owid_life_expectancy.png", alt: "Várható élettartam a világ régióiban, 1770-től", caption: "Our World in Data · CC BY 4.0 · Riley; Zijdeman et al.; HMD; UN WPP" },
    blocks: [
      { kind: "ask", html: "Ehhez nem kell magyarázat. De <strong>megszegi az első szabályunkat</strong>: a cím téma, nem állítás. Mégis érthető — miért?" },
      { kind: "text", step: 1, html: "Egy kérdés, egy vonal-család, <strong>közvetlen címkék</strong> a vonalak végén, egy mértékegység. A forma maga a történet: tartósan felfelé, és 1950 óta a régiók közti rés szűkül." },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1854",
    title: "Ki volt John Snow?",
    blocks: [
      { kind: "ask", html: "Mit tudtok a 19. századi kolerajárványokról? <strong>Mi okozta őket — szerintetek, és szerintük?</strong>" },
      {
        kind: "list", step: 1,
        items: [
          "Angol orvos (<strong>1813. március 15., York – 1858. június 16., London</strong>).",
          "Az <strong>érzéstelenítés</strong> és az orvosi higiénia fejlesztésének úttörője.",
          "<strong>1849:</strong> esszét ír a kolera terjedéséről. <strong>1855:</strong> részletes értekezés, benne az 1854-es soho-i járvány vizsgálata.",
          "A Broad Street-i járvány vizsgálatát az <strong>epidemiológia egyik alapító eseményének</strong> tartják.",
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1854",
    title: "Mi történt a Broad Streeten?",
    blocks: [
      {
        kind: "list",
        items: [
          "<strong>1854. augusztus 31.:</strong> kolerajárvány tör ki Londonban, <strong>Soho</strong>-ban, a Broad Street (ma Broadwick Street) környékén.",
          "Az első három napban <strong>127-en</strong> haltak meg; szeptember 10-ig több mint 300-an; összesen <strong>420-an</strong>. A következő héten a lakók háromnegyede elmenekült.",
          "Az uralkodó nézet a <strong>miazma-elmélet</strong>: a kolerát a rothadó anyagokból származó, levegőben terjedő részecskék okozzák.",
          "<strong>Snow szerint</strong> szennyezett víz terjeszti. Lakókkal és az áldozatok családjaival beszélt (Henry Whitehead tiszteletes segítségével), majd térképre vitte az eseteket és a vízkutakat.",
          "<strong>1854. szeptember 7.:</strong> bemutatja a találatait a plébánia vezetőinek (Board of Guardians); a Broad Street-i kút karját <strong>másnap</strong> eltávolítják.",
        ],
      },
      { kind: "ask", step: 1, html: "Miért térkép a jó válasz, és miért nem táblázat?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1854",
    title: "Snow térképe — mit kérdezett?",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/classics/snow_cholera.jpg", alt: "John Snow londoni koleratérképe, 1854", caption: "John Snow, 1854 · közkincs (Wikimedia Commons)" },
    blocks: [],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1854",
    title: "Hogyan olvassuk a térképet?",
    visual: { kind: "image", src: "assets/classics/snow_cholera.jpg", alt: "John Snow londoni koleratérképe, 1854", caption: "a fekete sávok a halálesetek, a PUMP jelek a vízkutak" },
    blocks: [
      {
        kind: "list",
        items: [
          "A <strong>fekete sávok</strong> a haláleseteket jelölik, házanként egymásra rakva.",
          "A <strong>PUMP</strong> feliratok a vízkutak.",
          "A sávok a <strong>Broad Street-i kút</strong> körül sűrűsödnek.",
        ],
      },
      { kind: "text", step: 1, html: "A kérdés <em>hol</em> volt: a forma a kérdésből jön." },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1854",
    title: "Mit nem bizonyít a térkép?",
    blocks: [
      { kind: "ask", html: "A halálesetek a kút körül sűrűsödnek. <strong>Bizonyítja ez, hogy a víz okozta a járványt?</strong> Mi másra gondolhatnánk?" },
      { kind: "text", step: 1, html: "Snow maga is megjegyezte, hogy a járvány már a kút lezárása előtt visszaszorulóban lehetett (a lakók elmenekültek), vagyis a kar eltávolítása nem egyedül magyarázza a végét." },
      { kind: "tension", step: 2, label: "A későbbi nyomozás", html: "A kutat egy régi, szivárgó emésztőgödörtől mintegy 3 lábra (kb. 1 méterre) ásták, és a gödörbe egy kolerás csecsemő pelenkáinak mosóvize jutott. <strong>A térkép a „hol”-t mutatta meg; a „miért”-hez további nyomozás kellett.</strong>" },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · kicsoda ő?",
    title: "Ki volt Florence Nightingale?",
    blocks: [
      { kind: "ask", html: "Hallottatok már Florence Nightingale-ről? <strong>Mit tudtok róla?</strong>" },
      {
        kind: "list", step: 1,
        items: [
          "Angol társadalmi reformer és <strong>statisztikus</strong>; a <strong>modern ápolás megalapozója</strong>.",
          "<strong>1820. május 12-én született</strong> Firenzében, <strong>1910. augusztus 13-án halt meg</strong>.",
          "Az éjszakai kórtermi körútjairól „<strong>a lámpás hölgy</strong>” (<em>The Lady with the Lamp</em>) néven vált ikonná.",
          "<strong>1860:</strong> Londonban, a St Thomas' Kórházban ápolóiskolát alapít, ezzel megteremtve a hivatásos ápolást.",
        ],
      },
      { kind: "tension", step: 2, label: "Ma a statisztikusról lesz szó", html: "Arról az <strong>egy diagramról</strong>, amellyel meg akarta győzni a döntéshozókat." },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · hol és mikor?",
    title: "A krími háború és Scutari",
    blocks: [
      {
        kind: "list",
        items: [
          "<strong>A krími háború (1853–1856):</strong> Oroszország az Oszmán Birodalom, Nagy-Britannia és Franciaország szövetsége ellen (1855-től Szardínia is). A harcok fő színtere a <strong>Krím-félsziget</strong> volt.",
          "<strong>Scutari = Üsküdar</strong>, ma Isztambul <strong>ázsiai oldalán</strong> (akkor Konstantinápoly, az Oszmán Birodalom fővárosa).",
          "A <strong>Selimiye-laktanya</strong> ideiglenes katonai kórház lett a brit hadsereg számára.",
          "<strong>1854. november 4.:</strong> Nightingale 37 önkéntes ápolónővel megérkezik.",
        ],
      },
      { kind: "ask", step: 1, html: "Miért van egy brit kórház Isztambulban, és nem Londonban vagy a Krímben?" },
      { kind: "text", step: 2, html: "A laktanyát a Krím felé tartó brit hadseregnek jelölték ki; miután két gyalogezred a frontra indult, <strong>ideiglenes katonai kórházzá</strong> alakították." },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1858",
    title: "Nightingale, 1858 — mit akart elérni vele?",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/classics/nightingale.jpg", alt: "Florence Nightingale rózsadiagramja", caption: "Florence Nightingale, 1858 · közkincs (Wikimedia Commons)" },
    blocks: [],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · történelmi háttér",
    title: "Mi történt Scutariban?",
    blocks: [
      {
        kind: "list",
        items: [
          "<strong>1854 novembere:</strong> Nightingale megérkezik a scutari kórházba. Kevés gyógyszer, elhanyagolt higiénia, tömeges, gyakran halálos fertőzések.",
          "<strong>Az első tél:</strong> 4077 brit katona hal meg Scutariban. Nagyjából tízszer annyian haltak meg betegségben, mint harci sebekben.",
          "<strong>1855 márciusa:</strong> a kormány Sanitary Commission-t küld: csatornák átöblítése, szellőzés javítása. A halálozás jelentősen csökken.",
          "<strong>1858:</strong> a diagram megjelenik egy brit hadseregről szóló jelentéskötetben, és elküldik Viktória királynőnek.",
          "<strong>1859:</strong> Nightingale a Royal Statistical Society első női tagja.",
        ],
      },
      { kind: "ask", step: 1, html: "Miért épp <strong>diagram</strong>, miért nem táblázat? Kiknek készült?" },
      { kind: "text", step: 2, html: "Képviselőknek és hivatalnokoknak, akik hagyományos statisztikai jelentéseket nem olvastak volna el. Az ábra célja nem a szépség, hanem hogy <strong>döntést váltson ki</strong>." },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1858",
    title: "Hogyan olvassuk?",
    visual: { kind: "image", src: "assets/classics/nightingale.jpg", alt: "Florence Nightingale rózsadiagramja", caption: "Nightingale, 1858 · jobb: 1854. ápr.–1855. márc., bal: 1855. ápr.–1856. márc." },
    blocks: [
      {
        kind: "list",
        items: [
          "<strong>Kék:</strong> megelőzhető vagy enyhíthető fertőző betegségek",
          "<strong>Piros:</strong> sebesülés",
          "<strong>Fekete:</strong> minden egyéb ok",
          "A <strong>terület</strong> a havi halálozás (éves ráta, 1000 főre)",
        ],
      },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1858",
    title: "Mit nem bizonyít?",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/classics/nightingale.jpg", alt: "Florence Nightingale rózsadiagramja", caption: "a bal diagramon a kék szirmok kisebbek" },
    blocks: [
      { kind: "ask", label: "Gondolkodjatok", html: "A bal diagramon a kék szirmok kisebbek. Ez bizonyítja, hogy a Sanitary Commission miatt? <strong>Mi más változhatott?</strong>" },
      { kind: "tension", step: 1, label: "Emlékeztető az 1. órából", html: "Az ábra az <em>előtte–utána</em> összefüggést mutatja, az okot nem. Egy meggyőző ábra még nem bizonyíték." },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1869",
    title: "Minard: hány adat van a képen?",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/classics/minard.png", alt: "Minard térképe Napóleon oroszországi hadjáratáról", caption: "Charles Minard, 1869 · közkincs (Wikimedia Commons)" },
    blocks: [],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1869",
    title: "Hány fő indult, és hányan tértek vissza?",
    blocks: [
      { kind: "ask", html: "A térkép szerint hány katonával lépte át Napóleon serege az orosz határt (a Nyemen folyót)? Hányan értek Moszkvába? Hányan jöttek vissza?" },
      {
        kind: "list", step: 1,
        items: [
          "<strong>A sáv vastagsága a létszám:</strong> 1 mm = 10 000 fő (Minard saját jelmagyarázata).",
          "<strong>Bézs sáv</strong> (az eredetiben vörös): befelé, Oroszországba. <strong>Fekete sáv:</strong> kifelé.",
          "<strong>Indulás</strong> (a Nyemen átlépése): <strong>422 000</strong> fő.",
          "<strong>Moszkva:</strong> <strong>100 000</strong> fő.",
          "<strong>A visszaút vége:</strong> <strong>10 000</strong> fő.",
        ],
      },
      { kind: "tension", step: 2, label: "A szám, ami elmondja a történetet", html: "10 000 a 422 000-ből: a térkép szerint a kiindulók <strong>alig 2,4%-a</strong> ért vissza a Nyemenhez. A számokat a térképen feliratok adják, nem kell kiolvasni a vastagságból." },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1869",
    title: "Olvasd el a lábjegyzetet is",
    blocks: [
      { kind: "ask", html: "Minard a térkép szövegében leírja, <strong>hogyan számolt</strong>. Szerintetek mire hívja fel a figyelmet, és miért fontos ez?" },
      { kind: "text", step: 1, html: "Hogy a veszteség jobban látsszon, <strong>feltételezte</strong>, hogy Jérôme herceg és Davout marsall hadtestei (amelyek Minszk és Mogiljov felé váltak le, majd Orsa és Vityebszk környékén csatlakoztak vissza) <strong>végig a fősereggel meneteltek</strong>." },
      { kind: "tension", step: 2, label: "Ami ebből következik", html: "Az ábra számai egy <strong>szerkesztői döntést</strong> is tartalmaznak. A jó ábra ezt a lábjegyzetben el is mondja — ugyanúgy, ahogy a forrást és a mértékegységet." },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1869",
    title: "A hőmérséklet a térkép alján — mennyi ez Celsiusban?",
    visualLayout: "stack",
    visual: { kind: "image", src: "assets/minard_temperature.png", alt: "A Minard-térkép hőmérsékleti pontjai Réaumur- és Celsius-fokban", caption: "a térkép jelölt pontjai, olvashatóan újrarajzolva" },
    blocks: [],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1869",
    title: "Hogyan olvassuk a hőmérsékleti skálát?",
    blocks: [
      { kind: "ask", html: "A térkép aljára Minard külön hőmérséklet-diagramot tett, <strong>Réaumur-fokban</strong>. Hogyan számoljuk át Celsiusra?" },
      { kind: "text", step: 1, html: "<strong>Réaumur → Celsius: × 1,25.</strong> A skála a fagypont <em>alatt</em> számol (0-tól 30-ig lefelé = egyre hidegebb), tehát −30 °R = <strong>−37,5 °C</strong>." },
      { kind: "text", step: 2, html: "Az idő a térképen <strong>jobbról balra</strong> telik (a visszavonulás Moszkvától a Nyemenig); a vékony függőleges vonalak a hőmérsékleti pontot a térkép megfelelő helyéhez kötik." },
      { kind: "text", step: 3, html: "A dátumok régi írásmóddal: <strong>8.bre = október, 9.bre = november, X.bre = december</strong>." },
    ],
  },
  {
    type: "content",
    eyebrow: "Klasszikus · 1869",
    title: "Hat adat, egy állítás",
    blocks: [
      { kind: "text", html: "Hat adat egy képen: <strong>létszám, két földrajzi koordináta, irány, hőmérséklet és dátum</strong>. Aki nem ismeri a történetet, <em>akkor is látja</em>, hogy a sereg eltűnik." },
      { kind: "text", step: 1, html: "Az ábra megmutatja, mi az, amit a legtöbb ábra nem tud: sok dimenziót <strong>egyetlen állításhoz</strong> rendelni." },
    ],
  },

  // ---------------- Analitika: esettanulmány ----------------
  { type: "divider", index: "05", eyebrow: "Esettanulmány", title: "checkers.com: mit kezdjünk a fizetési adattal?" },
  {
    type: "content",
    eyebrow: "A kiinduló helyzet",
    title: "Van egy fizetési adatsorunk",
    blocks: [
      { kind: "text", html: "Ugyanaz a cég, mint a BCE-s előadáson: <strong>checkers.com</strong>, online dáma, havi előfizetés. Van egy táblázatunk arról, ki mikor mennyit fizetett." },
      { kind: "ask", label: "Gyűjtsünk", html: "<strong>Mit kezdenénk vele?</strong> Minden ötlet jó — írjuk fel a táblára." },
      { kind: "tension", step: 1, label: "A szándékolt válasz", html: "<strong>Értékeljük a céget.</strong> Mennyit ér a checkers.com?" },
    ],
  },
  {
    type: "content",
    eyebrow: "A keret",
    title: "Adat → információ → insight → döntés",
    blocks: [
      {
        kind: "columns",
        columns: [
          { heading: "Adat", html: "Nyers fizetési sorok: ki, mikor, mennyit." },
          { heading: "Információ", html: "Struktúra + kontextus: <em>hányan maradnak meg hány hónapig?</em> (túlélési görbe)" },
        ],
      },
      {
        kind: "columns", step: 1,
        columns: [
          { heading: "Insight", html: "Döntésrelevancia: <em>egy előfizető ennyit ér, és ez mozgatja.</em>" },
          { heading: "Döntés", html: "<em>Megéri-e ennyit költeni egy új előfizetőre? Mibe fektessünk?</em>" },
        ],
      },
      { kind: "ask", step: 2, html: "Hol csúszik el leggyakrabban egy elemzés ezen a négy lépcsőn?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Értékelés",
    title: "Hogyan értékelnétek egy céget?",
    blocks: [
      { kind: "ask", html: "Három perc: <strong>hogyan állapítanátok meg, mennyit ér egy cég?</strong> Mi minden jut eszetekbe?" },
      { kind: "text", step: 1, html: "Például: bevételi szorzó, hasonló cégek (összehasonlító), <strong>jövőbeli pénzáramlások jelenértéke</strong> (DCF)." },
      { kind: "tension", step: 2, label: "A mi esetünkben", html: "Egy előfizetéses cég pénzáramlásai <strong>előfizetők fizetéseiből</strong> jönnek. Tehát előbb: <strong>mennyit ér egy előfizető?</strong>" },
    ],
  },
  {
    type: "content",
    eyebrow: "Egy előfizető értéke",
    title: "Havonta fizet P-t. Mennyit ér ma?",
    blocks: [
      { kind: "ask", html: "Egy előfizető <strong>pontosan n hónapig</strong> marad, havonta P-t fizet. A pénz ma többet ér, mint holnap (diszkontráta r). <strong>Mennyit ér ez ma?</strong>" },
      { kind: "text", step: 1, html: "Mértani sor (annuitás): minden hónap fizetése 1/(1+r)-szeresére „kopik”." },
      { kind: "ask", step: 2, html: "De nem tudjuk, mennyi ideig marad. <strong>Mi történik, ha végtelen ideig?</strong> És ha valaki eltűnik?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Churn",
    title: "Hány hónapot fizet átlagosan?",
    blocks: [
      { kind: "ask", html: "Minden hónapban <strong>c</strong> eséllyel lelép. Mennyi az átlagos fizetett hónapszám?" },
      { kind: "text", step: 1, html: "Geometriai eloszlás: a várható élettartam <strong>1/c</strong>. (c = 10% → átlag 10 hónap.)" },
      { kind: "ask", step: 2, html: "És ha a fizetéseket <strong>diszkontáljuk is</strong>? Próbáljátok levezetni a táblán!" },
    ],
  },
  {
    type: "content",
    eyebrow: "A zárt alak",
    title: "V = P · (1 + r) / (r + c)",
    blocks: [
      { kind: "text", html: "A <em>t</em>. hónap elején P · ((1−c)/(1+r))<sup>t</sup> a várható befizetés (akkor fizet, ha addig életben maradt). A végtelen mértani sor összege:" },
      { kind: "text", step: 1, html: "<strong>V = P / (1 − (1−c)/(1+r)) = P · (1+r) / (r+c)</strong>" },
      { kind: "ask", step: 2, label: "Három ismeretlen", html: "<strong>P, c, r</strong> — honnan szerezzük? Melyik jön az <em>adatból</em>, és melyik <em>feltevés</em>?" },
      { kind: "tension", step: 3, label: "Válasz", html: "P: az adatból (átlagár). c: az adatból — de <strong>melyik</strong> c? r: <strong>feltevés</strong> (a befektetők elvárt hozama), nem az adatból jön." },
    ],
  },
  {
    type: "content",
    eyebrow: "Adat → információ",
    title: "A churn nem állandó",
    blocks: [
      { kind: "ask", html: "Az új előfizetők ugyanolyan eséllyel lépnek le az 1. hónapban, mint a 20. hónapban?" },
      { kind: "text", step: 1, html: "Nem: eleinte sokan lelépnek, aki viszont megmarad, az stabilabb mag. Ezt a <strong>hazárdfüggvény</strong> (havi lelépési arány tenure szerint) és a belőle számolt <strong>túlélési görbe</strong> írja le." },
      { kind: "ask", step: 2, label: "Jóslat", html: "Ha a valódi görbével számolunk, a CLTV <strong>nagyobb vagy kisebb</strong> lesz a zárt alaknál? Szavazás — mielőtt futtatjuk." },
    ],
  },
  {
    type: "content",
    eyebrow: "Élő demó",
    title: "Számoljuk ki élőben",
    blocks: [
      { kind: "text", html: "Empirikus hazárd → túlélési görbe → CLTV <strong>kétféleképpen</strong>: zárt alakkal és a tényleges görbe szerinti összegzéssel." },
      { kind: "tension", label: "Figyelem", html: "A mai adat <strong>szintetikus (placeholder)</strong>, nem valós checkers.com-minta. A <em>módszer</em> a tanulság, a konkrét számok nem." },
      { kind: "ask", step: 1, html: "Mennyire tér el a két szám? <strong>Honnan jön az eltérés?</strong>" },
    ],
  },
  {
    type: "content",
    eyebrow: "Az eltérés három forrása",
    title: "Melyik számot hisszük el?",
    blocks: [
      { kind: "ask", html: "A két szám eltér. <strong>Három gyanúsított van</strong> — mi lehet a három?" },
      { kind: "list", step: 1, items: [
        "<strong>Időzítés (off-by-one):</strong> a zárt alak a hónap <em>elején</em> fizettet, a numerikus összeg a hónap <em>végéig</em> élőkkel súlyoz. Egységteszt: állandó hazárdnál egyezniük kell.",
        "<strong>Az átlag módja:</strong> az első 12 hazárd átlaga nem az az állandó churn, ami a tényleges görbét adná.",
        "<strong>Horizont és farok:</strong> a görbe ott ér véget, ahol az adat; a még aktívak tovább fizetnek.",
      ] },
      { kind: "ask", step: 2, html: "A horizont szélén <strong>hány emberen</strong> alapul a hazárd, és a CLTV mekkora része esik <em>túl</em> rajta?" },
      { kind: "tension", step: 3, label: "A tanulság", html: "Egy szám elhitele előtt <strong>teszteld egy olyan esetre, ahol tudod a választ</strong>. A CLTV egy része <strong>feltevés a farokról</strong> — a döntés ettől függ." },
    ],
  },
  {
    type: "content",
    eyebrow: "Mit hagytunk ki?",
    title: "Visszatérő előfizetők",
    blocks: [
      { kind: "ask", html: "A modellünkben aki egyszer lelép, az örökre elveszett. <strong>Igaz ez?</strong>" },
      { kind: "text", step: 1, html: "Ha π eséllyel visszatér: egy „epizód” átlagosan <strong>g = 1/c + 1/π</strong> hónap, és minden visszatérés újra V értéket hoz (diszkontálva): <strong>V / (1 − δ<sup>g</sup>)</strong>, ahol δ = 1/(1+r)." },
      { kind: "tension", step: 2, label: "Feltevés, nem adat", html: "A π-t <strong>nem tudjuk az adatból</strong> (nincs benne resub-esemény). Az eredmény érzékeny rá — ezért mutatjuk <em>tartományként</em>, nem egy számként." },
    ],
  },
  {
    type: "content",
    eyebrow: "Információ → insight",
    title: "Mi mozgatja az értéket?",
    blocks: [
      { kind: "ask", html: "Melyik többet ér: <strong>1 százalékponttal kisebb churn</strong>, vagy <strong>10%-kal drágább előfizetés</strong>? Tippeljetek, aztán számoljuk ki." },
      { kind: "text", step: 1, html: "Minél alacsonyabb már a churn, annál nagyobb az <strong>abszolút</strong> hatása egy további csökkentésnek (a V a c-nek konvex függvénye)." },
    ],
  },
  {
    type: "content",
    eyebrow: "Insight → döntés",
    title: "Megéri-e megszerezni egy előfizetőt?",
    blocks: [
      { kind: "ask", label: "Becsüljétek", html: "Mennyibe kerülhet egy új előfizető megszerzése (CAC)? Írjátok fel a számot — <strong>ez feltevés</strong>." },
      { kind: "text", step: 1, html: "Döntési szabály: <strong>LTV / CAC</strong>. Számoljuk ki a <strong>horizonton levágott</strong> numerikus értékre (alsó korlát), a zárt alakra és a farokkal bővítettre — <em>ugyanaz a döntés mindegyiknél?</em>" },
      { kind: "tension", step: 2, label: "Döntési kártya (csapatonként)", html: "<strong>Mit teszünk?</strong> · <strong>Mi a mérőszám?</strong> · <strong>Mi változtatná meg a döntést (kill-kritérium)?</strong>" },
    ],
  },
  {
    type: "content",
    eyebrow: "Visszakötés a vizualizációhoz",
    title: "Ti jöttök: egy önmagában érthető ábra",
    blocks: [
      { kind: "ask", label: "Feladat (csapatonként)", html: "Rajzoljatok <strong>egyetlen ábrát</strong> (az ügynökötökkel), amiből a CLTV-történet megérthető — <em>cím = az insight</em>, tengelycímek, egység, forrás, annotáció." },
      { kind: "text", step: 1, html: "Galéria: egymás ábráit nézzük meg 5 másodpercig. <strong>Érthető-e magyarázat nélkül?</strong>" },
    ],
  },
  {
    type: "content",
    eyebrow: "Összefoglalás",
    title: "Honnan hova jutottunk?",
    blocks: [
      { kind: "list", items: [
        "<strong>Adat</strong> → fizetési sorok",
        "<strong>Információ</strong> → hazárd + túlélési görbe",
        "<strong>Insight</strong> → egy előfizető ennyit ér, és a <em>farokra vonatkozó feltevés</em> mozgatja",
        "<strong>Döntés</strong> → LTV/CAC alapján megéri-e, és mi változtatná meg",
      ] },
      { kind: "ask", step: 1, html: "Melyik lépcsőn akadtatok el a legtöbbet? Hol nem volt elég az <em>adat</em>?" },
      { kind: "text", step: 2, html: "Egy előfizető értéke még nem a cég értéke: ahhoz kell a <strong>meglévő előfizetők száma</strong> és a <strong>jövőbeli beáramlás</strong> — erről a Markov-modellnél és a kohorszelemzésnél lesz szó." },
    ],
  },
];
