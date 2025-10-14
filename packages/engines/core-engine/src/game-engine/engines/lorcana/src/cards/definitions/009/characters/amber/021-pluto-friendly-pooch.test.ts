import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { plutoFriendlyPooch } from "./021-pluto-friendly-pooch";

describe("Pluto - Friendly Pooch", () => {
  it.skip("**GOOD DOG** {E} – You pay 1 {I} less for the next character you play this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: plutoFriendlyPooch.cost,
      play: [plutoFriendlyPooch],
      hand: [plutoFriendlyPooch],
    });

    await testEngine.playCard(plutoFriendlyPooch);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
