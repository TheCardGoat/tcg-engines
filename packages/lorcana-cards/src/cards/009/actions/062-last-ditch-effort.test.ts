// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { lastditchEffort } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Last-ditch Effort", () => {
//   It.skip("Exert chosen opposing character. Then chosen character of yours gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: lastditchEffort.cost,
//       Play: [lastditchEffort],
//       Hand: [lastditchEffort],
//     });
//
//     Await testEngine.playCard(lastditchEffort);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
