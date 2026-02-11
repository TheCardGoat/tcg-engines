// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   TinkerBellGenerousFairy,
//   WendyDarlingTalentedSailor,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   CleansingRainwater,
//   WildcatsWrench,
// } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tinker Bell - Generous Fairy", () => {
//   It("**MAKE A NEW FRIEND** When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Place the rest on the bottom of your deck in any order.", () => {
//     Const testStore = new TestStore({
//       Inkwell: tinkerBellGenerousFairy.cost,
//       Hand: [tinkerBellGenerousFairy],
//       Deck: [
//         CleansingRainwater,
//         WendyDarlingTalentedSailor,
//         WildcatsWrench,
//         WildcatsWrench,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       TinkerBellGenerousFairy.id,
//     );
//     Const targetCard = testStore.getByZoneAndId(
//       "deck",
//       WendyDarlingTalentedSailor.id,
//     );
//     Const otherCards = [
//       TestStore.getByZoneAndId("deck", cleansingRainwater.id),
//       TestStore.getByZoneAndId("deck", wildcatsWrench.id),
//       TestStore.getByZoneAndId("deck", wildcatsWrench.id),
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
//       CleansingRainwater.name,
//       WildcatsWrench.name,
//       WildcatsWrench.name,
//     ]);
//   });
// });
//
