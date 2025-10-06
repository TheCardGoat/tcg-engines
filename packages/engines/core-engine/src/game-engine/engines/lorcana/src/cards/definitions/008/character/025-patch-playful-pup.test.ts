/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  dalmatianPuppyTailWagger,
  patchPlayfulPup,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Patch - Playful Pup", () => {
  it("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [patchPlayfulPup],
    });

    const cardUnderTest = testEngine.getCardModel(patchPlayfulPup);
    expect(cardUnderTest.hasWard).toBe(true);
  });

  it("PUPPY BARKING While you have another Puppy character in play, this character gets +1 {L}.", async () => {
    const testEngine = new TestEngine({
      inkwell: dalmatianPuppyTailWagger.cost,
      play: [patchPlayfulPup],
      hand: [dalmatianPuppyTailWagger],
    });

    const cardUnderTest = testEngine.getCardModel(patchPlayfulPup);

    // Verify no lore boost
    expect(cardUnderTest.lore).toBe(1);

    // Play the other puppy
    await testEngine.playCard(dalmatianPuppyTailWagger);

    // Verify lore boost
    expect(cardUnderTest.lore).toBe(2);
  });
});
