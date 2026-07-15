// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { heiheiBoatSnack } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   BoltDependableFriend,
//   BoltSuperdog,
//   CalhounCourageousRescuer,
//   HeiheiExpandedConsciousness,
//   HiroHamadaArmorDesigner,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hiro Hamada - Armor Designer", () => {
//   It("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Hiro Hamada.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [hiroHamadaArmorDesigner],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(hiroHamadaArmorDesigner);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("YOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward. (Only characters with Evasive can challenge them. Opponents can’t choose them except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [
//         HiroHamadaArmorDesigner,
//         CalhounCourageousRescuer,
//         BoltDependableFriend,
//         HeiheiBoatSnack,
//       ],
//       Hand: [heiheiExpandedConsciousness, boltSuperdog],
//     });
//
//     Await testEngine.shiftCard({
//       Shifted: heiheiBoatSnack,
//       Shifter: heiheiExpandedConsciousness,
//     });
//     Await testEngine.shiftCard({
//       Shifted: boltDependableFriend,
//       Shifter: boltSuperdog,
//     });
//
//     Const withoutCardUnder = [
//       CalhounCourageousRescuer,
//       HiroHamadaArmorDesigner,
//     ];
//
//     For (const card of withoutCardUnder) {
//       Const cardUnderTest = testEngine.getCardModel(card);
//       Expect(cardUnderTest.hasEvasive).toBe(false);
//       Expect(cardUnderTest.hasWard).toBe(false);
//     }
//
//     Const withCardUnder = [heiheiExpandedConsciousness, boltSuperdog];
//     For (const card of withCardUnder) {
//       Const cardUnderTest = testEngine.getCardModel(card);
//       Expect(cardUnderTest.hasEvasive).toBe(true);
//       Expect(cardUnderTest.hasWard).toBe(true);
//     }
//   });
// });
//
