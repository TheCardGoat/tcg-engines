// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AmethystCoil,
//   KodaSmallishBear,
//   SirKayUnrulyKnight,
//   SuzyMasterSeamstress,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Amethyst Coil", () => {
//   It("MAGICAL TOUCH During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [amethystCoil, sirKayUnrulyKnight],
//         Hand: [suzyMasterSeamstress],
//       },
//       {
//         Play: [kodaSmallishBear],
//       },
//     );
//
//     Await testEngine.setCardDamage(sirKayUnrulyKnight, 1);
//     Await testEngine.putIntoInkwell(suzyMasterSeamstress);
//
//     Expect(testEngine.getCardModel(sirKayUnrulyKnight).damage).toBe(1);
//     Expect(testEngine.getCardModel(kodaSmallishBear).damage).toBe(0);
//
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [sirKayUnrulyKnight],
//       },
//       True,
//     );
//     Await testEngine.resolveTopOfStack({
//       Targets: [kodaSmallishBear],
//     });
//
//     Expect(testEngine.getCardModel(sirKayUnrulyKnight).damage).toBe(0);
//     Expect(testEngine.getCardModel(kodaSmallishBear).damage).toBe(1);
//   });
// });
//
