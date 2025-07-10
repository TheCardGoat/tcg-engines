/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  dalmatianPuppyTailWagger,
  patchPlayfulPup,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
