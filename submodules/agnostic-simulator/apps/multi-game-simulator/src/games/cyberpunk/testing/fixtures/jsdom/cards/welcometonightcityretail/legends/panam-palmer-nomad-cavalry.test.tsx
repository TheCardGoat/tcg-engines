import { describe, test } from "vite-plus/test";
import { fireEvent, waitFor } from "@testing-library/react";
import {
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailPanamPalmerNomadCavalry,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Panam Palmer - Nomad Cavalry (Retail) jsdom happy path", () => {
  test("spend ability fires and spends the legend", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendPanamPalmerNomadCavalryRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const panam = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPanamPalmerNomadCavalry.id,
      );

      const unit = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );

      // Unit starts without gear
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, unit.instanceId, 0);

      await pom.activateAbility(panam.instanceId, 0, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const gearChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (gearChoices.length !== 1) {
        throw new Error(
          `Expected Panam to offer exactly one attached Gear, got ${gearChoices.length}.`,
        );
      }
      await pom.resolveEffectTarget([gearChoices[0]!], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectLegendCardSpent(CYBERPUNK_P1, panam.instanceId, true);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, unit.instanceId, 1);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("spend ability target prompt clearly selects attached gear", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendQaGearTempo",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const panam = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPanamPalmerNomadCavalry.id,
      );
      const overwatch = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailOverwatchPanamSGift.id,
      );

      await pom.activateAbility(panam.instanceId, 0, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const promptTitle = await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="prompt-banner-title"]'),
      );
      expectEqual(
        "Panam target prompt title",
        promptTitle.textContent?.trim(),
        "Choose a target for Panam Palmer — Nomad Cavalry",
      );

      const gearTarget = requiredElement<HTMLButtonElement>(
        view.container,
        `[data-card-id="${overwatch.instanceId}"][data-choice-eligible="true"]`,
      );
      expectEqual(
        "Panam gear target aria",
        gearTarget.getAttribute("aria-label"),
        "Select Overwatch — Panam's Gift",
      );
      expectEqual(
        "Panam gear target visual label",
        gearTarget.getAttribute("data-choice-label"),
        "Select",
      );
      expectEqual("Panam gear target text", gearTarget.textContent?.includes("TRASH"), false);
      fireEvent.click(gearTarget);
    } finally {
      view.unmount();
    }
  });
});

function requiredElement<T extends Element>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element;
}
