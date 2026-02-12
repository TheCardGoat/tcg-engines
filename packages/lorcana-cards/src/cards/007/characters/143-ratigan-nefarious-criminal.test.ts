// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { ratiganNefariousCriminal } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ratigan - Nefarious Criminal", () => {
//   It.skip("A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: ratiganNefariousCriminal.cost,
//       Play: [ratiganNefariousCriminal],
//       Hand: [ratiganNefariousCriminal],
//     });
//
//     Await testEngine.playCard(ratiganNefariousCriminal);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
