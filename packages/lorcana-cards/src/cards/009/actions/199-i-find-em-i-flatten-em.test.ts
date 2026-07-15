// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { iFindEmIFlattenEm } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("I Find 'Em, I Flatten 'Em", () => {
//   It.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: iFindEmIFlattenEm.cost,
//       Play: [iFindEmIFlattenEm],
//       Hand: [iFindEmIFlattenEm],
//     });
//
//     Await testEngine.playCard(iFindEmIFlattenEm);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Banish all items.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: iFindEmIFlattenEm.cost,
//       Play: [iFindEmIFlattenEm],
//       Hand: [iFindEmIFlattenEm],
//     });
//
//     Await testEngine.playCard(iFindEmIFlattenEm);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
