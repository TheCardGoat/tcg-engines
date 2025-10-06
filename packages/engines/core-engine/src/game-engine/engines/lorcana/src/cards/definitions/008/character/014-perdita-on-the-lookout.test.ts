/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  dalmatianPuppyTailWagger,
  perditaOnTheLookout,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Perdita - On the Lookout", () => {
  it("KEEPING WATCH While you have a Puppy character in play, this character gets +1 {W}.", async () => {
    const testEngine = new TestEngine({
      play: [perditaOnTheLookout, dalmatianPuppyTailWagger],
    });

    const cardToTest = testEngine.getCardModel(perditaOnTheLookout);

    expect(cardToTest.willpower).toBe(perditaOnTheLookout.willpower + 1);
  });
});
