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
//   KhanWarHorse,
//   NothingWeWontDo,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Nothing We Won't Do", () => {
//   It("Sing Together 8 (Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: nothingWeWontDo.cost,
//       Hand: [nothingWeWontDo],
//     });
//
//     Expect(testEngine.getCardModel(nothingWeWontDo).hasSingTogether).toEqual(
//       True,
//     );
//   });
//
//   It("Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.", async () => {
//     Const charsInPlay = [
//       DeweyLovableShowoff,
//       KhanWarHorse,
//       DalmatianPuppyTailWagger,
//     ];
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: nothingWeWontDo.cost,
//         Play: charsInPlay,
//         Hand: [nothingWeWontDo],
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     For (const char of charsInPlay) {
//       Await testEngine.tapCard(char);
//
//       Expect(testEngine.getCardModel(char).ready).toEqual(false);
//       Expect(testEngine.getCardModel(char).hasQuestRestriction).toEqual(false);
//       Expect(testEngine.getCardModel(char).damage).toEqual(0);
//       Expect(testEngine.getCardModel(char).zone).toEqual("play");
//     }
//
//     Await testEngine.playCard(nothingWeWontDo);
//     Await testEngine.tapCard(goofyKnightForADay);
//
//     For (const char of charsInPlay) {
//       Const charModel = testEngine.getCardModel(char);
//
//       Expect(charModel.ready).toEqual(true);
//       Expect(charModel.hasQuestRestriction).toEqual(true);
//
//       Await testEngine.challenge({
//         Attacker: char,
//         Defender: goofyKnightForADay,
//       });
//
//       Expect(charModel.zone).toEqual("play");
//       Expect(charModel.damage).toEqual(0);
//     }
//   });
// });
//
