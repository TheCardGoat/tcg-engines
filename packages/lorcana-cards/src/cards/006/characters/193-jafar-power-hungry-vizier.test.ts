// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { jafarPowerhungryVizier } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Jafar - Power‐Hungry Vizier", () => {
//   it.skip("YOU WILL BE PAID WHEN THE TIME COMES During your turn, whenever a card is put into your inkwell, deal 1 damage to chosen character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: jafarPowerhungryVizier.cost,
//       play: [jafarPowerhungryVizier],
//       hand: [jafarPowerhungryVizier],
//     });
//
//     await testEngine.playCard(jafarPowerhungryVizier);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
