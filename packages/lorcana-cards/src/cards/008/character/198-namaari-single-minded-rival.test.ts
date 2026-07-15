// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   RayaFierceProtector,
//   SisuDaringVisitor,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { namaariSinglemindedRival } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Namaari - Single-Minded Rival", () => {
//   It("STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: namaariSinglemindedRival.cost,
//       Hand: [namaariSinglemindedRival, rayaFierceProtector],
//       Deck: [sisuDaringVisitor],
//     });
//
//     Const namaari = testEngine.getCardModel(namaariSinglemindedRival);
//     Const sisu = testEngine.getCardModel(sisuDaringVisitor);
//     Const raya = testEngine.getCardModel(rayaFierceProtector);
//
//     Await testEngine.playCard(namaari);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [sisu] });
//
//     Expect(namaari.zone).toBe("play");
//     Expect(sisu.zone).toBe("discard");
//     Expect(raya.zone).toBe("hand");
//   });
//
//   It("EXTREME FOCUS This character gets +1 {S} for each card in your discard.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: namaariSinglemindedRival.cost,
//       Play: [namaariSinglemindedRival],
//       Hand: [],
//       Discard: [rayaFierceProtector, sisuDaringVisitor],
//       Deck: [],
//     });
//
//     Expect(testEngine.getCardModel(namaariSinglemindedRival).strength).toBe(2);
//   });
// });
//
