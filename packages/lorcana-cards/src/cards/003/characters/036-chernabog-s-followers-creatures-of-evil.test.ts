// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { chernabogsFollowersCreaturesOfEvil } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Chernabog's Followers - Creatures of Evil", () => {
//   describe("**RESTLESS SOULS** Whenever this character quests, you may banish this character to draw a card.", () => {
//     it("should banish this character to draw a card", () => {
//       const testStore = new TestStore({
//         inkwell: chernabogsFollowersCreaturesOfEvil.cost,
//         play: [chernabogsFollowersCreaturesOfEvil],
//         deck: 1,
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         chernabogsFollowersCreaturesOfEvil.id,
//       );
//
//       cardUnderTest.quest();
//
//       testStore.resolveOptionalAbility();
//       expect(cardUnderTest.zone).toEqual("discard");
//       expect(testStore.getZonesCardCount().hand).toEqual(1);
//     });
//
//     it("should not banish this character and not draw", () => {
//       const testStore = new TestStore({
//         inkwell: chernabogsFollowersCreaturesOfEvil.cost,
//         play: [chernabogsFollowersCreaturesOfEvil],
//         deck: 1,
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         chernabogsFollowersCreaturesOfEvil.id,
//       );
//
//       cardUnderTest.quest();
//
//       testStore.skipOptionalAbility();
//       expect(cardUnderTest.zone).toEqual("play");
//       expect(testStore.getZonesCardCount().hand).toEqual(0);
//       expect(testStore.getZonesCardCount().deck).toEqual(1);
//     });
//   });
// });
//
