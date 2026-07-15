// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { donaldDuckSleepwalker } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Donald Duck - Sleepwalker", () => {
//   It.skip("**STARTLED AWAKE** Whenever you play an action, this character gets +2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: donaldDuckSleepwalker.cost,
//       Play: [donaldDuckSleepwalker],
//       Hand: [donaldDuckSleepwalker],
//     });
//
//     Await testEngine.playCard(donaldDuckSleepwalker);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
