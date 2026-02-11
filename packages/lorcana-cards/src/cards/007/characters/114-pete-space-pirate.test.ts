// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KakamoraBandOfPirates,
//   PeteSpacePirate,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import {
//   MickeyMouseGiantMouse,
//   NothingWeWontDo,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pete - Space Pirate", () => {
//   It("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Pete.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [peteSpacePirate],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(peteSpacePirate);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   Describe("FRIGHTFUL SCHEME While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1. (Damage dealt to them is reduced by 1.)", () => {
//     It("While this character is exerted, opposing characters can't exert to sing songs.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [peteSpacePirate],
//         },
//         {
//           Play: [kakamoraBandOfPirates],
//         },
//       );
//
//       Expect(testEngine.getCardModel(kakamoraBandOfPirates).hasVoiceless).toBe(
//         False,
//       );
//
//       Await testEngine.tapCard(peteSpacePirate);
//
//       Expect(testEngine.getCardModel(kakamoraBandOfPirates).hasVoiceless).toBe(
//         True,
//       );
//     });
//
//     It("While this character is exerted, your Pirate characters gain Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
//       Const testEngine = new TestEngine({
//         Play: [peteSpacePirate, kakamoraBandOfPirates],
//       });
//
//       Expect(testEngine.getCardModel(kakamoraBandOfPirates).hasResist).toBe(
//         False,
//       );
//       Expect(testEngine.getCardModel(peteSpacePirate).hasResist).toBe(false);
//
//       Await testEngine.tapCard(peteSpacePirate);
//
//       Expect(testEngine.getCardModel(kakamoraBandOfPirates).hasResist).toBe(
//         True,
//       );
//       Expect(testEngine.getCardModel(peteSpacePirate).hasResist).toBe(true);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("should apply resist to itself while challenging", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [peteSpacePirate],
//       },
//       {
//         Play: [kakamoraBandOfPirates],
//       },
//     );
//
//     Await testEngine.challenge({
//       Attacker: peteSpacePirate,
//       Defender: kakamoraBandOfPirates,
//       ExertDefender: true,
//     });
//
//     Expect(testEngine.getCardModel(peteSpacePirate).hasResist).toBe(true);
//     Expect(testEngine.getCardModel(peteSpacePirate).damage).toBe(
//       KakamoraBandOfPirates.strength - 1,
//     );
//   });
//
//   It("Should prevent Singing Together", async () => {
//     Const singers = [kakamoraBandOfPirates, mickeyMouseGiantMouse];
//     Const testEngine = new TestEngine(
//       {
//         Hand: [nothingWeWontDo],
//         Play: singers,
//       },
//       {
//         Play: [peteSpacePirate],
//       },
//     );
//
//     For (const singer of singers) {
//       Expect(testEngine.getCardModel(singer).hasVoiceless).toBe(false);
//       Expect(testEngine.getCardModel(singer).canSing).toBe(true);
//     }
//
//     Await testEngine.tapCard(peteSpacePirate);
//
//     For (const singer of singers) {
//       Expect(testEngine.getCardModel(singer).hasVoiceless).toBe(true);
//       Expect(testEngine.getCardModel(singer).canSing).toBe(false);
//     }
//
//     Await testEngine.singSongTogether({
//       Song: nothingWeWontDo,
//       Singers: singers,
//     });
//
//     Expect(testEngine.getCardModel(nothingWeWontDo).zone).toBe("hand");
//   });
// });
//
