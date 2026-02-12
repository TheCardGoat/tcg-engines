// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { kangaNurturingMother } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kanga - Nurturing Mother", () => {
//   It.skip("SAFE AND SOUND Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: kangaNurturingMother.cost,
//       Play: [kangaNurturingMother],
//       Hand: [kangaNurturingMother],
//     });
//
//     Await testEngine.playCard(kangaNurturingMother);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
