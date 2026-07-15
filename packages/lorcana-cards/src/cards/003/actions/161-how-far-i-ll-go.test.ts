// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChiefTui,
//   HeiheiBoatSnack,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { howFarIllGo } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("How Far I'll Go", () => {
//   It("Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: howFarIllGo.cost,
//       Hand: [howFarIllGo],
//       Deck: [shieldOfVirtue, heiheiBoatSnack, chiefTui, moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", howFarIllGo.id);
//     Const first = testStore.getByZoneAndId("deck", moanaOfMotunui.id);
//     Const second = testStore.getByZoneAndId("deck", chiefTui.id);
//     Const third = testStore.getByZoneAndId("deck", heiheiBoatSnack.id);
//     Const fourth = testStore.getByZoneAndId("deck", shieldOfVirtue.id);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({ scry: { inkwell: [first], hand: [second] } });
//
//     Const deck = testStore.store.tableStore
//       .getPlayerZoneCards("player_one", "deck")
//       .map((card) => card.lorcanitoCard?.name);
//
//     Expect(first.zone).toEqual("inkwell");
//     Expect(first.ready).toEqual(false);
//
//     Expect(second.zone).toEqual("hand");
//
//     Expect(deck).toEqual([
//       Fourth.lorcanitoCard?.name,
//       Third.lorcanitoCard?.name,
//     ]);
//   });
// });
//
