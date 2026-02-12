// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { healingTouch } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Healing Touch", () => {
//   It("Remove up to 4 damage from chosen character. Draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: healingTouch.cost,
//       Hand: [healingTouch],
//       Play: [goofyKnightForADay],
//       Deck: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", healingTouch.id);
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
