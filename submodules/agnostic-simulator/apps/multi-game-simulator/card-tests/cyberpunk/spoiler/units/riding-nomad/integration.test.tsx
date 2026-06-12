import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaArmoredMinotaur, alphaCorpoSecurity, spoilerRidingNomad } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("unitRidingNomad fixture behavior", () => {
  test("Riding Nomad - can attack spent units on played turn in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitRidingNomad" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const nomadInHand = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        spoilerRidingNomad.id,
      );
      const spentTarget = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );
      const readyRival = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaArmoredMinotaur.id,
      );

      await pom.playCardFromHand(nomadInHand.instanceId, CYBERPUNK_P1);
      const nomad = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        spoilerRidingNomad.id,
      );
      expectEqual("Riding Nomad played this turn", nomad.playedThisTurn, true);
      await pom.expectFieldCardGrantedRule(
        CYBERPUNK_P1,
        nomad.instanceId,
        "canAttackOnPlayedTurnAgainstUnits",
        true,
      );

      const attackers = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackUnit");
      const targets = await pom.getMoveTargetCandidateIds(CYBERPUNK_P1, "attackUnit");
      if (!attackers.includes(nomad.instanceId)) {
        throw new Error("Expected Riding Nomad to be an attackUnit candidate after being played.");
      }
      if (!targets.includes(spentTarget.instanceId)) {
        throw new Error("Expected spent Corpo Security to be a Riding Nomad attack target.");
      }
      if (targets.includes(readyRival.instanceId)) {
        throw new Error("Expected ready Armored Minotaur not to be a Riding Nomad attack target.");
      }
      const directCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackRival");
      if (directCandidates.includes(nomad.instanceId)) {
        throw new Error("Expected Riding Nomad not to attack the rival directly on played turn.");
      }

      await pom.attackUnit(nomad.instanceId, spentTarget.instanceId, CYBERPUNK_P1);

      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Riding Nomad to start a fight.");
      }
      expectEqual("Riding Nomad attack kind", attack.kind, "fight");
      expectEqual("Riding Nomad attack defender", attack.defenderId, spentTarget.instanceId);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, nomad.instanceId, true);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
