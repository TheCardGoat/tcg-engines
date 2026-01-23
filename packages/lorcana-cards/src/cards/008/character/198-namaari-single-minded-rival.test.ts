// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   rayaFierceProtector,
//   sisuDaringVisitor,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { namaariSinglemindedRival } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Namaari - Single-Minded Rival", () => {
//   it("STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: namaariSinglemindedRival.cost,
//       hand: [namaariSinglemindedRival, rayaFierceProtector],
//       deck: [sisuDaringVisitor],
//     });
//
//     const namaari = testEngine.getCardModel(namaariSinglemindedRival);
//     const sisu = testEngine.getCardModel(sisuDaringVisitor);
//     const raya = testEngine.getCardModel(rayaFierceProtector);
//
//     await testEngine.playCard(namaari);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [sisu] });
//
//     expect(namaari.zone).toBe("play");
//     expect(sisu.zone).toBe("discard");
//     expect(raya.zone).toBe("hand");
//   });
//
//   it("EXTREME FOCUS This character gets +1 {S} for each card in your discard.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: namaariSinglemindedRival.cost,
//       play: [namaariSinglemindedRival],
//       hand: [],
//       discard: [rayaFierceProtector, sisuDaringVisitor],
//       deck: [],
//     });
//
//     expect(testEngine.getCardModel(namaariSinglemindedRival).strength).toBe(2);
//   });
// });
//
