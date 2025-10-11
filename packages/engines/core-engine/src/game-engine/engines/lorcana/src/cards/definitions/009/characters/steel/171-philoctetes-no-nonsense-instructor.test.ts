import { describe, it } from "bun:test";
import { philoctetesNononsenseInstructor } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Philoctetes - No-Nonsense Instructor", () => {
  it.skip("**YOU GOTTA STAY FOCUSED** Your Hero characters gain **Challenger** +1. _(They get +1 {S} while challenging.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: philoctetesNononsenseInstructor.cost,
      play: [philoctetesNononsenseInstructor],
      hand: [philoctetesNononsenseInstructor],
    });

    await testEngine.playCard(philoctetesNononsenseInstructor);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("**SHAMELESS PROMOTER** Whenever you play a Hero character, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: philoctetesNononsenseInstructor.cost,
      play: [philoctetesNononsenseInstructor],
      hand: [philoctetesNononsenseInstructor],
    });

    await testEngine.playCard(philoctetesNononsenseInstructor);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
