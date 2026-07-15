// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { galacticCommunicator } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Galactic Communicator", () => {
//   It("RESOURCE ALLOCATION 1 {I}, Banish this item - Return chosen character with 2 {S} or less to their player's hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: galacticCommunicator.cost,
//         Play: [galacticCommunicator],
//       },
//       {
//         Play: [tipoGrowingSon],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(galacticCommunicator);
//     Const target = testEngine.getCardModel(tipoGrowingSon);
//
//     CardUnderTest.activate();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(testEngine.getCardZone(target)).toBe("hand");
//   });
//
//   It("regression check - cannot bounce targets with 3 attack or more.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: galacticCommunicator.cost,
//         Play: [galacticCommunicator],
//       },
//       {
//         Play: [mrSmeeBumblingMate],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(galacticCommunicator);
//     Const target = testEngine.getCardModel(mrSmeeBumblingMate);
//
//     CardUnderTest.activate();
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.getCardZone(target)).toBe("play");
//   });
// });
//
