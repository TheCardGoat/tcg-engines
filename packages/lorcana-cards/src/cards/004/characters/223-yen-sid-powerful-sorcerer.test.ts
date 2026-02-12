// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { yenSidPowerfulSorcerer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Yen Sid - Powerful Sorcerer", () => {
//   It.skip("**TIMELY INTERVENTION** When you play this character, if you have a character named Magic Broom in play, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: yenSidPowerfulSorcerer.cost,
//       Hand: [yenSidPowerfulSorcerer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       YenSidPowerfulSorcerer.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("**ARCANE STUDY** While you have 2 or more Broom characters in play, this character gets +2 {L}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: yenSidPowerfulSorcerer.cost,
//       Play: [yenSidPowerfulSorcerer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       YenSidPowerfulSorcerer.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
