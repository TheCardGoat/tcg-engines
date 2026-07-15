// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { nightHowlerRage } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Night Howler Rage", () => {
//   It("Draw a card. Chosen character gains **Reckless** during their next turn._(They can't quest and must challenge if able.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: nightHowlerRage.cost,
//       Hand: [nightHowlerRage],
//       Play: [mickeyBraveLittleTailor],
//       Deck: [mickeyBraveLittleTailor], // For drawing
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", nightHowlerRage.id);
//     Const targetCharacter = testStore.getByZoneAndId(
//       "play",
//       MickeyBraveLittleTailor.id,
//     );
//
//     Expect(testStore.getZonesCardCount().hand).toBe(1); // Only nightHowlerRage in hand
//     Expect(testStore.getZonesCardCount().deck).toBe(1); // Mickey in deck for drawing
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [targetCharacter] });
//
//     Expect(testStore.getZonesCardCount().discard).toBe(1); // Night Howler Rage goes to discard
//     Expect(testStore.getZonesCardCount().hand).toBe(1); // Drew a card
//     Expect(testStore.getZonesCardCount().deck).toBe(0); // Drew from deck
//   });
// });
//
