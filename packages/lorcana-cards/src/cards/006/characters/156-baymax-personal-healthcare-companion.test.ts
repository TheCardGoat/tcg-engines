// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BaymaxPersonalHealthcareCompanion,
//   HiroHamadaRoboticsProdigy,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Baymax - Personal Healthcare Companion", () => {
//   It("**FULLY CHARGED** If you have an Inventor character in play, you pay 1 {I} less to play this character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: baymaxPersonalHealthcareCompanion.cost,
//       Hand: [baymaxPersonalHealthcareCompanion],
//       Play: [hiroHamadaRoboticsProdigy],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       BaymaxPersonalHealthcareCompanion,
//     );
//
//     Expect(cardUnderTest.cost).toBe(baymaxPersonalHealthcareCompanion.cost - 1);
//   });
//   It("**FULLY CHARGED** If you have an Inventor character in play, you pay 1 {I} less to play this character.**YOU SAID 'OW'** 2 {I} - Remove up to 1 damage from another chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 2,
//       Play: [baymaxPersonalHealthcareCompanion, hiroHamadaRoboticsProdigy],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       BaymaxPersonalHealthcareCompanion,
//     );
//     Const hiro = testEngine.getCardModel(hiroHamadaRoboticsProdigy);
//
//     Hiro.updateCardDamage(1, "add");
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "YOU SAID 'OW'",
//     });
//
//     Await testEngine.resolveTopOfStack({ targets: [hiro] });
//     Expect(hiro.damage).toBe(0);
//   });
// });
//
