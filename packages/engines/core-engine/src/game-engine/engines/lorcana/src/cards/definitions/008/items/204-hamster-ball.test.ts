/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  hamsterBall,
  jumbaJookibaCriticalScientist,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hamster Ball", () => {
  it("ROLL WITH THE PUNCHES {E}, 1 {I} – Chosen character with no damage gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)", async () => {
    const testEngine = new TestEngine({
      inkwell: 1,
      play: [hamsterBall, jumbaJookibaCriticalScientist],
    });

    await testEngine.activateCard(hamsterBall, {
      targets: [jumbaJookibaCriticalScientist],
    });

    expect(
      testEngine.getCardModel(jumbaJookibaCriticalScientist).hasResist,
    ).toBe(true);
  });
});
