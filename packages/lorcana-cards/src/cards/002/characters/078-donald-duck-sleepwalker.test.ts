// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   NothingToHide,
//   ZeroToHero,
// } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { donaldDuckSleepwalker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Donald Duck - Sleepwalker", () => {
//   It("**STARTLED AWAKE** Whenever you play an action, this character gets +2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: nothingToHide.cost + zeroToHero.cost,
//       Hand: [nothingToHide, zeroToHero],
//       Play: [donaldDuckSleepwalker],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DonaldDuckSleepwalker.id,
//     );
//
//     Const actionOne = testStore.getByZoneAndId("hand", nothingToHide.id);
//     ActionOne.playFromHand();
//     Expect(cardUnderTest.strength).toBe(donaldDuckSleepwalker.strength + 2);
//
//     Const actionTwo = testStore.getByZoneAndId("hand", zeroToHero.id);
//     ActionTwo.playFromHand();
//     Expect(cardUnderTest.strength).toBe(donaldDuckSleepwalker.strength + 4);
//   });
// });
//
