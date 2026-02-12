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
// Import { peteBadGuy } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pete - Bad Guy", () => {
//   It("Ward", () => {
//     Const testStore = new TestStore({
//       Play: [peteBadGuy],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", peteBadGuy.id);
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
//
//   It("**TAKE THAT!** Whenever you play an action, this character gets +2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: nothingToHide.cost + zeroToHero.cost,
//       Hand: [nothingToHide, zeroToHero],
//       Play: [peteBadGuy],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", peteBadGuy.id);
//
//     Const actionOne = testStore.getByZoneAndId("hand", nothingToHide.id);
//     ActionOne.playFromHand();
//     Expect(cardUnderTest.strength).toBe(peteBadGuy.strength + 2);
//
//     Const actionTwo = testStore.getByZoneAndId("hand", zeroToHero.id);
//     ActionTwo.playFromHand();
//     Expect(cardUnderTest.strength).toBe(peteBadGuy.strength + 4);
//
//     // "**WHO'S NEXT** While this character has 7 {S} or more, he gets +2 {L}."
//     Expect(cardUnderTest.lore).toBe(peteBadGuy.lore + 2);
//   });
// });
//
