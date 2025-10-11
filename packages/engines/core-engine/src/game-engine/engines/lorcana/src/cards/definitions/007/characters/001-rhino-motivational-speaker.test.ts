import { describe, it } from "bun:test";
import { rhinoMotivationalSpeaker } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rhino - Motivational Speaker", () => {
  it.skip("DESTINY CALLING Your other characters get +2 {W}.", async () => {
    const testEngine = new TestEngine({
      inkwell: rhinoMotivationalSpeaker.cost,
      play: [rhinoMotivationalSpeaker],
      hand: [rhinoMotivationalSpeaker],
    });

    await testEngine.playCard(rhinoMotivationalSpeaker);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
