import { describe, it } from "bun:test";
import { dinnerBell } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dinner Bell", () => {
  it.skip("**YOU KNOW WHAT HAPPENS** {E}, 2 {I} − Draw cards equal to the damage on chosen character of yours, then banish them.", async () => {
    const testEngine = new TestEngine({
      inkwell: dinnerBell.cost,
      play: [dinnerBell],
      hand: [dinnerBell],
    });

    await testEngine.playCard(dinnerBell);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
