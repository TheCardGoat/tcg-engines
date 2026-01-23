// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { philoctetesNononsenseInstructor } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Philoctetes - No-Nonsense Instructor", () => {
//   it.skip("**YOU GOTTA STAY FOCUSED** Your Hero characters gain **Challenger** +1. _(They get +1 {S} while challenging.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: philoctetesNononsenseInstructor.cost,
//       play: [philoctetesNononsenseInstructor],
//       hand: [philoctetesNononsenseInstructor],
//     });
//
//     await testEngine.playCard(philoctetesNononsenseInstructor);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
//
//   it.skip("**SHAMELESS PROMOTER** Whenever you play a Hero character, gain 1 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: philoctetesNononsenseInstructor.cost,
//       play: [philoctetesNononsenseInstructor],
//       hand: [philoctetesNononsenseInstructor],
//     });
//
//     await testEngine.playCard(philoctetesNononsenseInstructor);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
