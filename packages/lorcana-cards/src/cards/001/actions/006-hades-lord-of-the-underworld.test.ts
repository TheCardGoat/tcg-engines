// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   hadesLordOfUnderworld,
//   ladyTremaine,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Hades Lord of the Underworld", () => {
//   it("WELL OF SOULS effect - return a character card from your discard to your hand", () => {
//     const testStore = new TestStore({
//       inkwell: hadesLordOfUnderworld.cost,
//       hand: [hadesLordOfUnderworld],
//       discard: [ladyTremaine],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       hadesLordOfUnderworld.id,
//     );
//     const target = testStore.getByZoneAndId("discard", ladyTremaine.id);
//     expect(target.zone).toEqual("discard");
//
//     cardUnderTest.playFromHand();
//
//     testStore.resolveTopOfStack({
//       targetId: target.instanceId,
//     });
//
//     expect(target.zone).toEqual("hand");
//     expect(testStore.getZonesCardCount()).toEqual(
//       expect.objectContaining({ hand: 1, deck: 0, discard: 0, play: 1 }),
//     );
//   });
// });
//
