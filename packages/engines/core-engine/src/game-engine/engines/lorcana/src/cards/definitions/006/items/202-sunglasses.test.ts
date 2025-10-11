import { describe, it } from "bun:test";
import { sunglasses } from "~/game-engine/engines/lorcana/src/cards/definitions/006/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sunglasses", () => {
  it.skip("SPYCRAFT {E} - Draw a card, then choose and discard a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: sunglasses.cost,
      play: [sunglasses],
      hand: [sunglasses],
    });

    await testEngine.playCard(sunglasses);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
