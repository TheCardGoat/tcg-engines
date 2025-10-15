import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { smash } from "./198-smash";

describe("Smash", () => {
  it.skip("Deal 3 damage to chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: smash.cost,
      play: [smash],
      hand: [smash],
    });

    await testEngine.playCard(smash);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
