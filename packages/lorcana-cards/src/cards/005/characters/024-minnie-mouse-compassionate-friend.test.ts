// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { minnieMouseCompassionateFriend } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Minnie Mouse - Compassionate Friend", () => {
//   it.skip("**PATCH THEM UP** Whenever this character quests, you may remove up to 2 damage from chosen character.", () => {
//     const testStore = new TestStore({
//       inkwell: minnieMouseCompassionateFriend.cost,
//       play: [minnieMouseCompassionateFriend],
//     });
//
//     const cardUnderTest = testStore.getCard(minnieMouseCompassionateFriend);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
