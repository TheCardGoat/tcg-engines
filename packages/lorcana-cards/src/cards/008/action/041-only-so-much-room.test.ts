// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PrincipeNaveenCarefreeExplorer,
//   SimbaHappygolucky,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { onlySoMuchRoom } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Only So Much Room", () => {
//   It("Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: onlySoMuchRoom.cost,
//       Hand: [onlySoMuchRoom],
//       Play: [simbaHappygolucky],
//       Discard: [principeNaveenCarefreeExplorer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(onlySoMuchRoom);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Await testEngine.resolveTopOfStack({ targets: [simbaHappygolucky] }, true);
//     Expect(testEngine.getCardModel(simbaHappygolucky).zone).toBe("hand");
//
//     Await testEngine.resolveTopOfStack({
//       Targets: [principeNaveenCarefreeExplorer],
//     });
//     Expect(testEngine.getCardModel(principeNaveenCarefreeExplorer).zone).toBe(
//       "hand",
//     );
//   });
// });
//
