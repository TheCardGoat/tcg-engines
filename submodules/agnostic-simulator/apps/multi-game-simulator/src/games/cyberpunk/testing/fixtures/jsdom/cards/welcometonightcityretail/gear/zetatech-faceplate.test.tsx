import { fireEvent } from "@testing-library/react";
import { describe, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Zetatech Faceplate (Retail) jsdom happy path", () => {
  test("spend trigger adjusts a gig and draws", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearZetatechFaceplateRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      const rivalHost = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailDelamainCab.id,
      );
      const d8 = expectDefined(
        "Zetatech Retail friendly d8",
        (await pom.getGigDice(CYBERPUNK_P1)).find((die) => die.dieType === "d8"),
      );

      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectGigValue(d8.id, 3);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

      await pom.attackRival(host.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Zetatech Retail eligible gig target count", eligible.length, 4);
      if (!eligible.includes(d8.id)) {
        throw new Error("Expected friendly d8 to be an eligible Zetatech Faceplate target.");
      }

      const selectedGig = view.container.querySelector<HTMLElement>(
        `[data-testid="gig-die"][data-die-id="${d8.id}"]`,
      );
      if (!selectedGig) {
        throw new Error("Expected the friendly d8 to render as a direct board target.");
      }
      fireEvent.click(selectedGig);

      const adjustPanels = view.container.querySelectorAll('[data-testid="gig-adjust-panel"]');
      expectEqual("Zetatech Retail adjustment panel count", adjustPanels.length, 1);
      expectEqual(
        "Zetatech Retail adjustment panel anchor",
        adjustPanels[0]?.closest('[data-testid="gig-die-anchor"]')?.getAttribute("data-die-id"),
        d8.id,
      );

      const setToFour = adjustPanels[0]?.querySelector<HTMLElement>(
        '[data-testid="gig-adjust-option"][data-value="4"]',
      );
      if (!setToFour) {
        throw new Error("Expected the d8 adjustment popover to offer Set to 4.");
      }
      fireEvent.click(setToFour);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectGigValue(d8.id, 4);
      await pom.expectHandSize(CYBERPUNK_P1, 3);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("both players may control Faceplate while only the active player may take none", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gearZetatechFaceplateRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      const rivalHost = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailDelamainCab.id,
      );
      const d8 = expectDefined(
        "Zetatech Retail friendly d8",
        (await pom.getGigDice(CYBERPUNK_P1)).find((die) => die.dieType === "d8"),
      );

      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectGigValue(d8.id, 3);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P2, rivalHost.instanceId, 1);

      await pom.attackRival(host.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      await pom.resolveAdjustGigPass(CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectGigValue(d8.id, 3);
      await pom.expectHandSize(CYBERPUNK_P1, 3);
      await pom.expectHandSize(CYBERPUNK_P2, 0);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
