// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { robinHoodTimelyContestant } from "@lorcanito/lorcana-engine/cards/005/characters/069-robin-hood-timely-contestant";
// import {
//   donaldGhostHunter,
//   hadesLookingForADeal,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hades - Looking for a Deal", () => {
//   describe("WHAT D'YA SAY? - Modal ability", () => {
//     it("should allow opponent to put their character on bottom of deck", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: hadesLookingForADeal.cost,
//           hand: [hadesLookingForADeal],
//           deck: 10,
//         },
//         {
//           play: [donaldGhostHunter, mickeyMouseDetective],
//         },
//       );
//
//       const targetCard = testEngine.getCardModel(donaldGhostHunter);
//       await testEngine.playCard(
//         hadesLookingForADeal,
//         {
//           targets: [targetCard],
//           acceptOptionalLayer: true,
//         },
//         true,
//       );
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.resolveTopOfStack({ mode: "1" });
//
//       expect(targetCard.zone).toEqual("deck");
//       expect(testEngine.getCardsByZone("hand", "player_one")?.length).toEqual(
//         0,
//       );
//       expect(testEngine.getCardsByZone("hand", "player_two")?.length).toEqual(
//         0,
//       );
//     });
//
//     it("should allow opponent to let you draw 2 cards", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: hadesLookingForADeal.cost,
//           hand: [hadesLookingForADeal],
//           deck: 10,
//         },
//         {
//           play: [donaldGhostHunter, mickeyMouseDetective],
//         },
//       );
//
//       const targetCard = testEngine.getCardModel(mickeyMouseDetective);
//       await testEngine.playCard(
//         hadesLookingForADeal,
//         {
//           targets: [targetCard],
//           acceptOptionalLayer: true,
//         },
//         true,
//       );
//
//       testEngine.changeActivePlayer("player_two");
//       await testEngine.resolveTopOfStack({ mode: "2" });
//
//       expect(targetCard.zone).toEqual("play");
//       expect(testEngine.getCardsByZone("hand", "player_one")?.length).toEqual(
//         2,
//       );
//       expect(testEngine.getCardsByZone("hand", "player_two")?.length).toEqual(
//         0,
//       );
//     });
//   });
// });
//
// describe("Regression", () => {
//   it("Shouldn't target characters with ward", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: hadesLookingForADeal.cost,
//         hand: [hadesLookingForADeal],
//         deck: 10,
//       },
//       {
//         play: [
//           donaldGhostHunter,
//           mickeyMouseDetective,
//           robinHoodTimelyContestant,
//         ],
//       },
//     );
//
//     const targetCard = testEngine.getCardModel(robinHoodTimelyContestant);
//     await testEngine.playCard(
//       hadesLookingForADeal,
//       {
//         targets: [targetCard],
//         acceptOptionalLayer: true,
//       },
//       true,
//     );
//
//     expect(testEngine.engine.store.priorityPlayer).toEqual("player_one");
//   });
// });
//
