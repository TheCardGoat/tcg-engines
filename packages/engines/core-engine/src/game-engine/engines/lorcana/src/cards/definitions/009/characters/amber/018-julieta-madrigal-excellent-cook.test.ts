import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { julietaMadrigalExcellentCook } from "./018-julieta-madrigal-excellent-cook";

describe("Julieta Madrigal - Excellent Cook", () => {
  it.skip("**SIGNATURE RECIPE** When you play this character, you may remove up to 2 damage from chosen character. If you removed damage this way, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: julietaMadrigalExcellentCook.cost,
      hand: [julietaMadrigalExcellentCook],
    });

    await testEngine.playCard(julietaMadrigalExcellentCook);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
