// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   kashekimAncientRuler,
//   trainingStaff,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Training Staff", () => {
//   it("PRECISION STRIKE {E}, 1 {I} – Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: 1,
//         play: [trainingStaff, kashekimAncientRuler],
//       },
//       {
//         deck: 1,
//       },
//     );
//
//     await testEngine.activateCard(trainingStaff);
//
//     const target = testEngine.getCardModel(kashekimAncientRuler);
//
//     expect(target.hasChallenger).toBe(false);
//
//     await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });
//
//     expect(target.hasChallenger).toBe(true);
//
//     await testEngine.passTurn();
//     expect(target.hasEvasive).toBe(false);
//   });
// });
//
