// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   StichtCarefreeSurfer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { princeJohnGreediestOfAll } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { cursedMerfolkUrsulasHandiwork } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Cursed Merfolk - Ursula's Handiwork", () => {
//   It("**POOR SOULS** Whenever this character is challenged, each opponent chooses and discards a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [liloMakingAWish],
//         Hand: [stichtCarefreeSurfer],
//         Deck: 1,
//       },
//       {
//         Play: [cursedMerfolkUrsulasHandiwork],
//         Deck: 1,
//       },
//     );
//
//     Await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);
//
//     Await testEngine.challenge({
//       Attacker: liloMakingAWish,
//       Defender: cursedMerfolkUrsulasHandiwork,
//     });
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     Await testEngine.resolveTopOfStack({ targets: [stichtCarefreeSurfer] });
//
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     Expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
//       "discard",
//     );
//   });
// });
//
// Describe("Regression - Prince John Interaction, Cursed Merfolk is not getting banished", () => {
//   It("Not having card to discard", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [liloMakingAWish],
//         Deck: 1,
//       },
//       {
//         Play: [cursedMerfolkUrsulasHandiwork, princeJohnGreediestOfAll],
//         Deck: 2,
//       },
//     );
//
//     Await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);
//
//     Await testEngine.challenge({
//       Attacker: liloMakingAWish,
//       Defender: cursedMerfolkUrsulasHandiwork,
//     });
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
//       "discard",
//     );
//   });
//
//   It("Accepting the draw", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [liloMakingAWish],
//         Hand: [stichtCarefreeSurfer],
//         Deck: 1,
//       },
//       {
//         Play: [cursedMerfolkUrsulasHandiwork, princeJohnGreediestOfAll],
//         Deck: 2,
//       },
//     );
//
//     Await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);
//
//     Await testEngine.challenge({
//       Attacker: liloMakingAWish,
//       Defender: cursedMerfolkUrsulasHandiwork,
//     });
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     Await testEngine.resolveTopOfStack(
//       { targets: [stichtCarefreeSurfer] },
//       True,
//     );
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     Expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
//       "discard",
//     );
//   });
//
//   It("Skipping the draw", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [liloMakingAWish],
//         Hand: [stichtCarefreeSurfer],
//         Deck: 1,
//       },
//       {
//         Play: [cursedMerfolkUrsulasHandiwork, princeJohnGreediestOfAll],
//         Deck: 2,
//       },
//     );
//
//     Await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);
//
//     Await testEngine.challenge({
//       Attacker: liloMakingAWish,
//       Defender: cursedMerfolkUrsulasHandiwork,
//     });
//
//     Expect(testEngine.stackLayers).toHaveLength(1);
//     Await testEngine.resolveTopOfStack(
//       { targets: [stichtCarefreeSurfer] },
//       True,
//     );
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.skipTopOfStack();
//
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     Expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
//       "discard",
//     );
//   });
// });
//
