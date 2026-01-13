// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   deweyLovableShowoff,
//   dormouseEasilyAgitated,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dormouse - Easily Agitated", () => {
//   it("VERY RUDE INDEED When you play this character, you may put 1 damage counter on chosen character.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: dormouseEasilyAgitated.cost,
//         hand: [dormouseEasilyAgitated],
//       },
//       {
//         play: [deweyLovableShowoff],
//       },
//     );
//
//     const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     await testEngine.playCard(dormouseEasilyAgitated);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     expect(target.damage).toEqual(1);
//   });
// });
//
