// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { testCharacterCard } from "@lorcanito/lorcana-engine/__mocks__/createGameMock";
// Import {
//   CinderellaTheRightOne,
//   TheGlassSlipper,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cinderella - The Right One", () => {
//   Describe("IF THE SLIPPER FITS When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.", () => {
//     It("Returning The Glass Slipper", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: cinderellaTheRightOne.cost,
//         Hand: [cinderellaTheRightOne],
//         Deck: [testCharacterCard],
//         Discard: [theGlassSlipper],
//       });
//
//       Await testEngine.playCard(cinderellaTheRightOne);
//       Await testEngine.acceptOptionalLayer();
//       Await testEngine.resolveTopOfStack({
//         Targets: [theGlassSlipper],
//       });
//
//       Expect(testEngine.getCardModel(theGlassSlipper).zone).toBe("deck");
//       Expect(testEngine.getLoreForPlayer()).toBe(3);
//
//       // Asserting it was not added to the top
//       Await testEngine.drawCard();
//       Expect(testEngine.getCardModel(theGlassSlipper).zone).toBe("deck");
//     });
//
//     It("Not Returning The Glass Slipper", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: cinderellaTheRightOne.cost,
//         Hand: [cinderellaTheRightOne],
//         Deck: [testCharacterCard],
//         Discard: [theGlassSlipper],
//       });
//
//       Await testEngine.playCard(cinderellaTheRightOne);
//       Await testEngine.skipTopOfStack();
//
//       Expect(testEngine.getCardModel(theGlassSlipper).zone).toBe("discard");
//       Expect(testEngine.getLoreForPlayer()).toBe(0);
//
//       // Asserting it was not added to the top
//       Await testEngine.drawCard();
//       Expect(testEngine.getCardModel(theGlassSlipper).zone).toBe("discard");
//     });
//   });
// });
//
