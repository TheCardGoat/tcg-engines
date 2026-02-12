// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { moanaIslandExplorer } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Moana - Island Explorer", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [moanaIslandExplorer],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(moanaIslandExplorer);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It.skip("ADVENTUROUS SPIRIT Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: moanaIslandExplorer.cost,
//       Play: [moanaIslandExplorer],
//       Hand: [moanaIslandExplorer],
//     });
//
//     Await testEngine.playCard(moanaIslandExplorer);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
