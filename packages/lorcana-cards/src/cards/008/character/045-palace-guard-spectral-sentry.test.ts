// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { palaceGuardSpectralSentry } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Palace Guard - Spectral Sentry", () => {
//   It.skip("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: palaceGuardSpectralSentry.cost,
//       Play: [palaceGuardSpectralSentry],
//       Hand: [palaceGuardSpectralSentry],
//     });
//
//     Await testEngine.playCard(palaceGuardSpectralSentry);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
