// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { zipperAstuteDecoy } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Zipper - Astute Decoy", () => {
//   It.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [zipperAstuteDecoy],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(zipperAstuteDecoy);
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
//
//   It.skip("RUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: zipperAstuteDecoy.cost,
//       Play: [zipperAstuteDecoy],
//       Hand: [zipperAstuteDecoy],
//     });
//
//     Await testEngine.playCard(zipperAstuteDecoy);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
