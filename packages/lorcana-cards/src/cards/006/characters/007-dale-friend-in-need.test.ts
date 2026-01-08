// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   chipFriendIndeed,
//   daleFriendInNeed,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dale - Friend in Need", () => {
//   describe("**CHIP'S PARTNER** This character enters play exerted unless you have a character named Chip in play.", () => {
//     it("No Chip in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: daleFriendInNeed.cost,
//         hand: [daleFriendInNeed],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(daleFriendInNeed);
//
//       await testEngine.playCard(cardUnderTest);
//
//       expect(cardUnderTest.exerted).toBe(true);
//     });
//
//     it("Chip in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: daleFriendInNeed.cost,
//         hand: [daleFriendInNeed],
//         play: [chipFriendIndeed],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(daleFriendInNeed);
//
//       await testEngine.playCard(cardUnderTest);
//
//       expect(cardUnderTest.exerted).toBe(false);
//     });
//   });
// });
//
