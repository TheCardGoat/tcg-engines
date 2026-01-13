// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   vanellopeVonSchweetzSpunkySpeedster,
//   wreckitRalphBackSeatDriver,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Wreck-it Ralph - Back Seat Driver", () => {
//   it("CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: wreckitRalphBackSeatDriver.cost,
//       hand: [wreckitRalphBackSeatDriver],
//       play: [vanellopeVonSchweetzSpunkySpeedster],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(wreckitRalphBackSeatDriver);
//     const targetCard = testEngine.getCardModel(
//       vanellopeVonSchweetzSpunkySpeedster,
//     );
//
//     await testEngine.playCard(cardUnderTest);
//     await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     expect(targetCard.strength).toEqual(
//       vanellopeVonSchweetzSpunkySpeedster?.strength + 4,
//     );
//   });
// });
//
