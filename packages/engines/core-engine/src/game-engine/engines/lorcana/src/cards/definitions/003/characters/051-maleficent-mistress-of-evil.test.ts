import { describe, it } from "bun:test";
import { maleficentMistressOfEvil } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Maleficent - Mistress of Evil", () => {
  it.skip("**DARK KNOWLEDGE** Whenever this character quests, you may draw a card.**DIVINATION** During your turn, whenever you draw a card, you may move 1 damage counter from a chosen character to a chosen opposing character.", () => {
    const testStore = new TestStore({
      inkwell: maleficentMistressOfEvil.cost,
      play: [maleficentMistressOfEvil],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      maleficentMistressOfEvil.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
