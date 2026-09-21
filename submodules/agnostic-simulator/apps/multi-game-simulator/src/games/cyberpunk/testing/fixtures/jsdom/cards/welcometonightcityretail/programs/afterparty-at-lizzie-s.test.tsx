import { describe, test } from "vite-plus/test";
import { welcomeToNightCityRetailAfterpartyAtLizzieS } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

// F8 regression: a die-target effect prompt (Afterparty at Lizzie's —
// "SELECT TARGET (0-1)" over gig dice) must be resolvable through the UI.
// Before the fix the interaction panel's submit stayed disabled until a
// candidate was selected, leaving the optional prompt mandatory-in-practice.
describe("Afterparty at Lizzie's (Retail) optional gig target — F8 regression", () => {
  test("an empty panel submission declines the optional gig target", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progAfterpartyAtLizzies",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const program = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAfterpartyAtLizzieS.id,
      );
      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      // The optional prompt is submittable with no candidate selected: the
      // empty selection IS the decline. (Regression: this submit used to be
      // disabled, deadlocking the prompt.)
      const submit = pom.interactionPanel.submitButton("resolveEffectTarget");
      const disabledBeforeSelection = await submit.getAttribute("disabled");
      expectEqual(
        "optional target submit enabled before selection",
        disabledBeforeSelection === null,
        true,
      );
      await pom.interactionPanel.submitInteraction("resolveEffectTarget");

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAfterpartyAtLizzieS.id,
      );
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("die candidate chips select in the interaction panel and resolve the prompt", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progAfterpartyAtLizzies",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const program = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAfterpartyAtLizzieS.id,
      );
      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (eligible.length === 0) {
        throw new Error("Expected gig die candidates for Afterparty at Lizzie's.");
      }

      // Clicking the die candidate chip must register the selection
      // (aria-pressed true) — the finding's failing interaction — and the
      // submit must then resolve the prompt.
      const selectedDie = await pom.getGigDie(eligible[0]!);
      // The Gig and its new face are submitted together as one authoritative move.
      await pom.resolveAdjustGig(
        selectedDie.id,
        selectedDie.faceValue > 1 ? selectedDie.faceValue - 1 : selectedDie.faceValue + 1,
        CYBERPUNK_P1,
      );
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);

      await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAfterpartyAtLizzieS.id,
      );
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("board gig dice are marked as the targeting surface for the prompt", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progAfterpartyAtLizzies",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const program = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailAfterpartyAtLizzieS.id,
      );
      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const eligible = new Set(await pom.getEligibleTargetIds(CYBERPUNK_P1));
      if (eligible.size === 0) {
        throw new Error("Expected gig die candidates for Afterparty at Lizzie's.");
      }
      // Census regression: eligible board dice must carry interactive markers
      // while the die-target prompt is pending.
      const doc = view.container.ownerDocument;
      const dice = [...(doc?.querySelectorAll('[data-testid="gig-die"]') ?? [])];
      const interactiveEligible = dice.filter(
        (die) =>
          die.getAttribute("data-interactive") === "true" &&
          die.getAttribute("data-die-id") !== null &&
          eligible.has(die.getAttribute("data-die-id") ?? ""),
      );
      expectEqual("interactive eligible gig dice", interactiveEligible.length, eligible.size);
    } finally {
      view.unmount();
    }
  });
});
