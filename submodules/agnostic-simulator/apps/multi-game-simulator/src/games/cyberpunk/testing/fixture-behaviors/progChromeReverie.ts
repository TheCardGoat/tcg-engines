import { alphaCorpoSecurity, spoilerRiverWardDetectiveOnTheHunt } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

export const progChromeReverieBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "progChromeReverie",
  label: "Chrome Reverie - cant-attack target and free legend call",
  references: ["packages/engine/src/cards/spoiler/programs/chrome-reverie.test.ts"],
  async run(pom) {
    const program = expectDefined(
      "Chrome Reverie in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );
    const corpoSecurity = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );
    const riverWard = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      spoilerRiverWardDetectiveOnTheHunt.id,
    );

    expectEqual("River Ward starts face-down", riverWard.faceDown, true);
    await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 4);

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectEddies(CYBERPUNK_P1, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const rivalUnitTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Chrome Reverie rival unit target count", rivalUnitTargets.length, 2);
    if (!rivalUnitTargets.includes(corpoSecurity.instanceId)) {
      throw new Error("Expected rival Corpo Security to be a Chrome Reverie target.");
    }

    await pom.resolveEffectTarget([corpoSecurity.instanceId], CYBERPUNK_P1);

    await pom.expectFieldCardGrantedRule(
      CYBERPUNK_P2,
      corpoSecurity.instanceId,
      "cantAttack",
      true,
    );
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const legendTargets = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Chrome Reverie free legend-call target count", legendTargets.length, 1);
    if (!legendTargets.includes(riverWard.instanceId)) {
      throw new Error("Expected face-down River Ward to be the free legend-call target.");
    }

    await pom.resolveEffectTarget([riverWard.instanceId], CYBERPUNK_P1);

    const calledRiverWard = await pom.getCardInZoneByInstanceId(
      "legendArea",
      CYBERPUNK_P1,
      riverWard.instanceId,
    );
    expectEqual("River Ward is face-up after free call", calledRiverWard.faceDown, false);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);
    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 1);
    await pom.expectFieldCardGrantedRule(
      CYBERPUNK_P2,
      corpoSecurity.instanceId,
      "cantAttack",
      true,
    );
  },
};
