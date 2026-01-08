// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   madHatterEccentricHost,
//   naveensUkulele,
//   scrump,
// } from "@lorcanito/lorcana-engine/cards/006";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mad Hatter - Eccentric Host", () => {
//   describe("WE'LL HAVE TO LOOK INTO THIS Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.", () => {
//     it("Looking at opponent's deck", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [madHatterEccentricHost],
//         },
//         {
//           deck: [naveensUkulele, scrump],
//         },
//       );
//
//       const cardToDiscard = testEngine.getCardModel(scrump);
//
//       expect(
//         testEngine.store.tableStore.getTopDeckCard("player_two")?.instanceId,
//       ).toEqual(cardToDiscard.instanceId);
//
//       await testEngine.questCard(madHatterEccentricHost);
//       // await testEngine.acceptOptionalLayer();
//
//       await testEngine.resolveTopOfStack(
//         {
//           targetPlayer: "player_two",
//         },
//         true,
//       );
//
//       await testEngine.resolveTopOfStack(
//         {
//           scry: { discard: [cardToDiscard] },
//         },
//         true,
//       );
//
//       expect(cardToDiscard.zone).toBe("discard");
//       expect(
//         testEngine.store.tableStore.getTopDeckCard("player_two")?.instanceId,
//       ).toEqual(testEngine.getCardModel(naveensUkulele).instanceId);
//     });
//
//     it("Looking at your own deck", async () => {
//       const testEngine = new TestEngine({
//         play: [madHatterEccentricHost],
//         deck: [naveensUkulele, scrump],
//       });
//
//       const cardToDiscard = testEngine.getCardModel(scrump);
//
//       expect(
//         testEngine.store.tableStore.getTopDeckCard("player_one")?.instanceId,
//       ).toEqual(cardToDiscard.instanceId);
//
//       await testEngine.questCard(madHatterEccentricHost);
//       // await testEngine.acceptOptionalLayer();
//
//       await testEngine.resolveTopOfStack(
//         {
//           targetPlayer: "player_one",
//         },
//         true,
//       );
//
//       await testEngine.resolveTopOfStack(
//         {
//           scry: { discard: [cardToDiscard] },
//         },
//         true,
//       );
//
//       expect(cardToDiscard.zone).toBe("discard");
//       expect(
//         testEngine.store.tableStore.getTopDeckCard("player_one")?.instanceId,
//       ).toEqual(testEngine.getCardModel(naveensUkulele).instanceId);
//     });
//   });
// });
//
