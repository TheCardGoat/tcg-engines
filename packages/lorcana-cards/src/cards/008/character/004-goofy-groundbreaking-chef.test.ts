// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyMusketeer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { goofyMusketeerSwordsman } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { goofyFlyingFool } from "@lorcanito/lorcana-engine/cards/006";
// Import { goofyGroundbreakingChef } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goofy - Groundbreaking Chef", () => {
//   It("PLENTY TO GO AROUND At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.", async () => {
//     Const shouldUntap = [
//       GoofyMusketeerSwordsman,
//       GoofyKnightForADay,
//       GoofyFlyingFool,
//     ];
//     Const shouldNotUntap = [goofyGroundbreakingChef, goofyMusketeer];
//
//     Const testEngine = new TestEngine({
//       Play: [...shouldNotUntap, ...shouldUntap],
//     });
//
//     // The effect says your other characters, so Goofy Groundbreaking Chef should not be included
//     Await testEngine.setCardDamage(goofyGroundbreakingChef, 1);
//     For (const card of shouldUntap) {
//       Await testEngine.setCardDamage(card, 1);
//     }
//
//     For (const card of [...shouldUntap, ...shouldNotUntap]) {
//       Await testEngine.tapCard(card);
//     }
//
//     Expect(testEngine.store.turnCount).toEqual(0);
//     Await testEngine.passTurn();
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.acceptOptionalLayer();
//     Expect(testEngine.store.turnCount).toEqual(1);
//
//     For (const card of shouldUntap) {
//       Expect(testEngine.getCardModel(card).damage).toEqual(0);
//       Expect(testEngine.getCardModel(card).exerted).toEqual(false);
//     }
//
//     For (const card of shouldNotUntap) {
//       Expect(testEngine.getCardModel(card).exerted).toEqual(true);
//     }
//
//     Expect(testEngine.getCardModel(goofyGroundbreakingChef).damage).toEqual(1);
//   });
// });
//
// Describe("Regression tests for Goofy - Groundbreaking Chef", () => {
//   It("Goofy + Mr Smee", async () => {
//     Const testEngine = new TestEngine({
//       Play: [goofyGroundbreakingChef, mrSmeeBumblingMate],
//     });
//
//     Await testEngine.setCardDamage(mrSmeeBumblingMate, 1);
//     Await testEngine.tapCard(mrSmeeBumblingMate);
//
//     Await testEngine.passTurn();
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.acceptOptionalLayerBySource({
//       Source: goofyGroundbreakingChef,
//     });
//     // await testEngine.acceptOptionalLayerBySource({
//     //   source: mrSmeeBumblingMate,
//     // });
//
//     // We should first trigger Goofy Groundbreaking Chef's ability, which will remove 1 damage from Mr Smee and ready Mr Smee
//     // Given Mr Smee is ready, his ability should NOT trigger and it won't cause one damage to himself.
//     Expect(testEngine.getCardModel(mrSmeeBumblingMate).damage).toEqual(0);
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
