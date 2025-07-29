/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { packTactics } from "@lorcanito/lorcana-engine/cards/002/actions/actions.ts";
import {
  cinderellaBallroomSensation,
  eudoraAccomplishedSeamstress,
  gastonBaritoneBully,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
