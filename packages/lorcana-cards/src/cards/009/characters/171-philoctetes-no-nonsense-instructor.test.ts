// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { philoctetesNononsenseInstructor } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Philoctetes - No-Nonsense Instructor", () => {
//   It.skip("**YOU GOTTA STAY FOCUSED** Your Hero characters gain **Challenger** +1. _(They get +1 {S} while challenging.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: philoctetesNononsenseInstructor.cost,
//       Play: [philoctetesNononsenseInstructor],
//       Hand: [philoctetesNononsenseInstructor],
//     });
//
//     Await testEngine.playCard(philoctetesNononsenseInstructor);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("**SHAMELESS PROMOTER** Whenever you play a Hero character, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: philoctetesNononsenseInstructor.cost,
//       Play: [philoctetesNononsenseInstructor],
//       Hand: [philoctetesNononsenseInstructor],
//     });
//
//     Await testEngine.playCard(philoctetesNononsenseInstructor);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
