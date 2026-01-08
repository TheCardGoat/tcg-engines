// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { heiheiBoatSnack } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   boltDependableFriend,
//   boltSuperdog,
//   calhounCourageousRescuer,
//   heiheiExpandedConsciousness,
//   hiroHamadaArmorDesigner,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hiro Hamada - Armor Designer", () => {
//   it("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Hiro Hamada.)", async () => {
//     const testEngine = new TestEngine({
//       play: [hiroHamadaArmorDesigner],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(hiroHamadaArmorDesigner);
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it("YOU CAN BE WAY MORE Your Floodborn characters that have a card under them gain Evasive and Ward. (Only characters with Evasive can challenge them. Opponents can’t choose them except to challenge.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 10,
//       play: [
//         hiroHamadaArmorDesigner,
//         calhounCourageousRescuer,
//         boltDependableFriend,
//         heiheiBoatSnack,
//       ],
//       hand: [heiheiExpandedConsciousness, boltSuperdog],
//     });
//
//     await testEngine.shiftCard({
//       shifted: heiheiBoatSnack,
//       shifter: heiheiExpandedConsciousness,
//     });
//     await testEngine.shiftCard({
//       shifted: boltDependableFriend,
//       shifter: boltSuperdog,
//     });
//
//     const withoutCardUnder = [
//       calhounCourageousRescuer,
//       hiroHamadaArmorDesigner,
//     ];
//
//     for (const card of withoutCardUnder) {
//       const cardUnderTest = testEngine.getCardModel(card);
//       expect(cardUnderTest.hasEvasive).toBe(false);
//       expect(cardUnderTest.hasWard).toBe(false);
//     }
//
//     const withCardUnder = [heiheiExpandedConsciousness, boltSuperdog];
//     for (const card of withCardUnder) {
//       const cardUnderTest = testEngine.getCardModel(card);
//       expect(cardUnderTest.hasEvasive).toBe(true);
//       expect(cardUnderTest.hasWard).toBe(true);
//     }
//   });
// });
//
