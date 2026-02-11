// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { quickShot } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Quick Shot", () => {
//   It("Deal 1 damage to chosen character. Draw a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: quickShot.cost,
//         Hand: [quickShot],
//         Deck: 2,
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Await testEngine.playCard(quickShot);
//     Await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
//     Expect(testEngine.getCardModel(goofyKnightForADay).meta.damage).toEqual(1);
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Deck: 1,
//         Hand: 1,
//       }),
//     );
//   });
// });
//
