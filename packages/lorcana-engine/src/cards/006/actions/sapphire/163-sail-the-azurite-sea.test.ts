/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  microbots,
  sailTheAzuriteSea,
  yokaiScientificSupervillain,
} from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
