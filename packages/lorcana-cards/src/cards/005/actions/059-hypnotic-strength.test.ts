// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hypnoticStrength } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { liloJuniorCakeDecorator } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hypnotic Strength", () => {
//   It("Draw a card. Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hypnoticStrength.cost,
//       Hand: [hypnoticStrength],
//       Play: [liloJuniorCakeDecorator],
//     });
//
//     Expect(testEngine.getCardModel(liloJuniorCakeDecorator).hasChallenger).toBe(
//       False,
//     );
//
//     Await testEngine.playCard(hypnoticStrength, {
//       Targets: [liloJuniorCakeDecorator],
//     });
//
//     Expect(testEngine.getCardModel(liloJuniorCakeDecorator).hasChallenger).toBe(
//       True,
//     );
//     Expect(testEngine.getZonesCardCount().hand).toBe(1);
//   });
// });
//
