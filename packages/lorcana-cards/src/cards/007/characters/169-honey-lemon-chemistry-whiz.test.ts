// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { honeyLemonChemistryWhiz } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Honey Lemon - Chemistry Whiz", () => {
//   It.skip("PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: honeyLemonChemistryWhiz.cost,
//       Play: [honeyLemonChemistryWhiz],
//       Hand: [honeyLemonChemistryWhiz],
//     });
//
//     Await testEngine.playCard(honeyLemonChemistryWhiz);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
