import { describe, expect, it } from "bun:test";
import {
  bashfulHopelessRomantic,
  happyGoodNatured,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bashful - Hopeless Romantic", () => {
  it("**OH, GOSH** This character can't quest unless you have another Seven Dwarfs character in play.", () => {
    const testStore = new TestStore({
      inkwell: happyGoodNatured.cost,
      hand: [happyGoodNatured],
      play: [bashfulHopelessRomantic],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      bashfulHopelessRomantic.id,
    );
    const dwarf = testStore.getByZoneAndId("hand", happyGoodNatured.id);

    expect(cardUnderTest.hasQuestRestriction).toEqual(true);
    dwarf.playFromHand();
    expect(cardUnderTest.hasQuestRestriction).toEqual(false);
  });
});
