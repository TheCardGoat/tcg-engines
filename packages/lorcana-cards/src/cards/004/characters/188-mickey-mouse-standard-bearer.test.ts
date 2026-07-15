// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { mickeyMouseStandardBearer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mickey Mouse - Standard Bearer", () => {
//   It("**BE STRONG** When you play this character, chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mickeyMouseStandardBearer.cost,
//       Hand: [mickeyMouseStandardBearer],
//       Play: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mickeyMouseStandardBearer);
//     Const target = testEngine.getCardModel(goofyKnightForADay);
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasChallenger).toBe(true);
//   });
// });
//
