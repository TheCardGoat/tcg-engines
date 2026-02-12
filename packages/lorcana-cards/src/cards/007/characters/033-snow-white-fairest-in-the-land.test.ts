// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { snowWhiteFairestInTheLand } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Snow White - Fairest in the Land", () => {
//   It.skip("HIDDEN AWAY This character can't be challenged.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: snowWhiteFairestInTheLand.cost,
//       Play: [snowWhiteFairestInTheLand],
//       Hand: [snowWhiteFairestInTheLand],
//     });
//
//     Await testEngine.playCard(snowWhiteFairestInTheLand);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
