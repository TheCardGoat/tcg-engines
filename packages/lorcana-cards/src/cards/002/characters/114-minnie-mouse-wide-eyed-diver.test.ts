// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tangle } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { fourDozenEggs } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { minnieMouseWideEyedDiver } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Minnie Mouse - Wide-Eyed Diver", () => {
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [minnieMouseWideEyedDiver],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MinnieMouseWideEyedDiver.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("Evasive", () => {
//     Const testStore = new TestStore({
//       Play: [minnieMouseWideEyedDiver],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MinnieMouseWideEyedDiver.id,
//     );
//
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("**UNDERSEA ADVENTURE** Whenever you play a second action in a turn, this character gets +2 {L} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: grabYourSword.cost + fourDozenEggs.cost + tangle.cost,
//       Hand: [grabYourSword, fourDozenEggs, tangle],
//       Play: [minnieMouseWideEyedDiver],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MinnieMouseWideEyedDiver.id,
//     );
//     Const actionOne = testStore.getByZoneAndId("hand", grabYourSword.id);
//     Const actionTwo = testStore.getByZoneAndId("hand", fourDozenEggs.id);
//     Const actionThree = testStore.getByZoneAndId("hand", tangle.id);
//
//     ActionOne.playFromHand();
//     Expect(cardUnderTest.lore).toBe(minnieMouseWideEyedDiver.lore);
//
//     ActionTwo.playFromHand();
//     Expect(cardUnderTest.lore).toBe(minnieMouseWideEyedDiver.lore + 2);
//
//     ActionThree.playFromHand();
//     Expect(cardUnderTest.lore).toBe(minnieMouseWideEyedDiver.lore + 2);
//   });
// });
//
