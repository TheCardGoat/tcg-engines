// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CogsworthIlluminaryWatchman,
//   MaleficentFearsomeQueen,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Maleficent - Fearsome Queen", () => {
//   // TODO: Fix the card, it's broken dynamicAmount.ts is not calculating correctly the amount of targets
//   // And also the filter lte 3 on the property cost is not working correctly
//   It.skip("**EVERYONE LISTEN** When you play this character, for each character named Maleficent you have in play, return chosen opposing character, item, or location of cost 3 or less to their player's hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: maleficentFearsomeQueen.cost,
//         Hand: [maleficentFearsomeQueen],
//       },
//       {
//         Play: [cogsworthIlluminaryWatchman],
//       },
//     );
//
//     Await testEngine.playCard(maleficentFearsomeQueen);
//     Await testEngine.resolveTopOfStack({
//       Targets: [cogsworthIlluminaryWatchman],
//     });
//
//     Expect(testEngine.getCardModel(cogsworthIlluminaryWatchman).zone).toBe(
//       "hand",
//     );
//   });
// });
//
