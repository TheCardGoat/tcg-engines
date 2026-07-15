// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { naniCaringSister } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Nani - Caring Sister", () => {
//   It.skip("Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [naniCaringSister],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(naniCaringSister);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   It.skip("I AM SO SORRY 2 {I} - Chosen character gets -1 {S} until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: naniCaringSister.cost,
//       Play: [naniCaringSister],
//       Hand: [naniCaringSister],
//     });
//
//     Await testEngine.playCard(naniCaringSister);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
