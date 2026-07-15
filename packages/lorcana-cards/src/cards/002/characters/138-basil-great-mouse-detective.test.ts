// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BasilGreatMouseDetective,
//   BasilOfBakerStreet,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Basil - Great Mouse Detective", () => {
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Inkwell: basilGreatMouseDetective.cost,
//       Play: [basilGreatMouseDetective],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       BasilGreatMouseDetective.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toEqual(true);
//   });
//
//   Describe("**THERE'S ALWAYS A CHANCE** If you used **Shift** to play this character, you may draw 2 cards when he enters play.", () => {
//     It("Not Shift", () => {
//       Const testStore = new TestStore({
//         Inkwell: basilGreatMouseDetective.cost,
//         Hand: [basilGreatMouseDetective],
//         Play: [basilOfBakerStreet],
//         Deck: 3,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         BasilGreatMouseDetective.id,
//       );
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.getZonesCardCount().deck).toEqual(3);
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("Shift", () => {
//       Const testStore = new TestStore({
//         Inkwell: basilGreatMouseDetective.cost,
//         Hand: [basilGreatMouseDetective],
//         Play: [basilOfBakerStreet],
//         Deck: 3,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         BasilGreatMouseDetective.id,
//       );
//       Const target = testStore.getByZoneAndId("play", basilOfBakerStreet.id);
//
//       CardUnderTest.shift(target);
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ deck: 1, hand: 2 }),
//       );
//     });
//   });
// });
//
