// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mulanStandingHerGround } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mulan - Standing Her Ground", () => {
//   It.skip("FLOWING BLADE During your turn, if you've put a card under one of your characters or locations this turn, this character takes no damage from challenges.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mulanStandingHerGround.cost,
//       Play: [mulanStandingHerGround],
//       Hand: [mulanStandingHerGround],
//     });
//
//     Await testEngine.playCard(mulanStandingHerGround);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
