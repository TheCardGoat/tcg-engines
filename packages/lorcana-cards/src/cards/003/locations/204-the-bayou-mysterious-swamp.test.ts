// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { theBayouMysteriousSwamp } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("The Bayou - Mysterious Swamp", () => {
//   it.skip("**SHOW ME THE WAY** Whenever a character quests while here, you may draw a card, then choose and discard a card.", () => {
//     const testStore = new TestStore({
//       inkwell: theBayouMysteriousSwamp.cost,
//       play: [theBayouMysteriousSwamp],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       theBayouMysteriousSwamp.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
