import { fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vite-plus/test";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { CYBERPUNK_P1 } from "./cyberpunk-simulator-pom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "./render-cyberpunk-simulator";

/**
 * Regression for the 2026-10-02 report: after the rival paid a GO SOLO Legend
 * onto the field, Carnage At The Colosseum's defeat target could not be picked.
 * CR 4.2.1 — a Legend on the field is also a Unit, so the board must mark it
 * selectable while the defeat-target prompt is pending and the click must
 * resolve the Program.
 */
describe("Carnage targets a fielded Go-Solo Legend", () => {
  test("the fielded legend is selectable and resolves the defeat", async () => {
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "regressionCarnageTargetsFieldedLegend",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      // The legend renders in the opponent's FIELD row (its engine zone), not
      // the legend rack, and is the only actionable opponent card.
      const fieldCards = Array.from(
        view.container.querySelectorAll<HTMLElement>(
          '[data-testid="field-zone"][data-side="opponent"] [data-testid="field-unit"]',
        ),
      );
      expect(
        fieldCards.length,
        `expected exactly the Go-Solo legend on the rival field, got ${fieldCards.length}`,
      ).toBe(1);
      const legendCard = fieldCards[0]!.querySelector<HTMLElement>('[data-testid="card"]');
      expect(legendCard, "expected the fielded legend card to render").not.toBeNull();
      expect(legendCard!.dataset.actionable).toBe("true");

      fireEvent.click(legendCard!);

      // The click must DEFEAT the legend, not merely clear the prompt: the
      // engine-level removal is locked at carnage-at-the-colosseum.test.ts, so
      // assert the board half — the rival field row empties out.
      await waitFor(() => {
        const remaining = view.container.querySelectorAll<HTMLElement>(
          '[data-testid="field-zone"][data-side="opponent"] [data-testid="field-unit"]',
        );
        expect(remaining.length, "the defeated legend still renders on the rival field row").toBe(
          0,
        );
      });
      await waitFor(async () => {
        await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      });
    } finally {
      view.unmount();
    }
  });

  test("the source-card target prompt defaults to slim and expands via the header toggle", async () => {
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "regressionCarnageTargetsFieldedLegend",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      // Desktop source-card prompts default to the compact single-row layout;
      // the header toggle flips the banner to the stacked presentation.
      const banner = await waitFor(() => {
        const el = document.body.querySelector<HTMLElement>(
          '[data-testid="prompt-banner"][data-state="select-target"]',
        );
        if (!el) throw new Error("target prompt banner did not render");
        return el;
      });
      expect(banner.className).toContain("bannerTargetSlim");
      const toggle = banner.querySelector<HTMLButtonElement>(
        '[data-testid="prompt-banner-toggle-expanded"]',
      );
      expect(toggle, "expand toggle missing from the source-card target prompt").not.toBeNull();
      expect(toggle!.getAttribute("aria-pressed")).toBe("false");
      expect(toggle!.getAttribute("aria-label")).toBe("Expanded prompt");

      fireEvent.click(toggle!);

      await waitFor(() => {
        const expanded = document.body.querySelector<HTMLElement>(
          '[data-testid="prompt-banner"][data-state="select-target"]',
        );
        expect(expanded, "banner left the DOM during expansion").not.toBeNull();
        expect(expanded!.className).not.toContain("bannerTargetSlim");
        expect(
          expanded!
            .querySelector<HTMLButtonElement>('[data-testid="prompt-banner-toggle-expanded"]')!
            .getAttribute("aria-pressed"),
        ).toBe("true");
      });
    } finally {
      view.unmount();
    }
  });
});
