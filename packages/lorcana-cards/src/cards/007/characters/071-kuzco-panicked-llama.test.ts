// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hadesDoubleDealer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   KuzcoPanickedLlama,
//   PongoDearOldDad,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kuzco - Panicked Llama", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [kuzcoPanickedLlama],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(kuzcoPanickedLlama);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   Describe("WE CAN FIGURE THIS OUT At the start of your turn, choose one: ", () => {
//     It("• Each player draws a card. ", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 3,
//         },
//         {
//           Deck: 3,
//           Play: [kuzcoPanickedLlama],
//         },
//       );
//
//       Await testEngine.passTurn();
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Deck: 2,
//         }),
//       );
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           Hand: 2,
//           Deck: 1,
//         }),
//       );
//     });
//
//     It("• Each player chooses and discards a card.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 3,
//           Hand: [hadesDoubleDealer],
//         },
//         {
//           Deck: 3,
//           Play: [kuzcoPanickedLlama],
//           Hand: [pongoDearOldDad],
//         },
//       );
//
//       Await testEngine.passTurn();
//       Await testEngine.resolveTopOfStack({ mode: "2" }, true);
//
//       Await testEngine.resolveTopOfStack({ targets: [pongoDearOldDad] }, true);
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Deck: 3,
//           Discard: 1,
//         }),
//       );
//
//       TestEngine.changeActivePlayer("player_one");
//       Await testEngine.resolveTopOfStack(
//         { targets: [hadesDoubleDealer] },
//         True,
//       );
//       Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Deck: 3,
//           Discard: 1,
//         }),
//       );
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//         Expect.objectContaining({
//           // After effect resolves they draw
//           Hand: 1,
//           Deck: 2,
//         }),
//       );
//     });
//   });
// });
//
