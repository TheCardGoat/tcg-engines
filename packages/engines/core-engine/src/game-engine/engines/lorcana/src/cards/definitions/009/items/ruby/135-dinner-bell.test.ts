import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { dinnerBell } from "./135-dinner-bell";

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
