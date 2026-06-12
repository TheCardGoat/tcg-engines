import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const gearKiroshiOpticsBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "gearKiroshiOptics",
  label: "Kiroshi Optics - peek at a face-down legend",
  references: ["packages/engine/src/cards/alpha/gear/kiroshi-optics.test.ts"],
  async run(pom) {
    const attacker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaSwordwiseHuscle.id,
    );

    await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 2);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, attacker.instanceId, 6);

    await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Kiroshi face-down legend target count", eligible.length, 2);
    const legendTarget = eligible[0];
    if (!legendTarget) {
      throw new Error("Expected Kiroshi Optics to expose a legend target.");
    }

    await pom.resolveEffectTarget([legendTarget], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 2);
    await pom.getCardInZoneByInstanceId("legendArea", CYBERPUNK_P1, legendTarget);
  },
};
