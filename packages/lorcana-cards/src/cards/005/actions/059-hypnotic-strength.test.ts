// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { hypnoticStrength } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { liloJuniorCakeDecorator } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hypnotic Strength", () => {
//   it("Draw a card. Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: hypnoticStrength.cost,
//       hand: [hypnoticStrength],
//       play: [liloJuniorCakeDecorator],
//     });
//
//     expect(testEngine.getCardModel(liloJuniorCakeDecorator).hasChallenger).toBe(
//       false,
//     );
//
//     await testEngine.playCard(hypnoticStrength, {
//       targets: [liloJuniorCakeDecorator],
//     });
//
//     expect(testEngine.getCardModel(liloJuniorCakeDecorator).hasChallenger).toBe(
//       true,
//     );
//     expect(testEngine.getZonesCardCount().hand).toBe(1);
//   });
// });
//
