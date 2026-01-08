// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   deweyLovableShowoff,
//   neroFearsomeCrocodile,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Nero - Fearsome Crocodile", () => {
//   it("AND MEAN {E} – Move 1 damage counter from this character to chosen opposing character.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [neroFearsomeCrocodile],
//       },
//       {
//         play: [deweyLovableShowoff],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(neroFearsomeCrocodile);
//     const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     await testEngine.setCardDamage(cardUnderTest, 1);
//     await testEngine.activateCard(cardUnderTest);
//     await testEngine.resolveTopOfStack(
//       { targets: [neroFearsomeCrocodile] },
//       true,
//     );
//     await testEngine.resolveTopOfStack({ targets: [deweyLovableShowoff] });
//
//     expect(cardUnderTest.damage).toEqual(0);
//     expect(target.damage).toEqual(1);
//   });
// });
//
