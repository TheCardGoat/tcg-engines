// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import {
//   DavidXanatosCharismaticLeader,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("David Xanatos - Charismatic Leader", () => {
//   Describe("LEARN FROM EVERYTHING", () => {
//     It("1. should draw a card when one of your characters is banished during your turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: smash.cost,
//         Play: [davidXanatosCharismaticLeader, mickeyMouseDetective],
//         Hand: [smash],
//         Deck: 5,
//       });
//
//       Const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//       Expect(mickey.zone).toBe("play");
//
//       // Banish Mickey during your turn (willpower 3, Smash deals 3 damage)
//       Await testEngine.playCard(smash, { targets: [mickey] });
//
//       Expect(mickey.zone).toBe("discard");
//       // Should have drawn 1 card (1 from hand - smash + 1 drawn = 1)
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     });
//
//     It("2. should NOT draw during opponent's turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [davidXanatosCharismaticLeader, deweyLovableShowoff],
//           Deck: 5,
//         },
//         {
//           Inkwell: smash.cost,
//           Hand: [smash],
//         },
//       );
//
//       Const dewey = testEngine.getCardModel(deweyLovableShowoff);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       // Opponent banishes your Dewey
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.playCard(smash, { targets: [dewey] });
//
//       // Should NOT have drawn (not your turn)
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     });
//   });
//
//   Describe("WHAT ARE YOU WAITING FOR?", () => {
//     It("3. should give chosen character Rush when David quests", async () => {
//       Const testEngine = new TestEngine({
//         Play: [davidXanatosCharismaticLeader, mickeyMouseDetective],
//       });
//
//       Const david = testEngine.getCardModel(davidXanatosCharismaticLeader);
//       Const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//       // Make David ready
//       David.updateCardMeta({ exerted: false });
//
//       Expect(mickey.hasRush).toBe(false);
//
//       // Quest with David
//       Await testEngine.questCard(davidXanatosCharismaticLeader);
//
//       // Resolve and choose Mickey
//       Await testEngine.resolveTopOfStack({ targets: [mickey] });
//
//       // Mickey should have Rush this turn
//       Expect(mickey.hasRush).toBe(true);
//     });
//
//     It("4. should only last for this turn", async () => {
//       Const testEngine = new TestEngine({
//         Play: [davidXanatosCharismaticLeader, mickeyMouseDetective],
//       });
//
//       Const david = testEngine.getCardModel(davidXanatosCharismaticLeader);
//       Const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//       // Make David ready
//       David.updateCardMeta({ exerted: false });
//
//       // Quest with David and give Mickey Rush
//       Await testEngine.questCard(davidXanatosCharismaticLeader);
//       Await testEngine.resolveTopOfStack({ targets: [mickey] });
//
//       Expect(mickey.hasRush).toBe(true);
//
//       // Pass turn
//       TestEngine.passTurn();
//
//       // Rush should be gone
//       Expect(mickey.hasRush).toBe(false);
//     });
//   });
// });
//
