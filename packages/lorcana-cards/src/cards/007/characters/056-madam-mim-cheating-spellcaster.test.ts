// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { madamMimCheatingSpellcaster } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Madam Mim - Cheating Spellcaster", () => {
//   It.skip("PLAY ROUGH Whenever this character quests, exert chosen opposing character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: madamMimCheatingSpellcaster.cost,
//       Play: [madamMimCheatingSpellcaster],
//       Hand: [madamMimCheatingSpellcaster],
//     });
//
//     Await testEngine.playCard(madamMimCheatingSpellcaster);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
