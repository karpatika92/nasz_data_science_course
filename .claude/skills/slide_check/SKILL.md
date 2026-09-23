---
name: slide_check
description: Diagnoses and fixes layout problems in this repo's custom JS slide decks (assets/deck/deck.js + deck.css, lessons/<name>/slides.html + slides-data.js) — overflow (content that would need scrolling during a live talk), text colliding with the meta-bar, and slides where content only fills the left half leaving a big dead right-hand column. Use this proactively after ANY edit to slides-data.js, deck.css, or deck.js (new slide, bigger fonts, reworked layout, new visual block) — not just when the user reports a problem. Also use whenever the user says a slide "doesn't fit", "overflows", "looks empty", "is one-sided", "doesn't use the full slide", or asks to "check all the slides" / "screenshot every slide" / verify the deck. Never eyeball this by reading slides-data.js or by screenshotting slides one at a time — the geometry (does it actually fit at 1600x900, does it actually reach the right edge) is only knowable by rendering the page, and this skill's script already does that reliably.
---

# slide_check

## Why this exists

Slide layout bugs in this deck are invisible in the source. `slides-data.js` is just
data — whether a slide overflows at 1600×900, whether its content col actually
reaches the meta-bar, or whether it visually stops at 50% width because of a CSS
unit quirk, can only be answered by **rendering the page and measuring it**. Reading
the JS and guessing wastes a turn; screenshotting slides one at a time and eyeballing
them doesn't scale past a handful and still misses geometry issues that are obvious
to a script (a few px of overflow) but easy to miss by eye. Use the bundled script.

This has already caught real bugs in this project, worth knowing about because
they'll likely recur:

1. **`max-width` in `ch` units on a container, sized for its children's font.**
   `ch` resolves against the *declaring element's own* font-size, not its
   descendants'. `.body-stack { max-width: 88ch }` with the actual text size set on
   `.body-stack p` (a descendant) computed against a small inherited font-size and
   silently capped the container at ~700px instead of the intended ~1400px — every
   slide *looked* like it had "text only on the left" but the JS/CSS looked correct
   on read-through. Fixed by switching these to plain `px` values. If a fresh case
   of "sparse" shows up, check for `ch`/`em` units on a container whose children set
   their own font-size before assuming the fix is "add more content."
2. **`.slide-visual` is a sibling of `.content-col`, not a descendant.** A checker
   (or a human) that scopes its search to `.content-col` when measuring how far
   right content extends will silently miss the entire image pane on a `has-visual`
   slide and report a false "empty right side" on slides that are actually fine.
   `scripts/check.js` searches the whole slide for this reason — don't narrow that
   scope without re-adding `.slide-visual` explicitly.
3. **`--screens` navigating by hash on the already-loaded page is a no-op.**
   `deck.js` only reads `location.hash` inside its `DOMContentLoaded` handler —
   once the page has loaded, `page.goto(`${url}#${info.index}`)` on the *same*
   Playwright page is a same-document fragment navigation in Chromium, which
   never re-fires `DOMContentLoaded`. The deck's displayed slide silently doesn't
   change, so every "flagged slide" screenshot was actually capturing whatever
   slide/scroll state the main measurement loop had left behind — not the slide
   named in the filename. Fixed by opening a **fresh page** per screenshot (a
   real initial load honors the hash). If you ever add another codepath that
   deep-links by hash, open a new page for it rather than reusing one that's
   already loaded the deck.

## Running it

```bash
cd .claude/skills/slide_check/scripts
npm install   # only needed once — installs playwright-core, which drives the
              # system-installed google-chrome directly (no browser download)
node check.js                              # checks every lessons/<name>/slides.html
node check.js lessons/03-x/slides.html      # or just one deck
node check.js --screens /tmp/slide-shots    # also saves a PNG per flagged slide
```

Exit code is 1 if anything was flagged, 0 if clean. The report is deliberately
compact — slide index, title, and exactly which check(s) failed, e.g.:

```
lessons/01-statisztikai-alapok/slides.html
  60 slides, 2 with issues
  #24 "Lady Tasting Tea" — overflow +72px
  #56 "Nem ugyanazt jelenti" — sparse (content only reaches 52% of slide width)
```

Each slide is put into its **fully-revealed** state before measuring (`.is-active`
+ `.is-revealed` on every `[data-step]` fragment) — that's the state a presenter
actually reaches by the end of clicking through the slide, and the one that has to
fit. Checking only the first-fragment state would miss most real overflow bugs.

## The four checks, and what "failing" means

- **Overflow** (`slide.scrollHeight - slide.clientHeight > 4px`): the slide has
  `overflow-y: auto`, so a real overflow doesn't error or visibly break anything —
  it just silently grows a scrollbar. That's worse than a hard failure for a live
  talk, since you won't notice until you're standing in front of the room.
- **Meta-bar collision**: `.meta-bar` is `position: absolute`, floating independent
  of document flow. A slide whose own top content got pushed up (e.g. from a
  layout change like switching to vertical centering) can render its eyebrow
  *under* the meta-bar without ever tripping the overflow check.
- **Sparse fill** (content-type slides only — dividers and the title slide are
  *supposed* to be sparse, one big numeral and a line of text, don't flag those):
  measures the rightmost edge of `.body-stack`, `.columns`, and `.slide-visual`
  against the 1600px viewport. Below 65% means there's a large dead column on the
  right that a viewer's eye reads as "unfinished" or "broken", not "minimalist."
- **Small-for-space** (content-type slides only): measures the bounding box of
  everything on the slide (`.eyebrow, .headline, .kicker, .body-stack, .columns,
  .slide-visual`) as a % of the full 1600×900 canvas. This catches a different
  failure than sparse fill: a slide can reach 100% of the width and still render
  its one sentence at normal body size, floating in a mostly-empty canvas — fine
  horizontally, but the text itself reads as small because nothing scales up when
  there's less content. Threshold (30%) was picked empirically: dumped the
  `areaPct` for every content slide in lesson 1, sorted ascending, and found a
  real gap — most slides cluster 30–70%, with a distinct low band at 19–28% that
  turned out to be exactly the slides made of a single `ask` or `plaque` block, or
  1–2 bare sentences. **This check has a real blind spot, found while calibrating
  it**: below ~30%, low area% stops reliably meaning "text is too small" and often
  just means "this slide is short by design, vertically centered, with a big
  margin above/below" — several slides flagged at 26–28% (a dense `image-sequence`
  slide, a two-column comparison) turned out on a full-reveal screenshot to be
  completely fine: legible, well-proportioned, just not owning the whole canvas.
  Treat anything still flagged after check 1 below (the type-scale bumps) as a
  **candidate list to eyeball, not an auto-fail** — screenshot it fully revealed
  (see the next section) before deciding it needs a fix.

## Fixing what it finds

**Overflow**: this deck's whole design intent is large, readable type — the fix is
essentially never "shrink the font." Instead split the slide: move the later blocks
(the ones revealed at higher `step` numbers) into a new slide object right after the
original in `slides-data.js`. Re-check afterward; a split occasionally needs a
second, smaller split if the content was very dense (it did, more than once, while
building this deck).

**Meta-bar collision**: usually a symptom of the same overflow-adjacent crowding —
splitting the slide (as above) resolves it, since it's the same underlying "too much
content, not enough vertical room" problem.

**Sparse fill**: resist the urge to just add filler text — that fights the "structure
is information, don't decorate" principle this deck otherwise follows. In order of
what to actually check:
1. Is there a CSS bug capping width for a whole *class* of slides (the `ch`-unit
   trap above is exactly this — one bad rule looked like dozens of individually
   sparse slides)? Fix the rule, re-run the check across the whole deck, and you'll
   likely clear many flagged slides at once.
2. Does this slide have (or deserve) a real chart, diagram, or image? If the topic
   has a natural visual (a distribution, a comparison, a historical diagram), add a
   `visual` field to the slide object (see existing slides in `slides-data.js` for
   the `image`, `doors`, `causal`, and `image-sequence` visual kinds already built
   into `assets/deck/deck.js`) rather than inventing decoration.
3. If the slide is genuinely a short, single-idea beat (an ask, a one-line
   transition) with nothing real to add, that's fine — but it should read as a
   deliberate pause, not an accident. Vertically centering non-visual content
   slides (already the default in `deck.css`) does most of this work; a
   consistently short slide doesn't need to be padded out.

**Small-for-space**: never fix this by adding content (same anti-filler principle
as sparse fill). The real fix is making the text that's already there bigger,
since the whole point of the complaint this check encodes is "the text is too
small to read even though there's room" — not "there isn't enough text." This
deck's `deck.css` has scoped rules for exactly this: `.body-stack > .ask:only-child
p`, `.body-stack > .plaque:only-child .year`/`.plaque-text`, and
`.body-stack:not(:has(> :not(p))) p` all bump the font size specifically when that
block type is the *entire* content of the slide (using `:only-child` / `:has()` so
slides that mix an ask/plaque with other blocks keep the normal, smaller size —
those aren't short-for-space, they're just one part of a fuller slide). If a new
flagged slide doesn't match one of these existing patterns, extend the pattern
(a new `:only-child`/`:has()` rule) rather than bumping a block type's base size
globally — a global bump risks pushing an already-dense multi-block slide (a
4-plaque timeline, say) into overflow.

## Always re-verify after fixing

Never report a fix as done without re-running `node check.js` and confirming the
specific slide(s) you touched no longer appear in the issue list (and that you
didn't introduce a new issue on a neighboring slide by shifting content into it).
"I split the slide, that should fix it" is a prediction, not a result — the script
takes a few seconds to run, there's no reason to skip the receipt.

## After the automated check is clean: one human-eyeball pass

Geometry checks don't see everything — a chart that rendered with the wrong data,
or text that's technically within bounds but has an awkward line break, won't trip
any of the three checks above. Once `node check.js` reports 0 issues, take a small
handful of representative screenshots for a final look, not a screenshot of every
slide:

```bash
google-chrome --headless --disable-gpu --no-sandbox --window-size=1600,900 \
  --screenshot=/tmp/shot.png "file://$(pwd)/lessons/01-.../slides.html#<N>"
```

Pick: the title slide, one divider, one content slide with a chart, and one
text-only content slide — enough to sanity-check each slide *type* is rendering as
intended, without burning context re-reading dozens of near-identical screenshots.
