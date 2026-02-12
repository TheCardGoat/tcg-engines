// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AladdinIntrepidCommander,
//   HadesStrongArm,
//   TootlesLostBoy,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hades - Strong Arm", () => {
//   It("WHAT ARE YOU GONNA DO? {E}, 3 {I}, Banish one of your characters – Banish chosen character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 3,
//         Play: [hadesStrongArm, aladdinIntrepidCommander],
//       },
//       {
//         Play: [tootlesLostBoy],
//       },
//     );
//
//     Await testEngine.activateCard(hadesStrongArm, {
//       Costs: [aladdinIntrepidCommander],
//     });
//
//     Await testEngine.resolveTopOfStack({ targets: [tootlesLostBoy] });
//
//     Expect(testEngine.getCardModel(hadesStrongArm).exerted).toBe(true);
//     Expect(testEngine.getCardModel(tootlesLostBoy).isDead).toBe(true);
//     Expect(testEngine.getCardModel(aladdinIntrepidCommander).isDead).toBe(true);
//   });
// });
//
