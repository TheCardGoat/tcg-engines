// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   DormouseEasilyAgitated,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dormouse - Easily Agitated", () => {
//   It("VERY RUDE INDEED When you play this character, you may put 1 damage counter on chosen character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: dormouseEasilyAgitated.cost,
//         Hand: [dormouseEasilyAgitated],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.playCard(dormouseEasilyAgitated);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.damage).toEqual(1);
//   });
// });
//
