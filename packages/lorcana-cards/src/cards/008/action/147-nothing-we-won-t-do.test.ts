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
//   khanWarHorse,
//   nothingWeWontDo,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Nothing We Won't Do", () => {
//   it("Sing Together 8 (Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: nothingWeWontDo.cost,
//       hand: [nothingWeWontDo],
//     });
//
//     expect(testEngine.getCardModel(nothingWeWontDo).hasSingTogether).toEqual(
//       true,
//     );
//   });
//
//   it("Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.", async () => {
//     const charsInPlay = [
//       deweyLovableShowoff,
//       khanWarHorse,
//       dalmatianPuppyTailWagger,
//     ];
//     const testEngine = new TestEngine(
//       {
//         inkwell: nothingWeWontDo.cost,
//         play: charsInPlay,
//         hand: [nothingWeWontDo],
//       },
//       {
//         play: [goofyKnightForADay],
//       },
//     );
//
//     for (const char of charsInPlay) {
//       await testEngine.tapCard(char);
//
//       expect(testEngine.getCardModel(char).ready).toEqual(false);
//       expect(testEngine.getCardModel(char).hasQuestRestriction).toEqual(false);
//       expect(testEngine.getCardModel(char).damage).toEqual(0);
//       expect(testEngine.getCardModel(char).zone).toEqual("play");
//     }
//
//     await testEngine.playCard(nothingWeWontDo);
//     await testEngine.tapCard(goofyKnightForADay);
//
//     for (const char of charsInPlay) {
//       const charModel = testEngine.getCardModel(char);
//
//       expect(charModel.ready).toEqual(true);
//       expect(charModel.hasQuestRestriction).toEqual(true);
//
//       await testEngine.challenge({
//         attacker: char,
//         defender: goofyKnightForADay,
//       });
//
//       expect(charModel.zone).toEqual("play");
//       expect(charModel.damage).toEqual(0);
//     }
//   });
// });
//
