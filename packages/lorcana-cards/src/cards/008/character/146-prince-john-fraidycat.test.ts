// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mickeyMouseFoodFightDefender } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { princeJohnFraidycat } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Prince John - Fraidy-Cat", () => {
//   It("HELP! HELP! Whenever an opponent plays a character, deal 1 damage to this character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mickeyMouseTrueFriend.cost + mickeyMouseFoodFightDefender.cost,
//         Hand: [mickeyMouseTrueFriend, mickeyMouseFoodFightDefender],
//       },
//       {
//         Play: [princeJohnFraidycat],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(princeJohnFraidycat);
//     Expect(cardUnderTest.damage).toEqual(0);
//
//     Await testEngine.playCard(mickeyMouseTrueFriend);
//     Expect(cardUnderTest.damage).toEqual(1);
//
//     Await testEngine.playCard(mickeyMouseFoodFightDefender);
//     Expect(cardUnderTest.damage).toEqual(2);
//   });
// });
//
