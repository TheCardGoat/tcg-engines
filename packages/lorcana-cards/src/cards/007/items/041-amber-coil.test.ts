// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AmberCoil,
//   KashekimAncientRuler,
//   KodaSmallishBear,
//   SuzyMasterSeamstress,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Amber Coil", () => {
//   It("HEALING AURA During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [amberCoil, kashekimAncientRuler, kodaSmallishBear],
//       Hand: [suzyMasterSeamstress],
//     });
//
//     Await testEngine.setCardDamage(kashekimAncientRuler, 2);
//
//     Await testEngine.putIntoInkwell(suzyMasterSeamstress);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });
//
//     Expect(testEngine.getCardModel(kashekimAncientRuler).damage).toBe(0);
//   });
// });
//
