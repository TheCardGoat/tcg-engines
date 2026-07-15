// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { swordInTheStone } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sword In The Stone", () => {
//   It("{E}, 2 {I} - Chosen character gets +1 {S} this turn for each 1 damage on them.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 2,
//       Play: [swordInTheStone, goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", swordInTheStone.id);
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     Target.updateCardDamage(5);
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toEqual(goofyKnightForADay.strength + 5);
//   });
// });
//
