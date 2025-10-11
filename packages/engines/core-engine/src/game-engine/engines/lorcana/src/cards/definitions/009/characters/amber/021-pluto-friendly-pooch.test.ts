import { describe, it } from "bun:test";
import { plutoFriendlyPooch } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
