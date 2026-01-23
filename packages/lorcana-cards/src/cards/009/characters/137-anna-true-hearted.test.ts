// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { annaTruehearted } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Anna - True-Hearted", () => {
//   it.skip("**LET ME HELP YOU** Whenever this character quests, your other Hero characters get +1 {L} this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: annaTruehearted.cost,
//       play: [annaTruehearted],
//       hand: [annaTruehearted],
//     });
//
//     await testEngine.playCard(annaTruehearted);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
