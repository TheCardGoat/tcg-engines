// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   balooCarefreeBear,
//   balooFriendAndGuardian,
//   balooLaidbackBear,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Baloo - Carefree Bear", () => {
//   it("has shift 3", async () => {
//     const testEngine = new TestEngine({
//       play: [balooCarefreeBear],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(balooCarefreeBear);
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   describe("ROLL WITH IT", () => {
//     it("chooses mode 1: Each player draws a card", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: balooCarefreeBear.cost,
//           hand: [balooCarefreeBear],
//           deck: 20,
//         },
//         {
//           deck: 10,
//         },
//       );
//
//       await testEngine.playCard(balooCarefreeBear);
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Both players should draw a card
//       expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         expect.objectContaining({
//           hand: 1,
//           deck: 19,
//         }),
//       );
//       expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         expect.objectContaining({
//           hand: 1,
//           deck: 9,
//         }),
//       );
//     });
//
//     it("chooses mode 2: Each player chooses and discards a card", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: balooCarefreeBear.cost,
//           hand: [balooCarefreeBear, balooFriendAndGuardian],
//         },
//         {
//           hand: [balooLaidbackBear],
//         },
//       );
//
//       await testEngine.playCard(balooCarefreeBear);
//       expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         expect.objectContaining({
//           hand: 1,
//           play: 1,
//         }),
//       );
//
//       await testEngine.resolveOptionalAbility();
//       await testEngine.resolveTopOfStack({ mode: "2" }, true);
//
//       // Active Player Chooses and Discards first
//       testEngine.changeActivePlayer("player_one");
//       await testEngine.resolveTopOfStack(
//         { targets: [balooFriendAndGuardian] },
//         true,
//       );
//       expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         expect.objectContaining({
//           hand: 0,
//           discard: 1,
//         }),
//       );
//
//       expect(testEngine.stackLayers).toHaveLength(1);
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.resolveTopOfStack(
//         { targets: [balooFriendAndGuardian] },
//         true,
//       );
//
//       await testEngine.resolveTopOfStack(
//         { targets: [balooLaidbackBear] },
//         true,
//       );
//       expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         expect.objectContaining({
//           hand: 0,
//           discard: 1,
//         }),
//       );
//     });
//
//     // it("handles empty hand when choosing discard mode", async () => {
//     //   const testEngine = new TestEngine({
//     //     inkwell: balooCarefreeBear.cost,
//     //     hand: [balooCarefreeBear],
//     //   });
//     //
//     //   await testEngine.playCard(balooCarefreeBear);
//     //   await testEngine.resolveOptionalAbility();
//     //   await testEngine.resolveTopOfStack({ mode: "2" }, true);
//     //
//     //   // Opponent has no cards to discard
//     //   expect(testEngine.getZonesCardCount("player_two")).toEqual(
//     //     expect.objectContaining({
//     //       hand: 0,
//     //       deck: 3,
//     //       discard: 0,
//     //     }),
//     //   );
//     //
//     //   // Current player has no cards to discard
//     //   testEngine.changeActivePlayer("player_one");
//     //   await testEngine.resolveTopOfStack({ targets: [] }, true);
//     //   expect(testEngine.getZonesCardCount("player_one")).toEqual(
//     //     expect.objectContaining({
//     //       hand: 0,
//     //       deck: 3,
//     //       discard: 0,
//     //     }),
//     //   );
//     // });
//   });
// });
//
