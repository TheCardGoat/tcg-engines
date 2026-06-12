// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";

import { measureRect } from "./AttackTargetingOverlayContainer.tsx";

/**
 * Regression for the attack-arrow anchor. `data-card-id` is rendered on
 * multiple surfaces — CardFace on the board, CardHoverPreview
 * (aria-hidden), and Comms-log CardLinks (`<button>`). A naive
 * `document.querySelector` returns the first in DOM order, which is the
 * log link (sidebar renders before the battle area), so the arrow and
 * `DEAL N` badge ended up anchored to the log entry instead of the unit.
 * `measureRect` must skip log / hover-preview / button matches.
 */
describe("AttackTargetingOverlayContainer · measureRect", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  function mountNode(html: string, rect: Partial<DOMRect>): HTMLElement {
    const wrap = document.createElement("div");
    wrap.innerHTML = html;
    const el = wrap.firstElementChild as HTMLElement;
    document.body.appendChild(el);
    el.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
        ...rect,
      }) as DOMRect;
    return el;
  }

  it("prefers the battle-area CardFace over a same-id Comms-log CardLink", () => {
    // Sidebar (log) renders first in DOM order — same as the real app.
    mountNode(`<div role="log"><button data-card-id="unit_1">Demi Trainer</button></div>`, {
      left: 40,
      top: 600,
      width: 80,
      height: 20,
      right: 120,
      bottom: 620,
    });
    mountNode(`<div data-card-id="unit_1">board</div>`, {
      left: 900,
      top: 500,
      width: 120,
      height: 180,
      right: 1020,
      bottom: 680,
    });

    const rect = measureRect("unit_1");
    expect(rect).not.toBeNull();
    // Must match the board rect, not the log button.
    expect(rect?.left).toBe(900);
    expect(rect?.width).toBe(120);
  });

  it("skips aria-hidden CardHoverPreview matches", () => {
    mountNode(`<div aria-hidden="true"><div data-card-id="unit_1">preview</div></div>`, {
      left: 10,
      top: 10,
      width: 10,
      height: 10,
      right: 20,
      bottom: 20,
    });
    mountNode(`<div data-card-id="unit_1">board</div>`, {
      left: 300,
      top: 200,
      width: 120,
      height: 180,
      right: 420,
      bottom: 380,
    });

    expect(measureRect("unit_1")?.left).toBe(300);
  });

  it("returns null when the only matches are log / hover / button", () => {
    mountNode(`<div role="log"><button data-card-id="unit_1">x</button></div>`, {
      left: 1,
      top: 1,
      width: 1,
      height: 1,
    });
    expect(measureRect("unit_1")).toBeNull();
  });

  it("escapes ids that contain selector metacharacters", () => {
    mountNode(`<div data-card-id='a"b\\c'>board</div>`, {
      left: 50,
      top: 60,
      width: 70,
      height: 80,
      right: 120,
      bottom: 140,
    });
    expect(measureRect('a"b\\c')?.left).toBe(50);
  });
});
