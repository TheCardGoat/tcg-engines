// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import {
//   LumiereFieryFriend,
//   MrsPottsEnchantedTeapot,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { theWardrobePerceptiveFriend } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Wardrobe - Perceptive Friend", () => {
//   It("I HAVE JUST THE THING {E}, Choose and discard an item card - Draw 2 cards", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theWardrobePerceptiveFriend.cost,
//       Play: [theWardrobePerceptiveFriend],
//       Hand: [pawpsicle],
//       Deck: [lumiereFieryFriend, mrsPottsEnchantedTeapot],
//     });
//
//     Await testEngine.activateCard(theWardrobePerceptiveFriend, {
//       Costs: [pawpsicle],
//     });
//
//     Expect(testEngine.getCardModel(pawpsicle).zone).toBe("discard");
//
//     Expect(testEngine.getCardModel(lumiereFieryFriend).zone).toBe("hand");
//     Expect(testEngine.getCardModel(mrsPottsEnchantedTeapot).zone).toBe("hand");
//   });
// });
//
// Describe("Regression Tests", () => {
//   It("The Wardrobe - Perceptive Friend should not draw then there's no items in hand", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theWardrobePerceptiveFriend.cost,
//       Play: [theWardrobePerceptiveFriend],
//       Hand: [mrsPottsEnchantedTeapot],
//       Deck: [lumiereFieryFriend, pawpsicle],
//     });
//
//     Await testEngine.activateCard(theWardrobePerceptiveFriend);
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Expect(testEngine.getCardModel(pawpsicle).zone).toBe("deck");
//     Expect(testEngine.getCardModel(lumiereFieryFriend).zone).toBe("deck");
//     Expect(testEngine.getCardModel(mrsPottsEnchantedTeapot).zone).toBe("hand");
//   });
// });
//
