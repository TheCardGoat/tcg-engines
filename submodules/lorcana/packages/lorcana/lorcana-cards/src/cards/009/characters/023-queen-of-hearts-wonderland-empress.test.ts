// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { queenOfHeartsWonderlandEmpress } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Queen of Hearts - Wonderland Empress", () => {
//   It.skip("**ALL WAYS HERE ARE MY WAYS** Whenever this character quests, your other Villain characters get +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: queenOfHeartsWonderlandEmpress.cost,
//       Play: [queenOfHeartsWonderlandEmpress],
//       Hand: [queenOfHeartsWonderlandEmpress],
//     });
//
//     Await testEngine.playCard(queenOfHeartsWonderlandEmpress);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
