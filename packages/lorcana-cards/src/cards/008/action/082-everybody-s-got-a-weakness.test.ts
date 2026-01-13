// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import {
//   dalmatianPuppyTailWagger,
//   deweyLovableShowoff,
//   everybodysGotAWeakness,
//   khanWarHorse,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Everybody's Got A Weakness", () => {
//   it("Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.", async () => {
//     const charsInPlay = [
//       deweyLovableShowoff,
//       khanWarHorse,
//       dalmatianPuppyTailWagger,
//     ];
//     const testEngine = new TestEngine(
//       {
//         inkwell: everybodysGotAWeakness.cost,
//         play: charsInPlay,
//         hand: [everybodysGotAWeakness],
//         deck: 10,
//       },
//       {
//         play: [goofyKnightForADay],
//       },
//     );
//
//     for (const char of charsInPlay) {
//       await testEngine.setCardDamage(char, 2);
//     }
//
//     await testEngine.playCard(everybodysGotAWeakness, {
//       targets: [goofyKnightForADay],
//     });
//
//     for (const char of charsInPlay) {
//       expect(testEngine.getCardModel(char).damage).toEqual(1);
//     }
//     expect(testEngine.getCardModel(goofyKnightForADay).damage).toEqual(
//       charsInPlay.length,
//     );
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         hand: charsInPlay.length,
//         deck: 10 - charsInPlay.length,
//       }),
//     );
//   });
// });
//
