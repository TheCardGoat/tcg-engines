// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { robinHoodCapableFighter } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { gizmoduckSuitedUp } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Resist +1 (Damage dealt to this character is reduced by 1.)", () => {
//   It.skip("", async () => {
//     Const testEngine = new TestEngine({
//       Play: [gizmoduckSuitedUp],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(gizmoduckSuitedUp);
//     Expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
// Describe("BLATHERING BLATHERSKITE This character can challenge ready damaged characters.", () => {
//   It("can challenge ready damaged characters", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 10,
//         Play: [gizmoduckSuitedUp],
//         Hand: [],
//       },
//       {
//         Inkwell: 10,
//         Play: [robinHoodCapableFighter],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(gizmoduckSuitedUp);
//     Const defender = testEngine.getCardModel(robinHoodCapableFighter);
//
//     Defender.damage = 2;
//
//     Expect(defender.damage).toEqual(2);
//
//     Expect(defender.ready).toBe(true);
//
//     Expect(cardUnderTest.canChallenge(defender)).toBe(true);
//
//     CardUnderTest.challenge(defender);
//   });
//
//   It("can't challenge ready not damaged characters", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: 10,
//         Play: [gizmoduckSuitedUp],
//         Hand: [],
//       },
//       {
//         Inkwell: 10,
//         Play: [robinHoodCapableFighter],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(gizmoduckSuitedUp);
//     Const defender = testEngine.getCardModel(robinHoodCapableFighter);
//
//     Expect(defender.damage).toEqual(0);
//
//     Expect(defender.ready).toBe(true);
//
//     Expect(cardUnderTest.canChallenge(defender)).toBe(false);
//   });
// });
//
