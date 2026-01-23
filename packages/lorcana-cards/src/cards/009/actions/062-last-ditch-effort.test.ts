// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { lastditchEffort } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Last-ditch Effort", () => {
//   it.skip("Exert chosen opposing character. Then chosen character of yours gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: lastditchEffort.cost,
//       play: [lastditchEffort],
//       hand: [lastditchEffort],
//     });
//
//     await testEngine.playCard(lastditchEffort);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
