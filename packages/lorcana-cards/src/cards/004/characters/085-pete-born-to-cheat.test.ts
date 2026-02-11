// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { peteBornToCheat } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pete - Born to Cheat", () => {
//   It.skip("**I CLOBBER YOU!** Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: peteBornToCheat.cost,
//       Play: [peteBornToCheat],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", peteBornToCheat.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
