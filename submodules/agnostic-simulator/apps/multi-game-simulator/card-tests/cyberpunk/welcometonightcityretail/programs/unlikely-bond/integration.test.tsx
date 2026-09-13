// @vitest-environment jsdom

import { describe, expect, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailAnimalsWrecker,
  welcomeToNightCityRetailUnlikelyBond,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailVRoamerOfTheBadlands,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("scraped retail release visual QA fixture", () => {
  test("Unlikely Bond guides the local player through both bottom-deck choices", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailScrapedReleaseAug2026Qa" });

    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const unlikelyBond = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailUnlikelyBond.id,
      );
      const friendlyUnit = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAnimalsWrecker.id,
      );
      const rivalUnit = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );

      await pom.playCardFromHand(unlikelyBond.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      expect(
        view.container.querySelector('[data-testid="prompt-banner-title"]')?.textContent?.trim(),
      ).toBe("Choose ready friendly Unit");
      const friendlyTarget = view.container.querySelector<HTMLElement>(
        `[data-entity-id="${friendlyUnit.instanceId}"]`,
      );
      expect(friendlyTarget?.getAttribute("role")).toBe("button");
      expect(friendlyTarget?.getAttribute("aria-label")).toBe("Select Animals Wrecker");
      await pom.resolveEffectTarget([friendlyUnit.instanceId], CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      expect(
        view.container.querySelector('[data-testid="prompt-banner-title"]')?.textContent?.trim(),
      ).toBe("Choose spent rival Unit");
      const rivalTarget = view.container.querySelector<HTMLElement>(
        `[data-entity-id="${rivalUnit.instanceId}"]`,
      );
      expect(rivalTarget?.getAttribute("role")).toBe("button");
      expect(rivalTarget?.getAttribute("aria-label")).toBe("Select Corpo Security");
      await pom.resolveEffectTarget([rivalUnit.instanceId], CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);

      await pom.getCardInZoneByDefinitionId(
        "deck",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAnimalsWrecker.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "deck",
        CYBERPUNK_P2,
        welcomeToNightCityRetailCorpoSecurity.id,
      );
    } finally {
      view.unmount();
    }
  });

  test("V's stolen Gig exposes every legal increase before applying the selected value", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "retailScrapedReleaseAug2026VStealQa",
    });

    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const rivalGig = (await pom.getGigDice(CYBERPUNK_P2))[0];
      expect(rivalGig).toBeDefined();
      await pom.resolveAttack(CYBERPUNK_P1, { gigIdsToSteal: [rivalGig!.id] });

      expect(
        view.container.querySelector('[data-testid="prompt-banner-title"]')?.textContent?.trim(),
      ).toBe("Adjust Gig");
      for (const value of [3, 4, 5, 6, 7]) {
        expect(view.getAllByRole("button", { name: `Set to ${value}` })).toHaveLength(2);
      }

      await pom.resolveAdjustGig(7, CYBERPUNK_P1);
      await pom.expectGigCount(CYBERPUNK_P1, 2);
      await pom.expectGigCount(CYBERPUNK_P2, 0);
      await pom.expectGigValue(rivalGig!.id, 7);
      await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailVRoamerOfTheBadlands.id,
      );
    } finally {
      view.unmount();
    }
  });
});
