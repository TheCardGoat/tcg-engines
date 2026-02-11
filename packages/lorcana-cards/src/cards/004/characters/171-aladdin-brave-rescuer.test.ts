// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cleansingRainwater } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { agrabahMarketplace } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import {
//   AladdinBraveRescuer,
//   AladdinResoluteSwordsman,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Aladdin - Brave Rescuer", () => {
//   It("**Shift: Discard a location card** _(You may discard a location card to play this on top of one of your characters named Aladdin.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: 0,
//       Play: [aladdinResoluteSwordsman],
//       Hand: [agrabahMarketplace, aladdinBraveRescuer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       AladdinBraveRescuer.id,
//     );
//     Const cardToDiscard = testStore.getByZoneAndId(
//       "hand",
//       AgrabahMarketplace.id,
//     );
//     Const shiftTarget = testStore.getByZoneAndId(
//       "play",
//       AladdinResoluteSwordsman.id,
//     );
//
//     CardUnderTest.shift(shiftTarget, [cardToDiscard]);
//
//     Expect(cardUnderTest.zone).toBe("play");
//     Expect(cardToDiscard.zone).toBe("discard");
//   });
//
//   It("**CRASHING THROUGH** Whenever this character quests, you may banish chosen item.", () => {
//     Const testStore = new TestStore({
//       Play: [aladdinBraveRescuer, cleansingRainwater],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       AladdinBraveRescuer.id,
//     );
//     Const target = testStore.getByZoneAndId("play", cleansingRainwater.id);
//     CardUnderTest.updateCardMeta({ exerted: false });
//
//     CardUnderTest.quest();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("discard");
//   });
// });
//
