import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  spoilerSandayuOdaHanakoSGuardian,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";
import { expectIncludes, getChoiceDefinitionIds } from "./cyberpunk-unit-fixture-helpers";

export const unitSandayuOdaHanakoSGuardianBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "unitSandayuOdaHanakoSGuardian",
  label: "Sandayu Oda - value pairs spend units and allow unit attack",
  references: [
    "packages/engine/src/cards/spoiler/units/sandayu-oda-hanako-s-guardian.test.ts",
    "apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/units.ts",
  ],
  async run(pom) {
    const sandayuInHand = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      spoilerSandayuOdaHanakoSGuardian.id,
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
      spoilerSandayuOdaHanakoSGuardian.id,
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
  },
};
