// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   genieOnTheJob,
//   jetsamUrsulaSpy,
//   maximusPalaceHorse,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { jasmineInspiredResearcher } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Jasmine - Inspired Researcher", () => {
//   it("EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.", async () => {
//     const characterCards = [maximusPalaceHorse, genieOnTheJob];
//     const testEngine = new TestEngine(
//       {
//         deck: 10,
//         play: [jasmineInspiredResearcher, ...characterCards],
//       },
//       {
//         play: [jetsamUrsulaSpy],
//       },
//     );
//
//     await testEngine.questCard(jasmineInspiredResearcher);
//
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(
//       characterCards.length,
//     );
//   });
//
//   it("EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.", async () => {
//     const characterCards = [maximusPalaceHorse, genieOnTheJob];
//     const testEngine = new TestEngine({
//       deck: 10,
//       play: [jasmineInspiredResearcher, jetsamUrsulaSpy],
//     });
//
//     await testEngine.questCard(jasmineInspiredResearcher);
//
//     expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       expect.objectContaining({
//         hand: 1,
//         deck: 9,
//       }),
//     );
//   });
// });
//
