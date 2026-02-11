// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { clarabelleLightOnHerHooves } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { intoTheUnknown } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Clarabelle - Light on Her Hooves", () => {
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [clarabelleLightOnHerHooves],
//     });
//
//     Const cardUnderTest = testStore.getCard(clarabelleLightOnHerHooves);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   Describe("**KEEP IN STEP** At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.", () => {
//     It("Draws cards until you have the same number of cards as the opponent", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [clarabelleLightOnHerHooves],
//           Hand: 2,
//           Deck: 10,
//         },
//         {
//           Hand: 6,
//           Deck: 1,
//         },
//       );
//
//       TestStore.passTurn();
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.store.turnCount).toBe(1);
//       Expect(testStore.getZonesCardCount("player_one").hand).toBe(6);
//       Expect(testStore.getZonesCardCount("player_two").hand).toBe(6 + 1); // 1 card drawn
//     });
//
//     It("You have more cards than the opponent", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [clarabelleLightOnHerHooves],
//           Hand: 6,
//           Deck: 10,
//         },
//         {
//           Hand: 2,
//           Deck: 1,
//         },
//       );
//
//       TestStore.passTurn();
//
//       Expect(testStore.store.turnCount).toBe(1);
//       Expect(testStore.getZonesCardCount("player_one").hand).toBe(6);
//       Expect(testStore.getZonesCardCount("player_two").hand).toBe(2 + 1); // 1 card drawn
//     });
//   });
//
//   Describe("Regression tests", () => {
//     It("Double Clarabelles should let you pass your turn.", async () => {
//       Const testStore = new TestEngine(
//         {
//           Play: [clarabelleLightOnHerHooves, clarabelleLightOnHerHooves],
//           Deck: 10,
//           Hand: 2,
//         },
//         {
//           Hand: 6,
//           Deck: 1,
//         },
//       );
//
//       Expect(testStore.store.turnCount).toBe(0);
//       TestStore.passTurn();
//       Expect(testStore.store.turnCount).toBe(0);
//
//       TestStore.changeActivePlayer("player_one");
//       Await testStore.acceptOptionalLayer();
//       Await testStore.skipTopOfStack();
//
//       // After resolving the ability, the turn should end
//       Expect(testStore.store.turnCount).toBe(1);
//     });
//
//     It("Does NOT trigger end-of-turn ability when card is in inkwell", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: intoTheUnknown.cost,
//           Play: [clarabelleLightOnHerHooves],
//           Hand: [intoTheUnknown],
//           Deck: 10,
//         },
//         {
//           Hand: 6,
//           Deck: 10,
//         },
//       );
//
//       // Exert Clarabelle
//       Await testEngine.exertCard(clarabelleLightOnHerHooves);
//
//       // Play Into the Unknown to put Clarabelle into inkwell
//       Await testEngine.playCard(intoTheUnknown);
//       Await testEngine.resolveTopOfStack({
//         Targets: [clarabelleLightOnHerHooves],
//       });
//
//       // Verify Clarabelle is in inkwell
//       Expect(testEngine.getCardModel(clarabelleLightOnHerHooves).zone).toBe(
//         "inkwell",
//       );
//
//       Const opponentHandBefore =
//         TestEngine.getZonesCardCount("player_two").hand;
//
//       // Pass turn - ability should NOT trigger
//       Await testEngine.passTurn();
//
//       // Verify opponent did NOT draw cards (hand count should only increase by 1 from beginning of turn draw)
//       Const opponentHandAfter = testEngine.getZonesCardCount("player_two").hand;
//       Expect(opponentHandAfter).toBe(opponentHandBefore + 1); // Only beginning of turn draw
//     });
//   });
// });
//
