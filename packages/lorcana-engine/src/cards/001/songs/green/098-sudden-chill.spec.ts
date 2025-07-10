/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { suddenChill } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Sudden Chill", () => {
  it("Each opponent chooses and discards a card", () => {
    const testStore = new TestStore(
      {
        inkwell: suddenChill.cost,
        hand: [suddenChill],
      },
      { hand: [moanaOfMotunui] },
    );

    const cardUnderTest = testStore.getCard(suddenChill);
    const target = testStore.getCard(moanaOfMotunui);

    cardUnderTest.playFromHand();

    testStore.changePlayer("player_two");

    testStore.resolveTopOfStack({
      targets: [target],
    });

    expect(target.zone).toEqual("discard");
  });
});
