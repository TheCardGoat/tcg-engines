// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { holdStill } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hold Still", () => {
//   It("Remove up to 4 damage from chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: holdStill.cost,
//       Hand: [holdStill],
//       Play: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", holdStill.id);
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     Target.updateCardDamage(5);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toBe(1);
//   });
// });
//
