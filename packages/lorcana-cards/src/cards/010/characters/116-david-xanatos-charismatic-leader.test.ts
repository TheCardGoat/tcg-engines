// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// import {
//   davidXanatosCharismaticLeader,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("David Xanatos - Charismatic Leader", () => {
//   describe("LEARN FROM EVERYTHING", () => {
//     it("1. should draw a card when one of your characters is banished during your turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell: smash.cost,
//         play: [davidXanatosCharismaticLeader, mickeyMouseDetective],
//         hand: [smash],
//         deck: 5,
//       });
//
//       const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//       expect(mickey.zone).toBe("play");
//
//       // Banish Mickey during your turn (willpower 3, Smash deals 3 damage)
//       await testEngine.playCard(smash, { targets: [mickey] });
//
//       expect(mickey.zone).toBe("discard");
//       // Should have drawn 1 card (1 from hand - smash + 1 drawn = 1)
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//     });
//
//     it("2. should NOT draw during opponent's turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [davidXanatosCharismaticLeader, deweyLovableShowoff],
//           deck: 5,
//         },
//         {
//           inkwell: smash.cost,
//           hand: [smash],
//         },
//       );
//
//       const dewey = testEngine.getCardModel(deweyLovableShowoff);
//
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       // Opponent banishes your Dewey
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.playCard(smash, { targets: [dewey] });
//
//       // Should NOT have drawn (not your turn)
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     });
//   });
//
//   describe("WHAT ARE YOU WAITING FOR?", () => {
//     it("3. should give chosen character Rush when David quests", async () => {
//       const testEngine = new TestEngine({
//         play: [davidXanatosCharismaticLeader, mickeyMouseDetective],
//       });
//
//       const david = testEngine.getCardModel(davidXanatosCharismaticLeader);
//       const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//       // Make David ready
//       david.updateCardMeta({ exerted: false });
//
//       expect(mickey.hasRush).toBe(false);
//
//       // Quest with David
//       await testEngine.questCard(davidXanatosCharismaticLeader);
//
//       // Resolve and choose Mickey
//       await testEngine.resolveTopOfStack({ targets: [mickey] });
//
//       // Mickey should have Rush this turn
//       expect(mickey.hasRush).toBe(true);
//     });
//
//     it("4. should only last for this turn", async () => {
//       const testEngine = new TestEngine({
//         play: [davidXanatosCharismaticLeader, mickeyMouseDetective],
//       });
//
//       const david = testEngine.getCardModel(davidXanatosCharismaticLeader);
//       const mickey = testEngine.getCardModel(mickeyMouseDetective);
//
//       // Make David ready
//       david.updateCardMeta({ exerted: false });
//
//       // Quest with David and give Mickey Rush
//       await testEngine.questCard(davidXanatosCharismaticLeader);
//       await testEngine.resolveTopOfStack({ targets: [mickey] });
//
//       expect(mickey.hasRush).toBe(true);
//
//       // Pass turn
//       testEngine.passTurn();
//
//       // Rush should be gone
//       expect(mickey.hasRush).toBe(false);
//     });
//   });
// });
//
