// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   cinderellaMelodyWeaver,
//   magicBroomAerialCleaner,
//   yenSidPowerfulSorcerer,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Yen Sid - Powerful Sorcerer", () => {
//   it("**TIMELY INTERVENTION** When you play this character, if you have a character named Magic Broom in play, you may draw a card.", () => {
//     const testStore = new TestStore({
//       inkwell: yenSidPowerfulSorcerer.cost,
//       hand: [yenSidPowerfulSorcerer],
//       play: [magicBroomAerialCleaner],
//       deck: [cinderellaMelodyWeaver],
//     });
//
//     const cardUnderTest = testStore.getCard(yenSidPowerfulSorcerer);
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//
//     expect(testStore.getZonesCardCount().hand).toBe(1);
//   });
//
//   it("**ARCANE STUDY** While you have 2 or more Broom characters in play, this character gets +2 {L}.", () => {
//     const testStore = new TestStore({
//       inkwell: yenSidPowerfulSorcerer.cost,
//       play: [
//         yenSidPowerfulSorcerer,
//         magicBroomAerialCleaner,
//         magicBroomAerialCleaner,
//       ],
//     });
//
//     const cardUnderTest = testStore.getCard(yenSidPowerfulSorcerer);
//     expect(cardUnderTest.lore).toBe(yenSidPowerfulSorcerer.lore + 2);
//   });
// });
//
