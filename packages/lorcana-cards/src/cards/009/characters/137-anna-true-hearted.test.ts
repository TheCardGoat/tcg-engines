// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { annaTruehearted } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Anna - True-Hearted", () => {
//   It.skip("**LET ME HELP YOU** Whenever this character quests, your other Hero characters get +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: annaTruehearted.cost,
//       Play: [annaTruehearted],
//       Hand: [annaTruehearted],
//     });
//
//     Await testEngine.playCard(annaTruehearted);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
