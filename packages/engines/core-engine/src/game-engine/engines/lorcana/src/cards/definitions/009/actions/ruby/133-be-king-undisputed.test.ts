import { describe, it } from "bun:test";
import { beKingUndisputed } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
