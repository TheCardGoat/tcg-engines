import { waitFor } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("River Ward - Detective on the Hunt (Retail) jsdom happy path", () => {
  test("spend plays a low-cost Gear from hand for free", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendRiverWardDetectiveOnTheHuntRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const river = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailRiverWardDetectiveOnTheHunt.id,
      );
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      const gear = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailKiroshiOptics.id,
      );

      const handBefore = await pom.getHandSize(CYBERPUNK_P1);
      expectEqual("River Ward hand before", handBefore, 1);

      await pom.activateAbility(river.instanceId, 1, CYBERPUNK_P1);

      // The activated ability first chooses the Gear, then its attachment host.
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const gearChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (!gearChoices.includes(gear.instanceId)) {
        throw new Error("Expected River Ward to offer Kiroshi Optics as the free Gear.");
      }
      await pom.resolveEffectTarget([gear.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (!eligible.includes(host.instanceId)) {
        throw new Error("Expected River Ward to offer Swordwise Huscle as an attachment host.");
      }
      await pom.resolveEffectTarget([host.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectLegendCardSpent(CYBERPUNK_P1, river.instanceId, true);
      // Eddies unchanged because the gear is played for free
      await pom.expectEddies(CYBERPUNK_P1, 5);
      const attachedGear = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailKiroshiOptics.id,
      );
      expectEqual("River Ward attached gear host", attachedGear.attachedToId, host.instanceId);
      const handAfter = await pom.getHandSize(CYBERPUNK_P1);
      expectEqual("River Ward hand after", handAfter, 0);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });

  test("defeat trigger trashes one selected top-deck card from the visible search modal", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "legendQaGearTempo" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const tBug = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailTBugAmateurPhilosopher.id,
      );
      const minotaur = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        embracingPowerRetailStarterDeckMinotaur.id,
      );
      const river = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailRiverWardDetectiveOnTheHunt.id,
      );

      await pom.attackUnit(tBug.instanceId, minotaur.instanceId, CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P1);
      await pom.resolveAttack(CYBERPUNK_P2, { pass: true });
      await pom.resolveAttack(CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTrigger");
      const trigger = (await pom.getPendingTriggerOptions(CYBERPUNK_P1)).find(
        (option) => option.sourceCardId === river.instanceId,
      );
      if (!trigger) {
        throw new Error("Expected River Ward to offer its equipped-Unit defeated trigger.");
      }
      await pom.resolveTrigger(trigger.triggerId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "scry");
      await waitFor(() => {
        expect(document.body.querySelector('[data-testid="choice-modal-sheet"]')).not.toBeNull();
        expect(document.body.querySelectorAll('[data-testid="search-deck-card"]')).toHaveLength(2);
      });

      const trashBefore = (await pom.getCardsInZone("trash", CYBERPUNK_P1)).length;
      const selectedButton = document.body.querySelector<HTMLButtonElement>(
        '[data-testid="search-deck-card"]',
      );
      const selectedCardId = selectedButton?.dataset.cardId;
      if (!selectedButton || !selectedCardId) {
        throw new Error("Expected River Ward to reveal a selectable top-deck card.");
      }

      selectedButton.click();

      await waitFor(async () => {
        await expect(pom.getPendingChoiceType(CYBERPUNK_P1)).resolves.toBeNull();
      });
      expectEqual(
        "River Ward trash count after top-deck selection",
        (await pom.getCardsInZone("trash", CYBERPUNK_P1)).length,
        trashBefore + 1,
      );
      await pom.getCardInZoneByInstanceId("trash", CYBERPUNK_P1, selectedCardId);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
