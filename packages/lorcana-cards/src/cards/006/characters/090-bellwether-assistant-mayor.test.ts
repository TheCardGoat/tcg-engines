// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { bellwetherAssistantMayor } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bellwether - Assistant Mayor", () => {
//   it.skip("FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: bellwetherAssistantMayor.cost,
//       play: [bellwetherAssistantMayor],
//       hand: [bellwetherAssistantMayor],
//     });
//
//     await testEngine.playCard(bellwetherAssistantMayor);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
