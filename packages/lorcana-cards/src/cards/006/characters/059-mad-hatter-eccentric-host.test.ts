// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MadHatterEccentricHost,
//   NaveensUkulele,
//   Scrump,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mad Hatter - Eccentric Host", () => {
//   Describe("WE'LL HAVE TO LOOK INTO THIS Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.", () => {
//     It("Looking at opponent's deck", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [madHatterEccentricHost],
//         },
//         {
//           Deck: [naveensUkulele, scrump],
//         },
//       );
//
//       Const cardToDiscard = testEngine.getCardModel(scrump);
//
//       Expect(
//         TestEngine.store.tableStore.getTopDeckCard("player_two")?.instanceId,
//       ).toEqual(cardToDiscard.instanceId);
//
//       Await testEngine.questCard(madHatterEccentricHost);
//       // await testEngine.acceptOptionalLayer();
//
//       Await testEngine.resolveTopOfStack(
//         {
//           TargetPlayer: "player_two",
//         },
//         True,
//       );
//
//       Await testEngine.resolveTopOfStack(
//         {
//           Scry: { discard: [cardToDiscard] },
//         },
//         True,
//       );
//
//       Expect(cardToDiscard.zone).toBe("discard");
//       Expect(
//         TestEngine.store.tableStore.getTopDeckCard("player_two")?.instanceId,
//       ).toEqual(testEngine.getCardModel(naveensUkulele).instanceId);
//     });
//
//     It("Looking at your own deck", async () => {
//       Const testEngine = new TestEngine({
//         Play: [madHatterEccentricHost],
//         Deck: [naveensUkulele, scrump],
//       });
//
//       Const cardToDiscard = testEngine.getCardModel(scrump);
//
//       Expect(
//         TestEngine.store.tableStore.getTopDeckCard("player_one")?.instanceId,
//       ).toEqual(cardToDiscard.instanceId);
//
//       Await testEngine.questCard(madHatterEccentricHost);
//       // await testEngine.acceptOptionalLayer();
//
//       Await testEngine.resolveTopOfStack(
//         {
//           TargetPlayer: "player_one",
//         },
//         True,
//       );
//
//       Await testEngine.resolveTopOfStack(
//         {
//           Scry: { discard: [cardToDiscard] },
//         },
//         True,
//       );
//
//       Expect(cardToDiscard.zone).toBe("discard");
//       Expect(
//         TestEngine.store.tableStore.getTopDeckCard("player_one")?.instanceId,
//       ).toEqual(testEngine.getCardModel(naveensUkulele).instanceId);
//     });
//   });
// });
//
