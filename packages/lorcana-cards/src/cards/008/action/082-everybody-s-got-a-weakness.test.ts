// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   DalmatianPuppyTailWagger,
//   DeweyLovableShowoff,
//   EverybodysGotAWeakness,
//   KhanWarHorse,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Everybody's Got A Weakness", () => {
//   It("Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.", async () => {
//     Const charsInPlay = [
//       DeweyLovableShowoff,
//       KhanWarHorse,
//       DalmatianPuppyTailWagger,
//     ];
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: everybodysGotAWeakness.cost,
//         Play: charsInPlay,
//         Hand: [everybodysGotAWeakness],
//         Deck: 10,
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     For (const char of charsInPlay) {
//       Await testEngine.setCardDamage(char, 2);
//     }
//
//     Await testEngine.playCard(everybodysGotAWeakness, {
//       Targets: [goofyKnightForADay],
//     });
//
//     For (const char of charsInPlay) {
//       Expect(testEngine.getCardModel(char).damage).toEqual(1);
//     }
//     Expect(testEngine.getCardModel(goofyKnightForADay).damage).toEqual(
//       CharsInPlay.length,
//     );
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: charsInPlay.length,
//         Deck: 10 - charsInPlay.length,
//       }),
//     );
//   });
// });
//
