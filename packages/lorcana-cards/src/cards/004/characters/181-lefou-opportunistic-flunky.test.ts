// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { lefouInstigator } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   ArgesTheCyclops,
//   LefouOpportunisticFlunky,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lefou - Opportunistic Flunky", () => {
//   It("**I LEARNED FROM THE BEST** During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [lefouOpportunisticFlunky, lefouInstigator],
//       },
//       {
//         Play: [argesTheCyclops],
//       },
//     );
//
//     Await testEngine.tapCard(argesTheCyclops);
//
//     Const cardUnderTest = testEngine.getCardModel(lefouOpportunisticFlunky);
//
//     Expect(cardUnderTest.cost).toEqual(lefouOpportunisticFlunky.cost);
//
//     Await testEngine.challenge({
//       Attacker: lefouInstigator,
//       Defender: argesTheCyclops,
//     });
//
//     Expect(cardUnderTest.cost).toEqual(0);
//   });
// });
//
