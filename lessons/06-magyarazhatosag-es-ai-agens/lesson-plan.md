# 6. óra — Magyarázhatóság és AI ügynök (záró óra)

Oktatói jegyzet. A `slides.html` a vetített anyag (**65 slide**, 3 kérdés); a notebookot (`demo.ipynb`) nem vetítjük, csak a számok forrása.
Minden szám az `expl.py`-ból jön (`results.json`, rögzített seedek); az ábrákat a `build_assets.py` állítja elő. Az adat és a modell az **5. óra** bike-sharingje
(`../05-regresszio/bike.py`, egyetlen igazságforrás). A `hw_example/` a házi hét promptjának valódi futása (notebook, terv, CLAUDE.md).

**Cél:** (A) a hallgatók tudják, mit jelent egy együttható (standardizálva, log-transzformálva), mit mond és mit **nem** mond egy fa „fontossága”, és mit ad a SHAP (a Shapley-érték játékelméleti
példákkal); (B) a parancssorból, **terv-olvasással és ellenőrzéssel** dolgozzanak egy kódoló ügynökkel, és lássák, hogyan megy a házi néhány promptban, **kimenetekkel**.

## Időzítés — FIGYELEM: 65 slide 60 percre sok

Az első verzió 49 slide volt; a kért bővítések (emlékeztető, log-esély, permutációs magyarázat, 3 Shapley-példa, a fa útja, CLI-képek, a házi kimenetei) 65-re vitték. 60 percben ez ~55 mp/slide, ami csak
akkor megy, ha a slide-ok fele másfél mondat. **Javaslat: vágj ~53-ra** (alább a sorrend), vagy tervezz 70–75 percet.

| Blokk | Slide | Perc (65 slide-dal) |
|---|---|---|
| Cím, emlékeztető, terv | 1–3 | 2 |
| A. Miért; lineáris és logisztikus együtthatók | 4–16 | 12 |
| A. Fa-fontosság (beépített, permutációs) | 17–21 | 5 |
| A. Shapley-példák, SHAP, összevetés, csapdák | 22–33 | 10 |
| B. Miért CLI, a terminál, parancsok | 34–41 | 7 |
| B. Claude Code (telepítés, módok, munkafolyamat, terv, kontextus, CLAUDE.md, memória) | 42–49 | 9 |
| B. Promptolás | 50–54 | 5 |
| B. A házi hét promptban, kimenetekkel | 55–64 | 10 |

**Vágási sorrend (12 slide → 53):** 7 (egység), 10 (log jellemző), 13 (valószínűség-hatás), 16 (mit nem mond), 21 (permutáció előny/hátrány), 29 (SHAP 3:00), 33 (csapdák: az 5. óra témája),
41 (CLI-trükkök), 49 (memória és bővítések), 53 (hasznos fordulatok), 56 (házi: terv), 60 (diagnosztika ábrák). **Ne vágd:** 14, 20 (kérdések), 18–19 (permutáció, négy rangsor), 22–24 (Shapley), 26–28 (fa útja, 680), 30–31 (beeswarm, interakció), 46 (a terv olvasása).

## Kérdések (3, mindegyik válasza a következő kattintásra jelenik meg)

14. A munkanap együtthatója ≈ 0 (+3,3): számít-e? **Nem additív**: csúcsóra × munkanap +213, a munkanap együtthatója −59, R² 0,515 → 0,576.
20. Két véletlen oszlop a Random Forestben: beépített fontosság 0,44 / 0,45 % (a szélsebesség 0,43 %); permutációsan +0,02 / +0,07 RMSE a hőmérséklet +1,40-ével szemben.
51. „Csináld meg a házit, legyen jó.”: mind a négy elem hiányzik (cél, kontextus, korlát, ellenőrzés).

## Mérések (mind a `results.json`-ból; egy vágás, egy seed, demó-szint)

* **Lineáris** (OLS, dev 2011-01..2012-10, 15 919 óra, 6 jellemző: °C, páratartalom %, szél km/h, munkanap, csúcsóra = 7–9 és 16–19 óra, 2012): R² 0,515; hőmérséklet +8,34 kölcsönzés/°C.
  Az UCI normalizált oszlopait (temp/41, hum/100, windspeed/67) visszaszoroztuk (ezt a Readme írja).
* **°C → °F:** együttható 8,34 → 4,63, a jóslatok legnagyobb eltérése 3·10⁻¹¹. **Standardizálva:** a hatás +1 SD-re (hőm. +65,9; páratart. −43,8; csúcsóra +83,5; szél +0,4); az intercept = az átlag (189,5).
* **Log-cél:** hőm. +7,0 % /°C, csúcsóra ×3,55; R² 0,42 a log-skálán (nem összevethető). **Log-log** (lag168 mint jellemző, 15 654 óra): rugalmasság 0,83; a °C-ot szándékosan nem logoljuk (nincs természetes nulla).
* **Kollinearitás:** temp és atemp r = 0,987; a temp együtthatója 8,34 → 2,77, az R² 0,515 → 0,516.
* **Log-esély frissítő (11.):** p = 0,1; 0,5; 0,8; 0,9; 0,99 → esély 0,11; 1; 4; 9; 99 → log-esély −2,20; 0; 1,39; 2,20; 4,60.
* **Logisztikus** (cél: cnt > 281, a felső negyed, 24,9 %): OR hőm. 1,158/°C, csúcsóra 14,8; 1 SD-re hőm. 3,19, csúcsóra 3,42. A valószínűség-hatás +1 °C-ra 5/15/30 °C-nál: +2,1/+3,7/+1,4 százalékpont (munkanapi csúcsóra, 2012).
* **Fák:** XGBoost (BASE + hat lag, mint az 5. órán), tanítás 2012-09-01 előtt (14 491 óra), validáció 2012-09..10 (1 428 óra), RMSE 63,7. Első hely: weight, gain: lag168; cover: yr; permutációs: lag2 (67,8 ± 1,2) és lag168 (66,9 ± 0,7): **holtverseny**.
  **Permutációs lépésről lépésre (18.):** az eredeti 63,7; lag168 megkeverve 130,5 (+66,9); hr 110,3 (+46,6); temp 68,8 (+5,2); windspeed 63,7 (+0,1). A SHAP átlag-abszolút: lag168 77,7 > lag2 45,5 > lag24 39,7 > hr 29,9.
* **Shapley-példák** (`expl.shapley_games`, az összes sorrend átlaga): üzletfelek (A 10, B 20, együtt 50): Anna 20, Bence 30; kesztyű-játék (1 bal, 2 jobb, pár = 1): bal 2/3, jobbak 1/6–1/6;
  **ENSZ BT** (Shapley–Shubik): állandó tagonként 19,63 % (együtt 98,1 %), nem állandó tagonként 0,19 % (együtt 1,9 %); az összeg 1,0. **Egyszerűsített modell:** súlyok 7 és 1, kvóta 39 (= 9 igen, köztük mind az 5 állandó tag);
  a tartózkodást (a gyakorlatban nem vétó) és az eljárási kérdéseket nem modellezi.
* **A fa útja (26–27.)** a 2012-09-04 8:00-s órára: az XGBoost 0. fája hat kérdés (hr < 7? nem; temp < 0,48? nem; yr < 1? nem; hr < 21? igen; hr < 17? igen; lag4 < 13? igen), levél +15,1; a lépcsőzetes jóslat 179 → 194 (1 fa) → 235 (3) → 362 (10) → 545 (30) → 662 (100) → 675 (300) → 680 (500).
  Az első fa nem is használja a lag168-at: egy fa keveset tud.
* **SHAP:** TreeExplainer; additivitás: legnagyobb eltérés 0,001; lineáris modellen a `LinearExplainer` = b·(x − átlag) (0,0 eltérés, teljes háttéradattal: a shap alapértelmezett 100 soros háttere 22-es eltérést adott: ezt ne feledd, ha élőben futtatod).

**Amit nem állítunk (és ne is mondj):** hogy a SHAP/a fontosság ok-okozati; hogy a MDI „mindig torzít”: a zaj-demó csak azt mutatja, hogy a gyenge jellemzőt **nem lehet megkülönböztetni a zajtól** (0,52 vs 0,44 %), míg permutációsan 1,40 vs 0,02–0,07;
a `season`, `yr`, `mnth` permutációs fontossága is ≈ 0, a zaj fölé rangsorolódik, tehát a rangsor önmagában itt sem tökéletes (magnitúdót mutass, ne rangot). A „korrelált jellemzők megosztják a fontosságot” **nem mért** itt, általános állítás.

## B rész: források és ellenőrzöttség

* **Karpathy:** a „Software 3.0” előadás (YC AI Startup School, 2025. június) jegyzetei a latent.space-en (https://www.latent.space/p/s3): részleges autonómia/autonómia-csúszka, „rövid póráz”, a generálás–ellenőrzés ciklus gyorsítása.
  A „vibe coding” (2025. február 2.) poszt idézete („forget that the code even exists”) másodlagos forrásból idézve; az eredeti X-posztot **nem nyitottam meg**. A 2026-os „agentic engineering” és a napi Claude Code-szokásaira vonatkozó állítások blogokból valók, egymásnak ellentmondók: **nem tettem a slide-ra**.
* **Claude Code:** a módok (Shift+Tab: default → acceptEdits → plan → bypass → auto), CLAUDE.md-helyek, `/clear /compact /context /rewind /resume /permissions /memory /init`, `claude -p / -c`, `--worktree`, telepítő parancsok: a code.claude.com dokumentációból (2026-11-24-i lekérés, egy ügynök olvasta, **élő futtatás nélkül**).
  **A napon ellenőrizd:** az auto mód elérhetősége (verzió-, csomag-, szolgáltatófüggő), a Shift+Tab (Windowson lehet Alt+M), a `claude --worktree` kapcsoló. A `#` memória-gyorsbillentyűt **nem tanítjuk** (nem találtam a doksiban).
* **CLI-képek (36., 38–40.):** a terminál-ábrák **illusztrációk**, de a parancsok kimenete valódi: a `build_assets.py` lefuttatja a parancsokat egy eldobható mappában (`LC_ALL=C`), a felhasználónevet `diak`-ra cseréli, majd rajzolja a „terminál-ablakot”. Nem képernyőkép.
  **A 37. slide (hol találod: Ctrl+Alt+T, Cmd+Szóköz, Start → Terminal, `wsl --install`) emlékezetből van, nem ellenőriztem az aktuális OS-verziókon.** A CLI-fejlesztések (rg, fd, bat…) slide-ot kérésre elhagytam.
* **A házi hét prompt és a kimenetek (56–63.):** egy friss ügynök végigfuttatta a hét promptot a King County adaton: `hw_example/notebook.ipynb` (21 cella, hiba nélkül, 16 s); a slide-ok kimenetei **szó szerint** az ő végrehajtott celláiból vannak (a hosszú sorok levágva `…`-tal, a 3. slide mutatótáblájának oszlopai összevonva).
  CV RMSE (3 fold): átlag 361 400, irányítószám-medián 287 474, log-lineáris + zip 139 805, fa 188 751, RF 134 602, **XGBoost 119 588 ± 5 631**; a „comps” páros különbsége −3 097 ± 3 177 (nem bizonyítottan jobb); teszt RMSE XGBoost 129 054 [117 655; 141 344], bootstrap property szerint.
  **Fontos:** a futás a **régebbi** prompt-szöveggel ment; a 2., 4., 5. promptot utána pontosítottam a futás tapasztalatából (2.: legutolsó eladás dátuma szerinti kulcs; 4.: `hypotheses.md`; 5.: döntési szabály a „nem segített”-hez). A kimenetek ezekkel összhangban vannak (az ügynök már ezeket választotta), de **az új szöveggel nem futtattam újra**.
  Egy ügynök, egy futás: azt mutatja, hogy a szekvencia végigmegy, nem azt, hogy a számok „a helyes” megoldás. A CLAUDE.md „split first” szabálya ütközik a házi sorrendjével (EDA előbb): szándékos, mondd ki.
  Az ügynök önkritikája valódi gyengéket talált (a hipotézist ugyanazokon a foldokon választotta és értékelte; a comps-szomszédok „jövőbeliek” a tanítón belül; `sqft_living15` utólagos infót hordozhat): a 63. slide ezt mutatja.

## Blokkonként

**Emlékeztető (2.).** Az 5. óra feladata és a mai kérdés; XGBoost RMSE 61,9 az 5. óra időrendi foldjain (`../05-regresszio/results.json`: `fe_right/xgb_lags`).
**A. Lineáris (6–16).** „+1 egység → b, a többi rögzítve”. A °C/°F slide a „nagyság ≠ fontosság” bizonyítéka. Standardizálás: +1 SD. Log-cél: exp(b) − 1. Log-log 2×2: „melyik oldalon van a log?”.
**Log-esély (11.)** a logisztikus előtt: esély, log-esély, a logisztikus a log-esélyt modellezi lineárisan. 14. kérdés: interakció. 15.: kollinearitás.
**A. Fák (17–21).** Honnan jön a fontosság; **mit jelent a permutációs** (18., lépésről lépésre); négy rangsor (19.); a zaj (20.).
**A. Shapley és SHAP (22–33).** Két üzletfél (a belépési sorrendek átlaga), kesztyű-játék (ritkaság), ENSZ BT (vétó = hatalom). SHAP-ötlet (25.). **A döntési fa útja** (26.), **500 fa összege** (27.), majd a waterfall (28.: miért 680) és a 3:00-s eset.
Beeswarm (30.), óra × munkanap (31.).
**B. CLI (34–41).** Chat vs ügynök; a terminál képe; hol találod; három „terminál” a valódi parancsokkal és kimenetekkel; trükkök.
**B. Claude Code (42–49).** Telepítés, módok (a **plan mód** a 46. slide-hoz vezet: „olvasd el a tervet”), kontextus, CLAUDE.md (a 48. slide példája a házi 0. promptja), memória/skill/subagent/hook/MCP.
**B. Promptolás (50–54) és a házi (55–64).** Négy elem; rossz/jó párok; ML-csapdák; a hét prompt angolul (az ügynökök angolul a legmegbízhatóbbak; magyarul is működik), mindegyik kimenetével.

## Ami szándékosan nincs benne

PDP/ICE, LIME, interakciós SHAP-mátrix, a Shapley-formula általános alakja, kontrafaktuális magyarázatok, Claude Code Agent SDK, GitHub-integráció, adatvédelmi szempontok (ügynöknek adott adat).
A „CLI-fejlesztések” slide (rg, fd, bat, fzf…) kérésre kimaradt.

## Futtatás

```
cd lessons/06-magyarazhatosag-es-ai-agens
uv run python expl.py            # results.json
uv run python build_assets.py    # assets/*.png (és results.json) kb. 1 perc
```
A `shap` a repo `pyproject.toml`-jába került (`uv add shap`, shap 0.54.1). A `results.json` utolsó számjegyei futásonként ~1e-14-gyel ingadozhatnak (párhuzamos erdő-összegzés); a slide-ok kerekített számai nem.
