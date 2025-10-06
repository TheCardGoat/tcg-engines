/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { julietaMadrigalExcellentCook } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

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
