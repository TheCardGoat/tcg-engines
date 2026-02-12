// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FireTheCannons,
//   NalaUndauntedLioness,
// } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Nala - Undaunted Lioness", () => {
//   It("DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [nalaUndauntedLioness],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(nalaUndauntedLioness);
//
//     Expect(cardUnderTest.damage).toBe(0);
//     Expect(cardUnderTest.hasResist).toBe(true);
//     Expect(cardUnderTest.lore).toBe(nalaUndauntedLioness.lore + 1);
//   });
//
//   It("DETERMINED DIVERSION While this character has no damage, she gets +1 {L} and gains Resist +1. (Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: nalaUndauntedLioness.cost,
//       Play: [nalaUndauntedLioness],
//       Hand: [fireTheCannons],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(nalaUndauntedLioness);
//
//     Expect(cardUnderTest.lore).toEqual(3);
//     Expect(cardUnderTest.hasResist).toBe(true);
//
//     Await testEngine.playCard(fireTheCannons, { targets: [cardUnderTest] });
//
//     Expect(cardUnderTest.lore).toEqual(2);
//     Expect(cardUnderTest.damage).toEqual(1);
//   });
// });
//
