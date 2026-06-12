import { spoilerKerryEurodyneTheLastRockerboy } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const unitKerryEurodyneTheLastRockerboyBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "unitKerryEurodyneTheLastRockerboy",
  label: "Kerry Eurodyne - max-value gig ability draws two",
  references: [
    "packages/engine/src/cards/spoiler/units/kerry-eurodyne-the-last-rockerboy.test.ts",
    "apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/units.ts",
  ],
  async run(pom) {
    const kerry = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      spoilerKerryEurodyneTheLastRockerboy.id,
    );
    const abilityCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "activateAbility");
    if (!abilityCandidates.includes(`${kerry.instanceId}:0`)) {
      throw new Error("Expected Kerry's activated ability to be visible.");
    }

    const handBefore = await pom.getHandSize(CYBERPUNK_P1);
    const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);

    await pom.activateAbility(kerry.instanceId, 0, CYBERPUNK_P1);

    await pom.expectFieldCardSpent(CYBERPUNK_P1, kerry.instanceId, true);
    await pom.expectHandSize(CYBERPUNK_P1, handBefore + 2);
    expectEqual("Kerry deck after draw", await pom.getDeckSize(CYBERPUNK_P1), deckBefore - 2);
  },
};
