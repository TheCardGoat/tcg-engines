// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { alanadaleRockinRooster } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Alan-a-Dale - Rockin' Rooster", () => {
//   it.skip("**FAN FAVORITE** Whenever you play a song, gain 1 lore.", () => {
//     const testStore = new TestStore({
//       inkwell: alanadaleRockinRooster.cost,
//       play: [alanadaleRockinRooster],
//     });
//
//     const cardUnderTest = testStore.getCard(alanadaleRockinRooster);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
