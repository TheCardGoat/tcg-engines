// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { youHaveForgottenMe } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   LiloMakingAWish,
//   MoanaOfMotunui,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { suddenChill } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { princeJohnGreediestOfAll } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prince John - Greediest of All", () => {
//   It("Ward", () => {
//     Const testStore = new TestStore({
//       Play: [princeJohnGreediestOfAll],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PrinceJohnGreediestOfAll.id,
//     );
//
//     Expect(cardUnderTest.hasWard).toEqual(true);
//   });
//
//   Describe("**I SENTENCE YOU** Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.", () => {
//     It("Doesn't trigger when you discard a card", () => {
//       Const testStore = new TestStore(
//         {
//           Hand: [youHaveForgottenMe],
//           Inkwell: youHaveForgottenMe.cost,
//           Deck: 3,
//         },
//         {
//           Play: [princeJohnGreediestOfAll],
//           Hand: [moanaOfMotunui, liloMakingAWish, stichtNewDog],
//           Deck: 3,
//         },
//       );
//
//       Const handDisruption = testStore.getByZoneAndId(
//         "hand",
//         YouHaveForgottenMe.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "hand",
//         LiloMakingAWish.id,
//         "player_two",
//       );
//       Const target2 = testStore.getByZoneAndId(
//         "hand",
//         StichtNewDog.id,
//         "player_two",
//       );
//
//       HandDisruption.playFromHand();
//
//       TestStore.changePlayer("player_two");
//       TestStore.resolveTopOfStack({ targets: [target, target2] }, true);
//       Expect(target.zone).toEqual("discard");
//       Expect(target2.zone).toEqual("discard");
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//       Expect(testStore.getZonesCardCount("player_one").deck).toEqual(3);
//       Expect(testStore.getZonesCardCount("player_two").deck).toEqual(3);
//     });
//
//     It("Opponent discarding one card", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [princeJohnGreediestOfAll],
//           Hand: [suddenChill],
//           Inkwell: suddenChill.cost,
//           Deck: 3,
//         },
//         {
//           Hand: [moanaOfMotunui, liloMakingAWish],
//         },
//       );
//
//       Const handDisruption = testStore.getByZoneAndId("hand", suddenChill.id);
//       Const target = testStore.getByZoneAndId(
//         "hand",
//         LiloMakingAWish.id,
//         "player_two",
//       );
//
//       HandDisruption.playFromHand();
//
//       TestStore.changePlayer("player_two");
//       TestStore.resolveTopOfStack({ targets: [target] }, true);
//       Expect(target.zone).toEqual("discard");
//
//       TestStore.changePlayer("player_one");
//       TestStore.resolveOptionalAbility();
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Hand: 1,
//           Deck: 2,
//           Discard: 1,
//         }),
//       );
//     });
//
//     It("Opponent discarding Two cards", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [princeJohnGreediestOfAll],
//           Hand: [youHaveForgottenMe],
//           Inkwell: youHaveForgottenMe.cost,
//           Deck: 3,
//         },
//         {
//           Hand: [moanaOfMotunui, liloMakingAWish, stichtNewDog],
//         },
//       );
//
//       Const handDisruption = testStore.getByZoneAndId(
//         "hand",
//         YouHaveForgottenMe.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "hand",
//         LiloMakingAWish.id,
//         "player_two",
//       );
//       Const target2 = testStore.getByZoneAndId(
//         "hand",
//         StichtNewDog.id,
//         "player_two",
//       );
//
//       HandDisruption.playFromHand();
//
//       TestStore.changePlayer("player_two");
//       TestStore.resolveTopOfStack({ targets: [target, target2] }, true);
//       Expect(target.zone).toEqual("discard");
//       Expect(target2.zone).toEqual("discard");
//
//       Expect(testStore.stackLayers).toHaveLength(2);
//
//       TestStore.changePlayer("player_one");
//       TestStore.resolveOptionalAbility();
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 2,
//           Hand: 1,
//           Discard: 1,
//         }),
//       );
//
//       TestStore.resolveOptionalAbility();
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({
//           Deck: 1,
//           Hand: 2,
//           Discard: 1,
//         }),
//       );
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//   });
// });
//
