// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChiefTui,
//   RapunzelGiftedWithHealing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Rapunzel - Gifted with Healing", () => {
//   Describe("**When you play this character, remove up to 3 damage from one of your characters. Draw a card for each 1 damage removed this way.**", () => {
//     It("Healing 2", () => {
//       Const testStore = new TestStore({
//         Inkwell: rapunzelGiftedWithHealing.cost,
//         Deck: 3,
//         Hand: [rapunzelGiftedWithHealing],
//         Play: [chiefTui],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         RapunzelGiftedWithHealing.id,
//       );
//       Const target = testStore.getByZoneAndId("play", chiefTui.id);
//
//       Target.updateCardDamage(2, "add");
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.meta.damage).toEqual(0);
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 2, deck: 1, play: 2, discard: 0 }),
//       );
//     });
//
//     It("Healing 3", () => {
//       Const testStore = new TestStore({
//         Inkwell: rapunzelGiftedWithHealing.cost,
//         Deck: 3,
//         Hand: [rapunzelGiftedWithHealing],
//         Play: [chiefTui],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         RapunzelGiftedWithHealing.id,
//       );
//       Const target = testStore.getByZoneAndId("play", chiefTui.id);
//
//       Target.updateCardDamage(3, "add");
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.meta.damage).toEqual(0);
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 3, deck: 0, play: 2, discard: 0 }),
//       );
//     });
//   });
// });
//
