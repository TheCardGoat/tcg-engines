// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { mosquitoBite } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mosquito Bite", () => {
//   it("Put 1 damage counter on chosen character.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: mosquitoBite.cost,
//         hand: [mosquitoBite],
//         deck: 2,
//       },
//       {
//         play: [goofyKnightForADay],
//       },
//     );
//
//     await testEngine.playCard(mosquitoBite);
//     await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
//     expect(testEngine.getCardModel(goofyKnightForADay).meta.damage).toEqual(1);
//   });
// });
//
