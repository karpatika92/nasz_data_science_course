---
marp: true
theme: default
paginate: true
class: lead
---

# Statisztikai alapok
### 1. óra — Data Science műhelykurzus

Kárpáti András

---

## Mielőtt elkezdenénk

Ez az óra **nem** frontális előadás.

A cél: minden témát egy **kérdéssel vagy játékkal** nyitunk, és csak utána jön a
formalizmus — mert az intuíciónk (és a híres tudósoké) itt szinte mindig téved.

---

<!-- _class: lead -->

# 1. Váltasz ajtót?

---

## A játék

3 ajtó. Az egyik mögött főnyeremény, kettő mögött semmi.

Választasz egy ajtót. A műsorvezető — **aki tudja, hol a nyeremény** — kinyit egy
másik, üres ajtót.

**Váltasz, vagy maradsz?**

---

## Szavazzunk

✋ Ki maradna az eredeti választásnál?

✋ Ki váltana?

*(még ne mondj indoklást — csak szavazz)*

---

## 1990, Parade magazin

Marilyn vos Savant megírta a helyes választ.

- **~10 000 olvasó** írt neki, hogy téved
- **~1000 közülük** doktori fokozattal rendelkezett
- Paul Erdős csak egy szimulációnak hitt

**Miért téved itt szinte mindenki?**

---

<!-- _class: lead -->

# 2. Bayes-tétel

---

## Amit épp csináltatok

Új infó (a felfedett ajtó) hatására **megváltozott a hitünk** egy esemény
valószínűségéről.

$$P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}$$

---

## A teszt paradoxona

Egy ritka betegség prevalenciája **1%**.

A teszt **99%**-ban helyesen jelez pozitívat betegnél, **99%**-ban helyesen jelez
negatívat egészségesnél.

**Pozitív lettél. Mekkora eséllyel vagy tényleg beteg?**

*(tippelj, mielőtt levezetjük)*

---

## Bayes a történelemben

- Thomas Bayes (1701–1761) — posztumusz kiadás, 1763
- Laplace — függetlenül újra felfedezi, kiterjeszti
- Turing & Good — Enigma-törés, Bletchley Park, II. vh.

---

<!-- _class: lead -->

# 3. Nagy számok törvénye

---

## Gambler's fallacy

Szabályos érme. 8-szor egymás után fej.

**Mennyi az esélye, hogy a 9. dobás írás?**

---

## A törvény

A mintaátlag → konvergál a valódi várható értékhez, ahogy n → ∞.

**Ez nem azt jelenti, hogy a jövő "kompenzál" a múltért.**

*Jakob Bernoulli, Ars Conjectandi (1713, posztumusz, ~20 év munka)*

---

<!-- _class: lead -->

# 4. Centrális határeloszlás-tétel

---

## Kérdés, mielőtt megnézzük

Ha **bármilyen** (akár nagyon ferde) eloszlásból sokszor mintát veszünk, és mindig
kiszámoljuk a mintaátlagot —

**milyen alakú lesz maguknak az átlagoknak az eloszlása?**

---

## Élő demó

→ `demo.ipynb`

*(exponenciális eloszlás → mintaátlagok hisztogramja, n növelésével)*

---

## CLT a történelemben

- de Moivre (1733) → Laplace → Ljapunov (1901, szigorú bizonyítás)
- Galton-deszka (1889) — fizikai demonstráció

**Ezért működik a legtöbb hipotézisvizsgálat.**

---

<!-- _class: lead -->

# 5. Hipotézisvizsgálat

---

## Kérdés

A/B tesztet futtatsz. B jobban teljesít, mint A.

**Mikor hiszed el, hogy ez valódi, és mikor gondolod, hogy csak zaj?**

---

## Amit a p-érték NEM jelent

❌ "Annak a valószínűsége, hogy a nullhipotézis igaz."

✅ "Milyen valószínű, hogy *legalább ilyen extrém* adatot látnék, HA a
nullhipotézis igaz volna."

---

## Lady Tasting Tea

Ronald Fisher, Rothamsted, 1920-as évek.

Egy kolléganő állította: meg tudja mondani, a teát vagy a tejet öntötték-e előbb.

→ Ebből született a modern szignifikanciavizsgálat.

*(Fisher és Neyman–Pearson évtizedekig vitatkozott azon, mit is jelent ez.)*

---

<!-- _class: lead -->

# 6. Korreláció vs. kauzalitás

---

## Spurious correlations

Nicolas Cage-filmek száma ↔ medencébe fulladások

Sajtfogyasztás ↔ ágyneműbe gabalyodva bekövetkezett halálesetek

**Ha A és B együtt mozog — mi lehet a magyarázat A→B-n kívül?**

---

## Dohányzás és tüdőrák, 1950-es évek

Ronald Fisher — a modern statisztika atyja — **a dohányipar fizetett tanácsadója**
volt, és komolyan érvelt egy meg nem figyelt genetikai konfounder mellett.

**A tudomány nem tekintélyi alapon dől el.**

*(Feloldás: Bradford Hill kauzalitási kritériumai, 1965)*

---

<!-- _class: lead -->

# 7. Simpson-paradoxon

---

## UC Berkeley, 1973

Összesített felvételi arány: férfiaknak magasabb, mint nőknek.

**Ez bizonyítja a diszkriminációt?**

*(vitassuk meg, mielőtt bontjuk)*

---

## Tanszékenkénti bontás

A legtöbb tanszéken a nők felvételi aránya **egyenlő vagy magasabb** volt.

A nők aránytalanul sok jelentkezést adtak be a legversenyzőbb tanszékekre.

**Hogyan lehet minden alcsoportban jobb az arány, mégis összesítve rosszabb?**

---

<!-- _class: lead -->

# 8. Dimenzió-átok

---

## Kérdés

Ahogy nő a feature-ök száma, minden pont egyre "egyformábban" távol kerül minden
más ponttól.

**Ha mindenki kb. ugyanolyan távol van tőled — van-e még értelme a "legközelebbi
szomszédnak"?**

*(Bellman, 1957 — eredetileg dinamikus programozás, nem statisztika)*

---

<!-- _class: lead -->

# 9. Lineáris regresszió

---

## Legkisebb négyzetek

A legjobban illeszkedő egyenes: minimalizálja a hibák **négyzetösszegét**.

**Miért a négyzetét, nem az abszolút értékét?**

---

## Két név, két történet

- Galton (1886) — "regresszió a középszerűséghez"
- Legendre (1805) vs. Gauss (állítása szerint 1795 óta) — elsőbbségi vita
- Gauss megjósolja a Ceres törpebolygó pozícióját (1801)

---

<!-- _class: lead -->

# 10. Logisztikus regresszió

---

## Bináris kimenet — miért ne lineáris?

Meg akarod jósolni: lemorzsolódik-e a felhasználó (igen/nem).

**Miért ne futtatnátok le rajta egyszerűen a lineáris regressziót?**

*(Ez a lineáris valószínűségi modell — LPM)*

---

## Amikor az LPM elromlik

→ `demo.ipynb`

*(predikciók 0 alá, 1 fölé mennek — mit jelent egy "-12%-os esély"?)*

---

## Milyen függvény szorítaná [0,1] közé?

*(hagyd, hogy javasoljanak, mielőtt megmutatod a szigmoidot)*

- Verhulst (1830-40-es évek) — korlátozott népességnövekedés
- Cox (1958) — logisztikus regresszió mint statisztikai módszer

---

<!-- _class: lead -->

# Házi feladat

→ `homework.md`
