import { describe, expect, it } from "bun:test";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import { luckyDime } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items";
import {
  archimedesResourcefulOwl,
  deweyLovableShowoff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Archimedes - Resourceful Owl", () => {
  it("YOU DON'T NEED THAT When you play this character, you may banish chosen item.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: archimedesResourcefulOwl.cost,
        hand: [archimedesResourcefulOwl],
      },
      {
        play: [pawpsicle],
      },
    );

    const cardUnderTest = testEngine.getCardModel(archimedesResourcefulOwl);
    const target = testEngine.getCardModel(pawpsicle);

    await testEngine.playCard(cardUnderTest);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [target] }, true);

    expect(target.zone).toBe("discard");
  });

  it("NOW, THAT'S NOT BAD During your turn, whenever an item is banished, you may draw a card, then choose and discard a card.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: archimedesResourcefulOwl.cost,
        hand: [archimedesResourcefulOwl, pawpsicle],
        deck: [deweyLovableShowoff],
      },
      {
        play: [luckyDime],
      },
    );

    const cardUnderTest = testEngine.getCardModel(archimedesResourcefulOwl);
    const target = testEngine.getCardModel(luckyDime);
    const deckCard = testEngine.getCardModel(deweyLovableShowoff);
    const pawp = testEngine.getCardModel(pawpsicle);

    await testEngine.playCard(cardUnderTest);

    // Draw is top of stack before discard for some reason
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [target] }, true);

    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [pawpsicle] }, true);

    expect(deckCard.zone).toBe("hand");
    expect(pawp.zone).toBe("discard");
    expect(target.zone).toBe("discard");
  });
});
