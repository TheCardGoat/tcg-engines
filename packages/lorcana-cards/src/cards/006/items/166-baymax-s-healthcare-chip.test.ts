// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { baymaxsHealthcareChip } from "@lorcanito/lorcana-engine/cards/006/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Baymax's Healthcare Chip", () => {
//   It.skip("10,000 MEDICAL PROCEDURES {E} - Choose one:", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: baymaxsHealthcareChip.cost,
//       Play: [baymaxsHealthcareChip],
//       Hand: [baymaxsHealthcareChip],
//     });
//
//     Await testEngine.playCard(baymaxsHealthcareChip);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("* Remove up to 1 damage from chosen character. ", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: baymaxsHealthcareChip.cost,
//       Play: [baymaxsHealthcareChip],
//       Hand: [baymaxsHealthcareChip],
//     });
//
//     Await testEngine.playCard(baymaxsHealthcareChip);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("* If you have a Robot character in play, remove up to 3 damage from chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: baymaxsHealthcareChip.cost,
//       Play: [baymaxsHealthcareChip],
//       Hand: [baymaxsHealthcareChip],
//     });
//
//     Await testEngine.playCard(baymaxsHealthcareChip);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
