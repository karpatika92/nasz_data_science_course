# A checkers.com üzleti esete — 2. fejezet

*Háttéranyag mindkét részhez. Max. 2 A4 oldal — ez minden, amit a cégről és a
mandátumról tudni kell a mai két órához.*

## Mi történt az 1. előadás óta

Az 1. előadáson (Üzleti analitika és cégértékelés) a checkers.com még
befektetőket keresett, és azt számoltuk ki, mennyit érhet a cég. Azóta
**eladták**. Egy nagyobb, több játékmárkát összefogó holding, a **GameLeap
Holdings** vásárolta fel 2026 elején. A vételi tézis lényege nem a jelenlegi
bevétel volt, hanem egy növekedési feltevés: *a web platform napi aktív
felhasználószáma (DAU) két éven belül megduplázható* — és az ár ezt a
feltevést árazta be.

A tranzakció lezárása óta ti vagytok (szimulációban) a termék- és
növekedési csapat: a mandátumotok egyetlen mondatban: **duplázzátok meg a web
DAU-t 24 hónap alatt.** Ez vált az új tulajdonos alatt az #1 vállalati
célszámmá — nem a bevétel, nem a CLTV, hanem a napi aktív felhasználók
száma a web platformon.

**Fontos leszűkítés mára**: a checkers.com-nak van mobilalkalmazása is, de
azt ma figyelmen kívül hagyjuk. Minden szám, minden kísérlet, amiről ma szó
lesz, **kizárólag a web platformra** vonatkozik — ez tartja kezelhető
méretben a mai gyakorlatot.

## A cég ma — tények, amik nem változtak

- Online dámaoktatás, -tréning, -matchmaking és -tartalom egy platformon.
- Egyetlen bevételi forrás: havi előfizetés, két árszint (Alap/Prémium),
  nincs hirdetés. *(A pontos árazás ma nem releváns — a mandátum a DAU-ról
  szól, nem a bevételről — de a regisztráció/megtartás/konverzió
  alapszámait lásd lent, mert ezek a kísérletek becsléséhez kellenek.)*
- A felhasználói bázis a 2024-es virális növekedési hullám óta nagyjából
  **platózott**: az elmúlt két negyedévben a web DAU 180-200 ezer között
  ingadozott, szervesen alig nő tovább. Épp ezért nem elég "várni, hogy megint
  bevirágozzon" — tudatos, kísérletalapú termékfejlesztés kell.

## A web platform ma — a négy funkcióterület

| Funkcióterület | Mit jelent | Napi aktív használók (DAU-ból) | Arány |
|---|---|---|---|
| **Matchmaking** (Játék) | Élő parti bot vagy másik felhasználó ellen, rangsorolt vagy casual | 190 000 | 95% |
| **Tartalom** | Cikkek, hírek, videók, közösségi feed | 50 000 | 25% |
| **Tréning** | Taktikai feladvány-gyakorló ("Puzzles") | 20 000 | 10% |
| **Oktatás** | Strukturált leckék, kurzusok (nyitás, végjáték, stratégia) | 16 000 | 8% |

**Teljes web DAU ma: 200 000.** A sorok nem zárják ki egymást — egy
felhasználó aznap játszhat ÉS olvashat cikket is, ezért az arányok nem adnak
ki 100%-ot. A legtöbb felhasználó gyakorlatilag csak játszik; a többi
funkció egy-egy szűkebb, de elkötelezettebb szeletet szolgál ki.

**A cél: 200 000 → 400 000 web DAU, 24 hónap alatt** (a felvásárlás
lezárásától számítva).

## Napi szintű mutatók — regisztráció, megtartás, konverzió

- **Teljes web DAU**: 200 000 (lásd fent)
- **Regisztráció/nap (web)**: ~5 000 új felhasználó
- **CURR** (*Current User Retention Rate* — egy már aktív felhasználó
  esélye, hogy holnap is aktív lesz): **99%**

**Új felhasználók aktivitás-megtartása** (hányan térnek vissza egy adott
nap után, a regisztráció napjához képest):

| | D1 | D7 | D30 |
|---|---|---|---|
| Még aktív | **40%** | **22%** | **13%** |

**NURR** (*New User Retention Rate*) **= a D1-érték, 40%** — ugyanaz a
szám, csak a Markov-modell nyelvén: egy aznap regisztrált felhasználó
esélye, hogy holnap is visszatér. A görbe lassuló esése (40%→22%→13%, nem
40%→4%→0,4%) ugyanaz a jelenség, mint az 1. előadás churn-görbéje: a
lemorzsolódás eleinte gyors, aztán lassul — akik 30 napig kitartanak,
azok már egy stabilabb mag.

**Konverziós tölcsér** (regisztrált → fizetős):

- **Új felhasználók D7-konverziója** (fizetőssé válás az első 7 napban):
  **2,0%** — ez a tölcsér legmagasabb pontja: próbaidőszak, bevezető
  ajánlatok, "aha-élmény" frissen regisztráltaknál hajtja ezt a csúcsot.
  **Új felhasználók D30-konverziója** (kumulált, az első 30 napban):
  **3,5%**.
- **Általános DAU-konverziós ráta** (egy tetszőleges, még nem fizető DAU
  esélye, hogy fizetőssé válik egy 30 napos ablakban): **1,2%** —
  **alacsonyabb, mint az új felhasználók D7-konverziója**, annak ellenére,
  hogy itt a mérési ablak hosszabb (30 nap vs. 7 nap). Ennek oka: az
  "könnyen konvertálók" jellemzően már a regisztráció utáni első napokban
  fizetőssé váltak (ezt méri a D7-szám) — ami az általános DAU-ban marad,
  az egy hosszabb ideje aktív, de eddig soha nem fizető, eleve
  ellenállóbb népesség.

| Funkcióterület | Konverziós ráta a funkció használóira (feltételes, 30 nap) |
|---|---|
| Matchmaking | 1,3% |
| Tartalom | 1,1% |
| Tréning (Puzzles) | 2,8% |
| Oktatás | 3,5% |

*A funkcióterületek átfednek (lásd fent), ezért ezek a feltételes ráták nem
adják ki súlyozott átlagként az 1,2%-os általános rátát — jelzésértékűek:
a Matchmaking (a DAU 95%-a) közel van az általános rátához, mert gyakorlatilag
ő maga az általános DAU; minél "elkötelezettebb" jellegű a funkció (Tréning,
Oktatás), annál magasabb a hozzá tartozó konverzió.*

**Gyors konzisztencia-ellenőrzés** (az 1. előadás flow-balance logikájával:
*kiesés = pótlás* egyensúlyban): (1 − CURR) × DAU = NURR × Regisztráció/nap,
azaz 0,01 × 200 000 = **2 000** = 0,40 × 5 000. Stimmel — napi 2 000 fő esik
ki a meglévő aktívak közül, és pont ennyi új, megtartott felhasználó
pótolja őket. **Ez pontosan az az egyensúly, amitől a DAU plató, nem
csökkenő** — de ez az egyensúly önmagában NEM elég a duplázáshoz, csak a
jelenlegi szint tartásához. Erről szól a mai nap.

## Miért számít ez a mai két órának

A régi kérdés (1. előadás) az volt: *mennyit ér a cég ma?* — egy
egyszeri, pénzügyi becslés. Az új kérdés egészen más jellegű: *melyik
termékváltoztatás viszi közelebb a céget a duplázáshoz, és melyiket
érdemes előbb megcsinálni?* Ehhez nem egy modellre van szükség, hanem
**sok, egymástól független kísérletre** — különböző funkcióterületeken,
különböző időpontokban, különböző méretű közönségen —, amiket utólag
**össze kell tudni hasonlítani egymással**. Ez a mai nap technikai
magja: hogyan dönthető el szigorúan, hogy egy megfigyelt különbség valódi-e
(1. rész), és hogyan mérhető úgy a hatása, hogy a teljesen más jellegű
kísérletek mégis egy közös mérlegen legyenek (szintén 1. rész, a nap
végén) — majd (2. rész) ebből hogyan épül fel egy rangsorolt ütemterv.

## Korlátok, amik a 2. részben számítanak

A termékcsapat kapacitása véges: egyszerre kb. **4-5 kísérlet** fut
párhuzamosan, egy tipikus kísérlet **2-8 hét fejlesztői munkát** igényel a
scope-jától függően (egy kis kopogtató A/B-teszt a kisebbik, egy új
funkció/motor-csere a nagyobbik vége ennek a sávnak). A mandátum
2 éve véges — nem lehet mind a négy funkcióterületen egyszerre mindent
kipróbálni. **Priorizálni kell** — ez a 2. rész feladata.

---

*Minden szám ezen a lapon szintetikus, a gyakorlat kedvéért generált — nem
valós Chess.com- vagy más cég adat.*
