// @vitest-environment jsdom
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";
import { CYBERPUNK_P1 } from "../../cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

describe("Pepe ready prompt", () => {
  test.each([0, 1, 2])("readies exactly %i selected Legends", async (count) => {
    ensureJsdomAnimationSupport();
    globalThis.ResizeObserver ??= class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    window.matchMedia ??= (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    });
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "pepeReadyLegendsPrompt",
      initialHumanSide: "player",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await waitFor(() =>
        expect(
          screen.getByRole("heading", { name: "Ready up to 2 of your spent MERC Legends" }),
        ).toBeTruthy(),
      );
      expect(screen.getByTestId("prompt-target-confirm").hasAttribute("disabled")).toBe(true);
      const textToggle = screen.getByTestId("prompt-card-text-toggle");
      expect(textToggle.getAttribute("aria-expanded")).toBe("false");
      expect(screen.queryByTestId("prompt-banner-effect")).toBeNull();
      fireEvent.click(textToggle);
      expect(textToggle.getAttribute("aria-expanded")).toBe("true");
      expect(textToggle.getAttribute("aria-label")).toContain("Hide");
      expect(screen.getByTestId("prompt-banner-effect").textContent).toContain("value-pair");
      fireEvent.click(textToggle);
      expect(textToggle.getAttribute("aria-expanded")).toBe("false");
      expect(screen.queryByTestId("prompt-banner-effect")).toBeNull();
      for (const name of [
        "Select V: Streetkid",
        "Select Alt Cunningham: Soulkiller Architect",
      ].slice(0, count)) {
        fireEvent.click(screen.getByLabelText(name, { exact: true }));
      }
      if (count < 2) {
        expect(screen.getByTestId("prompt-target-selection-count").textContent).toBe(
          `${count} of 2 Legends selected`,
        );
        fireEvent.click(
          screen.getByRole("button", { name: count === 0 ? "Ready none" : "Ready 1 Legend" }),
        );
      }
      await waitFor(async () => {
        const legends = await pom.getCardsInZone("legendArea", CYBERPUNK_P1);
        expect(legends.filter((card) => !card.spent)).toHaveLength(count);
        expect(screen.queryByTestId("prompt-target-confirm")).toBeNull();
      });
    } finally {
      view.unmount();
    }
  });
});
