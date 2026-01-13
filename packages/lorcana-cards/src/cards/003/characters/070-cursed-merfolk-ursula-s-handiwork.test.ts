// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   liloMakingAWish,
//   stichtCarefreeSurfer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { princeJohnGreediestOfAll } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { cursedMerfolkUrsulasHandiwork } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Cursed Merfolk - Ursula's Handiwork", () => {
//   it("**POOR SOULS** Whenever this character is challenged, each opponent chooses and discards a card.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [liloMakingAWish],
//         hand: [stichtCarefreeSurfer],
//         deck: 1,
//       },
//       {
//         play: [cursedMerfolkUrsulasHandiwork],
//         deck: 1,
//       },
//     );
//
//     await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);
//
//     await testEngine.challenge({
//       attacker: liloMakingAWish,
//       defender: cursedMerfolkUrsulasHandiwork,
//     });
//
//     expect(testEngine.stackLayers).toHaveLength(1);
//     await testEngine.resolveTopOfStack({ targets: [stichtCarefreeSurfer] });
//
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
//       "discard",
//     );
//   });
// });
//
// describe("Regression - Prince John Interaction, Cursed Merfolk is not getting banished", () => {
//   it("Not having card to discard", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [liloMakingAWish],
//         deck: 1,
//       },
//       {
//         play: [cursedMerfolkUrsulasHandiwork, princeJohnGreediestOfAll],
//         deck: 2,
//       },
//     );
//
//     await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);
//
//     await testEngine.challenge({
//       attacker: liloMakingAWish,
//       defender: cursedMerfolkUrsulasHandiwork,
//     });
//
//     expect(testEngine.stackLayers).toHaveLength(0);
//
//     expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
//       "discard",
//     );
//   });
//
//   it("Accepting the draw", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [liloMakingAWish],
//         hand: [stichtCarefreeSurfer],
//         deck: 1,
//       },
//       {
//         play: [cursedMerfolkUrsulasHandiwork, princeJohnGreediestOfAll],
//         deck: 2,
//       },
//     );
//
//     await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);
//
//     await testEngine.challenge({
//       attacker: liloMakingAWish,
//       defender: cursedMerfolkUrsulasHandiwork,
//     });
//
//     expect(testEngine.stackLayers).toHaveLength(1);
//     await testEngine.resolveTopOfStack(
//       { targets: [stichtCarefreeSurfer] },
//       true,
//     );
//
//     testEngine.changeActivePlayer("player_two");
//     await testEngine.resolveOptionalAbility();
//
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
//       "discard",
//     );
//   });
//
//   it("Skipping the draw", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [liloMakingAWish],
//         hand: [stichtCarefreeSurfer],
//         deck: 1,
//       },
//       {
//         play: [cursedMerfolkUrsulasHandiwork, princeJohnGreediestOfAll],
//         deck: 2,
//       },
//     );
//
//     await testEngine.tapCard(cursedMerfolkUrsulasHandiwork);
//
//     await testEngine.challenge({
//       attacker: liloMakingAWish,
//       defender: cursedMerfolkUrsulasHandiwork,
//     });
//
//     expect(testEngine.stackLayers).toHaveLength(1);
//     await testEngine.resolveTopOfStack(
//       { targets: [stichtCarefreeSurfer] },
//       true,
//     );
//
//     testEngine.changeActivePlayer("player_two");
//     await testEngine.skipTopOfStack();
//
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(0);
//     expect(testEngine.getCardModel(cursedMerfolkUrsulasHandiwork).zone).toBe(
//       "discard",
//     );
//   });
// });
//
