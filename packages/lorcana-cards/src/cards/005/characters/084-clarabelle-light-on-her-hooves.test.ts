// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { clarabelleLightOnHerHooves } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { intoTheUnknown } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Clarabelle - Light on Her Hooves", () => {
//   it("Shift", () => {
//     const testStore = new TestStore({
//       play: [clarabelleLightOnHerHooves],
//     });
//
//     const cardUnderTest = testStore.getCard(clarabelleLightOnHerHooves);
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   describe("**KEEP IN STEP** At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.", () => {
//     it("Draws cards until you have the same number of cards as the opponent", () => {
//       const testStore = new TestStore(
//         {
//           play: [clarabelleLightOnHerHooves],
//           hand: 2,
//           deck: 10,
//         },
//         {
//           hand: 6,
//           deck: 1,
//         },
//       );
//
//       testStore.passTurn();
//       testStore.resolveOptionalAbility();
//
//       expect(testStore.store.turnCount).toBe(1);
//       expect(testStore.getZonesCardCount("player_one").hand).toBe(6);
//       expect(testStore.getZonesCardCount("player_two").hand).toBe(6 + 1); // 1 card drawn
//     });
//
//     it("You have more cards than the opponent", () => {
//       const testStore = new TestStore(
//         {
//           play: [clarabelleLightOnHerHooves],
//           hand: 6,
//           deck: 10,
//         },
//         {
//           hand: 2,
//           deck: 1,
//         },
//       );
//
//       testStore.passTurn();
//
//       expect(testStore.store.turnCount).toBe(1);
//       expect(testStore.getZonesCardCount("player_one").hand).toBe(6);
//       expect(testStore.getZonesCardCount("player_two").hand).toBe(2 + 1); // 1 card drawn
//     });
//   });
//
//   describe("Regression tests", () => {
//     it("Double Clarabelles should let you pass your turn.", async () => {
//       const testStore = new TestEngine(
//         {
//           play: [clarabelleLightOnHerHooves, clarabelleLightOnHerHooves],
//           deck: 10,
//           hand: 2,
//         },
//         {
//           hand: 6,
//           deck: 1,
//         },
//       );
//
//       expect(testStore.store.turnCount).toBe(0);
//       testStore.passTurn();
//       expect(testStore.store.turnCount).toBe(0);
//
//       testStore.changeActivePlayer("player_one");
//       await testStore.acceptOptionalLayer();
//       await testStore.skipTopOfStack();
//
//       // After resolving the ability, the turn should end
//       expect(testStore.store.turnCount).toBe(1);
//     });
//
//     it("Does NOT trigger end-of-turn ability when card is in inkwell", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: intoTheUnknown.cost,
//           play: [clarabelleLightOnHerHooves],
//           hand: [intoTheUnknown],
//           deck: 10,
//         },
//         {
//           hand: 6,
//           deck: 10,
//         },
//       );
//
//       // Exert Clarabelle
//       await testEngine.exertCard(clarabelleLightOnHerHooves);
//
//       // Play Into the Unknown to put Clarabelle into inkwell
//       await testEngine.playCard(intoTheUnknown);
//       await testEngine.resolveTopOfStack({
//         targets: [clarabelleLightOnHerHooves],
//       });
//
//       // Verify Clarabelle is in inkwell
//       expect(testEngine.getCardModel(clarabelleLightOnHerHooves).zone).toBe(
//         "inkwell",
//       );
//
//       const opponentHandBefore =
//         testEngine.getZonesCardCount("player_two").hand;
//
//       // Pass turn - ability should NOT trigger
//       await testEngine.passTurn();
//
//       // Verify opponent did NOT draw cards (hand count should only increase by 1 from beginning of turn draw)
//       const opponentHandAfter = testEngine.getZonesCardCount("player_two").hand;
//       expect(opponentHandAfter).toBe(opponentHandBefore + 1); // Only beginning of turn draw
//     });
//   });
// });
//
