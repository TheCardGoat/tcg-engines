/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { tinkerBellGenerousFairy } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tinker Bell - Generous Fairy", () => {
  it.skip("MAKE A NEW FRIEND When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: tinkerBellGenerousFairy.cost,
      hand: [tinkerBellGenerousFairy],
    });

    await testEngine.playCard(tinkerBellGenerousFairy);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
