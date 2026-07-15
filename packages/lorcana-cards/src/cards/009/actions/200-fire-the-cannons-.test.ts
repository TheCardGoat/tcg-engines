// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Fire the Cannons!", () => {
//   It.skip("Deal 2 damage to chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: fireTheCannons.cost,
//       Play: [fireTheCannons],
//       Hand: [fireTheCannons],
//     });
//
//     Await testEngine.playCard(fireTheCannons);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
