import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

export const progAfterpartyAtLizziesBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "progAfterpartyAtLizzies",
  label: "Afterparty at Lizzie's - rival gig to adjust",
  references: ["packages/engine/src/cards/spoiler/programs/afterparty-at-lizzie-s.test.ts"],
  async run(pom) {
    const rivalD6 = expectDefined(
      "Afterparty rival d6",
      (await pom.getGigDice(CYBERPUNK_P2)).find((die) => die.dieType === "d6"),
    );
    const program = expectDefined(
      "Afterparty at Lizzie's in hand",
      (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
    );

    await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
    const eligible = await pom.getEligibleTargetIds(CYBERPUNK_P1);
    expectEqual("Afterparty eligible gig count", eligible.length, 2);
    if (!eligible.includes(rivalD6.id)) {
      throw new Error("Expected rival d6 to be eligible for Afterparty at Lizzie's.");
    }

    await pom.resolveEffectTarget([rivalD6.id], CYBERPUNK_P1);
    await pom.resolveAdjustGig(2, CYBERPUNK_P1);

    await pom.expectGigValue(rivalD6.id, 2);
    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectTrashSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 1);
  },
};
