import { describe, it } from "bun:test";
import { anastasiaBossyStepsister } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Anastasia - Bossy Stepsister", () => {
  it.skip("OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: anastasiaBossyStepsister.cost,
      play: [anastasiaBossyStepsister],
      hand: [anastasiaBossyStepsister],
    });

    await testEngine.playCard(anastasiaBossyStepsister);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
