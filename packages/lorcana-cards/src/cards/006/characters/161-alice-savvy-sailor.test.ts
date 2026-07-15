// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { aliceSavvySailor } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Alice - Savvy Sailor", () => {
//   It.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [aliceSavvySailor],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(aliceSavvySailor);
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
//
//   It.skip("AHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: aliceSavvySailor.cost,
//       Play: [aliceSavvySailor],
//       Hand: [aliceSavvySailor],
//     });
//
//     Await testEngine.playCard(aliceSavvySailor);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
