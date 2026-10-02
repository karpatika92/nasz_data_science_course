/* ============================================================
   Deck engine — betölt egy globális SLIDES tömböt (lásd
   slides-data.js egy adott órában), és renderel + navigál.
   Nincs külső könyvtár — kevés mozgó rész, könnyebb stílusban
   tartani végig a féléven.
   ============================================================ */

(function () {
  "use strict";

  const LESSON_LABEL = window.LESSON_LABEL || "";
  const slides = window.SLIDES || [];

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function renderBlock(block) {
    const wrap = el("div");
    if (block.step) wrap.dataset.step = String(block.step);

    switch (block.kind) {
      case "text": {
        const p = el("p", "", block.html);
        if (block.step) p.dataset.step = String(block.step);
        return p;
      }

      case "list": {
        const ul = el("ul");
        if (block.step) ul.dataset.step = String(block.step);
        block.items.forEach((item) => ul.appendChild(el("li", "", item)));
        return ul;
      }

      case "ask": {
        const box = el("div", "ask");
        if (block.step) box.dataset.step = String(block.step);
        box.appendChild(el("p", "ask-label", block.label || "KÉRDÉS"));
        box.appendChild(el("p", "", block.html));
        return box;
      }

      case "plaque": {
        const box = el("div", "plaque");
        if (block.step) box.dataset.step = String(block.step);
        box.appendChild(el("div", "year", block.year));
        box.appendChild(el("div", "plaque-text", block.html));
        return box;
      }

      case "tension": {
        const box = el("div", "tension");
        if (block.step) box.dataset.step = String(block.step);
        box.appendChild(el("p", "tension-label", block.label || "VITATOTT PONT"));
        box.appendChild(el("div", "", block.html));
        return box;
      }

      case "columns": {
        const box = el("div", "columns");
        if (block.step) box.dataset.step = String(block.step);
        block.columns.forEach((col) => {
          const c = el("div", "column");
          c.appendChild(el("h3", "", col.heading));
          c.appendChild(el("div", "", col.html));
          box.appendChild(c);
        });
        return box;
      }

      case "figure": {
        const fig = el("figure", "figure");
        if (block.step) fig.dataset.step = String(block.step);
        const img = el("img");
        img.src = block.src;
        img.alt = block.alt || "";
        fig.appendChild(img);
        if (block.caption) fig.appendChild(el("figcaption", "", block.caption));
        return fig;
      }

      default:
        return el("div", "", "");
    }
  }

  function renderVisual(visual) {
    const wrap = el("div", "slide-visual");
    if (visual.step) wrap.dataset.step = String(visual.step);

    if (visual.kind === "doors") {
      const row = el("div", "doors");
      [1, 2, 3].forEach((n) => {
        const isOpen = visual.openIndex === n;
        const door = el("div", "door" + (isOpen ? " door--open" : ""));
        door.appendChild(el("div", "door-label", isOpen ? "ÜRES" : String(n)));
        row.appendChild(door);
      });
      wrap.appendChild(row);
      return wrap;
    }

    if (visual.kind === "causal") {
      const box = el("div", "causal-diagram");

      const direct = el("div", "causal-panel");
      direct.appendChild(el("div", "causal-label", "Közvetlen ok"));
      const directRow = el("div", "causal-row");
      directRow.appendChild(el("div", "causal-node", "A"));
      directRow.appendChild(el("div", "causal-arrow", "→"));
      directRow.appendChild(el("div", "causal-node", "B"));
      direct.appendChild(directRow);
      box.appendChild(direct);

      const reverse = el("div", "causal-panel");
      reverse.appendChild(el("div", "causal-label", "Fordított ok"));
      const reverseRow = el("div", "causal-row");
      reverseRow.appendChild(el("div", "causal-node", "B"));
      reverseRow.appendChild(el("div", "causal-arrow", "→"));
      reverseRow.appendChild(el("div", "causal-node", "A"));
      reverse.appendChild(reverseRow);
      box.appendChild(reverse);

      const confound = el("div", "causal-panel");
      confound.appendChild(el("div", "causal-label", "Közös ok (confounder)"));
      confound.appendChild(el("div", "causal-node causal-node--top", "C"));
      confound.appendChild(el("div", "causal-arrows-fan", "↙&nbsp;&nbsp;&nbsp;&nbsp;↘"));
      const confoundRow = el("div", "causal-row");
      confoundRow.appendChild(el("div", "causal-node", "A"));
      confoundRow.appendChild(el("div", "", ""));
      confoundRow.appendChild(el("div", "causal-node", "B"));
      confound.appendChild(confoundRow);
      box.appendChild(confound);

      wrap.appendChild(box);
      return wrap;
    }

    if (visual.kind === "image") {
      const fig = el("figure", "figure figure--visual");
      const img = el("img");
      img.src = visual.src;
      img.alt = visual.alt || "";
      fig.appendChild(img);
      if (visual.caption) fig.appendChild(el("figcaption", "", visual.caption));
      wrap.appendChild(fig);
      return wrap;
    }

    if (visual.kind === "image-sequence") {
      const group = el("div", "image-sequence");
      visual.items.forEach((item) => {
        const fig = el("figure", "figure figure--visual image-sequence-item");
        fig.dataset.step = String(item.step || 0);
        const img = el("img");
        img.src = item.src;
        img.alt = item.alt || "";
        fig.appendChild(img);
        if (item.caption) fig.appendChild(el("figcaption", "", item.caption));
        group.appendChild(fig);
      });
      wrap.appendChild(group);
      return wrap;
    }

    return wrap;
  }

  function buildSlide(data, index, total) {
    const visualClass = data.visual ? " has-visual" + (data.visualLayout === "stack" ? " has-visual--stack" : "") : "";
    const slide = el("section", "slide slide--" + data.type + visualClass);
    slide.dataset.index = String(index);

    const meta = el("div", "meta-bar");
    meta.appendChild(el("span", "", `<strong>${LESSON_LABEL}</strong>`));
    meta.appendChild(el("span", "", `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`));
    slide.appendChild(meta);

    if (data.type === "divider" && data.index) {
      slide.appendChild(el("div", "slide-number-huge", data.index));
    }

    const target = data.visual ? el("div", "content-col") : slide;

    if (data.eyebrow) target.appendChild(el("p", "eyebrow", data.eyebrow));

    if (data.title) {
      const tag = data.type === "content" ? "h2" : "h1";
      target.appendChild(el(tag, "headline", data.title));
    }

    if (data.kicker) target.appendChild(el("p", "kicker", data.kicker));

    if (data.blocks && data.blocks.length) {
      const stack = el("div", "body-stack");
      data.blocks.forEach((block) => stack.appendChild(renderBlock(block)));
      target.appendChild(stack);
    }

    if (data.note) {
      target.appendChild(el("div", "note", data.note));
    }

    if (data.visual) {
      slide.appendChild(target);
      slide.appendChild(renderVisual(data.visual));
    }

    return slide;
  }

  function maxStep(slideEl) {
    let max = 0;
    slideEl.querySelectorAll("[data-step]").forEach((n) => {
      max = Math.max(max, Number(n.dataset.step));
    });
    return max;
  }

  function init() {
    const deck = document.getElementById("deck");
    const total = slides.length;

    slides.forEach((data, i) => deck.appendChild(buildSlide(data, i, total)));

    const slideEls = Array.from(deck.querySelectorAll(".slide"));
    const progressFill = document.getElementById("progress-fill");

    let current = 0;
    let step = 0;

    function fromHash() {
      const n = parseInt(location.hash.replace("#", ""), 10);
      return Number.isInteger(n) && n >= 1 && n <= total ? n - 1 : 0;
    }

    function revealSteps(slideEl, upTo) {
      slideEl.querySelectorAll("[data-step]").forEach((n) => {
        n.classList.toggle("is-revealed", Number(n.dataset.step) <= upTo);
      });

      // image-sequence: nem egymásra halmozódik, hanem FELVÁLTJA egymást --
      // csak a legutóbb feloldott kép látszik, a korábbiak eltűnnek.
      slideEl.querySelectorAll(".image-sequence").forEach((group) => {
        const items = Array.from(group.querySelectorAll(".image-sequence-item"));
        let latest = null;
        items.forEach((item) => {
          const step = Number(item.dataset.step);
          if (step <= upTo && (latest === null || step > Number(latest.dataset.step))) {
            latest = item;
          }
        });
        items.forEach((item) => item.classList.toggle("is-current", item === latest));
      });
    }

    function render() {
      slideEls.forEach((s, i) => s.classList.toggle("is-active", i === current));
      const activeEl = slideEls[current];
      revealSteps(activeEl, step);
      progressFill.style.width = `${((current + 1) / total) * 100}%`;
      history.replaceState(null, "", `#${current + 1}`);
    }

    function next() {
      const activeEl = slideEls[current];
      const top = maxStep(activeEl);
      if (step < top) {
        step += 1;
      } else if (current < total - 1) {
        current += 1;
        step = 0;
      }
      render();
    }

    function prev() {
      if (step > 0) {
        step -= 1;
      } else if (current > 0) {
        current -= 1;
        step = maxStep(slideEls[current]);
      }
      render();
    }

    function goTo(index) {
      current = Math.max(0, Math.min(total - 1, index));
      step = 0;
      render();
    }

    document.getElementById("nav-next").addEventListener("click", next);
    document.getElementById("nav-prev").addEventListener("click", prev);
    document.querySelector(".nav-zone--next").addEventListener("click", next);
    document.querySelector(".nav-zone--prev").addEventListener("click", prev);

    window.addEventListener("keydown", (e) => {
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        goTo(0);
      } else if (e.key === "End") {
        goTo(total - 1);
      }
    });

    current = fromHash();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
