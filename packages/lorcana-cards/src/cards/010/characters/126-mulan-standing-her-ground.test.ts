// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mulanStandingHerGround } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mulan - Standing Her Ground", () => {
//   it.skip("FLOWING BLADE During your turn, if you've put a card under one of your characters or locations this turn, this character takes no damage from challenges.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: mulanStandingHerGround.cost,
//       play: [mulanStandingHerGround],
//       hand: [mulanStandingHerGround],
//     });
//
//     await testEngine.playCard(mulanStandingHerGround);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
