// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CruellaDeVilPerfectlyWretched,
//   GrandPabbieOldestAndWisest,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { weightSet } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Weight Set", () => {
//   Describe("**TRAINING** Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.", () => {
//     It("should trigger when playing a character with 4 or more strength", () => {
//       Const testStore = new TestStore({
//         Deck: 2,
//         Inkwell: 1 + cruellaDeVilPerfectlyWretched.cost,
//         Hand: [cruellaDeVilPerfectlyWretched],
//         Play: [weightSet],
//       });
//
//       Const target = testStore.getByZoneAndId(
//         "hand",
//         CruellaDeVilPerfectlyWretched.id,
//       );
//       Target.playFromHand();
//
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 1,
//           Hand: 1,
//         }),
//       );
//     });
//
//     It("should not trigger when playing a character with less than 4 strength", () => {
//       Const testStore = new TestStore({
//         Deck: 2,
//         Inkwell: 1 + grandPabbieOldestAndWisest.cost,
//         Hand: [grandPabbieOldestAndWisest],
//         Play: [weightSet],
//       });
//
//       Const target = testStore.getByZoneAndId(
//         "hand",
//         GrandPabbieOldestAndWisest.id,
//       );
//       Target.playFromHand();
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 2,
//           Hand: 0,
//         }),
//       );
//     });
//   });
// });
//
