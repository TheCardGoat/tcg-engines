// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { sisuDaringVisitor } from "@lorcanito/lorcana-engine/cards/004/characters/123-sisu-daring-visitor";
// import {
//   bambiLittlePrince,
//   deweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bambi - Little Prince", () => {
//   it("SAY HELLO When you play this character, gain 1 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: bambiLittlePrince.cost,
//       hand: [bambiLittlePrince],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(bambiLittlePrince);
//
//     cardUnderTest.play();
//
//     expect(testEngine.getPlayerLore()).toEqual(1);
//   });
//
//   it("KIND OF BASHFUL When an opponent plays a character, return this character to your hand.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: bambiLittlePrince.cost,
//         play: [bambiLittlePrince],
//       },
//       {
//         inkwell: deweyLovableShowoff.cost,
//         hand: [deweyLovableShowoff],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(bambiLittlePrince);
//     const cardOppo = testEngine.getCardModel(deweyLovableShowoff);
//
//     testEngine.passTurn();
//
//     await testEngine.playCard(cardOppo);
//
//     expect(cardUnderTest.zone).toEqual("hand");
//   });
//
//   describe("Regression tests", () => {
//     it("Sisu Interaction, banish should happen first.", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: sisuDaringVisitor.cost,
//           hand: [sisuDaringVisitor],
//         },
//         {
//           play: [bambiLittlePrince],
//         },
//       );
//
//       await testEngine.playCard(sisuDaringVisitor);
//       // While the trigger is not resolved, bambi should still be in play
//       expect(testEngine.getCardModel(bambiLittlePrince).zone).toEqual("play");
//
//       await testEngine.resolveTopOfStack(
//         { targets: [bambiLittlePrince] },
//         true,
//       );
//
//       // Active player trigger should happen first, so bambi should be banished, not returned to hand
//       expect(testEngine.getCardModel(bambiLittlePrince).zone).toEqual(
//         "discard",
//       );
//     });
//   });
// });
//
