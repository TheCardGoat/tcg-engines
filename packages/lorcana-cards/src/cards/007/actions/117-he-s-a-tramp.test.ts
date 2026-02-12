// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mauiHalfshark } from "@lorcanito/lorcana-engine/cards/006";
// Import { hesATramp } from "@lorcanito/lorcana-engine/cards/007/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("He's A Tramp", () => {
//   It("Chosen character gets +1 {S} this turn for each character you have in play.", async () => {
//     Const charsInPlay = [mickeyBraveLittleTailor, mauiHalfshark];
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: charsInPlay,
//       Hand: [hesATramp],
//     });
//
//     Await testEngine.playCard(hesATramp);
//     Await testEngine.resolveTopOfStack({ targets: [mickeyBraveLittleTailor] });
//
//     Expect(testEngine.getCardModel(mickeyBraveLittleTailor).strength).toBe(
//       MickeyBraveLittleTailor.strength + charsInPlay.length,
//     );
//   });
// });
//
