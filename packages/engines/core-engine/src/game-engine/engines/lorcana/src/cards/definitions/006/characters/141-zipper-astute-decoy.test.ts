import { describe, expect, it } from "bun:test";
import { zipperAstuteDecoy } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Zipper - Astute Decoy", () => {
  it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [zipperAstuteDecoy],
    });

    const cardUnderTest = testEngine.getCardModel(zipperAstuteDecoy);
    expect(cardUnderTest.hasWard()).toBe(true);
  });

  it.skip("RUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      inkwell: zipperAstuteDecoy.cost,
      play: [zipperAstuteDecoy],
      hand: [zipperAstuteDecoy],
    });

    await testEngine.playCard(zipperAstuteDecoy);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
