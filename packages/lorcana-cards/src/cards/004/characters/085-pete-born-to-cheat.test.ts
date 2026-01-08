// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { peteBornToCheat } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Pete - Born to Cheat", () => {
//   it.skip("**I CLOBBER YOU!** Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.", () => {
//     const testStore = new TestStore({
//       inkwell: peteBornToCheat.cost,
//       play: [peteBornToCheat],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", peteBornToCheat.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
