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
// Import { gastonIntellectualPowerhouse } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gaston - Intellectual Powerhouse", () => {
//   It("has shift", () => {
//     Const testStore = new TestStore({
//       Play: [gastonIntellectualPowerhouse],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       GastonIntellectualPowerhouse.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("**DEVELOPED BRAIN** When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     Const testStore = new TestStore({
//       Inkwell: gastonIntellectualPowerhouse.cost,
//       Deck: [liloMakingAWish, moanaOfMotunui, chiefTui, heiheiBoatSnack],
//       Hand: [gastonIntellectualPowerhouse],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       GastonIntellectualPowerhouse.id,
//     );
//     Const lilo = testStore.getByZoneAndId("deck", liloMakingAWish.id);
//     Const tui = testStore.getByZoneAndId("deck", chiefTui.id);
//     Const moana = testStore.getByZoneAndId("deck", moanaOfMotunui.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({
//       Scry: { bottom: [lilo, tui], hand: [moana] },
//     });
//
//     Expect(moana.zone).toBe("hand");
//     Expect(
//       TestStore.store.tableStore
//         .getPlayerZoneCards("player_one", "deck")
//         .map((card) => card.lorcanitoCard?.name),
//     ).toEqual([liloMakingAWish.name, chiefTui.name, heiheiBoatSnack.name]);
//   });
// });
//
