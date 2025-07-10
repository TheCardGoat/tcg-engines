/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  docLeaderOfTheSevenDwarfs,
  dopeyAlwaysPlayful,
  grumpyBadTempered,
  happyGoodNatured,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { olafCarrotEnthusiast } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Olaf - Carrot Enthusiast", () => {
  it("**CARROTS ALL AROUND!** Whenever he quests, each of your other characters gets +{S} equal to this character's {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: olafCarrotEnthusiast.cost,
      play: [
        olafCarrotEnthusiast,
        docLeaderOfTheSevenDwarfs,
        dopeyAlwaysPlayful,
        grumpyBadTempered,
        happyGoodNatured,
      ],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      olafCarrotEnthusiast.id,
    );

    const targets = [
      testStore.getByZoneAndId("play", docLeaderOfTheSevenDwarfs.id),
      testStore.getByZoneAndId("play", dopeyAlwaysPlayful.id),
      testStore.getByZoneAndId("play", grumpyBadTempered.id),
      testStore.getByZoneAndId("play", happyGoodNatured.id),
    ];

    // Store initial strengths
    const initialStrengths = targets.map((target) => target.strength);

    cardUnderTest.playFromHand();
    cardUnderTest.quest();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets });

    targets.forEach((target, index) => {
      expect(target.strength).toBe(
        initialStrengths[index]! + olafCarrotEnthusiast.strength,
      );
    });
  });
});
