// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { mamaOdieVoiceOfWisdom } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mama Odie - Voice of Wisdom", () => {
//   it.skip("**LISTEN TO YOUR MAMA NOW** Whenever this character quests, you may move up to 2 damage counters from chosen character to chosen opposing character.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: mamaOdieVoiceOfWisdom.cost,
//       play: [mamaOdieVoiceOfWisdom],
//       hand: [mamaOdieVoiceOfWisdom],
//     });
//
//     await testEngine.playCard(mamaOdieVoiceOfWisdom);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
