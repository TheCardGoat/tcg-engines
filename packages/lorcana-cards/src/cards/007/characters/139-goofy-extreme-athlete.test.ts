// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyExtremeAthlete } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goofy - Extreme Athlete", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [goofyExtremeAthlete],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(goofyExtremeAthlete);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It.skip("STAR POWER Whenever this character challenges another character, your other characters get +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: goofyExtremeAthlete.cost,
//       Play: [goofyExtremeAthlete],
//       Hand: [goofyExtremeAthlete],
//     });
//
//     Await testEngine.playCard(goofyExtremeAthlete);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
