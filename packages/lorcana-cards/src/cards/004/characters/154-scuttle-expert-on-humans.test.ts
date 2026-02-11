// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cleansingRainwater } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import {
//   AladdinResoluteSwordsman,
//   ScuttleExpertOnHumans,
//   SisuWiseFriend,
//   TukTukCuriousPartner,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Scuttle - Expert on Humans", () => {
//   It("**LET ME SEE** When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it in your hand. Put the rest on the bottom of your deck in any order.", () => {
//     Const testStore = new TestStore({
//       Inkwell: scuttleExpertOnHumans.cost,
//       Hand: [scuttleExpertOnHumans],
//       Deck: [
//         SisuWiseFriend,
//         TukTukCuriousPartner,
//         AladdinResoluteSwordsman,
//         CleansingRainwater,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       ScuttleExpertOnHumans.id,
//     );
//     Const targetCard = testStore.getByZoneAndId("deck", cleansingRainwater.id);
//     Const otherCards = [
//       TestStore.getByZoneAndId("deck", sisuWiseFriend.id),
//       TestStore.getByZoneAndId("deck", aladdinResoluteSwordsman.id),
//       TestStore.getByZoneAndId("deck", tukTukCuriousPartner.id),
//     ];
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({
//       Scry: { bottom: otherCards, hand: [targetCard] },
//     });
//
//     Expect(targetCard.zone).toBe("hand");
//     Expect(
//       TestStore.store.tableStore
//         .getPlayerZoneCards("player_one", "deck")
//         .map((card) => card.lorcanitoCard?.name),
//     ).toEqual([
//       SisuWiseFriend.name,
//       AladdinResoluteSwordsman.name,
//       TukTukCuriousPartner.name,
//     ]);
//   });
// });
//
