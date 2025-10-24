import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { fireTheCannons } from "./200-fire-the-cannons-";

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
