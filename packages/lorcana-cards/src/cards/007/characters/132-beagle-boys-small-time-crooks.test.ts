// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { beagleBoysSmalltimeCrooks } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Beagle Boys - Small-Time Crooks", () => {
//   It.skip("HURRY IT UP! Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn. (They can challenge the turn they're played. Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: beagleBoysSmalltimeCrooks.cost,
//       Play: [beagleBoysSmalltimeCrooks],
//       Hand: [beagleBoysSmalltimeCrooks],
//     });
//
//     Await testEngine.playCard(beagleBoysSmalltimeCrooks);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
