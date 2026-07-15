// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   JudyHoppsResourcefulRabbit,
//   PrincipeNaveenCarefreeExplorer,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Judy Hopps - Resourceful Rabbit", () => {
//   It("NEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [judyHoppsResourcefulRabbit, principeNaveenCarefreeExplorer],
//     });
//
//     Const target = testEngine.getCardModel(principeNaveenCarefreeExplorer);
//
//     Await testEngine.tapCard(principeNaveenCarefreeExplorer);
//
//     Expect(testEngine.store.turnCount).toBe(0);
//     Await testEngine.passTurn("player_one", true);
//     Expect(testEngine.store.turnCount).toBe(0);
//
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(target.ready).toEqual(false);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//     Expect(target.ready).toEqual(true);
//
//     Expect(testEngine.store.turnCount).toBe(1);
//     Expect(testEngine.store.priorityPlayer).toBe("player_two");
//     Expect(testEngine.store.turnPlayer).toBe("player_two");
//   });
// });
//
