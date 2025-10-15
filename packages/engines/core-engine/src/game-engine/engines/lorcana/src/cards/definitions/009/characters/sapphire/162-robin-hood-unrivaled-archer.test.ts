import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { robinHoodUnrivaledArcher } from "./162-robin-hood-unrivaled-archer";

describe("Robin Hood - Unrivaled Archer", () => {
  it.skip("**Feed The Poor** When you play this character, if an opponent has more cards in their hand than you, draw a card./n/n**Good Shot** During your turn, this character gains **Evasive**. (_They can challenge characters with Evasive._)", async () => {
    const testEngine = new TestEngine({
      inkwell: robinHoodUnrivaledArcher.cost,
      hand: [robinHoodUnrivaledArcher],
    });

    await testEngine.playCard(robinHoodUnrivaledArcher);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
