/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { rhinoMotivationalSpeaker } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

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
