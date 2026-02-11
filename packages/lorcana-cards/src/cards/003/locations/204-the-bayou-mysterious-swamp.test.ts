// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { theBayouMysteriousSwamp } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Bayou - Mysterious Swamp", () => {
//   It.skip("**SHOW ME THE WAY** Whenever a character quests while here, you may draw a card, then choose and discard a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: theBayouMysteriousSwamp.cost,
//       Play: [theBayouMysteriousSwamp],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TheBayouMysteriousSwamp.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
