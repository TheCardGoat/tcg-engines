import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { lastditchEffort } from "./062-last-ditch-effort";

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
