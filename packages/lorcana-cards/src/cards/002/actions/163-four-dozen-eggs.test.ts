// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { fourDozenEggs } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { owlLogicalLecturer } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Four Dozen Eggs", () => {
//   It("Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: fourDozenEggs.cost,
//       Hand: [fourDozenEggs],
//       Play: [liloMakingAWish, owlLogicalLecturer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", fourDozenEggs.id);
//     Const target = testStore.getByZoneAndId("play", owlLogicalLecturer.id);
//     Const anotherTarget = testStore.getByZoneAndId("play", liloMakingAWish.id);
//
//     [target, anotherTarget].forEach((character) => {
//       Expect(character.hasResist).toBe(false);
//     });
//
//     CardUnderTest.playFromHand();
//
//     [target, anotherTarget].forEach((character) => {
//       Expect(character.hasResist).toBe(true);
//     });
//     Expect(cardUnderTest.zone).toEqual("discard");
//   });
// });
//
