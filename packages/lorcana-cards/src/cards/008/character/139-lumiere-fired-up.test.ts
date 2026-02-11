// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AtlanteanCrystal,
//   BellesFavoriteBook,
//   LumiereFiredUp,
//   TelevisionSet,
//   TinkerBellInsistentFairy,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Lumiere - Fired Up", () => {
//   It("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lumiere.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [lumiereFiredUp],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(lumiereFiredUp);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("Evasive", async () => {
//     Const testEngine = new TestEngine({
//       Play: [lumiereFiredUp],
//     });
//
//     Await testEngine.playCard(lumiereFiredUp);
//     Const cardUnderTest = testEngine.getCardModel(lumiereFiredUp);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("SACREBLEU!: Whenever one of your items is banished, this character gets +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [
//         LumiereFiredUp,
//         TinkerBellInsistentFairy,
//         AtlanteanCrystal,
//         BellesFavoriteBook,
//         TelevisionSet,
//       ],
//     });
//
//     // Verify that limier has 2 {L} at the start
//     Await testEngine.playCard(lumiereFiredUp);
//     Const cardUnderTest = testEngine.getCardModel(lumiereFiredUp);
//     Expect(cardUnderTest.lore).toBe(2);
//
//     // Banish one of the items
//     Await testEngine.getCardModel(atlanteanCrystal).banish();
//     // await testEngine.acceptOptionalAbility();
//     Expect(cardUnderTest.lore).toBe(3);
//
//     // Banish another item
//     Await testEngine.getCardModel(bellesFavoriteBook).banish();
//     Expect(cardUnderTest.lore).toBe(4);
//
//     // Banish the last item
//     Await testEngine.getCardModel(televisionSet).banish();
//     Expect(cardUnderTest.lore).toBe(5);
//
//     // Banish tinker bell (verify that it does not increase lore)
//     Await testEngine.getCardModel(tinkerBellInsistentFairy).banish();
//     Expect(cardUnderTest.lore).toBe(5);
//   });
// });
//
