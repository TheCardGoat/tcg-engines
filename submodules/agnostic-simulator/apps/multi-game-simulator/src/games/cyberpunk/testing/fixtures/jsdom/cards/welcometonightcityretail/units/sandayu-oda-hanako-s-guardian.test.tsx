import { describe, test } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  welcomeToNightCityRetailSandayuOdaHanakoSGuardian,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectIncludes,
  getChoiceDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Sandayu Oda jsdom happy path (Retail)", () => {
  test("sandayu Oda - value pairs spend units and allow unit attack (Retail)", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitSandayuOdaHanakoSGuardianRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const sandayuInHand = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSandayuOdaHanakoSGuardian.id,
      );
      const corpo = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaCorpoSecurity.id,
      );
      const minotaur = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P2,
        alphaArmoredMinotaur.id,
      );

      await pom.playCardFromHand(sandayuInHand.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
      const eligibleDefinitions = await getChoiceDefinitionIds(pom, eligible);
      expectEqual("Sandayu spend target count", eligible.length, 2);
      expectIncludes("Sandayu spend targets", eligibleDefinitions, alphaCorpoSecurity.id);
      expectIncludes("Sandayu spend targets", eligibleDefinitions, alphaArmoredMinotaur.id);

      await pom.resolveEffectTarget([corpo.instanceId, minotaur.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFieldCardSpent(CYBERPUNK_P2, corpo.instanceId, true);
      await pom.expectFieldCardSpent(CYBERPUNK_P2, minotaur.instanceId, true);

      const sandayu = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSandayuOdaHanakoSGuardian.id,
      );
      await pom.expectFieldCardGrantedRule(
        CYBERPUNK_P1,
        sandayu.instanceId,
        "canAttackOnPlayedTurnAgainstUnits",
        true,
      );

      const attackers = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackUnit");
      const targets = await pom.getMoveTargetCandidateIds(CYBERPUNK_P1, "attackUnit");
      if (!attackers.includes(sandayu.instanceId)) {
        throw new Error("Expected Sandayu to be an attackUnit candidate after being played.");
      }
      if (!targets.includes(corpo.instanceId) || !targets.includes(minotaur.instanceId)) {
        throw new Error("Expected Sandayu to attack spent rival units after its play trigger.");
      }

      const directCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackRival");
      if (directCandidates.includes(sandayu.instanceId)) {
        throw new Error("Expected Sandayu not to attack the rival directly on played turn.");
      }

      await pom.attackUnit(sandayu.instanceId, corpo.instanceId, CYBERPUNK_P1);

      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Sandayu to start a fight against a spent unit.");
      }
      expectEqual("Sandayu attack kind", attack.kind, "fight");
      expectEqual("Sandayu attack defender", attack.defenderId, corpo.instanceId);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, sandayu.instanceId, true);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
