// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BalooCarefreeBear,
//   BalooFriendAndGuardian,
//   BalooLaidbackBear,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Baloo - Carefree Bear", () => {
//   It("has shift 3", async () => {
//     Const testEngine = new TestEngine({
//       Play: [balooCarefreeBear],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(balooCarefreeBear);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   Describe("ROLL WITH IT", () => {
//     It("chooses mode 1: Each player draws a card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: balooCarefreeBear.cost,
//           Hand: [balooCarefreeBear],
//           Deck: 20,
//         },
//         {
//           Deck: 10,
//         },
//       );
//
//       Await testEngine.playCard(balooCarefreeBear);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       // Both players should draw a card
//       Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Deck: 19,
//         }),
//       );
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Deck: 9,
//         }),
//       );
//     });
//
//     It("chooses mode 2: Each player chooses and discards a card", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: balooCarefreeBear.cost,
//           Hand: [balooCarefreeBear, balooFriendAndGuardian],
//         },
//         {
//           Hand: [balooLaidbackBear],
//         },
//       );
//
//       Await testEngine.playCard(balooCarefreeBear);
//       Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Play: 1,
//         }),
//       );
//
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ mode: "2" }, true);
//
//       // Active Player Chooses and Discards first
//       TestEngine.changeActivePlayer("player_one");
//       Await testEngine.resolveTopOfStack(
//         { targets: [balooFriendAndGuardian] },
//         True,
//       );
//       Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Discard: 1,
//         }),
//       );
//
//       Expect(testEngine.stackLayers).toHaveLength(1);
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack(
//         { targets: [balooFriendAndGuardian] },
//         True,
//       );
//
//       Await testEngine.resolveTopOfStack(
//         { targets: [balooLaidbackBear] },
//         True,
//       );
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Discard: 1,
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
