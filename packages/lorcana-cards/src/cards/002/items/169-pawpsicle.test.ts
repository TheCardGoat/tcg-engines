// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pawpsicle", () => {
//   It("**JUMBO POP** When you play this item, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: pawpsicle.cost,
//       Deck: 2,
//       Hand: [pawpsicle],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", pawpsicle.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 1, play: 1, discard: 0 }),
//     );
//   });
//
//   It("**THAT'S REDWOOD** Banish this item − Remove up to 2 damage from chosen character.", () => {
//     Const testStore = new TestStore({
//       Play: [pawpsicle, cinderellaBallroomSensation],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", pawpsicle.id);
//     Const damagedChar = testStore.getByZoneAndId(
//       "play",
//       CinderellaBallroomSensation.id,
//     );
//     DamagedChar.updateCardMeta({ damage: 2 });
//     Expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 2 }));
//
//     CardUnderTest.activate();
//     TestStore.resolveOptionalAbility();
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
//
//     TestStore.resolveTopOfStack({ targets: [damagedChar] });
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//
//     Expect(damagedChar.meta).toEqual(expect.objectContaining({ damage: 0 }));
//   });
// });
//
