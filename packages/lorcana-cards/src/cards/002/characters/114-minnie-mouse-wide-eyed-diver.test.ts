// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { tangle } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { fourDozenEggs } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import { minnieMouseWideEyedDiver } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Minnie Mouse - Wide-Eyed Diver", () => {
//   it("Shift", () => {
//     const testStore = new TestStore({
//       play: [minnieMouseWideEyedDiver],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       minnieMouseWideEyedDiver.id,
//     );
//
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it("Evasive", () => {
//     const testStore = new TestStore({
//       play: [minnieMouseWideEyedDiver],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       minnieMouseWideEyedDiver.id,
//     );
//
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it("**UNDERSEA ADVENTURE** Whenever you play a second action in a turn, this character gets +2 {L} this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: grabYourSword.cost + fourDozenEggs.cost + tangle.cost,
//       hand: [grabYourSword, fourDozenEggs, tangle],
//       play: [minnieMouseWideEyedDiver],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       minnieMouseWideEyedDiver.id,
//     );
//     const actionOne = testStore.getByZoneAndId("hand", grabYourSword.id);
//     const actionTwo = testStore.getByZoneAndId("hand", fourDozenEggs.id);
//     const actionThree = testStore.getByZoneAndId("hand", tangle.id);
//
//     actionOne.playFromHand();
//     expect(cardUnderTest.lore).toBe(minnieMouseWideEyedDiver.lore);
//
//     actionTwo.playFromHand();
//     expect(cardUnderTest.lore).toBe(minnieMouseWideEyedDiver.lore + 2);
//
//     actionThree.playFromHand();
//     expect(cardUnderTest.lore).toBe(minnieMouseWideEyedDiver.lore + 2);
//   });
// });
//
