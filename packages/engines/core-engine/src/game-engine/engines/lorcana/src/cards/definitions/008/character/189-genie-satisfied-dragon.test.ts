/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { genieSatisfiedDragon } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Genie - Satisfied Dragon", () => {
  it("BUG CATCHER During your turn, this character gains Evasive. (They can challenge characters with Evasive.)", async () => {
    const testEngine = new TestEngine({
      inkwell: genieSatisfiedDragon.cost,
      play: [genieSatisfiedDragon],
      hand: [],
    });

    expect(testEngine.getCardModel(genieSatisfiedDragon).hasEvasive).toBe(true);

    await testEngine.passTurn();

    expect(testEngine.getCardModel(genieSatisfiedDragon).hasEvasive).toBe(
      false,
    );
  });
});
