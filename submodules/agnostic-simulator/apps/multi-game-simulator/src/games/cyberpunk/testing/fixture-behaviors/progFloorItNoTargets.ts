import { alphaJackieWellesRideOrDieChoom } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

export const progFloorItNoTargetsBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "progFloorItNoTargets",
  label: "Floor It - no spent low-cost units",
  references: ["packages/engine/src/cards/alpha/programs/floor-it.test.ts"],
  async run(pom) {
    const jackie = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaJackieWellesRideOrDieChoom.id,
    );
    const program = expectDefined(
      "Floor It in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    expectEqual(
      "Floor It no-target eligible count",
      (await pom.getEligibleTargetIds(CYBERPUNK_P1)).length,
      0,
    );
    await pom.expectFieldCardSpent(CYBERPUNK_P2, jackie.instanceId, true);
    await pom.expectFieldSize(CYBERPUNK_P2, 1);
    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 1);
  },
};
