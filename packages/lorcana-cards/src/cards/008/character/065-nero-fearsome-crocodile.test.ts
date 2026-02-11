// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   NeroFearsomeCrocodile,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Nero - Fearsome Crocodile", () => {
//   It("AND MEAN {E} – Move 1 damage counter from this character to chosen opposing character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [neroFearsomeCrocodile],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(neroFearsomeCrocodile);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.setCardDamage(cardUnderTest, 1);
//     Await testEngine.activateCard(cardUnderTest);
//     Await testEngine.resolveTopOfStack(
//       { targets: [neroFearsomeCrocodile] },
//       True,
//     );
//     Await testEngine.resolveTopOfStack({ targets: [deweyLovableShowoff] });
//
//     Expect(cardUnderTest.damage).toEqual(0);
//     Expect(target.damage).toEqual(1);
//   });
// });
//
