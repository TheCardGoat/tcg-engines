// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import type { CardModel } from "@lorcanito/lorcana-engine";
// Import {
//   GastonFrightfulBully,
//   GoofyGhostHunter,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goofy - Ghost Hunter", () => {
//   It("THE PERFECT TRAP - reduces chosen opposing character's strength by 1", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: goofyGhostHunter.cost,
//         Hand: [goofyGhostHunter],
//       },
//       {
//         Play: [gastonFrightfulBully],
//       },
//     );
//
//     Const cardToTest = testEngine.getCardModel(goofyGhostHunter);
//     Const targetCard: CardModel = testEngine.getCardModel(gastonFrightfulBully);
//
//     Const originalStrength = gastonFrightfulBully.strength;
//
//     Await testEngine.playCard(cardToTest);
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     Expect(targetCard.strength).toBe(originalStrength - 1);
//   });
//
//   It("THE PERFECT TRAP - strength reduction lasts until the start of your next turn", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: goofyGhostHunter.cost,
//         Hand: [goofyGhostHunter],
//       },
//       {
//         Play: [gastonFrightfulBully],
//       },
//     );
//
//     Const cardToTest = testEngine.getCardModel(goofyGhostHunter);
//     Const targetCard: CardModel = testEngine.getCardModel(gastonFrightfulBully);
//
//     Const originalStrength = gastonFrightfulBully.strength;
//
//     Await testEngine.playCard(cardToTest);
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     Expect(targetCard.strength).toBe(originalStrength - 1);
//
//     // Opponent's turn - effect should still be active
//     TestEngine.passTurn();
//     Expect(targetCard.strength).toBe(originalStrength - 1);
//
//     // Back to our turn - effect should end at start of turn
//     TestEngine.passTurn();
//     Expect(targetCard.strength).toBe(originalStrength);
//   });
//
//   It("THE PERFECT TRAP - can only target opposing characters", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: goofyGhostHunter.cost,
//         Hand: [goofyGhostHunter],
//         Play: [gastonFrightfulBully],
//       },
//       {
//         Play: [],
//       },
//     );
//
//     Const cardToTest = testEngine.getCardModel(goofyGhostHunter);
//     Const ownCharacter = testEngine.getCardModel(gastonFrightfulBully);
//
//     Await testEngine.playCard(cardToTest);
//
//     // Ability auto-resolves since there are no valid targets
//     Expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//     // Own character's strength should be unaffected
//     Expect(ownCharacter.strength).toBe(gastonFrightfulBully.strength);
//   });
//
//   It("THE PERFECT TRAP - reduces strength correctly regardless of original value", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: goofyGhostHunter.cost,
//         Hand: [goofyGhostHunter],
//       },
//       {
//         Play: [gastonFrightfulBully],
//       },
//     );
//
//     Const cardToTest = testEngine.getCardModel(goofyGhostHunter);
//     Const targetCard: CardModel = testEngine.getCardModel(gastonFrightfulBully);
//
//     Const originalStrength = gastonFrightfulBully.strength;
//
//     Await testEngine.playCard(cardToTest);
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     // Strength should be reduced by 1
//     Expect(targetCard.strength).toBe(originalStrength - 1);
//   });
//
//   It("THE PERFECT TRAP - triggers when card enters play", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: goofyGhostHunter.cost,
//         Hand: [goofyGhostHunter],
//       },
//       {
//         Play: [gastonFrightfulBully],
//       },
//     );
//
//     Const cardToTest = testEngine.getCardModel(goofyGhostHunter);
//
//     Expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//
//     Await testEngine.playCard(cardToTest);
//
//     // Ability should trigger and be on the stack
//     Expect(testEngine.store.stackLayerStore.layers).toHaveLength(1);
//     Expect(testEngine.getCardModel(cardToTest).zone).toBe("play");
//   });
// });
//
