// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { daisyDuckSecretAgent } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Daisy Duck - Secret Agent", () => {
//   It.skip("**THWART** Whenever this character quests, each opponent chooses and discards a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: daisyDuckSecretAgent.cost,
//       Play: [daisyDuckSecretAgent],
//       Hand: [daisyDuckSecretAgent],
//     });
//
//     Await testEngine.playCard(daisyDuckSecretAgent);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
