// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BlueFairyRewardingGoodDeeds,
//   CobraBubblesSimpleEducator,
//   HerculesDivineHero,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Blue Fairy - Rewarding Good Deeds", () => {
//   Describe("**ETHEREAL GLOW** Whenever you play a Floodborn character, you may draw a card.", () => {
//     It("Playing a floodborn", () => {
//       Const testStore = new TestStore({
//         Inkwell: herculesDivineHero.cost,
//         Hand: [herculesDivineHero],
//         Play: [blueFairyRewardingGoodDeeds],
//         Deck: 2,
//       });
//
//       Const floodbornChar = testStore.getByZoneAndId(
//         "hand",
//         HerculesDivineHero.id,
//       );
//
//       FloodbornChar.playFromHand();
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Deck: 1,
//         }),
//       );
//     });
//
//     It("Playing a NON floodborn", () => {
//       Const testStore = new TestStore({
//         Inkwell: cobraBubblesSimpleEducator.cost,
//         Hand: [cobraBubblesSimpleEducator],
//         Play: [blueFairyRewardingGoodDeeds],
//         Deck: 2,
//       });
//
//       Const storybornChar = testStore.getByZoneAndId(
//         "hand",
//         CobraBubblesSimpleEducator.id,
//       );
//
//       StorybornChar.playFromHand();
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 0,
//           Deck: 2,
//         }),
//       );
//     });
//   });
// });
//
