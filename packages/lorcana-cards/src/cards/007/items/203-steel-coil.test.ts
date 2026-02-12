// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KashekimAncientRuler,
//   KodaSmallishBear,
//   SteelCoil,
//   SuzyMasterSeamstress,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Steel Coil", () => {
//   It("METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.", async () => {
//     Const testEngine = new TestEngine({
//       Deck: [kodaSmallishBear],
//       Play: [steelCoil],
//       Hand: [suzyMasterSeamstress, kashekimAncientRuler],
//     });
//
//     Await testEngine.putIntoInkwell(suzyMasterSeamstress);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });
//
//     Expect(testEngine.getCardModel(suzyMasterSeamstress).zone).toBe("inkwell");
//     Expect(testEngine.getCardModel(kashekimAncientRuler).zone).toBe("discard");
//     Expect(testEngine.getCardModel(kodaSmallishBear).zone).toBe("hand");
//   });
// });
//
// Describe("Regression", () => {
//   It("should be able to discard the card that was drawn", async () => {
//     Const testEngine = new TestEngine({
//       Deck: [kodaSmallishBear],
//       Play: [steelCoil],
//       Hand: [suzyMasterSeamstress, kashekimAncientRuler],
//     });
//
//     Await testEngine.putIntoInkwell(suzyMasterSeamstress);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [kodaSmallishBear] });
//
//     Expect(testEngine.getCardModel(suzyMasterSeamstress).zone).toBe("inkwell");
//     Expect(testEngine.getCardModel(kashekimAncientRuler).zone).toBe("hand");
//     Expect(testEngine.getCardModel(kodaSmallishBear).zone).toBe("discard");
//   });
// });
//
