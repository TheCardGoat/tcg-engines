import { describe, it } from "bun:test";
import { boltHeadstrongDog } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
