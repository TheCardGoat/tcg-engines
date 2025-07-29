import { describe, expect, it } from "bun:test";
import { packTactics } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import {
  cinderellaBallroomSensation,
  eudoraAccomplishedSeamstress,
  gastonBaritoneBully,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pack Tactics", () => {
  it("Gain 1 lore for each damaged character opponents have in play.", () => {
    const testStore = new TestStore(
      {
        inkwell: packTactics.cost,
        hand: [packTactics],
      },
      {
        play: [
          gastonBaritoneBully,
          eudoraAccomplishedSeamstress,
          cinderellaBallroomSensation,
        ],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", packTactics.id);

    const target = testStore.getByZoneAndId(
      "play",
      gastonBaritoneBully.id,
      "player_two",
    );
    const target2 = testStore.getByZoneAndId(
      "play",
      eudoraAccomplishedSeamstress.id,
      "player_two",
    );
    const target3 = testStore.getByZoneAndId(
      "play",
      cinderellaBallroomSensation.id,
      "player_two",
    );

    [target3, target2, target].forEach((target) => {
      target.updateCardDamage(1);
    });

    cardUnderTest.playFromHand();

    expect(testStore.getPlayerLore()).toBe(3);
  });
});
