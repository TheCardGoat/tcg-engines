// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { alanadaleRockinRooster } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Alan-a-Dale - Rockin' Rooster", () => {
//   It.skip("**FAN FAVORITE** Whenever you play a song, gain 1 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: alanadaleRockinRooster.cost,
//       Play: [alanadaleRockinRooster],
//     });
//
//     Const cardUnderTest = testStore.getCard(alanadaleRockinRooster);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
