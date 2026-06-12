import { alphaCorpoSecurity } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

export const progFloorItBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "progFloorIt",
  label: "Floor It - spent units to bounce",
  references: ["packages/engine/src/cards/alpha/programs/floor-it.test.ts"],
  async run(pom) {
    const rivalTarget = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );
    await pom.expectFieldCardSpent(CYBERPUNK_P2, rivalTarget.instanceId, true);

    const program = expectDefined(
      "Floor It in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );
    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Floor It eligible target count", eligible.length, 2);
    if (!eligible.includes(rivalTarget.instanceId)) {
      throw new Error("Expected spent rival Corpo Security to be eligible for Floor It.");
    }

    await pom.resolveEffectTarget([rivalTarget.instanceId], CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectFieldSize(CYBERPUNK_P2, 1);
    await pom.expectHandSize(CYBERPUNK_P2, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 1);
  },
};
