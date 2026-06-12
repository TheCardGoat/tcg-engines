import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaSecondhandBombus,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("unitArmoredMinotaur fixture behavior", () => {
  test("Armored Minotaur - high Street Cred defeats low-power rival in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitArmoredMinotaur" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const minotaur = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        alphaArmoredMinotaur.id,
      );
      const corpo = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );

      expectEqual("Minotaur Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 14);
      await pom.playCardFromHand(minotaur.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
      expectEqual("Minotaur eligible count", eligible.length, 2);
      expectIncludes("Minotaur eligible definitions", eligibleDefinitions, alphaCorpoSecurity.id);
      expectIncludes(
        "Minotaur eligible definitions",
        eligibleDefinitions,
        alphaSecondhandBombus.id,
      );

      await pom.resolveEffectTarget([corpo.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFieldSize(CYBERPUNK_P1, 2);
      await pom.expectFieldSize(CYBERPUNK_P2, 1);
      await pom.expectTrashSize(CYBERPUNK_P2, 1);
      await pom.getCardInZoneByDefinitionId("trash", CYBERPUNK_P2, alphaCorpoSecurity.id);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
