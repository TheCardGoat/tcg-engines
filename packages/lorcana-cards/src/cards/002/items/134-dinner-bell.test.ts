// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyDaredevil,
//   GoofyMusketeer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { dinnerBell } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dinner Bell", () => {
//   It("**YOU KNOW WHAT HAPPENS** {E}, 2 {I} − Draw cards equal to the damage on chosen character of yours, then banish them.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 2,
//       Deck: 4,
//       Play: [dinnerBell, goofyKnightForADay, goofyMusketeer, goofyDaredevil],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", dinnerBell.id);
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//     Const target2 = testStore.getByZoneAndId("play", goofyMusketeer.id);
//     Const target3 = testStore.getByZoneAndId("play", goofyDaredevil.id);
//
//     // First target won't have any damage
//     [target, target2, target3].forEach((target, index) => {
//       Target.updateCardDamage(index);
//     });
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target3] });
//
//     Expect(cardUnderTest.ready).toEqual(false);
//     Expect(target.zone).toEqual("play");
//     Expect(target2.zone).toEqual("play");
//     Expect(target3.zone).toEqual("discard");
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 2,
//         Discard: 1,
//         Deck: 2,
//       }),
//     );
//   });
// });
//
