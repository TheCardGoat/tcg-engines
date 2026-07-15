// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KashekimAncientRuler,
//   TrainingStaff,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Training Staff", () => {
//   It("PRECISION STRIKE {E}, 1 {I} – Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 1,
//         Play: [trainingStaff, kashekimAncientRuler],
//       },
//       {
//         Deck: 1,
//       },
//     );
//
//     Await testEngine.activateCard(trainingStaff);
//
//     Const target = testEngine.getCardModel(kashekimAncientRuler);
//
//     Expect(target.hasChallenger).toBe(false);
//
//     Await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });
//
//     Expect(target.hasChallenger).toBe(true);
//
//     Await testEngine.passTurn();
//     Expect(target.hasEvasive).toBe(false);
//   });
// });
//
