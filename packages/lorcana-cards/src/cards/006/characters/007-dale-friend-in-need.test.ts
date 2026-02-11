// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChipFriendIndeed,
//   DaleFriendInNeed,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dale - Friend in Need", () => {
//   Describe("**CHIP'S PARTNER** This character enters play exerted unless you have a character named Chip in play.", () => {
//     It("No Chip in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: daleFriendInNeed.cost,
//         Hand: [daleFriendInNeed],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(daleFriendInNeed);
//
//       Await testEngine.playCard(cardUnderTest);
//
//       Expect(cardUnderTest.exerted).toBe(true);
//     });
//
//     It("Chip in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: daleFriendInNeed.cost,
//         Hand: [daleFriendInNeed],
//         Play: [chipFriendIndeed],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(daleFriendInNeed);
//
//       Await testEngine.playCard(cardUnderTest);
//
//       Expect(cardUnderTest.exerted).toBe(false);
//     });
//   });
// });
//
