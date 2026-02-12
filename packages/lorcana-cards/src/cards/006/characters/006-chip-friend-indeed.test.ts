// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { chipFriendIndeed } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Chip - Friend Indeed", () => {
//   It("**DALE'S PARTNER** When you play this character, chosen character gets +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: chipFriendIndeed.cost,
//       Hand: [chipFriendIndeed],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(chipFriendIndeed);
//     Await testEngine.playCard(cardUnderTest);
//
//     Await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });
//     Expect(cardUnderTest.lore).toEqual(chipFriendIndeed.lore + 1);
//   });
// });
//
