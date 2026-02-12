// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HeiheiBoatSnack,
//   MauiDemiGod,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mauisFishHook } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maui's Fish Hook", () => {
//   It("**IT'S MAUI TIME!** If you have a character named Maui in play, you may use this item's Shapeshift ability for free.", () => {
//     Const testStore = new TestStore({
//       Play: [mauiDemiGod, mauisFishHook, heiheiBoatSnack],
//     });
//
//     Const cardUnderTest = testStore.getCard(mauisFishHook);
//
//     CardUnderTest.activate();
//     Expect(cardUnderTest.ready).toBe(false);
//     Expect(testStore.stackLayers).toHaveLength(1);
//   });
//
//   Describe("**SHAPESHIFT** {E}, 2 {I} – Choose one:· Chosen character gains **Evasive** until the start of your next turn. _(Only characters with Evasive can challenge them.)_· Chosen character gets +3 {S} this turn.", () => {
//     It("Mode one", () => {
//       Const testStore = new TestStore({
//         Inkwell: 2,
//         Play: [mauisFishHook, heiheiBoatSnack],
//       });
//
//       Const cardUnderTest = testStore.getCard(mauisFishHook);
//       Const target = testStore.getCard(heiheiBoatSnack);
//
//       CardUnderTest.activate();
//       Expect(cardUnderTest.ready).toBe(false);
//
//       TestStore.resolveTopOfStack({ mode: "1" }, true);
//
//       Expect(target.hasEvasive).toBe(false);
//       TestStore.resolveTopOfStack({ targets: [target] });
//       Expect(target.hasEvasive).toBe(true);
//     });
//
//     It("Mode two", () => {
//       Const testStore = new TestStore({
//         Inkwell: 2,
//         Play: [mauisFishHook, heiheiBoatSnack],
//       });
//
//       Const cardUnderTest = testStore.getCard(mauisFishHook);
//       Const target = testStore.getCard(heiheiBoatSnack);
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack({ mode: "2" }, true);
//
//       Expect(cardUnderTest.ready).toBe(false);
//
//       Expect(target.strength).toBe(heiheiBoatSnack.strength);
//       TestStore.resolveTopOfStack({ targets: [target] });
//       Expect(target.strength).toBe(heiheiBoatSnack.strength + 3);
//     });
//   });
// });
//
