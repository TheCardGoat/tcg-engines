// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CobraBubblesSimpleEducator,
//   TheHuntsmanReluctantEnforcer,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Huntsman- Reluctant Enforcer", () => {
//   It("**CHANGE OF HEART** Whenever this character quests, you may draw a card, then choose and discard a card.", () => {
//     Const testStore = new TestStore({
//       Deck: [cobraBubblesSimpleEducator],
//       Play: [theHuntsmanReluctantEnforcer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TheHuntsmanReluctantEnforcer.id,
//     );
//
//     CardUnderTest.quest();
//
//     TestStore.resolveOptionalAbility();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
//     );
//
//     Const aCardToDiscard = testStore.getByZoneAndId(
//       "hand",
//       CobraBubblesSimpleEducator.id,
//     );
//     TestStore.resolveTopOfStack({
//       Targets: [aCardToDiscard],
//     });
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 0, deck: 0, play: 1, discard: 1 }),
//     );
//   });
// });
//
