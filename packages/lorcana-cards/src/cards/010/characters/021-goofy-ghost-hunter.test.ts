// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import type { CardModel } from "@lorcanito/lorcana-engine";
// import {
//   gastonFrightfulBully,
//   goofyGhostHunter,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Goofy - Ghost Hunter", () => {
//   it("THE PERFECT TRAP - reduces chosen opposing character's strength by 1", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: goofyGhostHunter.cost,
//         hand: [goofyGhostHunter],
//       },
//       {
//         play: [gastonFrightfulBully],
//       },
//     );
//
//     const cardToTest = testEngine.getCardModel(goofyGhostHunter);
//     const targetCard: CardModel = testEngine.getCardModel(gastonFrightfulBully);
//
//     const originalStrength = gastonFrightfulBully.strength;
//
//     await testEngine.playCard(cardToTest);
//     await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     expect(targetCard.strength).toBe(originalStrength - 1);
//   });
//
//   it("THE PERFECT TRAP - strength reduction lasts until the start of your next turn", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: goofyGhostHunter.cost,
//         hand: [goofyGhostHunter],
//       },
//       {
//         play: [gastonFrightfulBully],
//       },
//     );
//
//     const cardToTest = testEngine.getCardModel(goofyGhostHunter);
//     const targetCard: CardModel = testEngine.getCardModel(gastonFrightfulBully);
//
//     const originalStrength = gastonFrightfulBully.strength;
//
//     await testEngine.playCard(cardToTest);
//     await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     expect(targetCard.strength).toBe(originalStrength - 1);
//
//     // Opponent's turn - effect should still be active
//     testEngine.passTurn();
//     expect(targetCard.strength).toBe(originalStrength - 1);
//
//     // Back to our turn - effect should end at start of turn
//     testEngine.passTurn();
//     expect(targetCard.strength).toBe(originalStrength);
//   });
//
//   it("THE PERFECT TRAP - can only target opposing characters", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: goofyGhostHunter.cost,
//         hand: [goofyGhostHunter],
//         play: [gastonFrightfulBully],
//       },
//       {
//         play: [],
//       },
//     );
//
//     const cardToTest = testEngine.getCardModel(goofyGhostHunter);
//     const ownCharacter = testEngine.getCardModel(gastonFrightfulBully);
//
//     await testEngine.playCard(cardToTest);
//
//     // Ability auto-resolves since there are no valid targets
//     expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//     // Own character's strength should be unaffected
//     expect(ownCharacter.strength).toBe(gastonFrightfulBully.strength);
//   });
//
//   it("THE PERFECT TRAP - reduces strength correctly regardless of original value", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: goofyGhostHunter.cost,
//         hand: [goofyGhostHunter],
//       },
//       {
//         play: [gastonFrightfulBully],
//       },
//     );
//
//     const cardToTest = testEngine.getCardModel(goofyGhostHunter);
//     const targetCard: CardModel = testEngine.getCardModel(gastonFrightfulBully);
//
//     const originalStrength = gastonFrightfulBully.strength;
//
//     await testEngine.playCard(cardToTest);
//     await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     // Strength should be reduced by 1
//     expect(targetCard.strength).toBe(originalStrength - 1);
//   });
//
//   it("THE PERFECT TRAP - triggers when card enters play", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: goofyGhostHunter.cost,
//         hand: [goofyGhostHunter],
//       },
//       {
//         play: [gastonFrightfulBully],
//       },
//     );
//
//     const cardToTest = testEngine.getCardModel(goofyGhostHunter);
//
//     expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//
//     await testEngine.playCard(cardToTest);
//
//     // Ability should trigger and be on the stack
//     expect(testEngine.store.stackLayerStore.layers).toHaveLength(1);
//     expect(testEngine.getCardModel(cardToTest).zone).toBe("play");
//   });
// });
//
