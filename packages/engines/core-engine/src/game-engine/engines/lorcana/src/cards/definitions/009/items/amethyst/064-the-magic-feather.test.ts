import { describe, expect, it } from "bun:test";
import { deweyLovableShowoff } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { theMagicFeather } from "./064-the-magic-feather";

describe("The Magic Feather", () => {
  it("NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive. (Only characters with Evasive can challenge them.)", async () => {
    const testEngine = new TestEngine({
      inkwell: theMagicFeather.cost,
      play: [deweyLovableShowoff],
      hand: [theMagicFeather],
    });

    const cardUnderTest = testEngine.getCardModel(theMagicFeather);
    const targetCard = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.playCard(cardUnderTest);

    await testEngine.resolveTopOfStack({ targets: [targetCard] });

    expect(targetCard.hasEvasive).toBe(true);
  });

  it("GROUNDED 3 {I} – Return this item to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: 3,
      play: [theMagicFeather],
    });

    const cardUnderTest = testEngine.getCardModel(theMagicFeather);

    expect(cardUnderTest.zone).toBe("play");

    testEngine.activateCard(cardUnderTest);

    expect(cardUnderTest.zone).toBe("hand");
  });

  it("Character loses Evasive when the item leaves play", async () => {
    const testEngine = new TestEngine({
      inkwell: theMagicFeather.cost + 3,
      play: [deweyLovableShowoff],
      hand: [theMagicFeather],
    });

    const itemCard = testEngine.getCardModel(theMagicFeather);
    const characterCard = testEngine.getCardModel(deweyLovableShowoff);

    // Play the item and choose the character
    await testEngine.playCard(itemCard);
    await testEngine.resolveTopOfStack({ targets: [characterCard] });

    // Verify character has Evasive
    expect(characterCard.hasEvasive).toBe(true);

    // Use GROUNDED ability to return the item to hand
    testEngine.activateCard(itemCard);

    // Verify character lost Evasive when item left play
    expect(characterCard.hasEvasive).toBe(false);
  });
});
