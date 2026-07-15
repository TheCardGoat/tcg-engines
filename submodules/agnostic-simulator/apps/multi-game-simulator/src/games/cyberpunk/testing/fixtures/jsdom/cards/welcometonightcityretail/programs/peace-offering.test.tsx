import { describe, test } from "vite-plus/test";
import { welcomeToNightCityRetailPeaceOffering } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { fireEvent, waitFor } from "@testing-library/react";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Peace Offering (Retail) jsdom happy path", () => {
  test("play copies gig value and draws from value-pair", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progPeaceOfferingRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const eddiesBefore = await pom.getEddies(CYBERPUNK_P1);
      const handBefore = await pom.getHandSize(CYBERPUNK_P1);

      const peace = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPeaceOffering.id,
      );

      await pom.playCardFromHand(peace.instanceId, CYBERPUNK_P1);

      // Binding targets all gigs; with only P1 gigs there are exactly 2
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      expectEqual("Peace Offering eligible gig count", eligible.length, 2);
      await pom.resolveEffectTarget([eligible[0]!, eligible[1]!], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectEddies(CYBERPUNK_P1, eddiesBefore - 1);
      // After copying gig value, a value-pair exists and a card is drawn
      await pom.expectHandSize(CYBERPUNK_P1, handBefore);
      // Peace Offering goes to trash
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPeaceOffering.id,
      );

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("updates the prompt helper after the first Gig is selected", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "retailCombatGigBench",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const peace = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPeaceOffering.id,
      );

      await pom.playCardFromHand(peace.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const friendlyGigs = await pom.getGigDice(CYBERPUNK_P1);
      const source = friendlyGigs.find((die) => die.dieType === "d6" && die.faceValue === 5);
      const target = friendlyGigs.find((die) => die.dieType === "d4" && die.faceValue === 4);
      if (!source || !target) {
        throw new Error("Retail combat bench did not expose the expected D6 source and D4 target.");
      }

      const sourceButton = gigDieButton(view.container, source.id);
      const targetButton = gigDieButton(view.container, target.id);

      expectEqual("initial source role", sourceButton.dataset.selectionRole, "copy-source");
      expectEqual(
        "no die helper badges before source",
        view.container.querySelectorAll('[data-testid="gig-selection-badge"]').length,
        0,
      );

      fireEvent.click(sourceButton);

      await waitFor(() => {
        expectEqual("selected source role", sourceButton.dataset.selectionRole, "copy-source");
        expectEqual("selected source state", sourceButton.dataset.selected, "true");
        expectEqual("target role after source", targetButton.dataset.selectionRole, "copy-target");
      });

      const sequence = view.container.querySelector<HTMLElement>(
        '[data-testid="prompt-banner-sequence"]',
      );
      if (!sequence?.textContent?.includes("D6 showing 5 is the source")) {
        throw new Error("Prompt banner did not name the selected Peace Offering source die.");
      }
      expectEqual(
        "no die helper badges after source",
        view.container.querySelectorAll('[data-testid="gig-selection-badge"]').length,
        0,
      );

      fireEvent.click(targetButton);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      const resolvedTarget = await pom.getGigDie(target.id);
      expectEqual("D4 cap result", resolvedTarget.faceValue, 4);
    } finally {
      view.unmount();
    }
  });
});

function gigDieButton(container: HTMLElement, dieId: string): HTMLButtonElement {
  const button = container.querySelector<HTMLButtonElement>(
    `[data-testid="gig-die"][data-die-id="${dieId}"]`,
  );
  if (!button) {
    throw new Error(`No gig die button found for ${dieId}.`);
  }
  return button;
}
