// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { mosquitoBite } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mosquito Bite", () => {
//   It("Put 1 damage counter on chosen character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: mosquitoBite.cost,
//         Hand: [mosquitoBite],
//         Deck: 2,
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Await testEngine.playCard(mosquitoBite);
//     Await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
//     Expect(testEngine.getCardModel(goofyKnightForADay).meta.damage).toEqual(1);
//   });
// });
//
