// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   chiefTui,
//   heiheiBoatSnack,
//   liloMakingAWish,
//   moanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { gastonIntellectualPowerhouse } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Gaston - Intellectual Powerhouse", () => {
//   it("has shift", () => {
//     const testStore = new TestStore({
//       play: [gastonIntellectualPowerhouse],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       gastonIntellectualPowerhouse.id,
//     );
//
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it("**DEVELOPED BRAIN** When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     const testStore = new TestStore({
//       inkwell: gastonIntellectualPowerhouse.cost,
//       deck: [liloMakingAWish, moanaOfMotunui, chiefTui, heiheiBoatSnack],
//       hand: [gastonIntellectualPowerhouse],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       gastonIntellectualPowerhouse.id,
//     );
//     const lilo = testStore.getByZoneAndId("deck", liloMakingAWish.id);
//     const tui = testStore.getByZoneAndId("deck", chiefTui.id);
//     const moana = testStore.getByZoneAndId("deck", moanaOfMotunui.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({
//       scry: { bottom: [lilo, tui], hand: [moana] },
//     });
//
//     expect(moana.zone).toBe("hand");
//     expect(
//       testStore.store.tableStore
//         .getPlayerZoneCards("player_one", "deck")
//         .map((card) => card.lorcanitoCard?.name),
//     ).toEqual([liloMakingAWish.name, chiefTui.name, heiheiBoatSnack.name]);
//   });
// });
//
