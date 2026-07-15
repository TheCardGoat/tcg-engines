// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { donaldDuckPerfectGentleman } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Donald Duck - Perfect Gentleman", () => {
//   It("Shifts", () => {
//     Const testStore = new TestStore({
//       Play: [donaldDuckPerfectGentleman],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DonaldDuckPerfectGentleman.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toEqual(true);
//   });
//
//   It("**ALLOW ME** At the start of your turn, each player may draw a card.", async () => {
//     Const testEngine = new TestEngine(
//       { deck: 3 },
//       {
//         Play: [donaldDuckPerfectGentleman],
//         Deck: 3,
//       },
//     );
//
//     Await testEngine.passTurn();
//
//     // This happen before draw step
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Deck: 3,
//         Hand: 0,
//       }),
//     );
//
//     // Card owner's effect
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Deck: 2,
//         Hand: 1,
//       }),
//     );
//
//     // Card owner's opponent's effect
//     // await testEngine.resolveOptionalAbility();
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Deck: 2,
//         Hand: 1,
//       }),
//     );
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
