/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
import {
  lumiereFieryFriend,
  mrsPottsEnchantedTeapot,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { theWardrobePerceptiveFriend } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("The Wardrobe - Perceptive Friend", () => {
  it("I HAVE JUST THE THING {E}, Choose and discard an item card - Draw 2 cards", async () => {
    const testEngine = new TestEngine({
      inkwell: theWardrobePerceptiveFriend.cost,
      play: [theWardrobePerceptiveFriend],
      hand: [pawpsicle],
      deck: [lumiereFieryFriend, mrsPottsEnchantedTeapot],
    });

    await testEngine.activateCard(theWardrobePerceptiveFriend, {
      costs: [pawpsicle],
    });

    expect(testEngine.getCardModel(pawpsicle).zone).toBe("discard");

    expect(testEngine.getCardModel(lumiereFieryFriend).zone).toBe("hand");
    expect(testEngine.getCardModel(mrsPottsEnchantedTeapot).zone).toBe("hand");
  });
});

describe("Regression Tests", () => {
  it("The Wardrobe - Perceptive Friend should not draw then there's no items in hand", async () => {
    const testEngine = new TestEngine({
      inkwell: theWardrobePerceptiveFriend.cost,
      play: [theWardrobePerceptiveFriend],
      hand: [mrsPottsEnchantedTeapot],
      deck: [lumiereFieryFriend, pawpsicle],
    });

    await testEngine.activateCard(theWardrobePerceptiveFriend);

    expect(testEngine.stackLayers).toHaveLength(0);

    expect(testEngine.getCardModel(pawpsicle).zone).toBe("deck");
    expect(testEngine.getCardModel(lumiereFieryFriend).zone).toBe("deck");
    expect(testEngine.getCardModel(mrsPottsEnchantedTeapot).zone).toBe("hand");
  });
});
