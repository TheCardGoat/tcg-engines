import { alphaArmoredMinotaur, alphaCorpoSecurity } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const legendYorinobuArasakaEmbracingDestructionBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "legendYorinobuArasakaEmbracingDestruction",
  label: "Yorinobu - first Arasaka attack draw/discard",
  references: [
    "packages/engine/src/cards/alpha/legends/yorinobu-arasaka-embracing-destruction.test.ts",
  ],
  async run(pom) {
    const minotaur = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaArmoredMinotaur.id,
    );
    const defender = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );

    await pom.expectHandSize(CYBERPUNK_P1, 2);
    expectEqual("Yorinobu starting deck", await pom.getDeckSize(CYBERPUNK_P1), 37);

    await pom.attackUnit(minotaur.instanceId, defender.instanceId, CYBERPUNK_P1);

    await pom.expectHandSize(CYBERPUNK_P1, 3);
    expectEqual("Yorinobu deck after draw", await pom.getDeckSize(CYBERPUNK_P1), 36);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

    const discardChoices = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Yorinobu discard choices", discardChoices.length, 3);
    await pom.resolveDiscardFromHand([discardChoices[0]!], CYBERPUNK_P1);

    await pom.expectHandSize(CYBERPUNK_P1, 2);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  },
};
