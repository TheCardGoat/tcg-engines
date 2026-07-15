// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { robinHoodTimelyContestant } from "@lorcanito/lorcana-engine/cards/005/characters/069-robin-hood-timely-contestant";
// Import {
//   DonaldGhostHunter,
//   HadesLookingForADeal,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hades - Looking for a Deal", () => {
//   Describe("WHAT D'YA SAY? - Modal ability", () => {
//     It("should allow opponent to put their character on bottom of deck", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: hadesLookingForADeal.cost,
//           Hand: [hadesLookingForADeal],
//           Deck: 10,
//         },
//         {
//           Play: [donaldGhostHunter, mickeyMouseDetective],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(donaldGhostHunter);
//       Await testEngine.playCard(
//         HadesLookingForADeal,
//         {
//           Targets: [targetCard],
//           AcceptOptionalLayer: true,
//         },
//         True,
//       );
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({ mode: "1" });
//
//       Expect(targetCard.zone).toEqual("deck");
//       Expect(testEngine.getCardsByZone("hand", "player_one")?.length).toEqual(
//         0,
//       );
//       Expect(testEngine.getCardsByZone("hand", "player_two")?.length).toEqual(
//         0,
//       );
//     });
//
//     It("should allow opponent to let you draw 2 cards", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: hadesLookingForADeal.cost,
//           Hand: [hadesLookingForADeal],
//           Deck: 10,
//         },
//         {
//           Play: [donaldGhostHunter, mickeyMouseDetective],
//         },
//       );
//
//       Const targetCard = testEngine.getCardModel(mickeyMouseDetective);
//       Await testEngine.playCard(
//         HadesLookingForADeal,
//         {
//           Targets: [targetCard],
//           AcceptOptionalLayer: true,
//         },
//         True,
//       );
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({ mode: "2" });
//
//       Expect(targetCard.zone).toEqual("play");
//       Expect(testEngine.getCardsByZone("hand", "player_one")?.length).toEqual(
//         2,
//       );
//       Expect(testEngine.getCardsByZone("hand", "player_two")?.length).toEqual(
//         0,
//       );
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("Shouldn't target characters with ward", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: hadesLookingForADeal.cost,
//         Hand: [hadesLookingForADeal],
//         Deck: 10,
//       },
//       {
//         Play: [
//           DonaldGhostHunter,
//           MickeyMouseDetective,
//           RobinHoodTimelyContestant,
//         ],
//       },
//     );
//
//     Const targetCard = testEngine.getCardModel(robinHoodTimelyContestant);
//     Await testEngine.playCard(
//       HadesLookingForADeal,
//       {
//         Targets: [targetCard],
//         AcceptOptionalLayer: true,
//       },
//       True,
//     );
//
//     Expect(testEngine.engine.store.priorityPlayer).toEqual("player_one");
//   });
// });
//
