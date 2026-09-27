window.LESSON_LABEL = "Üzleti analitika · 2/2";

window.SLIDES = [
  {
    type: "title",
    eyebrow: "Analitika és vállalatértékelés",
    title: "Hányan lesznek, és mennyit ér a cég?",
    kicker: "DAU-előrejelzés Markov-modellel, előfizetőszám-előrejelzés kohorszokkal — és vissza a cégértékeléshez",
    note: "Kárpáti András · 2. rész / 2",
  },

  // ============ RECAP ============
  {
    type: "content",
    eyebrow: "Recap",
    title: "Múltkor",
    blocks: [
      { kind: "ask", label: "Mondjátok vissza", html: "Mi az a CLTV, és miért lett belőle strukturálisan egy perpetuitás, annak ellenére, hogy egy előfizető biztosan véges ideig marad?" },
      { kind: "text", step: 1, html: "Tudjuk: mennyit ér <strong>egy</strong> előfizető. Ma: hányan lesznek — és mit kezdjünk ezzel a cégértékelésnél." },
    ],
  },

  // ============ DAU/WAU MARKOV MODELL ============
  { type: "divider", index: "08", eyebrow: "Esettanulmány 2", title: "DAU-előrejelzés Markov-modellel" },
  {
    type: "content",
    eyebrow: "A módszertan eredete",
    title: "A Duolingo növekedési modellje",
    blocks: [
      { kind: "text", html: "A Duolingo nyilvánosan publikálta a saját DAU-előrejelző módszertanát (blog.duolingo.com/growth-model-duolingo). A checkers.com ugyanezt a keretrendszert implementálta." },
      { kind: "text", step: 1, html: "Az alapötlet: a felhasználói bázist nem egy számmal (DAU) kezeljük, hanem <strong>állapotok</strong> között mozgó emberek sokaságaként — ez egy <strong>Markov-lánc</strong>." },
    ],
  },
  {
    type: "content",
    eyebrow: "Kezdjük a legegyszerűbbel",
    title: "Csak Aktív és Inaktív, plusz egy csap",
    blocks: [
      { kind: "text", html: "A legegyszerűbb lehetséges verzió: 2 állapot (<strong>Aktív</strong> / <strong>Inaktív</strong>), plusz egy állandó napi <strong>top-of-funnel regisztráció</strong> (R), ami közvetlenül Aktívba lép be." },
      { kind: "text", step: 1, html: "Minden nap: az Aktívak <em>c</em> (churn) valószínűséggel Inaktívvá válnak; az Inaktívak <em>π</em> (reaktivációs ráta) valószínűséggel visszatérnek Aktívba." },
    ],
  },
  {
    type: "content",
    eyebrow: "Flow balance",
    title: "Egyensúlyban a ki- és beáramlás egyenlő",
    blocks: [
      { kind: "text", html: "Egyensúlyban annyian churnolnak ki az Aktívból, amennyien visszatérnek az Inaktívból: <strong>c · Aktív = π · Inaktív</strong>." },
      { kind: "text", step: 1, html: "Ebből az Aktív/Teljes arány egyensúlyi értéke zárt alakban: <strong>Aktív / Teljes = π / (π + c)</strong> — függetlenül attól, honnan indultunk." },
    ],
  },
  {
    type: "content",
    eyebrow: "Ez már látszik szimulációval is",
    title: "Már ez az egyszerű modell is egyensúlyhoz vezet",
    visual: { kind: "image", src: "../assets/simple_two_state_equilibrium.png", alt: "Szimulalt Aktiv/Teljes arany konvergal az elmeleti pi/(pi+c) egyensulyi aranyhoz" },
    blocks: [
      { kind: "text", html: "Az induló aránytól függetlenül, a szimuláció a <strong>π/(π+c)</strong> elméleti egyenes felé tart." },
      { kind: "ask", step: 1, html: "Mivel a Teljes populáció minden nap R-rel nő (soha nem csökken), mit gondoltok: az Aktív FELHASZNÁLÓK SZÁMA (nem az aránya) idővel egy fix szinthez tart, vagy folyamatosan nő?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Most bonyolítsuk",
    title: "A valóság ennél gazdagabb",
    blocks: [
      { kind: "text", html: "Az 'Inaktív' a valóságban nem egyetlen állapot — van, aki csak egy hete nem aktív (könnyen visszahozható), és van, aki már 90+ napja (sokkal nehezebben). A regisztráció maga sem állandó — trendje és szezonalitása van." },
    ],
  },
  {
    type: "content",
    eyebrow: "Állapottér",
    title: "Négy 'zóna', amiben egy felhasználó lehet",
    visual: {
      kind: "image",
      src: "../assets/markov_states_diagram.png",
      alt: "Négy allapot: Inaktiv, Veszelyeztetett hosszu tav, Veszelyeztetett rovid tav, Aktiv ma -- nyilakkal az atmeneti valoszinusegek",
    },
    blocks: [
      { kind: "text", html: "Minden nyílhoz egy <strong>átmeneti valószínűség</strong> tartozik ('XURR'-ráta): pl. <code>curr</code> = current user retention. Mindegyik (0, 1) között — soha nem 100% fölött." },
      { kind: "text", step: 1, html: "A nyilak iránya fontos: a <strong>lemorzsolódás</strong> zónáról zónára halad, DE a <strong>visszatérés</strong> MINDIG közvetlenül Aktívba ugrik — sosem a szomszédos zónába." },
    ],
  },
  {
    type: "content",
    eyebrow: "A teljes modell",
    title: "'Aktív ma' maga is négy alcsoport",
    visualLayout: "full",
    visual: {
      kind: "image",
      src: "../assets/markov_full_state_diagram.png",
      alt: "A teljes 7-allapotu modell: Inaktiv, Veszelyeztetett hosszu tav, Veszelyeztetett rovid tav, es az Aktiv ma 4 alcsoportja (Uj, Jelenlegi, Reaktivalt, Feltamasztott) sajat dobozokkal es nyilakkal",
    },
  },
  {
    type: "content",
    eyebrow: "Fontos",
    title: "Miért külön kezelni őket?",
    blocks: [
      { kind: "ask", html: "Miért éri meg külön kezelni a 'reaktivált' és 'feltámasztott' felhasználót a sima 'jelenlegitől'? Mi különbözhet a viselkedésükben?" },
    ],
  },
  {
    type: "content",
    eyebrow: "Egy pillantás a valóságra",
    title: "A DAU nagy része sosem 'új'",
    visual: { kind: "image", src: "../assets/dau_decomposition.png", alt: "A DAU %-os osszetetele: jelenlegi, uj, reaktivalt, feltamasztott felhasznalok aranya idoben" },
    blocks: [
      { kind: "text", html: "Egy érett terméknél a napi aktív felhasználók <strong>túlnyomó többsége</strong> visszatérő ('jelenlegi') felhasználó — az új/reaktivált/feltámasztott csak egy vékony, de stratégiailag fontos sáv." },
    ],
  },

  // ============ EMPIRIKUS RÁTÁK — NOTEBOOK ============
  { type: "divider", index: "09", eyebrow: "Ne fogadjátok el készpénznek", title: "Honnan jönnek a ráták?" },
  {
    type: "content",
    eyebrow: "demo_dau_markov.ipynb — 1. rész",
    title: "Becsüljük meg a rátákat magunk",
    blocks: [
      { kind: "text", html: "A notebookban egy rövid ablakos (néhány hónapos), névtelenített és zajosított minta van valós checkers.com-felhasználók napi állapotáról: <code>data/user_daily_states_sample.csv</code>." },
      { kind: "list", step: 1, items: [
        "Csoportosítás állapot → következő állapot szerint (crosstab)",
        "Minden ráta = egy egyszerű arány: hányan léptek át egy adott állapotból egy másikba, osztva az adott állapotban lévők számával",
        "Ellenőrzés: minden ráta 0 és 1 között van-e",
      ]},
    ],
  },
  {
    type: "content",
    eyebrow: "Próbáljátok ki",
    title: "Ti jöttök",
    blocks: [
      { kind: "ask", label: "Feladat a notebookban", html: "Számoljátok ki a saját mintátokból a curr és a nurr rátát — melyik magasabb, és ez meglep-e titeket?" },
    ],
  },

  // ============ EGYENSÚLY ELMÉLETE ============
  { type: "divider", index: "10", eyebrow: "Elmélet", title: "Miért lesz ebből egyensúly?" },
  {
    type: "content",
    eyebrow: "A Markov-láncok alaptétele",
    title: "Egy zárt lánc mindig stabil eloszláshoz konvergál",
    blocks: [
      { kind: "text", html: "Ha egy Markov-lánc <strong>véges</strong>, <strong>irreducibilis</strong> (minden állapotból elérhető minden állapot) és <strong>aperiodikus</strong>, akkor — a kezdőállapottól függetlenül — az állapotok közti eloszlás konvergál egy <strong>egyetlen, stabil (stacionárius) eloszláshoz</strong>." },
      { kind: "plaque", step: 1, year: "1906", html: "Andrej Markov bemutatja a nevét viselő láncokat — eredetileg Puskin <em>Jevgenyij Anyegin</em> című versének szövegén, a magánhangzó–mássalhangzó szekvenciák mintázatát elemezve." },
    ],
  },
  {
    type: "content",
    eyebrow: "De van egy csavar",
    title: "Nálunk folyamatosan érkeznek új szereplők",
    blocks: [
      { kind: "text", html: "A mi láncunk nem zárt — minden nap új regisztrációk lépnek be. Ez olyan, mint egy <strong>növekvő populáció</strong>, nem egy fix embercsoport, aki egymás között mozog." },
      { kind: "text", step: 1, html: "Ilyenkor az egyensúly nem egy <em>fix szint</em>, hanem egy <strong>egyensúlyi növekedési ráta</strong> — hasonlóan a demográfia 'stabil populáció'-elméletéhez: az életkor szerinti eloszlás stabilizálódik, miközben a populáció mérete tovább nő." },
      { kind: "ask", step: 2, html: "Mi történne, ha az új regisztrációk üteme állandó maradna, de a teljes elérhető piac véges?" },
    ],
  },

  // ============ SZEZONALITÁS + FORGATÓKÖNYVEK ============
  { type: "divider", index: "11", eyebrow: "Gyakorlat", title: "Szezonalitás és forgatókönyv-tervezés" },
  {
    type: "content",
    eyebrow: "A probléma",
    title: "A nyers napi adat tele van zajjal, ami nem 'zaj'",
    blocks: [
      { kind: "text", html: "Hétvégén másképp viselkednek a felhasználók, mint hétköznap. Szeptemberben másképp, mint júliusban. Ha ezt figyelmen kívül hagyjuk, az előrejelzésünk vagy túl zajos, vagy tévesen extrapolálja a mintázatot." },
    ],
  },
  {
    type: "content",
    eyebrow: "A módszer (a valós checkers.com pipeline-ból)",
    title: "Dekompozíció, majd visszahelyezés",
    visual: { kind: "image", src: "../assets/seasonality_before_after.png", alt: "Nyers vs deszezonalizalt trend uj felhasznalokra es a curr ratara" },
    blocks: [
      { kind: "list", items: [
        "1. Nap-a-hetén faktor: minden nap eltérése a saját heti átlagától → medián naptípusonként",
        "2. Havi faktor: ugyanez a már 'kihetezett' soron, naptári hónaponként",
        "3. A <strong>trendet</strong> a deszezonalizált soron jelezzük előre",
        "4. Az előrejelzett trendre <strong>visszahelyezzük</strong> a heti+havi faktorokat",
      ]},
    ],
  },
  {
    type: "content",
    eyebrow: "Forgatókönyv-tervezés",
    title: "Nem egy szám — egy sáv",
    visual: { kind: "image", src: "../assets/scenario_comparison.png", alt: "Alapeset kontra novekedes-leall, vegtelen novekedes es megtartas-javulas forgatokonyvek" },
    blocks: [
      { kind: "text", html: "Két forgatókönyv-típus: <strong>növekedési ráta</strong> módosítás (pl. az új felhasználók éves növekedési üteme −10% / +10%) és <strong>egyszeri elmozdulás</strong> (pl. egy adott rátánál egyetlen naptól kezdve állandó eltolás)." },
    ],
  },
  {
    type: "content",
    eyebrow: "Forgatókönyv-tervezés",
    title: "A meglepő eredmény",
    blocks: [
      { kind: "tension", label: "A megtartás felülír egy nagy akvizíciós löketet", html: "Egy szerény, mindössze <strong>+1,5 százalékpontos</strong> napi megtartás-javulás 4 év alatt megelőzi a +40%-os akvizíciós-növekedési forgatókönyvet. A megtartás apró, tartós javulása jobban összeadódik, mint egy nagy, egyszeri akvizíciós löket." },
      { kind: "ask", step: 1, html: "Miért van ez így? (Gondoljatok arra, hogy a megtartás minden NAP, minden MEGLÉVŐ felhasználóra hat — az akvizíció csak az aznapi új beáramlásra.)" },
    ],
  },

  // ============ EGYENSÚLY ÉS TAM ============
  {
    type: "content",
    eyebrow: "Vissza az egyensúlyhoz",
    title: "Végtelen piac vs. véges piac",
    visualLayout: "stack",
    visual: { kind: "image", src: "../assets/equilibrium_tam.png", alt: "Vegtelen piac kontra veges piacmeret -- egyensulyi novekedesi rata kontra egyensulyi szint" },
    blocks: [
      { kind: "text", html: "Ha nincs piaci korlát (TAMP=1, 'végtelen piac'), az egyensúly egy <strong>konstans növekedési ráta</strong> — a DAU görbe sosem lapul ki. Ha bevezetünk egy véges piacméret-becslést, az egyensúly egy <strong>fix szint</strong> lesz." },
    ],
  },
  {
    type: "content",
    eyebrow: "Vissza az egyensúlyhoz",
    title: "Ez egy feltevés, nem tény",
    blocks: [
      { kind: "tension", label: "Egy jó ökölszabály", html: "Ha úgy gondoljuk, az elérhető piac mérete <strong>legalább 10-szerese</strong> a jelenlegi méretünknek, ésszerű 'végtelennek' kezelni modellezési célra — a 10×-es korláton belüli telítődés hatása elhanyagolható a forecast-horizonton belül. Egy befektetői pitchben viszont ezt a feltevést meg kell tudnotok védeni." },
    ],
  },

  // ============ ELŐFIZETŐSZÁM-ELŐREJELZÉS ============
  { type: "divider", index: "12", eyebrow: "Esettanulmány 3", title: "Előfizetőszám-előrejelzés" },
  {
    type: "content",
    eyebrow: "Összerakjuk az eddigieket",
    title: "A DAU-ból lesznek az előfizetők",
    blocks: [
      { kind: "text", html: "A DAU-előrejelzésünk tartalmaz egy <strong>új regisztrációk</strong> előrejelzést is. Minden hónapban ezen új regisztráltak egy része <strong>előfizetővé konvertál</strong> — így minden hónap egy új 'előfizetői kohorszot' hoz létre." },
      { kind: "ask", step: 1, html: "Ha minden hónap egy új kohorszot indít, és minden kohorsz a saját tempójában morzsolódik le — hogyan kapjuk meg a TELJES előfizetőszámot egy adott jövőbeli hónapban?" },
    ],
  },
  {
    type: "content",
    eyebrow: "A válasz",
    title: "Minden előfizető pontosan egy kohorszhoz tartozik",
    blocks: [
      { kind: "text", html: "Egy adott hónapban a teljes előfizetőszám = <strong>az összes korábbi (még nem teljesen lemorzsolódott) kohorsz összege</strong>, mindegyik a saját tenure-jének (hónapok az előfizetés kezdete óta) megfelelő túlélési valószínűséggel." },
      { kind: "text", step: 1, html: "Emellett a meglévő előfizetők nem csak churnolhatnak — <strong>upgrade</strong>-elhetnek (Alap→Prémium), <strong>downgrade</strong>-elhetnek, vagy megmaradhatnak. Mindezt egy tenure-függő átmeneti mátrix írja le." },
    ],
  },
  {
    type: "content",
    eyebrow: "A churn nem egyenletes",
    title: "Gyors churn az elején, majd lassulás",
    visual: { kind: "image", src: "../assets/tenure_churn_curve_PLACEHOLDER.png", alt: "Kohorsz-tulelesi gorbe: egy veletlen kohorsz kontra az atlag" },
    blocks: [
      { kind: "text", html: "Ez a klasszikus 'duration dependence' mintázat: aki túléli az első pár hónapot, egyre <strong>stabilabb</strong> előfizetővé válik — a churn-hazárd hónapról hónapra csökken." },
      { kind: "ask", step: 1, html: "Milyen üzleti okok állhatnak amögött, hogy a korai hónapokban ilyen magas a lemorzsolódás?" },
    ],
  },
  {
    type: "content",
    eyebrow: "A piacméret újra előkerül",
    title: "Mekkora a checkers.com elérhető piaca?",
    blocks: [
      { kind: "text", html: "Az előfizetőszám-előrejelzés bemenete a DAU/regisztráció-előrejelzés — ami maga is függ a piacméret-feltevéstől (TAM/TAMP). Ez az egyik <strong>legerősebb</strong>, mégis leginkább vitatható feltevés az egész modellben." },
      { kind: "tension", step: 1, label: "Vitatott pont", html: "'Végtelen piac' feltevés mellett az előfizetőszám sosem lapul ki — ez optimista, de a való életben minden piac egyszer telítődik. A kérdés nem az, hogy van-e korlát, hanem hogy <em>mikorra</em> érdemes beépíteni a modellbe." },
    ],
  },

  // ============ KÉT ÚT A CÉGÉRTÉKELÉSHEZ ============
  { type: "divider", index: "13", eyebrow: "Visszatérünk a nyitó kérdéshez", title: "Mennyit ér a checkers.com?" },
  {
    type: "content",
    eyebrow: "Két lehetséges út",
    title: "1. út: explicit cash flow a kohorszokból",
    blocks: [
      { kind: "text", html: "Minden jövőbeli hónapra: (élő előfizetők száma tier szerint) × (ár tier szerint) − (költségek), diszkontálva a WACC-kal. Ez egy teljes, hónapról hónapra épített cash flow-előrejelzés." },
    ],
  },
  {
    type: "content",
    eyebrow: "Két lehetséges út",
    title: "2. út: az 1. részben számolt CLTV-t skálázzuk",
    blocks: [
      { kind: "text", html: "(Előrejelzett új előfizetők száma minden hónapban) × (CLTV egy előfizetőre) — összegezve, diszkontálva. Gyorsabb, kevesebb részlet, de ugyanaz a logika." },
      { kind: "ask", step: 1, html: "Milyen helyzetben választanátok az 1. utat a 2. helyett — és fordítva? (Gondoljatok arra, mi van, ha az árszintek és a churn-görbe idővel változik.)" },
    ],
  },
  {
    type: "content",
    eyebrow: "Zárás",
    title: "A teljes lánc",
    blocks: [
      { kind: "list", items: [
        "Adat → insight → adatvezérelt döntés, és a négyszintes analitika-piramis",
        "CLTV: mennyit ér <strong>egy</strong> előfizető (annuitás → perpetuitás → churn → resubscription)",
        "DAU Markov-modell: hányan lesznek aktívak, szezonalitással és forgatókönyvekkel",
        "Kohorsz-alapú előfizetőszám-előrejelzés: hányan lesznek <strong>előfizetők</strong>",
        "→ Cégértékelés: cash flow vagy CLTV-skálázás",
      ]},
      { kind: "ask", step: 1, html: "Ha befektetők előtt kellene megvédenetek egyetlen feltevést a modellből, melyiket választanátok — és miért pont azt?" },
    ],
  },
  {
    type: "content",
    eyebrow: "A módszertan tétje",
    title: "Ezért építettünk 3 külön modellt, nem egyet",
    blocks: [
      { kind: "text", html: "Emlékeztek az 1. rész elejéről: megtehettük volna, hogy egyszerűen trendvonalat illesztünk a múltbeli cash flow-ra és extrapolálunk. Ehelyett 3 <strong>függetlenül</strong> becsült mennyiséget építettünk (CLTV, DAU, előfizetőszám), és azokat kombináltuk." },
      { kind: "tension", step: 1, label: "Ez a lényeg", html: "Mivel a 3 becslés más adatból, más módszertannal, más feltevésekkel készült, a hibáik nem korrelálnak tökéletesen — a kombinált becslés robusztusabb, mint egyetlen trendvonal, és minden darabja külön-külön megvédhető egy befektető előtt." },
    ],
  },
];
