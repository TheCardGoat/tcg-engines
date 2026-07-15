// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BashfulAdoringKnight,
//   SnowWhiteFairhearted,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bashful - Adoring Knight", () => {
//   It("**IMPRESS THE PRINCESS** While you have a character named Snow White in play, this character gains **Bodyguard**. _(An opposing character who challenges one of your character must chose one with Bodyguard if able.)_", async () => {
//     // Setup test with only Bashful in play
//     Const testEngine = new TestEngine({
//       Inkwell: bashfulAdoringKnight.cost,
//       Play: [bashfulAdoringKnight],
//     });
//
//     Const bashfulCard = testEngine.getCardModel(bashfulAdoringKnight);
//
//     // Test initial state (without Snow White)
//     Expect(bashfulCard.hasBodyguard).toBe(false);
//
//     // Setup test with both Bashful and Snow White in play
//     Const testEngineWithSnowWhite = new TestEngine({
//       Inkwell: bashfulAdoringKnight.cost,
//       Play: [bashfulAdoringKnight, snowWhiteFairhearted],
//     });
//
//     Const bashfulCardWithSnowWhite =
//       TestEngineWithSnowWhite.getCardModel(bashfulAdoringKnight);
//
//     // Test state with Snow White in play
//     Expect(bashfulCardWithSnowWhite.hasBodyguard).toBe(true);
//   });
// });
//
