import { describe, it } from "bun:test";
import { fireTheCannons } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fire the Cannons!", () => {
  it.skip("Deal 2 damage to chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: fireTheCannons.cost,
      play: [fireTheCannons],
      hand: [fireTheCannons],
    });

    await testEngine.playCard(fireTheCannons);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
