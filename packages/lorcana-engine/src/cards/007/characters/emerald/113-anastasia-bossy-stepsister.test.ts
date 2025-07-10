/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { anastasiaBossyStepsister } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
