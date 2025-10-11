import { describe, it } from "bun:test";
import { rabbitIndignantPirate } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rabbit - Indignant Pirate", () => {
  it.skip("BE MORE CAREFUL When you play this character, you may remove up to 1 damage from chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: rabbitIndignantPirate.cost,
      hand: [rabbitIndignantPirate],
    });

    await testEngine.playCard(rabbitIndignantPirate);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
