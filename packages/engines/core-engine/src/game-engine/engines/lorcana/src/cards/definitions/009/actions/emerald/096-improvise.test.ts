import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { improvise } from "./096-improvise";

describe("Improvise", () => {
  it.skip("Chosen character gets +1 {S} this turn. Draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: improvise.cost,
      play: [improvise],
      hand: [improvise],
    });

    await testEngine.playCard(improvise);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
