import { describe, expect, it } from "bun:test";
import {
  microbots,
  sailTheAzuriteSea,
  yokaiScientificSupervillain,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sail The Azurite Sea", () => {
  it("This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: sailTheAzuriteSea.cost,
      hand: [sailTheAzuriteSea, microbots, yokaiScientificSupervillain],
      deck: 6,
    });

    await testEngine.putIntoInkwell(microbots);

    expect(
      testEngine.store.tableStore.getTable("player_one").canAddToInkwell(),
    ).toEqual(false);

    await testEngine.playCard(sailTheAzuriteSea);

    expect(
      testEngine.store.tableStore.getTable("player_one").canAddToInkwell(),
    ).toEqual(true);

    await testEngine.putIntoInkwell(yokaiScientificSupervillain);

    expect(
      testEngine.store.tableStore.getTable("player_one").canAddToInkwell(),
    ).toEqual(false);
  });
});
