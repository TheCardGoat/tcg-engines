// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { scarEerilyPrepared } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Scar - Eerily Prepared", () => {
//   It("Boost 2 ", async () => {
//     Const testEngine = new TestEngine({
//       Play: [scarEerilyPrepared],
//     });
//
//     Expect(testEngine.getCardModel(scarEerilyPrepared).hasBoost).toBe(true);
//   });
//
//   It.skip(" SURVIVAL OF THE FITTEST Whenever you put a card under this character, chosen opposing character gets -5 this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: scarEerilyPrepared.cost,
//       Play: [scarEerilyPrepared],
//       Hand: [scarEerilyPrepared],
//     });
//
//     Await testEngine.playCard(scarEerilyPrepared);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
