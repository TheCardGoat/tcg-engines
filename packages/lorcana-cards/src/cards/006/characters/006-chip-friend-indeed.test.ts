// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { chipFriendIndeed } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Chip - Friend Indeed", () => {
//   it("**DALE'S PARTNER** When you play this character, chosen character gets +1 {L} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: chipFriendIndeed.cost,
//       hand: [chipFriendIndeed],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(chipFriendIndeed);
//     await testEngine.playCard(cardUnderTest);
//
//     await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });
//     expect(cardUnderTest.lore).toEqual(chipFriendIndeed.lore + 1);
//   });
// });
//
