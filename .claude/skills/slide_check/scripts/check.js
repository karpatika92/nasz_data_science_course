#!/usr/bin/env node
/**
 * slide_check — geometry diagnostics for this repo's custom JS slide-deck engine
 * (assets/deck/deck.js + deck.css). Drives the system-installed Google Chrome via
 * playwright-core (no Playwright browser download needed — `channel: "chrome"`
 * points at the real `google-chrome` binary already on this machine).
 *
 * Usage:
 *   node check.js                          # checks every lessons/<name>/slides.html
 *   node check.js path/to/slides.html      # checks one deck
 *   node check.js --screens <dir>          # also saves a screenshot per flagged slide
 *
 * Exit code is 1 if any slide has an issue, 0 if everything is clean — use this in
 * scripts/CI, but the point of this tool is really the printed report: it tells you
 * exactly which slide and which check failed, so you go fix that slide, not "the deck".
 */
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright-core");

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..", "..");

function findDecks() {
  const lessonsDir = path.join(REPO_ROOT, "lessons");
  if (!fs.existsSync(lessonsDir)) return [];
  return fs
    .readdirSync(lessonsDir)
    .map((d) => path.join(lessonsDir, d, "slides.html"))
    .filter((p) => fs.existsSync(p));
}

async function checkDeck(browser, filePath, screensDir) {
  const url = "file://" + path.resolve(filePath);
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(url);
  // Google Fonts loads async (@import in deck.css) — give it a beat so text
  // metrics (and therefore layout/overflow) reflect the real fonts, not a
  // fallback face that would make every measurement here a little bit wrong.
  await page.waitForTimeout(400);

  const total = await page.evaluate(() => document.querySelectorAll(".slide").length);
  const issues = [];

  for (let i = 0; i < total; i++) {
    const info = await page.evaluate((idx) => {
      const slide = document.querySelectorAll(".slide")[idx];
      // Force this slide into the same fully-revealed state a presenter
      // reaches by the end of clicking through it — that's the state that
      // actually has to fit, not the (usually shorter) first-fragment state.
      slide.classList.add("is-active");
      slide.querySelectorAll("[data-step]").forEach((n) => n.classList.add("is-revealed"));

      const title = slide.querySelector(".headline")?.textContent || "(no title)";
      const type = slide.className.match(/slide--(\w+)/)?.[1] || "";
      const hasVisual = slide.classList.contains("has-visual");

      // CHECK 1 — overflow. .slide has overflow-y:auto, so if content doesn't
      // fit, the browser silently adds a scrollbar instead of erroring — easy
      // to miss just by reading the source, which is exactly why this needs a
      // real rendered measurement rather than eyeballing the data file.
      const overflowPx = slide.scrollHeight - slide.clientHeight;

      // CHECK 2 — meta-bar collision. .meta-bar is position:absolute at the
      // top, floating independently of the flow. A slide with enough content
      // to push its own top edge up (e.g. after switching non-visual slides
      // to vertical centering) can end up rendering its eyebrow UNDER the
      // meta-bar without ever triggering the overflow check above.
      const meta = slide.querySelector(".meta-bar");
      const eyebrow = slide.querySelector(".eyebrow") || slide.querySelector(".headline");
      const metaGap = meta && eyebrow
        ? eyebrow.getBoundingClientRect().top - meta.getBoundingClientRect().bottom
        : null;

      // CHECK 3 — horizontal fill. Only meaningful for "content" slides —
      // dividers and the title slide are deliberately sparse (big numeral,
      // short line) and shouldn't be flagged for it.
      //
      // IMPORTANT: search the whole slide, not just .content-col. On a
      // has-visual slide, .slide-visual is a SIBLING of .content-col, not a
      // descendant — scoping the query to .content-col silently drops the
      // entire right-hand image/diagram from the measurement and produces a
      // false "this slide is sparse" reading even when it looks fine.
      let fillPct = null;
      if (type === "content") {
        const candidates = slide.querySelectorAll(".body-stack, .columns, .slide-visual");
        let maxRight = 0;
        candidates.forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || parseFloat(cs.opacity) === 0) return;
          const r = el.getBoundingClientRect();
          if (r.width > 0) maxRight = Math.max(maxRight, r.right);
        });
        fillPct = Math.round((maxRight / 1600) * 100);
      }

      // CHECK 4 — content area vs. available canvas. Check 3 only asks "does
      // content reach far enough right"; it says nothing about whether the
      // content is rendered at a size that actually USES the space it has,
      // vertically as well as horizontally. Font sizes here are set with
      // viewport-relative clamp()s, so the same slide always renders the same
      // type size regardless of how little text is on it — a one-sentence
      // slide, now vertically centered, still renders that sentence at normal
      // body size, which reads as "too small" against a mostly-empty 1600x900
      // canvas even though nothing is technically broken. This check catches
      // that: it's not about any single element's font-size, it's about how
      // much of the available canvas the content's bounding box actually
      // covers. Only content-type slides are checked (dividers/title are
      // deliberately sparse — a giant outlined numeral is the whole point).
      let areaPct = null;
      if (type === "content") {
        const candidates = slide.querySelectorAll(
          ".eyebrow, .headline, .kicker, .body-stack, .columns, .slide-visual"
        );
        let left = Infinity, top = Infinity, right = 0, bottom = 0;
        candidates.forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || parseFloat(cs.opacity) === 0) return;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          left = Math.min(left, r.left);
          top = Math.min(top, r.top);
          right = Math.max(right, r.right);
          bottom = Math.max(bottom, r.bottom);
        });
        if (right > left && bottom > top) {
          const contentArea = (right - left) * (bottom - top);
          const availableArea = 1600 * 900; // full slide canvas, incl. its own padding
          areaPct = Math.round((contentArea / availableArea) * 100);
        }
      }

      slide.classList.remove("is-active");
      return { index: idx + 1, title, type, hasVisual, overflowPx, metaGap, fillPct, areaPct };
    }, i);

    const flags = [];
    if (info.overflowPx > 4) flags.push(`overflow +${info.overflowPx}px`);
    if (info.metaGap !== null && info.metaGap < 4) {
      flags.push(`meta-bar collision (gap ${Math.round(info.metaGap)}px)`);
    }
    if (info.type === "content" && info.fillPct !== null && info.fillPct < 65) {
      flags.push(`sparse (content only reaches ${info.fillPct}% of slide width)`);
    }
    if (info.type === "content" && info.areaPct !== null && info.areaPct < 30) {
      flags.push(`small-for-space (content bounding box covers only ${info.areaPct}% of the slide canvas — text may read as too small even if nothing overflows)`);
    }

    if (flags.length) {
      issues.push({ ...info, flags });
      if (screensDir) {
        // deck.js only reads location.hash inside its DOMContentLoaded handler
        // (init()), so navigating the SAME already-loaded page to `${url}#N`
        // is a fragment-only same-document navigation in Chromium -- it never
        // re-fires DOMContentLoaded, so the deck's displayed slide doesn't
        // change and this would silently screenshot whatever slide/scroll
        // state the main measurement loop happened to leave behind. A fresh
        // page forces a real initial load, so the hash is actually honored.
        const shotPage = await browser.newPage({ viewport: { width: 1600, height: 900 } });
        await shotPage.goto(`${url}#${info.index}`);
        await shotPage.waitForTimeout(400);
        await shotPage.evaluate((idx) => {
          const slide = document.querySelectorAll(".slide")[idx - 1];
          slide.querySelectorAll("[data-step]").forEach((n) => n.classList.add("is-revealed"));
        }, info.index);
        // .is-revealed drives an opacity transition (deck.css) -- give it a
        // beat to finish, or the screenshot catches fragments mid-fade.
        await shotPage.waitForTimeout(400);
        await shotPage.screenshot({ path: path.join(screensDir, `${path.basename(path.dirname(filePath))}-issue-${info.index}.png`) });
        await shotPage.close();
      }
    }
  }

  await page.close();
  return { url, total, issues };
}

async function main() {
  const args = process.argv.slice(2);
  const screensIdx = args.indexOf("--screens");
  const screensDir = screensIdx !== -1 ? args[screensIdx + 1] : null;
  const explicitPath = args.find((a) => a.endsWith(".html"));

  if (screensDir) fs.mkdirSync(screensDir, { recursive: true });

  const decks = explicitPath ? [explicitPath] : findDecks();
  if (decks.length === 0) {
    console.error("No slides.html found (looked under lessons/*/slides.html). Pass a path explicitly.");
    process.exit(2);
  }

  const browser = await chromium.launch({ channel: "chrome" });
  let anyIssues = false;

  for (const deck of decks) {
    const result = await checkDeck(browser, deck, screensDir);
    console.log(`\n${path.relative(REPO_ROOT, deck)}`);
    console.log(`  ${result.total} slides, ${result.issues.length} with issues`);
    result.issues.forEach((r) => {
      console.log(`  #${r.index} "${r.title}" — ${r.flags.join("; ")}`);
    });
    if (result.issues.length) anyIssues = true;
  }

  await browser.close();
  process.exit(anyIssues ? 1 : 0);
}

main();
