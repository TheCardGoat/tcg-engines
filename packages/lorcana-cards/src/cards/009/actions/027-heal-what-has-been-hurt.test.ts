// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { healWhatHasBeenHurt } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Heal What Has Been Hurt", () => {
//   It.skip("(A character with cost 3 or more can {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: healWhatHasBeenHurt.cost,
//       Play: [healWhatHasBeenHurt],
//       Hand: [healWhatHasBeenHurt],
//     });
//
//     Await testEngine.playCard(healWhatHasBeenHurt);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("Remove up to 3 damage from chosen character. Draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: healWhatHasBeenHurt.cost,
//       Play: [healWhatHasBeenHurt],
//       Hand: [healWhatHasBeenHurt],
//     });
//
//     Await testEngine.playCard(healWhatHasBeenHurt);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
