// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { bellwetherAssistantMayor } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bellwether - Assistant Mayor", () => {
//   It.skip("FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: bellwetherAssistantMayor.cost,
//       Play: [bellwetherAssistantMayor],
//       Hand: [bellwetherAssistantMayor],
//     });
//
//     Await testEngine.playCard(bellwetherAssistantMayor);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
