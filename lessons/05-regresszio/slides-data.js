window.LESSON_LABEL = "5. óra · Regresszió";

// 90 perces óra: kb. 1 slide/perc. Kérdés-költségvetés: összesen 6 kérdés (qa()), mindegyik válasza a KÖVETKEZŐ kattintásra jelenik meg.
// Minden más slide állítás. A hallgatók NEM látják az adatot az órán: ami kell, az a slide-on van (táblázat-képként).
// Minden szám a results.py-ból jön (results.json; UCI Bike Sharing hourly, rögzített seedek, 3 időrendi fold 2012-05..10-en,
// a záró teszt 2012-11 és 2012-12, csak a végén). Az ábrákat a build_assets.py generálja ugyanabból a bike.py-ból.
// A 2. órás gif-eket újrahasznosítjuk: a hallgatók már látták őket.
const L2 = "../02-gepi-tanulas/assets/";

// Állítás-slide. img: stack elrendezés (kép a szöveg alatt): cím ~20 karakter, a szöveg <= ~110 karakter, különben ráfut a képre.
function S(o) {
  return {
    type: "content", eyebrow: o.eyebrow, title: o.title,
    ...(o.img ? { visualLayout: "stack", visual: { kind: "image", src: "assets/" + o.img, alt: o.alt || o.title, caption: o.caption || "" } } : {}),
    ...(o.gif ? { visual: { kind: "image", src: L2 + o.gif, alt: o.alt || o.title, caption: o.caption || "" } } : {}),
    blocks: (o.blocks || []).map((b) => (typeof b === "string" ? { kind: "text", html: b } : b)),
  };
}
// A 6 kérdés egyike: a kérdés step 0, a válaszok step 1, 2, ...
function qa(o) {
  const answers = (Array.isArray(o.answer) ? o.answer : [o.answer]).map((x, i) =>
    typeof x === "string" ? { kind: "text", step: i + 1, html: x } : { ...x, step: i + 1 });
  return {
    type: "content", eyebrow: o.eyebrow, title: o.title,
    ...(o.img ? { visualLayout: "stack", visual: { kind: "image", src: "assets/" + o.img, alt: o.alt || o.title, caption: o.caption || "" } } : {}),
    blocks: [{ kind: "ask", html: o.ask }, ...answers],
  };
}
const T = (label, html) => ({ kind: "tension", label, html });
const LIST = (...items) => ({ kind: "list", items });

window.SLIDES = [
  { type: "title", eyebrow: "Data Science műhelykurzus", title: "Regresszió", kicker: "Ha a modell számot jósol: hogyan mérjük, hol téved, és mikor hihetünk neki?", note: "Kárpáti András · 5. óra" },

  // ---------------- Recap (a 2. óra gif-jei) ----------------
  S({ eyebrow: "Recap · regresszió és bias-variance", title: "Görbe az adatpontokra", gif: "polynomial_overfit.gif", caption: "a 2. órán látott animáció: növekvő fokszám",
      blocks: ["A regresszió <strong>számot</strong> jósol. A rugalmasság (fokszám) nő, és a modell egyre inkább a <strong>zajt</strong> is megtanulja."] }),
  S({ eyebrow: "Recap · fa és erdő", title: "Lépcsős függvény", gif: "tree_depth.gif", caption: "a 2. órán látott animáció (osztályozás); regressziónál ugyanez, csak a levélben egy szám áll",
      blocks: ["Regressziónál a fa levele a csoport <strong>átlaga</strong>: a jóslat lépcsős függvény. A Random Forest sok ilyen fa átlaga."] }),
  S({ eyebrow: "Recap · Gradient Boosting", title: "A maradékokat javítja", gif: "gradient_boosting_rounds.gif", caption: "a 2. órán látott animáció (osztályozás): körről körre élesedik",
      blocks: ["Regressziónál a boosting szó szerint a <strong>reziduumra</strong> illeszt új fát. Ma a reziduumot a diagnosztikában is használjuk."] }),

  // ---------------- Feladat, adat, EDA ----------------
  S({ eyebrow: "A feladat", title: "Kerékpármegosztás: kereslet",
      blocks: ["Egy bérbiciklis rendszer (Capital Bikeshare, Washington D.C.) előre tudni akarja, hány kerékpárt kölcsönöznek <strong>egy adott órában</strong> (a rendszer egészében, nem állomásonként).",
               "<strong>Mikor jósolunk:</strong> a jóslatot a jósolt óra <strong>előtti óra elején</strong> adjuk ki. Ekkor a jósolt óra előtti óra még tart: az utolsó ismert óra <strong>2 órával korábbi</strong> (<code>lag2</code>), a <code>lag1</code> nem használható.",
               "<strong>Feltevés:</strong> az időjárást előrejelzésnek tekintjük (az adatban a megfigyelt érték áll helyette: ez optimista), a naptár ismert. A kimenet egy <strong>szám</strong> (kölcsönzés/óra)."] }),
  S({ eyebrow: "Az adat", title: "UCI: Bike Sharing",
      blocks: [LIST("<strong>17 379</strong> óra, 2011-01-01 és 2012-12-31 között (UCI Machine Learning Repository, Fanaee-T és Gama)",
                    "Az utolsó <strong>2 hónapot (2012-11 és 12, 1 460 óra) zároljuk</strong> záró tesztnek; minden más (15 919 óra) a fejlesztés",
                    "Oszlopok: dátum, óra, munkanap, ünnep, időjárás-kategória, hőmérséklet és hőérzet, páratartalom, szélsebesség",
                    "Cél: <code>cnt</code>, a kölcsönzések száma az órában (1–977, átlag 189)")] }),
  S({ eyebrow: "Az adat", title: "Ilyen a nyers adat", img: "tbl_nyers.png", caption: "az adatsor első napjának hat sora; a cél a cnt, a narancs oszlopokat eldobjuk",
      blocks: ["A <code>casual</code> és a <code>registered</code> összege <strong>pontosan a cél</strong> (minden sorban): szivárgás, eldobjuk."] }),
  S({ eyebrow: "EDA", title: "Óra szerint", img: "eda_ora.png", caption: "átlagos kölcsönzés óránként, a fejlesztési szakaszon (2011-01 – 2012-10)",
      blocks: ["Munkanapon <strong>két csúcs</strong> (8 és 17–18 óra, ingázás), hétvégén egy <strong>délutáni púp</strong>: az óra hatása a nap típusától függ."] }),
  S({ eyebrow: "EDA", title: "Idő szerint", img: "eda_trend.png", caption: "heti átlag; szaggatott: az adott év január–október átlaga (azonos hónapok)",
      blocks: ["Egy év alatt <strong>+66%</strong> (146,6 → 243,8). A rendszer nő: a jövő nem olyan, mint a múlt. A mélypont: 2012 októbere, lásd lent."] }),
  S({ eyebrow: "Tisztítás", title: "165 hiányzó óra",
      blocks: ["A 17 544 órából <strong>165</strong> hiányzik, és nem véletlenszerűen: 2012-10-29-én 1, 30-án 11 óra van rögzítve (az adatsor leírása szerint ekkor volt a Sandy-hurrikán).",
               T("Következmény", "A „korábbi óra” nem a <strong>sor</strong> szerinti szomszéd, hanem az <strong>időbélyeg</strong> szerinti. Ha az óra hiányzik, a jellemző is hiányzik (NaN): a fa ezt kezeli, a lineáris modellnek kitöltés kell.")] }),

  // ---------------- Kiértékelés ----------------
  S({ eyebrow: "Kiértékelés", title: "Időrendi vágás", img: "split_idorendi.png", caption: "kiterjedő ablak: kék a tanítás, narancs a teszt-blokk (2 hónap); a sraffozott a záró teszt",
      blocks: ["A modell csak a <strong>múltból</strong> tanul: a teszt-blokk előtti összes hónapból. A záró teszt egyszer, a végén jön."] }),
  qa({ eyebrow: "Kiértékelés", title: "Véletlen vagy időrendi?",
      ask: "Ugyanazt a modellt két vágással mérjük. Melyik ad kisebb hibát, és melyik igaz?",
      answer: ["Véletlen vágásnál <strong>47,3</strong>, időrendinél <strong>66,0</strong>: a szomszéd órák a tanítóban elárulják a tesztet. Az igaz szám a 66,0."] }),
  S({ eyebrow: "Kiértékelés", title: "A véletlen vágás ára", img: "random_vs_time.png", caption: "XGBoost; ugyanazok a teszt-órák (2012-05–10), csak a tanító halmaz más",
      blocks: ["A hiba <strong>28%-kal kisebb</strong>, de ez látszat: a tanítóban ott van a szomszéd óra. Élesben nincs."] }),
  S({ eyebrow: "Kiértékelés", title: "Amit meg kell verni", img: "tbl_alap.png", caption: "3 időrendi fold, együtt; R²: a teszt-órák szórásához mérve",
      blocks: ["Az <strong>átlag</strong> R²-je negatív. A „<strong>múlt heti azonos óra</strong>” egy sor kód, és már R² 0,80: minden modellnek ezt kell megvernie."] }),
  S({ eyebrow: "Mutatók", title: "RMSE és MAE",
      blocks: [LIST("<strong>MAE</strong>: az átlagos abszolút hiba, az adat mértékegységében (kölcsönzés/óra); a kiugrókra kevésbé érzékeny",
                    "<strong>RMSE</strong>: a négyzetes hiba gyöke; a nagy tévedéseket <strong>négyzetesen bünteti</strong>, ezért a csúcsórák uralják",
                    "Ha az RMSE sokkal nagyobb, mint az MAE, a hibák eloszlása elnyúló: néhány nagy tévedés van")] }),
  S({ eyebrow: "Mutatók", title: "Arányos mutatók",
      blocks: [LIST("<strong>WAPE</strong> = az abszolút hibák összege / a tényleges értékek összege: „a forgalom hány százalékát tévesztjük”. Különböző szinteken is összehasonlítható",
                    "<strong>RMSLE</strong>: a log-skálán mért hiba; az <strong>arányokat</strong> nézi, ezért az éjszakai órák is számítanak",
                    "<strong>MAPE</strong> (százalékos hiba): a 0-hoz közeli tényleges értéknél felrobban (éjjel 1–3 kölcsönzés), itt nem használjuk")] }),
  S({ eyebrow: "Mutatók", title: "Az R² csapdái",
      blocks: [LIST("R² = 1 − (a modell hibája / az átlagjóslat hibája): az <strong>alapmodelltől</strong> függ, nem a hasznosságtól",
                    "Új adaton <strong>negatív</strong> is lehet: az átlag R²-je −0,25",
                    "A 2 órával korábbi érték jóslatnak: R² = 0,04, a lineáris, óra-szám modellé 0,28: egy R² önmagában nem mond semmit, ha nem tudjuk, mi a baseline")] }),
  S({ eyebrow: "Mutatók", title: "Melyik mutató kinek?", img: "tbl_szegmens_alap.png", caption: "alap XGBoost, dev foldok",
      blocks: ["Az RMSE a csúcsot nézi (107), az arányos hiba az éjszakát (60%). Hogy melyik számít, <strong>üzleti döntés</strong>."] }),

  // ---------------- Modell-létra ----------------
  S({ eyebrow: "Modell-létra", title: "Az óra számként", img: "lr_ora_szam.png", caption: "átlagos jóslat óránként (out-of-fold) a tényleges átlaggal",
      blocks: ["A lineáris modell az órát egyetlen számnak veszi: egy lejtőt illeszt a kétpúpú napi görbére. RMSE <strong>193,2</strong>."] }),
  qa({ eyebrow: "Modell-létra", title: "Tisztességes lineáris",
      ask: "A lineáris modell RMSE-je 193. Mit tennél, hogy tisztességes baseline legyen?",
      answer: ["Az órát <strong>kategóriaként</strong> kezeljük (óra × munkanap dummyk): 193 → <strong>110,9</strong>.",
               "Ez is rosszabb a „múlt heti azonos óránál” (101,5): a lineáris modell tisztességes változata is csak a létra alja."] }),

  // ---------------- Idő mint változó: kategória vs. kör (sin/cos) ----------------
  S({ eyebrow: "Idő mint változó", title: "Óra: ki a szomszéd?", img: "time_tavolsag.png", caption: "két óra távolsága a kódolt térben (színek: panelenként a saját skálán); narancs keret: a 0. és a 23. óra",
      blocks: ["Számként a 0. és a 23. óra a legtávolabbi pár; one-hot-nál minden pár egyformán távoli; a körön a 23. a 0. szomszédja."] }),
  S({ eyebrow: "Idő mint változó", title: "Az óra körre csavarva", img: "ora_kor.gif", caption: "a számegyenes körré hajlik; a pont két koordinátája lesz az új jellemző (méret és szín: a munkanapi kereslet)",
      blocks: ["Két jellemző az óra helyett: <code>sin(2π · óra / 24)</code> és <code>cos(2π · óra / 24)</code>."] }),
  S({ eyebrow: "Idő mint változó", title: "Hány harmonikus kell?", img: "time_illesztes.png", caption: "munkanap; a lineáris modell illesztése a teljes fejlesztési adatra (illusztráció, nem out-of-fold); szürke: tényleges átlag",
      blocks: ["Egy sinusból egy púp lesz; két csúcshoz több harmonikus kell. Hatnál már közel van a dummykhoz."] }),
  S({ eyebrow: "Idő mint változó", title: "Hiba és paraméterek", img: "time_rmse_param.png", caption: "lineáris modell, az órán kívüli jellemzők mindenhol ugyanazok; 3 időrendi fold",
      blocks: ["k = 6 harmonikus (24 paraméter): <strong>114,2</strong>; a dummyk (48): <strong>110,9</strong>; k = 12 ugyanazt a teret fedi: 110,6."] }),
  S({ eyebrow: "Idő mint változó", title: "Mikor melyiket?",
      blocks: [LIST("<strong>Kategória (dummy):</strong> bármilyen alakot megtanul, de 24–48 paraméter, és nem tudja, hogy két óra szomszéd; ritka kategóriánál zajos",
                    "<strong>sin/cos:</strong> sima görbe kevés paraméterrel (k = 6: 24), a 23–0 átmenet természetes; de kevés harmonikus kevés (k = 1: 173,8)",
                    "A határon <strong>ugyanaz</strong>: k = 12 harmonikus ugyanazt a teret fedi, mint a 24 dummy (110,6 vs 110,9)",
                    "A fának is kicsit jobb: az óra helyett sin/cos mind az 5 seeden, <strong>3,9 ± 1,1</strong> RMSE-vel (az ok hipotézis)",
                    "Ugyanígy körként kódolható a hónap (12), az év hete (52) és a hét napja (7) is. Mértük: a hónapra 11 dummy 110,9, sin/cos k = 2 (4 paraméter) szintén 110,9; az év hetét nem (két évnyi adat alig teszteli)")] }),
  S({ eyebrow: "Modell-létra", title: "A létra", img: "ladder.png", caption: "RMSE, 3 időrendi fold átlaga; pontok: foldonként; szaggatott: a múlt heti azonos óra",
      blocks: ["Fa 91,9 → Random Forest 70,1 → XGBoost <strong>66,0</strong>: a tisztességes lineárisnál <strong>40%-kal</strong> kisebb hiba, mind a három foldon."] }),

  // ---------------- Diagnosztika ----------------
  S({ eyebrow: "Diagnosztika", title: "Hol téved a modell?",
      blocks: ["Az XGBoost RMSE-je 66,0. Egy szám nem mondja meg, <strong>hol</strong> téved. Négy nézet, mindig az out-of-fold jóslatokon:",
               LIST("<strong>kalibráció</strong>: a jósolt szintek átlagosan jók-e?", "<strong>reziduum a becsült érték szerint</strong>: állandó-e a szórás?",
                    "<strong>reziduum szegmensenként és időben</strong>: van-e szerkezete a hibának?", "<strong>autokorreláció</strong>: ismétlődik-e a hiba?")] }),
  S({ eyebrow: "Diagnosztika · kalibráció", title: "Kalibráció", img: "calib_decilis.png", caption: "a jóslatok decilisei: átlagos jósolt és tényleges érték",
      blocks: ["Közepes szinteken jó; a legfelső decilisben <strong>7%-kal alulbecsül</strong> (675 helyett 723): a csúcsokat simítja."] }),
  S({ eyebrow: "Diagnosztika · reziduum", title: "Reziduum és becslés", img: "reziduum_tolcser.png", caption: "3 500 véletlen óra; narancs: a reziduum szórása decilisenként",
      blocks: ["Tölcsér: a hiba szórása <strong>14-ről 94-re</strong> nő a szinttel. Az állandó szórás feltevése nem teljesül."] }),
  qa({ eyebrow: "Diagnosztika · reziduum", title: "Mi a teendő a tölcsérrel?",
      ask: "A hiba a szinttel nő. Mit tennél a célváltozóval?",
      answer: ["A logaritmusát jósoljuk: <code>log(1 + cnt)</code>. A szórás így inkább az <strong>arányt</strong> követi, nem az abszolút szintet.",
               "Eredmény: RMSE <strong>66,0 → 63,8</strong>, RMSLE <strong>0,489 → 0,275</strong>."] }),
  S({ eyebrow: "Diagnosztika · log-cél", title: "A visszaalakítás ára", img: "tbl_log.png", caption: "XGBoost, alap jellemzők, dev foldok",
      blocks: ["<code>exp</code> után a jóslat a mediánt közelíti: az összes forgalom <strong>96,1%</strong> helyett csak <strong>92,8%</strong>-át jósoljuk."] }),
  S({ eyebrow: "Diagnosztika · lehetetlen jóslat", title: "Negatív kereslet", img: "negativ_joslat.png", caption: "az alap XGBoost out-of-fold jóslatai éjjel (0–5 óra); 120 fölött nincs ábrázolva",
      blocks: ["<strong>44 negatív</strong> jóslat (az éjszakai órák 3,8%-a, legrosszabb −37): a darabszám nem lehet negatív, a nyers célú modell ezt nem tudja."] }),
  S({ eyebrow: "Diagnosztika · szegmensek", title: "Szegmensenként", img: "bias_ora_munkanap.png", caption: "átlagos reziduum (tényleges − jósolt): óra × munkanap",
      blocks: ["Munkanapon a csúcsórákban <strong>alulbecsül</strong> (+49…+64), hétvégén reggel 7-kor <strong>túlbecsül</strong> (−60): a két napfajtát összemossa."] }),
  S({ eyebrow: "Diagnosztika · idő", title: "Autokorreláció", img: "acf.png", caption: "az out-of-fold reziduum korrelációja a k órával korábbival",
      blocks: ["Az 1 órával korábbi hibával <strong>0,63</strong> a korreláció, 24 órával korábbival még <strong>0,32</strong>. Független hibánál 0 lenne."] }),

  // ---------------- Visszacsatolási kör ----------------
  S({ eyebrow: "Visszacsatolás", title: "Hipotézis: a közelmúlt", img: "tbl_lag.png", caption: "egy hiányzó óra körül: a lag2 NaN (időbélyeg szerinti késleltetés)",
      blocks: ["A hiba órák között ismétlődik: a <strong>közelmúlt forgalma</strong> hiányzik. Jellemzők: <code>lag2, lag3, lag4, lag24, lag168, roll3</code> (a lag1 nem: a jóslat kiadásakor még nem ismert)."] }),
  S({ eyebrow: "Visszacsatolás", title: "Első próba: 3 órás átlag",
      blocks: ["A gyors megoldás: a forgalom átlaga az óra körül, új jellemzőként:",
               LIST("<code>cnt.rolling(3, center=True).mean()</code>", "egy sor kód, a hipotézis (a közelmúlt számít) szerint ez a közelmúlt jele"),
               T("Várakozás", "Ha a hipotézis igaz, a hiba csökken. Nézzük, mennyivel.")] }),
  qa({ eyebrow: "Visszacsatolás", title: "Elhiszed?", img: "tbl_fe_rossz.png", caption: "XGBoost, dev foldok",
      ask: "Egy sor kód: az RMSE 66,0-ról 27,7-re esett. Elhiszed?",
      answer: ["Nem: a központosított átlag a <strong>mostani és a következő órát</strong> is tartalmazza. Szivárgás: élesben nem ismert."] }),
  S({ eyebrow: "Visszacsatolás", title: "A javítás: csak a múlt",
      blocks: ["A <code>roll3</code> a három legutóbbi <strong>ismert</strong> óra átlaga (lag2–4). Minden jellemzőre feltesszük: <strong>ismerném ezt a jóslás pillanatában?</strong> Ezért nincs lag1.",
               T("Szabály", "Ha a jellemzőt csak a jövő ismeretében tudnánk kiszámolni, szivárgás. A „túl jó” eredmény a gyanú jele, nem a siker jele.")] }),
  S({ eyebrow: "Visszacsatolás", title: "A valódi javulás", img: "fe_helyes.png", caption: "XGBoost RMSE foldonként: alap vs. késleltetett jellemzőkkel",
      blocks: ["66,0 → <strong>61,9</strong>, mindhárom foldon (−3,9; −2,0; −6,4). Napi blokk-bootstrap: javulás 4,1 [0,7; 7,5]: valódi, de kicsi és bizonytalan."] }),
  S({ eyebrow: "Visszacsatolás", title: "Melyik késleltetés kell?", img: "fe_ablation.png", caption: "XGBoost RMSE, a jellemzők külön-külön, ugyanazokon a foldokon",
      blocks: ["A <strong>lag2 egyedül</strong> (62,0) ugyanannyit tud, mint mind a hat együtt (61,9): döntetlen. Az előre rögzített szabály (legkisebb CV-RMSE) a hatot választja."] }),
  S({ eyebrow: "Visszacsatolás", title: "Újra a diagnosztika", img: "rediag_tolcser.png", caption: "a reziduum szórása decilisenként, mind a hat késleltetéssel",
      blocks: ["A tölcsér laposabb (94 → 72); éjszaka az RMSE <strong>22,2 → 15,2</strong>, de csúcsban nem javult (107,0 → 108,0); az 1 órás autokorreláció csak <strong>0,63 → 0,45</strong>: az előző órát nem ismerjük."] }),
  S({ eyebrow: "Visszacsatolás", title: "A lineárisnak is segít",
      blocks: ["Lineáris + késleltetések: <strong>75,3</strong> (110,9-ről). XGBoost + késleltetések: 61,9. A különbség a lineárishoz képest 40%-ról <strong>18%</strong>-ra olvadt.",
               T("Őszinte tanulság", "A 4. órán a feature engineering csak a fának segített. Itt <strong>mindkettőnek</strong>, a lineárisnak sokkal többet (110,9 → 75,3, szemben 66,0 → 61,9-cel): az idősoros szerkezetet bármelyik modell kihasználja, ha megkapja.")] }),

  // ---------------- Sodródás ----------------
  S({ eyebrow: "Sodródás", title: "Mi van, ha nő a rendszer?",
      blocks: ["A rendszer egy év alatt <strong>+66%</strong>-ot nőtt. A fa a tanító adat <strong>tartományán belül</strong> jósol; azon kívül nem lát tovább. A lineáris modell igen.",
               "Próba: csak 2011-en tanítunk, és 2012 első 10 hónapját jósoljuk.",
               T("Miért számít?", "Éles rendszerben a jövő mindig kicsit más, mint a tanító adat: ez a modell egyik legvalószínűbb meghibásodása.")] }),
  qa({ eyebrow: "Sodródás", title: "Ki nyer 2012-ben?",
      ask: "2011-en tanult modellek jósolják 2012-t. XGBoost + lag2 vagy lineáris + késleltetések nyer?",
      answer: ["A <strong>lineáris</strong>: RMSE 78,4, az XGBoost + lag2 115,0. A fa nem követi a növekedést: az összforgalomnak csak 71%-át jósolja."] }),
  S({ eyebrow: "Sodródás", title: "A fa nem extrapolál", img: "ext_trend.png", caption: "havi átlagos jóslat 2012-ben; a modellek csak 2011-et láttak",
      blocks: ["Alap jellemzőkkel az XGBoost az összforgalom <strong>63%</strong>-át jósolja. A késleltetés segít (71–82%), de a lineáris + késleltetés <strong>91%</strong>."] }),
  S({ eyebrow: "Sodródás", title: "A tanulság", img: "tbl_ext.png", caption: "2011-en tanult modellek, 2012-01–10 a teszt",
      blocks: ["„A gépi tanulás veri a lineárist” <strong>feltétele</strong>, hogy a jövő hasonlítson a tanítóra. Sodródás esetén újratanítás és figyelés kell."] }),

  // ---------------- A cél átfogalmazása: változás a múlt héthez képest ----------------
  S({ eyebrow: "Sodródás · új célváltozó", title: "Változást jósolunk", img: "cel_stacionaritas.png", caption: "heti átlagok a fejlesztési szakaszon (azon órák, ahol van múlt heti érték); szaggatott: nulla",
      blocks: ["Cél: <code>y − y(múlt hét)</code>, vagy a log-arány. A szint nő (150 → 244), a változás átlaga alig (2,0 → 4,1)."] }),
  S({ eyebrow: "Sodródás · új célváltozó", title: "Mihez viszonyítunk?", img: "tbl_cel_jellemzok.png", caption: "XGBoost, RMSE: normál foldok / 2012-re (2011-en tanulva, 3 seed átlaga)",
      blocks: ["Csak a lag2 mellett a változás-cél összeomlik (94,2 és 147,0): a modellnek tudnia kell, mihez viszonyít."] }),
  S({ eyebrow: "Sodródás · új célváltozó", title: "Újra 2012-ben", img: "ext_trend_change.png", caption: "havi átlagos jóslat 2012-ben; a modellek csak 2011-et láttak; XGBoost, ugyanazok a jellemzők",
      blocks: ["2012-re a szint-cél 95,4 (az összforgalom 86%-a), a változás-cél 73,1 (93%), a log-arány 74,6 (90%)."] }),
  S({ eyebrow: "Sodródás · új célváltozó", title: "Hiányzó múlt hét", img: "tbl_cel_hianyzo.png", caption: "2012-11-05: a Sandy utáni hét; utólagos (post-hoc) vizsgálat: a záró teszt ezekre a modellekre már nem tiszta",
      blocks: ["Vihar után hiányzik a múlt heti érték: a nyers jellemző 546-ot jósol 219 helyett; szomszéd-kitöltéssel 244."] }),
  S({ eyebrow: "Sodródás · új célváltozó", title: "Mikor melyik cél?",
      blocks: [LIST("<strong>Szint-cél:</strong> egyszerű, normál időszakban egyenrangú (63,6); növekedésnél a fa lemarad (az összforgalom 86%-a, RMSE 95,4)",
                    "<strong>Változás (delta):</strong> a múlt heti érték + a modell jóslata; normál időszakban ugyanannyi (62,6 vs 63,6), sodródásnál 73,1 (−23%), de 8 negatív jóslat, és a szórása a szinttel nő (72 → 101)",
                    "<strong>Log-arány:</strong> szorzót tanul, sosem negatív, a szórása stabil (0,58 → 0,52); normál időszakban 3%-kal gyengébb RMSE-ben (65,4 vs 63,6), RMSLE-ben a legjobb (0,325)",
                    "<strong>Hiányzó múlt heti érték:</strong> a legközelebbi elérhető szomszéd: 1) ugyanaz az óra múlt héten, 2) a múlt heti szomszéd órák átlaga, 3) ugyanaz az óra két hete; így nincs szükség másik modellre (RMSE 79,9 → 52,9)",
                    "Sodródásnál a változás-célú fa (73,1) már 6,8%-kal jobb a lineáris + késleltetésnél (78,4); ez egyetlen forgatókönyv, egy évnyi tanító adattal")] }),

  // ---------------- Záró teszt ----------------
  S({ eyebrow: "Záró teszt", title: "Előre rögzített szabály",
      blocks: [LIST("Jelöltek (CV-RMSE): XGBoost + mind a hat késleltetés <strong>61,9</strong>, csak lag2 62,0, alap 66,0; lineáris + késleltetések 75,3, alap 110,9",
                    "Nyer a <strong>legkisebb CV-RMSE</strong>: XGBoost + mind a hat (a lag2 egyedül döntetlen: 0,1 a különbség)",
                    "A záró teszt (2012-11 és 12, 1 460 óra) <strong>egyszer</strong>: a teljes fejlesztési adaton tanult modellel")] }),
  qa({ eyebrow: "Záró teszt", title: "Jobb lett a modell?", img: "tbl_vegso.png", caption: "teszt: 2012-11–12 (1 460 óra); CV: a dev foldok",
      ask: "A teszt-RMSE (50,9) kisebb, mint a CV-é (61,9). Jobb lett a modell?",
      answer: ["Nem: alacsonyabb a szint, de a relatív hiba <strong>nagyobb</strong>: WAPE <strong>0,172</strong> a teszten, 0,140 a CV-ben (az alapnál 0,228 vs 0,161)."] }),
  S({ eyebrow: "Záró teszt", title: "Mennyivel jobb?", img: "final_javulas.png", caption: "a pont: az RMSE-különbség a teszten; a szakasz: 95%-os napi blokk-bootstrap intervallum",
      blocks: ["XGBoost + mind a hat: <strong>16,9</strong>-cel jobb az alapnál és <strong>15,4</strong>-gyel a lineáris + késleltetésnél; egyik intervallum sem érinti a 0-t."] }),
  S({ eyebrow: "Záró teszt", title: "Egy szám nem elég", img: "interval.png", caption: "a teszt egy hete: 90%-os kvantilis-sáv (5. és 95. percentilis), pontbecslés, tényleges",
      blocks: ["A teszten az órák <strong>82,8%</strong>-a esik a 90%-os sávba: a sáv túl keskeny; a szinttel szélesedik (átlagosan 78 → 180)."] }),
  S({ eyebrow: "Összefoglaló", title: "Ellenőrzőlista",
      blocks: [LIST("Alapmodell és naiv szabály mindig; a lineáris modellt <strong>tisztességesen</strong> állítjuk be", "Időben rendezett adatnál időrendi vágás; a záró teszt egyszer",
                    "Több mutató, előre választva; hogy melyik számít, üzleti döntés", "Diagnosztika: kalibráció, reziduum vs becslés, szegmensek, idő, autokorreláció",
                    "Minden jellemzőre: <strong>ismerném a jóslás pillanatában?</strong>", "A javulást foldonként és intervallummal mondjuk ki", "Ha a rendszer sodródik: újratanítás, figyelés")] }),
  S({ eyebrow: "Házi", title: "Építs saját regressziós modellt",
      blocks: ["Adatsor: <strong>King County házárak</strong> (21 613 eladás). A mai úton járj végig: <strong>tisztességes baseline</strong>, legalább három modell, a mai mutatók és diagnosztikák, <strong>egy dokumentált visszacsatolási kör</strong>, a teszthalmaz egyszer.",
               "Pontozás: az <strong>indoklás</strong> számít, nem a pontszám. Részletek: <code>homework.md</code>."] }),
];
