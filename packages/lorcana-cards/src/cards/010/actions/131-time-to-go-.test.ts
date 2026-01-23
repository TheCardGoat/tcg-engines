// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   robinHoodEphemeralArcher,
//   timeToGo,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Time to Go!", () => {
//   describe("Banish chosen character of yours to draw 2 cards. If that character had a card under them, draw 3 cards instead.", () => {
//     it("Having a card under them", async () => {
//       const testEngine = new TestEngine({
//         inkwell: timeToGo.cost + 1,
//         play: [robinHoodEphemeralArcher],
//         hand: [timeToGo],
//         deck: 10,
//       });
//
//       await testEngine.activateCard(robinHoodEphemeralArcher);
//       expect(
//         testEngine.getCardModel(robinHoodEphemeralArcher).cardsUnder,
//       ).toHaveLength(1);
//
//       await testEngine.playCard(timeToGo);
//
//       await testEngine.resolveTopOfStack({
//         targets: [robinHoodEphemeralArcher],
//       });
//
//       expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         expect.objectContaining({
//           deck: 6,
//           hand: 3,
//         }),
//       );
//     });
//
//     it("Not having a card under them", async () => {
//       const testEngine = new TestEngine({
//         inkwell: timeToGo.cost + 1,
//         play: [robinHoodEphemeralArcher],
//         hand: [timeToGo],
//         deck: 10,
//       });
//
//       await testEngine.playCard(timeToGo);
//
//       await testEngine.resolveTopOfStack({
//         targets: [robinHoodEphemeralArcher],
//       });
//
//       expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         expect.objectContaining({
//           deck: 8,
//           hand: 2,
//         }),
//       );
//     });
//   });
// });
//
