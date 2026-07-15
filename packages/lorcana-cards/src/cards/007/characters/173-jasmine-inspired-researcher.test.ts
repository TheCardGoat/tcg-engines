// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GenieOnTheJob,
//   JetsamUrsulaSpy,
//   MaximusPalaceHorse,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { jasmineInspiredResearcher } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jasmine - Inspired Researcher", () => {
//   It("EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.", async () => {
//     Const characterCards = [maximusPalaceHorse, genieOnTheJob];
//     Const testEngine = new TestEngine(
//       {
//         Deck: 10,
//         Play: [jasmineInspiredResearcher, ...characterCards],
//       },
//       {
//         Play: [jetsamUrsulaSpy],
//       },
//     );
//
//     Await testEngine.questCard(jasmineInspiredResearcher);
//
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(
//       CharacterCards.length,
//     );
//   });
//
//   It("EXTRA ASSISTANCE Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.", async () => {
//     Const characterCards = [maximusPalaceHorse, genieOnTheJob];
//     Const testEngine = new TestEngine({
//       Deck: 10,
//       Play: [jasmineInspiredResearcher, jetsamUrsulaSpy],
//     });
//
//     Await testEngine.questCard(jasmineInspiredResearcher);
//
//     Expect(testEngine.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Deck: 9,
//       }),
//     );
//   });
// });
//
