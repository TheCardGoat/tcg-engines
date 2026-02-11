// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { pleakleyScientificExpert } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pleakley - Scientific Expert", () => {
//   It.skip("REPORTING FOR DUTY When you play this character, put chosen character of yours into your inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: pleakleyScientificExpert.cost,
//       Hand: [pleakleyScientificExpert],
//     });
//
//     Await testEngine.playCard(pleakleyScientificExpert);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
