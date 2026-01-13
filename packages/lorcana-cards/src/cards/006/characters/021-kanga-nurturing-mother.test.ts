// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { kangaNurturingMother } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Kanga - Nurturing Mother", () => {
//   it.skip("SAFE AND SOUND Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: kangaNurturingMother.cost,
//       play: [kangaNurturingMother],
//       hand: [kangaNurturingMother],
//     });
//
//     await testEngine.playCard(kangaNurturingMother);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
