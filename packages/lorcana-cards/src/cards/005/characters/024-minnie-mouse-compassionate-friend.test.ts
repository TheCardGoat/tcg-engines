// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { minnieMouseCompassionateFriend } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Minnie Mouse - Compassionate Friend", () => {
//   It.skip("**PATCH THEM UP** Whenever this character quests, you may remove up to 2 damage from chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: minnieMouseCompassionateFriend.cost,
//       Play: [minnieMouseCompassionateFriend],
//     });
//
//     Const cardUnderTest = testStore.getCard(minnieMouseCompassionateFriend);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
