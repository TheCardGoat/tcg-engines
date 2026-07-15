import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import {
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailMamanBrigitteSpiritOfDeath,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectExcludes,
  expectIncludes,
  getChoiceDefinitionIds,
  getZoneDefinitionIds,
} from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("unitMamanBrigitte fixture behavior", () => {
  test("Maman Brigitte - discards programs to bottom-deck unequipped unit in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitMamanBrigitte" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const maman = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMamanBrigitteSpiritOfDeath.id,
      );
      const reboot = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailRebootOptics.id,
      );
      const surveillance = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailCorporateSurveillance.id,
      );
      await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailKiroshiOptics.id,
      );
      const unequippedTarget = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        welcomeToNightCityRetailMoxInciters.id,
      );

      const deckBefore = await pom.getDeckSize(CYBERPUNK_P2);
      await pom.playCardFromHand(maman.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const discardChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      const discardDefinitions = await getChoiceDefinitionIds(pom, discardChoices);
      expectEqual("Maman discard choice count", discardChoices.length, 2);
      expectIncludes(
        "Maman discard definitions",
        discardDefinitions,
        welcomeToNightCityRetailRebootOptics.id,
      );
      expectIncludes(
        "Maman discard definitions",
        discardDefinitions,
        welcomeToNightCityRetailCorporateSurveillance.id,
      );
      expectExcludes(
        "Maman discard definitions",
        discardDefinitions,
        welcomeToNightCityRetailKiroshiOptics.id,
      );

      await pom.resolveDiscardFromHand([reboot.instanceId, surveillance.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const targetChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      const targetDefinitions = await getChoiceDefinitionIds(pom, targetChoices);
      expectEqual("Maman bottom-deck target count", targetChoices.length, 1);
      expectIncludes(
        "Maman target definitions",
        targetDefinitions,
        welcomeToNightCityRetailMoxInciters.id,
      );
      expectExcludes(
        "Maman target definitions",
        targetDefinitions,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );

      await pom.resolveEffectTarget([unequippedTarget.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFieldSize(CYBERPUNK_P2, 1);
      await pom.expectTrashSize(CYBERPUNK_P1, 2);
      expectEqual("Maman rival deck size", await pom.getDeckSize(CYBERPUNK_P2), deckBefore + 1);

      const p2Deck = await getZoneDefinitionIds(pom, "deck", CYBERPUNK_P2);
      expectEqual(
        "Maman bottom-decked card",
        p2Deck[p2Deck.length - 1],
        welcomeToNightCityRetailMoxInciters.id,
      );

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
