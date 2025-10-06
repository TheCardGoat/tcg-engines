/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  falinePlayfulFawn,
  hiroHamadaIntuitiveThinker,
  princeJohnFraidycat,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Faline - Playful Fawn", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [falinePlayfulFawn],
    });

    const cardUnderTest = testEngine.getCardModel(falinePlayfulFawn);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("PRECOCIOUS FRIEND While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.", async () => {
    const testEngine = new TestEngine(
      {
        play: [falinePlayfulFawn],
      },
      {
        inkwell: princeJohnFraidycat.cost + hiroHamadaIntuitiveThinker.cost,
        hand: [princeJohnFraidycat, hiroHamadaIntuitiveThinker],
      },
    );

    // Has highest strength
    const cardUnderTest = testEngine.getCardModel(falinePlayfulFawn);
    expect(cardUnderTest.lore).toEqual(3);

    // Still has highest strength
    await testEngine.playCard(hiroHamadaIntuitiveThinker);
    expect(cardUnderTest.lore).toEqual(3);

    // Doesn't have highest strength
    await testEngine.playCard(princeJohnFraidycat);
    expect(cardUnderTest.lore).toEqual(1);
  });
});
