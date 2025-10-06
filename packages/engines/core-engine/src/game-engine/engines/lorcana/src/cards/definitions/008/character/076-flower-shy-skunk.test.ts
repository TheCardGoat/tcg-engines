/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { madamMimFox } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  deweyLovableShowoff,
  flowerShySkunk,
  louieOneCoolDuck,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Flower - Shy Skunk", () => {
  it("LOOKING FOR FRIENDS Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.", async () => {
    const testEngine = new TestEngine({
      inkwell: deweyLovableShowoff.cost,
      play: [flowerShySkunk],
      hand: [deweyLovableShowoff],
      deck: [louieOneCoolDuck, madamMimFox],
    });

    const newCardInPlay = testEngine.getCardModel(deweyLovableShowoff);
    const first = testEngine.getCardModel(madamMimFox);
    const last = testEngine.getCardModel(louieOneCoolDuck);
    expect(testEngine.store.tableStore.getTable().zones.deck.cards).toEqual([
      last,
      first,
    ]);

    await testEngine.playCard(newCardInPlay);
    testEngine.resolveOptionalAbility(true);

    await testEngine.resolveTopOfStack({ scry: { top: [last] } });

    expect(testEngine.store.tableStore.getTable().zones.deck.cards).toEqual([
      first,
      last,
    ]);
  });
});
