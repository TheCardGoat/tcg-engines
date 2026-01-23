// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { daisyDuckSecretAgent } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Daisy Duck - Secret Agent", () => {
//   it.skip("**THWART** Whenever this character quests, each opponent chooses and discards a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: daisyDuckSecretAgent.cost,
//       play: [daisyDuckSecretAgent],
//       hand: [daisyDuckSecretAgent],
//     });
//
//     await testEngine.playCard(daisyDuckSecretAgent);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
