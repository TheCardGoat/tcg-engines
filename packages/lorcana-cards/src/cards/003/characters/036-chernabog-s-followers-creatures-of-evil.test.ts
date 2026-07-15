// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { chernabogsFollowersCreaturesOfEvil } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Chernabog's Followers - Creatures of Evil", () => {
//   Describe("**RESTLESS SOULS** Whenever this character quests, you may banish this character to draw a card.", () => {
//     It("should banish this character to draw a card", () => {
//       Const testStore = new TestStore({
//         Inkwell: chernabogsFollowersCreaturesOfEvil.cost,
//         Play: [chernabogsFollowersCreaturesOfEvil],
//         Deck: 1,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         ChernabogsFollowersCreaturesOfEvil.id,
//       );
//
//       CardUnderTest.quest();
//
//       TestStore.resolveOptionalAbility();
//       Expect(cardUnderTest.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount().hand).toEqual(1);
//     });
//
//     It("should not banish this character and not draw", () => {
//       Const testStore = new TestStore({
//         Inkwell: chernabogsFollowersCreaturesOfEvil.cost,
//         Play: [chernabogsFollowersCreaturesOfEvil],
//         Deck: 1,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         ChernabogsFollowersCreaturesOfEvil.id,
//       );
//
//       CardUnderTest.quest();
//
//       TestStore.skipOptionalAbility();
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(testStore.getZonesCardCount().hand).toEqual(0);
//       Expect(testStore.getZonesCardCount().deck).toEqual(1);
//     });
//   });
// });
//
