// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KashekimAncientRuler,
//   RubyCoil,
//   SuzyMasterSeamstress,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ruby Coil", () => {
//   It("CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: rubyCoil.cost,
//       Play: [rubyCoil, kashekimAncientRuler],
//       Hand: [suzyMasterSeamstress],
//     });
//     Const target = testEngine.getCardModel(kashekimAncientRuler);
//
//     Expect(target.strength).toBe(kashekimAncientRuler.strength);
//
//     Await testEngine.putIntoInkwell(suzyMasterSeamstress);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });
//
//     Expect(target.strength).toBe(kashekimAncientRuler.strength + 2);
//   });
// });
//
