// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { robinHoodChampionOfSherwood } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Robin Hood - Champion of Sherwood", () => {
//   It.skip("**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)_", async () => {
//     Const testEngine = new TestEngine({
//       Play: [robinHoodChampionOfSherwood],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(robinHoodChampionOfSherwood);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("**SKILLED COMBATANT** During your turn, whenever this character banishes another character in a challenge, gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: robinHoodChampionOfSherwood.cost,
//       Play: [robinHoodChampionOfSherwood],
//       Hand: [robinHoodChampionOfSherwood],
//     });
//
//     Await testEngine.playCard(robinHoodChampionOfSherwood);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("**THE GOOD OF OTHERS** When this character is banished in a challenge, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: robinHoodChampionOfSherwood.cost,
//       Play: [robinHoodChampionOfSherwood],
//       Hand: [robinHoodChampionOfSherwood],
//     });
//
//     Await testEngine.playCard(robinHoodChampionOfSherwood);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
