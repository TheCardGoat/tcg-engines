// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { scarEerilyPrepared } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Scar - Eerily Prepared", () => {
//   it("Boost 2 ", async () => {
//     const testEngine = new TestEngine({
//       play: [scarEerilyPrepared],
//     });
//
//     expect(testEngine.getCardModel(scarEerilyPrepared).hasBoost).toBe(true);
//   });
//
//   it.skip(" SURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: scarEerilyPrepared.cost,
//       play: [scarEerilyPrepared],
//       hand: [scarEerilyPrepared],
//     });
//
//     await testEngine.playCard(scarEerilyPrepared);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
