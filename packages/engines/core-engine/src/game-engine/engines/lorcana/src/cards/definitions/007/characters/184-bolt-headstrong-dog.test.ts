/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { boltHeadstrongDog } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Bolt - Headstrong Dog", () => {
  it.skip("THERE'S NO TURNING BACK Whenever this character quests, if he has no damage, you may draw a card, then choose and discard a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: boltHeadstrongDog.cost,
      play: [boltHeadstrongDog],
      hand: [boltHeadstrongDog],
    });

    await testEngine.playCard(boltHeadstrongDog);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
