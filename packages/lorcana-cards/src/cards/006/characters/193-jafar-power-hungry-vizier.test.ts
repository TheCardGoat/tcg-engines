// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { jafarPowerhungryVizier } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jafar - Power‐Hungry Vizier", () => {
//   It.skip("YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jafarPowerhungryVizier.cost,
//       Play: [jafarPowerhungryVizier],
//       Hand: [jafarPowerhungryVizier],
//     });
//
//     Await testEngine.playCard(jafarPowerhungryVizier);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
