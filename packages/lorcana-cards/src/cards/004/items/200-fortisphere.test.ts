// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { peteRottenGuy } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { fortisphere } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fortisphere", () => {
//   Describe("**RESOURCEFUL** When you play this item, you may draw a card.", () => {
//     It("should allow the player to draw a card when played", () => {
//       Const testStore = new TestStore({
//         Inkwell: fortisphere.cost,
//         Hand: [fortisphere],
//         Deck: 2,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", fortisphere.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Deck: 1,
//           Play: 1,
//         }),
//       );
//     });
//   });
//
//   Describe("**EXTRACT OF STEEL** 1 {I}, Banish this item - Chosen character of yours gains **Bodyguard** until the start of your next turn. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
//     It("should allow the player to banish the item and give a character Bodyguard", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: 1,
//           Play: [fortisphere, peteRottenGuy],
//           Deck: 2,
//         },
//         { deck: 2 },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", fortisphere.id);
//       Const target = testStore.getByZoneAndId("play", peteRottenGuy.id);
//       Expect(target.hasBodyguard).toBeFalsy();
//
//       CardUnderTest.activate();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(cardUnderTest.zone).toEqual("discard");
//       Expect(target.hasBodyguard).toBeTruthy();
//
//       TestStore.passTurn();
//       Expect(target.hasBodyguard).toBeTruthy();
//
//       TestStore.passTurn();
//       Expect(target.hasBodyguard).toBeFalsy();
//     });
//   });
// });
//
