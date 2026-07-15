// @vitest-environment jsdom
import { afterEach, describe, expect, test } from "vite-plus/test";

import { readRectCache } from "./rectRegistry.js";

describe("readRectCache", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("prefers an inner resolving card rect over a duplicate outer entity wrapper", () => {
    document.body.innerHTML = `
      <main class="motion-animation-stage">
        <section data-sim-zone-id="resolution">
          <div data-testid="resolving-program" data-sim-entity-id="program-1">
            <span>Resolving</span>
            <div data-testid="resolving-program-card" data-sim-entity-id="program-1"></div>
          </div>
        </section>
      </main>
    `;
    setRect('[data-testid="resolving-program"]', {
      left: 80,
      top: 40,
      width: 220,
      height: 260,
    });
    setRect('[data-testid="resolving-program-card"]', {
      left: 120,
      top: 72,
      width: 96,
      height: 134,
    });
    setRect('[data-sim-zone-id="resolution"]', {
      left: 20,
      top: 20,
      width: 320,
      height: 320,
    });

    const cache = readRectCache();

    expect(cache.byEntityId.get("program-1")).toEqual({
      left: 120,
      top: 72,
      width: 96,
      height: 134,
    });
    expect(cache.byZoneEntityId.get("resolution::program-1")).toEqual({
      left: 120,
      top: 72,
      width: 96,
      height: 134,
    });
  });

  test("uses a card-sized child inside a larger field-unit wrapper", () => {
    document.body.innerHTML = `
      <main class="motion-animation-stage">
        <section data-sim-zone-id="field">
          <div data-testid="field-unit" data-sim-entity-id="unit-1">
            <div data-testid="card"></div>
          </div>
        </section>
      </main>
    `;
    setRect('[data-testid="field-unit"]', {
      left: 30,
      top: 50,
      width: 180,
      height: 320,
    });
    setRect('[data-testid="card"]', {
      left: 58,
      top: 66,
      width: 104,
      height: 146,
    });
    setRect('[data-sim-zone-id="field"]', {
      left: 0,
      top: 0,
      width: 260,
      height: 360,
    });

    const cache = readRectCache();

    expect(cache.byEntityId.get("unit-1")).toEqual({
      left: 58,
      top: 66,
      width: 104,
      height: 146,
    });
    expect(cache.byZoneEntityId.get("field::unit-1")).toEqual({
      left: 58,
      top: 66,
      width: 104,
      height: 146,
    });
  });

  test("falls back to the entity wrapper when there is no card visual child", () => {
    document.body.innerHTML = `
      <main class="motion-animation-stage">
        <section data-sim-zone-id="tokens">
          <div data-sim-entity-id="token-1"></div>
        </section>
      </main>
    `;
    setRect('[data-sim-entity-id="token-1"]', {
      left: 16,
      top: 24,
      width: 48,
      height: 48,
    });
    setRect('[data-sim-zone-id="tokens"]', {
      left: 0,
      top: 0,
      width: 96,
      height: 96,
    });

    const cache = readRectCache();

    expect(cache.byEntityId.get("token-1")).toEqual({
      left: 16,
      top: 24,
      width: 48,
      height: 48,
    });
    expect(cache.byZoneEntityId.get("tokens::token-1")).toEqual({
      left: 16,
      top: 24,
      width: 48,
      height: 48,
    });
  });
});

function setRect(
  selector: string,
  rect: { left: number; top: number; width: number; height: number },
) {
  const element = document.querySelector<HTMLElement>(selector);
  expect(element).toBeTruthy();
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      ...rect,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      x: rect.left,
      y: rect.top,
      toJSON: () => ({}),
    }),
  });
}
