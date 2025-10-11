import { describe, expect, it } from "bun:test";
import {
  arthurKingVictorious,
  docBoldKnight,
  nalaMischievousCub,
  princeNaveenUkulelePlayer,
  tukeNorthernMoose,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Doc - Bold Knight", () => {
  it("**DRASTIC MEASURES** When you play this character, you may discard your hand to draw 2 cards.", () => {
    const testStore = new TestStore({
      inkwell: docBoldKnight.cost,
      hand: [
        docBoldKnight,
        arthurKingVictorious,
        nalaMischievousCub,
        princeNaveenUkulelePlayer,
        tukeNorthernMoose,
      ],
      deck: 3,
    });

    const cardUnderTest = testStore.getCard(docBoldKnight);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 2,
        deck: 1,
        discard: 4,
      }),
    );
  });
});
