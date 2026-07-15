// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { sisuDaringVisitor } from "@lorcanito/lorcana-engine/cards/004/characters/123-sisu-daring-visitor";
// Import {
//   BambiLittlePrince,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bambi - Little Prince", () => {
//   It("SAY HELLO When you play this character, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: bambiLittlePrince.cost,
//       Hand: [bambiLittlePrince],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(bambiLittlePrince);
//
//     CardUnderTest.play();
//
//     Expect(testEngine.getPlayerLore()).toEqual(1);
//   });
//
//   It("KIND OF BASHFUL When an opponent plays a character, return this character to your hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: bambiLittlePrince.cost,
//         Play: [bambiLittlePrince],
//       },
//       {
//         Inkwell: deweyLovableShowoff.cost,
//         Hand: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(bambiLittlePrince);
//     Const cardOppo = testEngine.getCardModel(deweyLovableShowoff);
//
//     TestEngine.passTurn();
//
//     Await testEngine.playCard(cardOppo);
//
//     Expect(cardUnderTest.zone).toEqual("hand");
//   });
//
//   Describe("Regression tests", () => {
//     It("Sisu Interaction, banish should happen first.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: sisuDaringVisitor.cost,
//           Hand: [sisuDaringVisitor],
//         },
//         {
//           Play: [bambiLittlePrince],
//         },
//       );
//
//       Await testEngine.playCard(sisuDaringVisitor);
//       // While the trigger is not resolved, bambi should still be in play
//       Expect(testEngine.getCardModel(bambiLittlePrince).zone).toEqual("play");
//
//       Await testEngine.resolveTopOfStack(
//         { targets: [bambiLittlePrince] },
//         True,
//       );
//
//       // Active player trigger should happen first, so bambi should be banished, not returned to hand
//       Expect(testEngine.getCardModel(bambiLittlePrince).zone).toEqual(
//         "discard",
//       );
//     });
//   });
// });
//
