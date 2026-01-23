// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { lefouInstigator } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   argesTheCyclops,
//   lefouOpportunisticFlunky,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Lefou - Opportunistic Flunky", () => {
//   it("**I LEARNED FROM THE BEST** During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [lefouOpportunisticFlunky, lefouInstigator],
//       },
//       {
//         play: [argesTheCyclops],
//       },
//     );
//
//     await testEngine.tapCard(argesTheCyclops);
//
//     const cardUnderTest = testEngine.getCardModel(lefouOpportunisticFlunky);
//
//     expect(cardUnderTest.cost).toEqual(lefouOpportunisticFlunky.cost);
//
//     await testEngine.challenge({
//       attacker: lefouInstigator,
//       defender: argesTheCyclops,
//     });
//
//     expect(cardUnderTest.cost).toEqual(0);
//   });
// });
//
