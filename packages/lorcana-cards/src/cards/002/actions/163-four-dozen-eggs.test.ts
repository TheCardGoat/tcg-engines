// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { fourDozenEggs } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import { owlLogicalLecturer } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Four Dozen Eggs", () => {
//   it("Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_", () => {
//     const testStore = new TestStore({
//       inkwell: fourDozenEggs.cost,
//       hand: [fourDozenEggs],
//       play: [liloMakingAWish, owlLogicalLecturer],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", fourDozenEggs.id);
//     const target = testStore.getByZoneAndId("play", owlLogicalLecturer.id);
//     const anotherTarget = testStore.getByZoneAndId("play", liloMakingAWish.id);
//
//     [target, anotherTarget].forEach((character) => {
//       expect(character.hasResist).toBe(false);
//     });
//
//     cardUnderTest.playFromHand();
//
//     [target, anotherTarget].forEach((character) => {
//       expect(character.hasResist).toBe(true);
//     });
//     expect(cardUnderTest.zone).toEqual("discard");
//   });
// });
//
