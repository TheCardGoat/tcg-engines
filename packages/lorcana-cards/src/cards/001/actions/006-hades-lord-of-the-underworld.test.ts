// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HadesLordOfUnderworld,
//   LadyTremaine,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hades Lord of the Underworld", () => {
//   It("WELL OF SOULS effect - return a character card from your discard to your hand", () => {
//     Const testStore = new TestStore({
//       Inkwell: hadesLordOfUnderworld.cost,
//       Hand: [hadesLordOfUnderworld],
//       Discard: [ladyTremaine],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       HadesLordOfUnderworld.id,
//     );
//     Const target = testStore.getByZoneAndId("discard", ladyTremaine.id);
//     Expect(target.zone).toEqual("discard");
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("hand");
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, discard: 0, play: 1 }),
//     );
//   });
// });
//
