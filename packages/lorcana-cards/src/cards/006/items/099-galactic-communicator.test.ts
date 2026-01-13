// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mrSmeeBumblingMate } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { galacticCommunicator } from "@lorcanito/lorcana-engine/cards/006/items/items";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Galactic Communicator", () => {
//   it("RESOURCE ALLOCATION 1 {I}, Banish this item - Return chosen character with 2 {S} or less to their player's hand.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: galacticCommunicator.cost,
//         play: [galacticCommunicator],
//       },
//       {
//         play: [tipoGrowingSon],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(galacticCommunicator);
//     const target = testEngine.getCardModel(tipoGrowingSon);
//
//     cardUnderTest.activate();
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     expect(testEngine.getCardZone(target)).toBe("hand");
//   });
//
//   it("regression check - cannot bounce targets with 3 attack or more.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: galacticCommunicator.cost,
//         play: [galacticCommunicator],
//       },
//       {
//         play: [mrSmeeBumblingMate],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(galacticCommunicator);
//     const target = testEngine.getCardModel(mrSmeeBumblingMate);
//
//     cardUnderTest.activate();
//
//     expect(testEngine.stackLayers).toHaveLength(0);
//     expect(testEngine.getCardZone(target)).toBe("play");
//   });
// });
//
