import { describe, it } from "bun:test";
import { lastditchEffort } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Last-ditch Effort", () => {
  it.skip("Exert chosen opposing character. Then chosen character of yours gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
    const testEngine = new TestEngine({
      inkwell: lastditchEffort.cost,
      play: [lastditchEffort],
      hand: [lastditchEffort],
    });

    await testEngine.playCard(lastditchEffort);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
