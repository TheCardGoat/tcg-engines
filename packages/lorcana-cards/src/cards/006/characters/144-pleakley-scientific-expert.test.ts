// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { pleakleyScientificExpert } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Pleakley - Scientific Expert", () => {
//   it.skip("REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: pleakleyScientificExpert.cost,
//       hand: [pleakleyScientificExpert],
//     });
//
//     await testEngine.playCard(pleakleyScientificExpert);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
