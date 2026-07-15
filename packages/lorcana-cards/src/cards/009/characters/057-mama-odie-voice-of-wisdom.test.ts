// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { mamaOdieVoiceOfWisdom } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mama Odie - Voice of Wisdom", () => {
//   It.skip("**LISTEN TO YOUR MAMA NOW** Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mamaOdieVoiceOfWisdom.cost,
//       Play: [mamaOdieVoiceOfWisdom],
//       Hand: [mamaOdieVoiceOfWisdom],
//     });
//
//     Await testEngine.playCard(mamaOdieVoiceOfWisdom);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
