import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { beKingUndisputed } from "./133-be-king-undisputed";

describe("Be King Undisputed", () => {
  it.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_", async () => {
    const testEngine = new TestEngine({
      inkwell: beKingUndisputed.cost,
      play: [beKingUndisputed],
      hand: [beKingUndisputed],
    });

    await testEngine.playCard(beKingUndisputed);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("Each opponent chooses and banishes one of their characters.", async () => {
    const testEngine = new TestEngine({
      inkwell: beKingUndisputed.cost,
      play: [beKingUndisputed],
      hand: [beKingUndisputed],
    });

    await testEngine.playCard(beKingUndisputed);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
