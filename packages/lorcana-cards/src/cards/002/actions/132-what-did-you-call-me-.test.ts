// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { whatDidYouCallMe } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("What did you call me?", () => {
//   It("[NON DAMAGED] Chosen damaged character gets +3 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: whatDidYouCallMe.cost,
//       Hand: [whatDidYouCallMe],
//       Play: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", whatDidYouCallMe.id);
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toBe(goofyKnightForADay.strength);
//   });
//
//   It("Chosen damaged character gets +3 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: whatDidYouCallMe.cost,
//       Hand: [whatDidYouCallMe],
//       Play: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", whatDidYouCallMe.id);
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//     Target.updateCardDamage(1);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toBe(goofyKnightForADay.strength + 3);
//   });
// });
//
