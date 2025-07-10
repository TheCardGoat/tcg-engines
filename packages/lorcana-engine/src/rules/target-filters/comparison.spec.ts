/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  madameMedusaTheBoss,
  nutsyVultureHenchman,
} from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { sisuEmboldenedWarrior } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Filter Comparison", () => {
  it("Dynamic Strenght Comparison", () => {
    const testStore = new TestStore(
      {
        inkwell: madameMedusaTheBoss.cost,
        hand: [
          madameMedusaTheBoss,
          // 3 random cards so sisu has 4 strength
          nutsyVultureHenchman,
          nutsyVultureHenchman,
          nutsyVultureHenchman,
        ],
      },
      {
        play: [sisuEmboldenedWarrior],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      madameMedusaTheBoss.id,
    );
    const target = testStore.getByZoneAndId(
      "play",
      sisuEmboldenedWarrior.id,
      "player_two",
    );

    cardUnderTest.playFromHand();

    expect(testStore.getZonesCardCount().hand).toEqual(3);
    expect(target.strength).toEqual(4);

    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("play");
  });
});
