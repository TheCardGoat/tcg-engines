// @vitest-environment jsdom

import { fireEvent, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";
import { resetChoiceModalStateForTests } from "./choiceModalState";

describe("deck search choice window", () => {
  afterEach(() => resetChoiceModalStateForTests());

  test("restores the same pending choice after minimizing it", async () => {
    ensureJsdomAnimationSupport();
    globalThis.ResizeObserver ??= class ResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    };

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "deckSearchThreeMouthsPrompt",
      boardProps: { initialAi: { player: null, opponent: null } },
    });
    try {
      const sheet = await waitFor(() => {
        const element = document.body.querySelector<HTMLElement>(
          '[data-testid="choice-modal-sheet"]',
        );
        if (!element) throw new Error("Deck search choice did not open.");
        return element;
      });
      expect(sheet.textContent).toContain("Choose cards for your hand");
      expect(document.body.querySelectorAll('[data-testid="search-deck-card"]')).toHaveLength(3);

      fireEvent.click(
        sheet.querySelector<HTMLElement>('[aria-label="Select Tetratronic Rippler"]')!,
      );
      expect(sheet.querySelector('[aria-label="Selected Tetratronic Rippler"]')).not.toBeNull();

      fireEvent.click(
        sheet.querySelector<HTMLButtonElement>('[data-testid="choice-modal-minimize"]')!,
      );
      await waitFor(() => {
        expect(getComputedStyle(sheet.parentElement!).display).toBe("none");
        expect(view.container.querySelector('[data-testid="choice-modal-restore"]')).not.toBeNull();
      });

      fireEvent.click(
        view.container.querySelector<HTMLButtonElement>('[data-testid="choice-modal-restore"]')!,
      );
      await waitFor(() => {
        expect(getComputedStyle(sheet.parentElement!).display).not.toBe("none");
        expect(
          document.body.querySelector('[data-testid="choice-modal-sheet"]')?.textContent,
        ).toContain("Choose cards for your hand");
        expect(document.body.querySelectorAll('[data-testid="search-deck-card"]')).toHaveLength(3);
        expect(
          document.body.querySelector('[aria-label="Selected Tetratronic Rippler"]'),
        ).not.toBeNull();
      });
    } finally {
      view.unmount();
    }
  });
});
