// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KitCloudkickerToughGuy,
//   MrSmeeBumblingMate,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { tipoGrowingSon } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kit Cloudkicker - Tough Guy", () => {
//   It("**SKYSURFING** When you play this character, you may return chosen opposing character with 2 {S} or less to their player's hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: kitCloudkickerToughGuy.cost,
//         Hand: [kitCloudkickerToughGuy],
//       },
//       {
//         Play: [tipoGrowingSon],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(kitCloudkickerToughGuy);
//     Const target = testEngine.getCardModel(tipoGrowingSon);
//     CardUnderTest.playFromHand();
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(testEngine.getCardZone(target)).toBe("hand");
//   });
//
//   It("regression check - cannot bounce targets with 3 attack or more", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: kitCloudkickerToughGuy.cost,
//         Hand: [kitCloudkickerToughGuy],
//       },
//       {
//         Play: [mrSmeeBumblingMate],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(kitCloudkickerToughGuy);
//     CardUnderTest.playFromHand();
//
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getCardZone(cardUnderTest)).toBe("play");
//   });
// });
//
