import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import {
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailSwordwiseHuscle,
  theHeistRetailStarterDeckViktorVektorSitDownAndRelax,
  welcomeToNightCityRetailMandibularUpgrade,
  welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("legendViktorVektorSitDownAndRelax fixture behavior", () => {
  test("Viktor Vektor - call searches top deck for gear in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendViktorVektorSitDownAndRelax",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const viktor = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        theHeistRetailStarterDeckViktorVektorSitDownAndRelax.id,
      );
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      const otherHost = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSecondhandBombus.id,
      );
      const retailViktor = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch.id,
      );
      const mandibularUpgrade = await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMandibularUpgrade.id,
      );

      await pom.callLegend(viktor.instanceId, CYBERPUNK_P1);

      const calledViktor = await pom.getCardInZoneByInstanceId(
        "legendArea",
        CYBERPUNK_P1,
        viktor.instanceId,
      );
      expectEqual("Viktor is face-up", calledViktor.faceDown, false);
      await pom.expectEddies(CYBERPUNK_P1, 3);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "searchDeck");

      const revealed = await pom.getSearchDeckRevealedCardIds(CYBERPUNK_P1);
      expectEqual("Viktor reveal count", revealed.length, 5);
      const revealedDefinitions = await Promise.all(
        revealed.map((cardId) => pom.getCardDefinitionId(cardId)),
      );
      const selected = [
        revealed[revealedDefinitions.indexOf(welcomeToNightCityRetailKiroshiOptics.id)]!,
        revealed[revealedDefinitions.indexOf(welcomeToNightCityRetailMantisBlades.id)]!,
      ];
      if (selected.some((cardId) => !cardId)) {
        throw new Error("Expected Viktor search to reveal Kiroshi Optics and Mantis Blades.");
      }

      await pom.resolveSearchDeck(selected, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectHandSize(CYBERPUNK_P1, 4);
      expectEqual("Viktor deck after selecting two gear", await pom.getDeckSize(CYBERPUNK_P1), 34);

      await pom.playCardFromHand(retailViktor.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligibleGearTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (!eligibleGearTargets.includes(mandibularUpgrade.instanceId)) {
        throw new Error("Expected retail Viktor to let P1 select Mandibular Upgrade from trash.");
      }

      await pom.resolveEffectTarget([mandibularUpgrade.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligibleAttachTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      if (!eligibleAttachTargets.includes(host.instanceId)) {
        throw new Error("Expected retail Viktor to let P1 select Swordwise Huscle as attach host.");
      }
      if (!eligibleAttachTargets.includes(otherHost.instanceId)) {
        throw new Error(
          "Expected retail Viktor to let P1 select Secondhand Bombus as attach host.",
        );
      }
      if (eligibleAttachTargets.includes(retailViktor.instanceId)) {
        throw new Error("Expected retail Viktor not to be eligible to attach Gear to itself.");
      }

      await pom.resolveEffectTarget([host.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectEddies(CYBERPUNK_P1, 0);
      await pom.expectHandSize(CYBERPUNK_P1, 3);
      await pom.expectTrashSize(CYBERPUNK_P1, 0);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, host.instanceId, 1);
      const attachedGear = await pom.getCardInZoneByInstanceId(
        "field",
        CYBERPUNK_P1,
        mandibularUpgrade.instanceId,
      );
      expectEqual(
        "Mandibular Upgrade attached to selected unit",
        attachedGear.attachedToId,
        host.instanceId,
      );

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
