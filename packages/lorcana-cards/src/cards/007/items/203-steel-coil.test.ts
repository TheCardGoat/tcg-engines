// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   kashekimAncientRuler,
//   kodaSmallishBear,
//   steelCoil,
//   suzyMasterSeamstress,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Steel Coil", () => {
//   it("METALLIC FLOW During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.", async () => {
//     const testEngine = new TestEngine({
//       deck: [kodaSmallishBear],
//       play: [steelCoil],
//       hand: [suzyMasterSeamstress, kashekimAncientRuler],
//     });
//
//     await testEngine.putIntoInkwell(suzyMasterSeamstress);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [kashekimAncientRuler] });
//
//     expect(testEngine.getCardModel(suzyMasterSeamstress).zone).toBe("inkwell");
//     expect(testEngine.getCardModel(kashekimAncientRuler).zone).toBe("discard");
//     expect(testEngine.getCardModel(kodaSmallishBear).zone).toBe("hand");
//   });
// });
//
// describe("Regression", () => {
//   it("should be able to discard the card that was drawn", async () => {
//     const testEngine = new TestEngine({
//       deck: [kodaSmallishBear],
//       play: [steelCoil],
//       hand: [suzyMasterSeamstress, kashekimAncientRuler],
//     });
//
//     await testEngine.putIntoInkwell(suzyMasterSeamstress);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [kodaSmallishBear] });
//
//     expect(testEngine.getCardModel(suzyMasterSeamstress).zone).toBe("inkwell");
//     expect(testEngine.getCardModel(kashekimAncientRuler).zone).toBe("hand");
//     expect(testEngine.getCardModel(kodaSmallishBear).zone).toBe("discard");
//   });
// });
//
