// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   bashfulAdoringKnight,
//   snowWhiteFairhearted,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bashful - Adoring Knight", () => {
//   it("**IMPRESS THE PRINCESS** While you have a character named Snow White in play, this character gains **Bodyguard**. _(An opposing character who challenges one of your character must chose one with Bodyguard if able.)_", async () => {
//     // Setup test with only Bashful in play
//     const testEngine = new TestEngine({
//       inkwell: bashfulAdoringKnight.cost,
//       play: [bashfulAdoringKnight],
//     });
//
//     const bashfulCard = testEngine.getCardModel(bashfulAdoringKnight);
//
//     // Test initial state (without Snow White)
//     expect(bashfulCard.hasBodyguard).toBe(false);
//
//     // Setup test with both Bashful and Snow White in play
//     const testEngineWithSnowWhite = new TestEngine({
//       inkwell: bashfulAdoringKnight.cost,
//       play: [bashfulAdoringKnight, snowWhiteFairhearted],
//     });
//
//     const bashfulCardWithSnowWhite =
//       testEngineWithSnowWhite.getCardModel(bashfulAdoringKnight);
//
//     // Test state with Snow White in play
//     expect(bashfulCardWithSnowWhite.hasBodyguard).toBe(true);
//   });
// });
//
