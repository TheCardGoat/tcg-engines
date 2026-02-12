// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goGoTomagoDartingDynamo } from "@lorcanito/lorcana-engine/cards/006";
// Import { goGoTomagoCuttingEdge } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Go Go Tomago - Cutting Edge", () => {
//   It("Shift 4)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [goGoTomagoCuttingEdge],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(goGoTomagoCuttingEdge);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [goGoTomagoCuttingEdge],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(goGoTomagoCuttingEdge);
//     Console.log(JSON.stringify(cardUnderTest.nativeAbilities()));
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("ZERO RESISTANCE When you play this character, if you used Shift to play her, you may put chosen character into their player's inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: goGoTomagoCuttingEdge.cost,
//       Hand: [goGoTomagoCuttingEdge],
//       Play: [goGoTomagoDartingDynamo],
//     });
//
//     Await testEngine.shiftCard({
//       Shifter: goGoTomagoCuttingEdge,
//       Shifted: goGoTomagoDartingDynamo,
//     });
//     Const cardUnderTest = testEngine.getCardModel(goGoTomagoCuttingEdge);
//     Console.log(JSON.stringify(cardUnderTest.nativeAbilities()));
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [goGoTomagoCuttingEdge] });
//
//     Expect(testEngine.getTotalInkwellCardCount("player_one")).toBe(
//       GoGoTomagoCuttingEdge.cost + 2,
//     );
//     Expect(testEngine.getCardModel(goGoTomagoDartingDynamo).zone).toBe(
//       "inkwell",
//     );
//
//     Expect(testEngine.getCardModel(goGoTomagoCuttingEdge).zone).toBe("inkwell");
//
//     Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(0);
//   });
// });
//
