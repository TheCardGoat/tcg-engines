import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { bobbyZimuruskiSprayCheeseKid } from "./078-bobby-zimuruski-spray-cheese-kid";

describe("Bobby Zimuruski - Spray Cheese Kid", () => {
  it.skip("SO CHEESY When you play this character, you may draw a card, then choose and discard a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: bobbyZimuruskiSprayCheeseKid.cost,
      hand: [bobbyZimuruskiSprayCheeseKid],
    });

    await testEngine.playCard(bobbyZimuruskiSprayCheeseKid);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
