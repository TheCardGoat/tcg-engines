// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { madamMimCheatingSpellcaster } from "@lorcanito/lorcana-engine/cards/007/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Madam Mim - Cheating Spellcaster", () => {
//   it.skip("PLAY ROUGH Whenever this character quests, exert chosen opposing character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: madamMimCheatingSpellcaster.cost,
//       play: [madamMimCheatingSpellcaster],
//       hand: [madamMimCheatingSpellcaster],
//     });
//
//     await testEngine.playCard(madamMimCheatingSpellcaster);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
