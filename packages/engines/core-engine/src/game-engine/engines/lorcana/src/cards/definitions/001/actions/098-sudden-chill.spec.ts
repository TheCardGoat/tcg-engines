import { describe, expect, it } from "bun:test";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { suddenChill } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
