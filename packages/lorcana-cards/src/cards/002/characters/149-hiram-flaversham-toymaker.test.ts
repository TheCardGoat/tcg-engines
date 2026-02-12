// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, test } from "@jest/globals";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { gumboPot } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hiram Flaversham - Toymaker", () => {
//   Describe("**ARTIFICER** When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.", () => {
//     Test("When you play this character", () => {
//       Const testStore = new TestStore({
//         Inkwell: hiramFlavershamToymaker.cost,
//         Play: [gumboPot],
//         Hand: [hiramFlavershamToymaker],
//         Deck: 3,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         HiramFlavershamToymaker.id,
//       );
//       Const target = testStore.getByZoneAndId("play", gumboPot.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 2,
//           Deck: 1,
//           Discard: 1,
//           Play: 1,
//         }),
//       );
//     });
//
//     Test("Whenever he quests", () => {
//       Const testStore = new TestStore({
//         Play: [hiramFlavershamToymaker, gumboPot],
//         Deck: 3,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         HiramFlavershamToymaker.id,
//       );
//       Const target = testStore.getByZoneAndId("play", gumboPot.id);
//
//       CardUnderTest.quest();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 2,
//           Deck: 1,
//           Discard: 1,
//           Play: 1,
//         }),
//       );
//     });
//
//     Test("No valid target", () => {
//       Const testStore = new TestStore({
//         Inkwell: hiramFlavershamToymaker.cost,
//         Hand: [hiramFlavershamToymaker],
//         Deck: 3,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         HiramFlavershamToymaker.id,
//       );
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [] });
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Deck: 3,
//           Play: 1,
//         }),
//       );
//     });
//   });
// });
//
