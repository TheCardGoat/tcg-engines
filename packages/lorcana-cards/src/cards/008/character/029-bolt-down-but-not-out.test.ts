// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { boltDownButNotOut } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bolt - Down but Not Out", () => {
//   it.skip("NONE OF YOUR POWERS ARE WORKING This character enters play exerted.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: boltDownButNotOut.cost,
//       play: [boltDownButNotOut],
//       hand: [boltDownButNotOut],
//     });
//
//     await testEngine.playCard(boltDownButNotOut);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
