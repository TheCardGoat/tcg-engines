// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { boltDownButNotOut } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bolt - Down but Not Out", () => {
//   It.skip("NONE OF YOUR POWERS ARE WORKING This character enters play exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: boltDownButNotOut.cost,
//       Play: [boltDownButNotOut],
//       Hand: [boltDownButNotOut],
//     });
//
//     Await testEngine.playCard(boltDownButNotOut);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
