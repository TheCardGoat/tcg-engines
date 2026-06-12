import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "../cyberpunk-simulator-pom";
import { type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const gearKiroshiOpticsNoFaceDownBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "gearKiroshiOpticsNoFaceDown",
  label: "Kiroshi Optics - no face-down legends",
  references: ["packages/engine/src/cards/alpha/gear/kiroshi-optics.test.ts"],
  async run(pom) {
    const attacker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaSwordwiseHuscle.id,
    );

    await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);

    await pom.attackRival(attacker.instanceId, CYBERPUNK_P1);

    if ((await pom.getPendingChoiceType(CYBERPUNK_P1)) === "chooseTarget") {
      throw new Error("Expected Kiroshi Optics to have no face-down legend target prompt.");
    }
    await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 0);
  },
};
