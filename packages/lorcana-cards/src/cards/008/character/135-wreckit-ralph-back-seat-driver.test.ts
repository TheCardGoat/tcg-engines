// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   VanellopeVonSchweetzSpunkySpeedster,
//   WreckitRalphBackSeatDriver,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Wreck-it Ralph - Back Seat Driver", () => {
//   It("CHARGED UP When you play this character, chosen Racer character gets +4 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: wreckitRalphBackSeatDriver.cost,
//       Hand: [wreckitRalphBackSeatDriver],
//       Play: [vanellopeVonSchweetzSpunkySpeedster],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(wreckitRalphBackSeatDriver);
//     Const targetCard = testEngine.getCardModel(
//       VanellopeVonSchweetzSpunkySpeedster,
//     );
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     Expect(targetCard.strength).toEqual(
//       VanellopeVonSchweetzSpunkySpeedster?.strength + 4,
//     );
//   });
// });
//
