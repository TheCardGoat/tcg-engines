// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { swordInTheStone } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Sword In The Stone", () => {
//   it("{E}, 2 {I} - Chosen character gets +1 {S} this turn for each 1 damage on them.", () => {
//     const testStore = new TestStore({
//       inkwell: 2,
//       play: [swordInTheStone, goofyKnightForADay],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", swordInTheStone.id);
//     const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     target.updateCardDamage(5);
//
//     cardUnderTest.activate();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.strength).toEqual(goofyKnightForADay.strength + 5);
//   });
// });
//
