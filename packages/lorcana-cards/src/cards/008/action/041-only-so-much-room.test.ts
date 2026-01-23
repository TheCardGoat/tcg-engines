// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   principeNaveenCarefreeExplorer,
//   simbaHappygolucky,
// } from "@lorcanito/lorcana-engine/cards/006";
// import { onlySoMuchRoom } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Only So Much Room", () => {
//   it("Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: onlySoMuchRoom.cost,
//       hand: [onlySoMuchRoom],
//       play: [simbaHappygolucky],
//       discard: [principeNaveenCarefreeExplorer],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(onlySoMuchRoom);
//
//     await testEngine.playCard(cardUnderTest);
//
//     await testEngine.resolveTopOfStack({ targets: [simbaHappygolucky] }, true);
//     expect(testEngine.getCardModel(simbaHappygolucky).zone).toBe("hand");
//
//     await testEngine.resolveTopOfStack({
//       targets: [principeNaveenCarefreeExplorer],
//     });
//     expect(testEngine.getCardModel(principeNaveenCarefreeExplorer).zone).toBe(
//       "hand",
//     );
//   });
// });
//
