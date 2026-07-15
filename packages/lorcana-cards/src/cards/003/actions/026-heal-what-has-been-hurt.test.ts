// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { healWhatHasBeenHurt } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Heal What Has Been Hurt", () => {
//   It("_(A character with cost 3 or more can {E} to sing this song for free.)_ Remove up to 3 damage from chosen character. Draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: healWhatHasBeenHurt.cost,
//       Hand: [healWhatHasBeenHurt],
//       Play: [goofyKnightForADay],
//       Deck: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       HealWhatHasBeenHurt.id,
//     );
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     Target.updateCardDamage(5);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toBe(2);
//   });
// });
//
