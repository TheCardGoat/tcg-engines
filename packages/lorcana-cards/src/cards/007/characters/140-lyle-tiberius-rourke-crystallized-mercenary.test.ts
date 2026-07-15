// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KakamoraBandOfPirates,
//   KenaiProtectiveBrother,
//   LyleTiberiusRourkeCrystallizedMercenary,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lyle Tiberius Rourke - Crystallized Mercenary", () => {
//   It("EXPLOSIVE Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [lyleTiberiusRourkeCrystallizedMercenary],
//         Hand: [kenaiProtectiveBrother],
//       },
//       {
//         Play: [kakamoraBandOfPirates],
//       },
//     );
//
//     Await testEngine.putIntoInkwell(kenaiProtectiveBrother);
//
//     Expect(testEngine.getCardModel(kakamoraBandOfPirates).damage).toEqual(2);
//     Expect(
//       TestEngine.getCardModel(lyleTiberiusRourkeCrystallizedMercenary).damage,
//     ).toEqual(2);
//   });
// });
//
