// @vitest-environment jsdom

import { waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";

import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";

const originalMatchMedia = window.matchMedia;

window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia;

describe("Cyberpunk desktop mid-column identity row", () => {
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  test("keeps Legends and Eddies in one identity row beside Field, on both seats", async () => {
    ensureJsdomAnimationSupport();
    globalThis.ResizeObserver ??= class ResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "gameStart",
      layout: "desktop",
    });

    try {
      const boards = await waitFor(() => {
        const found = view.container.querySelectorAll<HTMLElement>('[data-testid="game-board"]');
        if (found.length < 2) {
          throw new Error("Expected both desktop seats.");
        }
        return found;
      });

      for (const board of boards) {
        const identity = requiredElement<HTMLElement>(board, '[data-testid="mid-identity"]');
        const field = requiredElement<HTMLElement>(board, '[data-testid="field-zone"]');
        const legends = requiredElement<HTMLElement>(identity, '[data-testid="legends-zone"]');
        const eddies = requiredElement<HTMLElement>(identity, '[data-testid="eddies-zone"]');

        expect(identity.contains(legends)).toBe(true);
        expect(identity.contains(eddies)).toBe(true);
        expect(identity.contains(field)).toBe(false);
        expect(identity.parentElement).toBe(field.parentElement);
        expect(identity.getAttribute("data-legend-gear-count")).toBe("0");
      }
    } finally {
      view.unmount();
    }
  });

  test("keeps the empty Eddie reminder while the drop slot fills the identity leftover", async () => {
    ensureJsdomAnimationSupport();
    globalThis.ResizeObserver ??= class ResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "gameStart",
      layout: "desktop",
    });

    try {
      const board = await waitFor(() => {
        const found = [
          ...view.container.querySelectorAll<HTMLElement>('[data-testid="game-board"]'),
        ];
        const player = found.find((node) => node.dataset.side === "player");
        if (!player) {
          throw new Error("Expected the player desktop seat.");
        }
        return player;
      });

      const identity = requiredElement<HTMLElement>(board, '[data-testid="mid-identity"]');
      const dropSlot = requiredElement<HTMLElement>(identity, '[data-testid="eddies-drop-slot"]');
      const eddies = requiredElement<HTMLElement>(dropSlot, '[data-testid="eddies-zone"]');
      const emptyReminder = requiredElement<HTMLElement>(eddies, ".empty-zone");

      expect(dropSlot.dataset.dropZone).toBe("p-eddies");
      expect(dropSlot.contains(eddies)).toBe(true);
      expect(eddies.contains(emptyReminder)).toBe(true);
      expect(emptyReminder.textContent).toMatch(/Eddies/i);
      expect(dropSlot.parentElement).toBe(identity);
    } finally {
      view.unmount();
    }
  });
});

function requiredElement<T extends Element>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Expected element matching ${selector}.`);
  }
  return element;
}
