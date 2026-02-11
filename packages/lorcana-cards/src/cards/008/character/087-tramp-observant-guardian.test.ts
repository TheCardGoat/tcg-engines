// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   TrampObservantGuardian,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tramp - Observant Guardian", () => {
//   It("HOW DO I GET IN? When you play this character, chosen character gains Ward until the start of your next turn. (Opponents can't choose them except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: trampObservantGuardian.cost,
//       Hand: [trampObservantGuardian],
//       Play: [deweyLovableShowoff],
//     });
//
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.playCard(trampObservantGuardian);
//     // await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasWard).toBe(true);
//
//     TestEngine.passTurn();
//
//     Expect(target.hasWard).toBe(true);
//
//     TestEngine.passTurn();
//
//     Expect(target.hasWard).toBe(false);
//   });
// });
//
