// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { theSorcerersSpellbook } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Sorcerer's Spellbook", () => {
//   It("**KNOWLEDGE** {E}, 1 {I} − Gain 1 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 1,
//       Play: [theSorcerersSpellbook],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TheSorcerersSpellbook.id,
//     );
//
//     CardUnderTest.activate();
//
//     Expect(testStore.getPlayerLore()).toEqual(1);
//     Expect(cardUnderTest.ready).toEqual(false);
//   });
// });
//
