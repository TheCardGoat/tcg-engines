// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CinderellaMelodyWeaver,
//   MagicBroomAerialCleaner,
//   YenSidPowerfulSorcerer,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Yen Sid - Powerful Sorcerer", () => {
//   It("**TIMELY INTERVENTION** When you play this character, if you have a character named Magic Broom in play, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: yenSidPowerfulSorcerer.cost,
//       Hand: [yenSidPowerfulSorcerer],
//       Play: [magicBroomAerialCleaner],
//       Deck: [cinderellaMelodyWeaver],
//     });
//
//     Const cardUnderTest = testStore.getCard(yenSidPowerfulSorcerer);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//
//     Expect(testStore.getZonesCardCount().hand).toBe(1);
//   });
//
//   It("**ARCANE STUDY** While you have 2 or more Broom characters in play, this character gets +2 {L}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: yenSidPowerfulSorcerer.cost,
//       Play: [
//         YenSidPowerfulSorcerer,
//         MagicBroomAerialCleaner,
//         MagicBroomAerialCleaner,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getCard(yenSidPowerfulSorcerer);
//     Expect(cardUnderTest.lore).toBe(yenSidPowerfulSorcerer.lore + 2);
//   });
// });
//
