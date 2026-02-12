// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { dalmatianPuppyTailWagger } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dalmatian Puppy - Tail Wagger", () => {
//   It.skip("WHERE DID THEY ALL COME FROM? You may have up to 99 copies of Dalmatian Puppy - Tail Wagger in your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: dalmatianPuppyTailWagger.cost,
//       Play: [dalmatianPuppyTailWagger],
//       Hand: [dalmatianPuppyTailWagger],
//     });
//
//     Await testEngine.playCard(dalmatianPuppyTailWagger);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
