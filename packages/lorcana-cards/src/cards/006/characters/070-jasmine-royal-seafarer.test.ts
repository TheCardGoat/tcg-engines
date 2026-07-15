// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { jasmineRoyalSeafarer } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jasmine - Royal Seafarer", () => {
//   It.skip("BY ORDER OF THE PRINCESS When you play this character, choose one: \n* Exert chosen damaged character. \n* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jasmineRoyalSeafarer.cost,
//       Hand: [jasmineRoyalSeafarer],
//     });
//
//     Await testEngine.playCard(jasmineRoyalSeafarer);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
