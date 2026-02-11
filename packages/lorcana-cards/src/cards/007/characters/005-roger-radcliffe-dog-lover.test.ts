// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rogerRadcliffeDogLover } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Roger Radcliffe - Dog Lover", () => {
//   It.skip("THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rogerRadcliffeDogLover.cost,
//       Play: [rogerRadcliffeDogLover],
//       Hand: [rogerRadcliffeDogLover],
//     });
//
//     Await testEngine.playCard(rogerRadcliffeDogLover);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
