# 2. házi feladat — Gépi tanulás

Két rész: (1) videók + rövid reflexió, (2) gyakorlati feladat a Titanic-adatsoron.

## 1. rész — Videók + reflexió

Ugyanúgy, mint az 1. házinál: minden linket ellenőriztem (a csatorna saját
oldala/indexe alapján), nem tippeltem. A neurális háló két videója
3Blue1Brown-tól van (a leghíresebb sorozata pont erről szól), a többi
StatQuest-től — nincs Numberphile/Two Minute Papers találat ezekre a
témákra.

| Téma | Videó | Csatorna | Link |
|---|---|---|---|
| Bias-variance tradeoff | Machine Learning Fundamentals: Bias and Variance | StatQuest | https://youtu.be/EuBBz3bI-aA |
| Overfitting / cross-validation | Machine Learning Fundamentals: Cross Validation | StatQuest | https://youtu.be/fSytzGwwBVw |
| Neurális hálók | But what is a neural network? — Deep learning chapter 1 | 3Blue1Brown | https://www.youtube.com/watch?v=aircAruvnKk |
| Gradient descent / learning rate | Gradient descent, how neural networks learn — Deep learning chapter 2 | 3Blue1Brown | https://www.youtube.com/watch?v=IHZwWFHWa-w |
| Support Vector Machine | Support Vector Machines Part 1: Main Ideas | StatQuest | https://youtu.be/efR1C6CvhmE |
| Döntési fa | Decision and Classification Trees, Clearly Explained!!! | StatQuest | https://youtu.be/_L39rN6gz7Y |
| Random Forest | Random Forests Part 1: Building, using and evaluating | StatQuest | https://youtu.be/J4Wdy0Wc_xQ |
| Gradient Boosting | Gradient Boost Part 1: Regression Main Ideas | StatQuest | https://youtu.be/3CC4N4z3GJc |

**Reflexió (kb. 5-8 mondat összesen, nem videónként!):** válassz ki **3 videót**
a fenti listából, és mindegyikhez írj 2-3 mondatot:
1. Mit tanultál, ami **meglepett**, vagy amit másképp gondoltál eddig?
2. Hogyan kapcsolódik ez ahhoz, amit a mai órán a Titanic-példán végigcsináltunk?

## 2. rész — Gyakorlati feladat: hiperparaméter-vadászat

A `demo.ipynb` 9. szekciójában lefuttattunk egy modellösszehasonlítást a
Titanic-adatsoron, **alapértelmezett hiperparaméterekkel**. A feladat: próbáld
megverni ezeket az eredményeket.

**Lépések:**
1. Válassz ki **2 modellt** a hatból (pl. Random Forest és Gradient Boosting).
2. Mindkettőhöz próbálj ki **legalább 3-3 különböző hiperparaméter-beállítást**
   (pl. Random Forest-nél `max_depth`, `n_estimators`; Gradient Boosting-nál
   `learning_rate`, `n_estimators`, `max_depth`).
3. Minden beállításnál nézd meg **külön a tanuló és a teszt pontosságot** — nem
   csak a teszt pontosságot! Ha a kettő nagyon eltávolodik egymástól, az
   overfitting jele.
4. Írj 4-6 mondatot: melyik beállítás volt a legjobb, és **miért** gondolod,
   hogy pont az? Melyiknél láttál egyértelmű overfittinget (nagy tanuló-teszt
   szakadék)?

**Bónusz (nem kötelező):** próbáld ki ugyanezt egy **harmadik** modellel is,
amit az órán nem hasonlítottunk direktben — pl. `sklearn.neighbors.KNeighborsClassifier`
(K legközelebbi szomszéd) —, és gondold végig: hogyan viszonyul ez a modell a
dimenzió-átokhoz, amiről az 1. órán volt szó?

*(Miért fontos ez? A modellösszehasonlítás alapértelmezett hiperparaméterekkel
igazságtalan verseny — van, amelyik modell "eleve" jobban van hangolva a
sklearn defaultjaival egy adott problémára. A hiperparaméter-keresés az, ami
gyakorlatban tényleg megmondja, melyik modellcsalád illik jobban az
adatunkhoz.)*
