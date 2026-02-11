// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChiefTui,
//   HeiheiBoatSnack,
//   LiloMakingAWish,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { ursulaCaldron } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ursula's Cauldron", () => {
//   Describe("Peer Into The Depths", () => {
//     It("Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
//       Const testStore = new TestStore({
//         Deck: [liloMakingAWish, moanaOfMotunui, chiefTui, heiheiBoatSnack],
//         Play: [ursulaCaldron],
//         Inkwell: ursulaCaldron.cost,
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("play", ursulaCaldron.id);
//       Const heihei = testStore.getByZoneAndId("deck", heiheiBoatSnack.id);
//       Const tui = testStore.getByZoneAndId("deck", chiefTui.id);
//
//       CardUnderTest.activate();
//
//       TestStore.resolveTopOfStack({ scry: { top: [tui], bottom: [heihei] } });
//
//       Expect(
//         TestStore.store.tableStore
//           .getPlayerZoneCards("player_one", "deck")
//           .map((card) => card.lorcanitoCard?.name),
//       ).toEqual([
//         HeiheiBoatSnack.name,
//         LiloMakingAWish.name,
//         MoanaOfMotunui.name,
//         ChiefTui.name,
//       ]);
//     });
//   });
// });
//
