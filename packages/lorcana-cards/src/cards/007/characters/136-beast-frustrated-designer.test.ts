// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { beastFrustratedDesigner } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Beast - Frustrated Designer", () => {
//   It.skip("I'VE HAD IT! {E}, 2 {I}, Banish 2 of your items – Deal 5 damage to chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: beastFrustratedDesigner.cost,
//       Play: [beastFrustratedDesigner],
//       Hand: [beastFrustratedDesigner],
//     });
//
//     Await testEngine.playCard(beastFrustratedDesigner);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
