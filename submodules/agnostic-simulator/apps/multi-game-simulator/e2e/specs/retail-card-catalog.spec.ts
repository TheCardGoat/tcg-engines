import { test, expect } from "@playwright/test";
import { createPlaywrightCyberpunkSimulatorPom } from "@e2e/poms/CyberpunkPlaywrightHarnessClient";
import {
  CURRENT_CARD_QA_EXCLUDED_SET_CODES,
  currentCardQaCards,
  currentCardQaCardsByType,
  currentCardQaCases,
  currentCardQaScenarioIds,
} from "../../src/games/cyberpunk/engine/fixtures/scenarios/current-card-qa";

test.describe.configure({ mode: "serial" });

const expectedCardsByScenarioId = new Map(
  currentCardQaScenarioIds.map((scenarioId) => [
    scenarioId,
    currentCardQaCases.filter((entry) => entry.scenarioIds.includes(scenarioId)),
  ]),
);

test.describe("current-card QA cases", () => {
  test("partition all current non-alpha, non-spoiler cards into authored scenario cases", () => {
    expect(currentCardQaCards).toHaveLength(88);
    expect(currentCardQaCardsByType.legend ?? []).toHaveLength(24);
    expect(currentCardQaCardsByType.unit ?? []).toHaveLength(42);
    expect(currentCardQaCardsByType.gear ?? []).toHaveLength(9);
    expect(currentCardQaCardsByType.program ?? []).toHaveLength(13);

    const seen = new Map<string, string>();
    for (const entry of currentCardQaCases) {
      const cardKey = `${entry.card.set.code}:${entry.card.slug}`;
      expect(
        CURRENT_CARD_QA_EXCLUDED_SET_CODES.includes(
          entry.card.set.code as (typeof CURRENT_CARD_QA_EXCLUDED_SET_CODES)[number],
        ),
        `${cardKey} uses an excluded set`,
      ).toBe(false);
      expect(seen.get(cardKey), `${cardKey} appears in multiple QA cases`).toBeUndefined();
      expect(entry.scenarioIds.length, `${cardKey} has at least one scenario`).toBeGreaterThan(0);
      seen.set(cardKey, entry.note);
    }
    expect(seen.size).toBe(currentCardQaCards.length);
  });

  for (const scenarioId of currentCardQaScenarioIds) {
    test(`${scenarioId} hydrates as a current-card QA scenario`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));

      await createPlaywrightCyberpunkSimulatorPom(page, {
        fixture: { scenarioId },
      });

      if (pageErrors.length > 0) {
        throw new Error(`${scenarioId} failed to mount: ${pageErrors.join(" | ")}`);
      }

      await expect(page.locator('[data-testid="card"][data-instance-id]').first()).toBeVisible();

      for (const entry of expectedCardsByScenarioId.get(scenarioId) ?? []) {
        const visibleCard = page.locator(`[data-definition-id="${entry.card.id}"]`);
        if ((await visibleCard.count()) > 0) {
          await expect(visibleCard.first()).toBeVisible();
          continue;
        }

        expect(
          entry.card.type,
          `${scenarioId} should expose ${entry.card.set.code}:${entry.card.slug}`,
        ).toBe("legend");
        await expect(
          page.locator('[data-testid="legend-slot"][data-face-down="true"]').first(),
        ).toBeVisible();
      }
    });
  }
});
