// A 90 percre vágott slide-ok (nem töltődnek be: a slides.html csak a slides-data.js-t olvassa).
// Visszarakás: másold a kívánt slide-ot a slides-data.js window.SLIDES tömbjébe a megfelelő helyre (az S, qa, LIST, T segédek ott vannak definiálva).
// Az ábrák (assets/) továbbra is generálódnak (build_assets.py), a számok a results.json-ban vannak.
// Sorrend a vágás előtti 69 slide-os pakkban szerinti. A számok a lag2-es (a lag1 nélküli) pipeline-ból valók: a `python3 -I`-es xcheck a slides-data.js-t ellenőrzi, ezt a fájlt NEM,
// ezért visszarakás után futtasd újra a számellenőrzést.
const CUT_SLIDES = [
// ---- A hiba minimalizálása
  S({ eyebrow: "Recap · tanulás", title: "A hiba minimalizálása", gif: "gradient_descent_lr.gif", caption: "a 2. órán látott animáció: gradient descent",
      blocks: ["A modell azt a paramétert keresi, ahol a <strong>hiba</strong> a legkisebb. Regressziónál ez tipikusan a négyzetes eltérés átlaga."] }),
// ---- Hőmérséklet szerint
  S({ eyebrow: "EDA", title: "Hőmérséklet szerint", img: "eda_homerseklet.png", caption: "szürke pontok: 2 500 véletlen óra; narancs: 4 °C-os sávok átlaga; kék: egyenes illesztés",
      blocks: ["A kapcsolat közel <strong>lineáris</strong>, de a szórás nagy: azonos hőmérsékleten is nagyon különböző a kereslet."] }),
// ---- A célváltozó eloszlása
  S({ eyebrow: "EDA", title: "A célváltozó eloszlása", img: "eda_eloszlas.png", caption: "óránkénti kölcsönzés a fejlesztési szakaszon; jobbra: az óra × munkanap csoportok átlaga és szórása",
      blocks: ["Jobbra elnyúló darabszám, és a <strong>szórás az átlaggal együtt nő</strong>. Ez a kiértékelésnél és a diagnosztikában is vissza fog jönni."] }),
// ---- Miért nehezebb regressziónál?
  S({ eyebrow: "Kiértékelés", title: "Miért nehezebb regressziónál?",
      blocks: [LIST("Nincs „jó” és „rossz” válasz: a hiba <strong>nagysága</strong> számít, és a mutatók mást mérnek",
                    "A hiba <strong>skálája</strong> az adaté: 30 kölcsönzés tévedés éjjel sok, csúcsban semmi",
                    "A hibák <strong>szerkezete</strong> is információ: hol, mikor és mekkora szinten téved a modell",
                    "Időben rendezett adatnál a <strong>vágás</strong> is eldönti, mit mérünk")] }),
// ---- Az óra-görbe az óralapon
  S({ eyebrow: "Idő mint változó", title: "Az óra-görbe az óralapon", img: "time_polaris.png", caption: "átlagos kölcsönzés óránként, a fejlesztési szakaszon; a középponttól mért távolság a kereslet",
      blocks: ["Munkanapon két csúcs, hétvégén egy: a görbe zárt, a 23. és a 0. óra érintkezik, mint az óralapon."] }),
// ---- És a fának?
  S({ eyebrow: "Idő mint változó", title: "És a fának?", img: "time_xgb.png", caption: "XGBoost, 3 időrendi fold; kék: az óra számként, narancs: sin/cos az óra helyett; 5 seed",
      blocks: ["Az XGBoostnak is jobb a sin/cos, mind az 5 seeden: <strong>3,9 ± 1,1</strong> RMSE-vel (az ok hipotézis)."] }),
// ---- Mit tanult a fa?
  S({ eyebrow: "Modell-létra", title: "Mit tanult a fa?", img: "pdp_ora.png", caption: "az alap XGBoost átlagos jóslata óránként, ha az adott napok mind munkanapok / hétvégék",
      blocks: ["A tisztességes lineárisnak az óra × munkanap kölcsönhatást kézzel adtuk meg; a többit (pl. hőmérséklet × óra) a fa magától találja (hipotézis: nem mértük külön)."] }),
// ---- A mutatók vitatkoznak
  S({ eyebrow: "Modell-létra", title: "A mutatók vitatkoznak", img: "tbl_mutatok.png", caption: "dev foldok, ugyanazok a jóslatok; narancs: oszloponként a legjobb",
      blocks: ["Az RMSE és az R² az XGBoostot, az MAE, a WAPE és az RMSLE a <strong>Random Forestet</strong> választja. A mutató dönti el, ki a nyertes."] }),
// ---- Egy rossz hét
  S({ eyebrow: "Diagnosztika · idő", title: "Egy rossz hét", img: "het_joslat.png", caption: "2012-10-15 hete: a legnagyobb átlagos négyzetes hiba; kék: tényleges, narancs: XGBoost",
      blocks: ["A hibák <strong>egymás után ugyanabba az irányba</strong> mutatnak: a modell nem látja, mi történt az előző órákban."] }),
// ---- A klasszikus feltevések
  S({ eyebrow: "Diagnosztika · összegzés", title: "A klasszikus feltevések", img: "tbl_feltevesek.png", caption: "a lineáris regresszió feltevései és amit a mai modellen láttunk",
      blocks: ["Ugyanazok a feltevések, mint az 1. óra lineáris regressziójánál: a diagnosztika <strong>bármelyik modellre</strong> alkalmazható ellenőrzés."] }),
// ---- Az autokorreláció
  S({ eyebrow: "Visszacsatolás", title: "Az autokorreláció", img: "acf.png", caption: "az out-of-fold reziduum korrelációja a k órával korábbival",
      blocks: ["Az 1 órás autokorreláció csak <strong>0,63 → 0,45</strong>: az előző órát nem ismerjük, ezért ez nem tüntethető el; a 24 órás 0,32 → 0,12."] }),
// ---- Mibe kerül?
  S({ eyebrow: "Sodródás · új célváltozó", title: "Mibe kerül?", img: "tbl_cel_osszevetes.png", caption: "XGBoost, teljes jellemzők; normál foldok: 2012-05–10; a 2012-es oszlop 3 seed átlaga",
      blocks: ["Normál időszakban ugyanannyi (62,6 vs 63,6), sodródásnál 23%-kal kisebb a hiba (95,4 → 73,1)."] })
];
