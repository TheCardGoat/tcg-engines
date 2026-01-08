// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { quickShot } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Quick Shot", () => {
//   it("Deal 1 damage to chosen character. Draw a card.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: quickShot.cost,
//         hand: [quickShot],
//         deck: 2,
//       },
//       {
//         play: [goofyKnightForADay],
//       },
//     );
//
//     await testEngine.playCard(quickShot);
//     await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
//     expect(testEngine.getCardModel(goofyKnightForADay).meta.damage).toEqual(1);
//     expect(testEngine.getZonesCardCount()).toEqual(
//       expect.objectContaining({
//         deck: 1,
//         hand: 1,
//       }),
//     );
//   });
// });
//
