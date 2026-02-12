// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "bun:test";
// Import { theMostDiabolicalScheme } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   GastonBaritoneBully,
//   GoofyKnightForADay,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Most Diabolical Scheme", () => {
//   It("Banish chosen Villain of yours to banish chosen character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: theMostDiabolicalScheme.cost,
//         Hand: [theMostDiabolicalScheme],
//         Play: [gastonBaritoneBully],
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Await testEngine.playCard(theMostDiabolicalScheme);
//
//     Await testEngine.resolveTopOfStack(
//       { targets: [gastonBaritoneBully] },
//       True,
//     );
//     Expect(testEngine.getCardModel(gastonBaritoneBully).zone).toEqual(
//       "discard",
//     );
//
//     Await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
//     Expect(testEngine.getCardModel(goofyKnightForADay).zone).toEqual("discard");
//   });
// });
//
