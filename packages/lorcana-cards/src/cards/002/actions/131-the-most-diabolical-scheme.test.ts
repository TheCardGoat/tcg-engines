// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "bun:test";
// import { theMostDiabolicalScheme } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import {
//   gastonBaritoneBully,
//   goofyKnightForADay,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Most Diabolical Scheme", () => {
//   it("Banish chosen Villain of yours to banish chosen character.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: theMostDiabolicalScheme.cost,
//         hand: [theMostDiabolicalScheme],
//         play: [gastonBaritoneBully],
//       },
//       {
//         play: [goofyKnightForADay],
//       },
//     );
//
//     await testEngine.playCard(theMostDiabolicalScheme);
//
//     await testEngine.resolveTopOfStack(
//       { targets: [gastonBaritoneBully] },
//       true,
//     );
//     expect(testEngine.getCardModel(gastonBaritoneBully).zone).toEqual(
//       "discard",
//     );
//
//     await testEngine.resolveTopOfStack({ targets: [goofyKnightForADay] });
//     expect(testEngine.getCardModel(goofyKnightForADay).zone).toEqual("discard");
//   });
// });
//
