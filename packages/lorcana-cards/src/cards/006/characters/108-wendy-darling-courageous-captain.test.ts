// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   StitchAlienBuccaneer,
//   WendyDarlingCourageousCaptain,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Wendy Darling - Courageous Captain", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [wendyDarlingCourageousCaptain],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       WendyDarlingCourageousCaptain,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("LOOK LIVELY, CREW! While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: stitchAlienBuccaneer.cost,
//       Play: [wendyDarlingCourageousCaptain],
//       Hand: [stitchAlienBuccaneer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       WendyDarlingCourageousCaptain,
//     );
//     Expect(cardUnderTest.lore).toEqual(wendyDarlingCourageousCaptain.lore);
//     Expect(cardUnderTest.strength).toEqual(
//       WendyDarlingCourageousCaptain.strength,
//     );
//
//     Await testEngine.playCard(stitchAlienBuccaneer);
//
//     Expect(cardUnderTest.lore).toEqual(wendyDarlingCourageousCaptain.lore + 1);
//     Expect(cardUnderTest.strength).toEqual(
//       WendyDarlingCourageousCaptain.strength + 1,
//     );
//   });
// });
//
