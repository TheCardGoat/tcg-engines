// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   tinkerBellGenerousFairy,
//   wendyDarlingTalentedSailor,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import {
//   cleansingRainwater,
//   wildcatsWrench,
// } from "@lorcanito/lorcana-engine/cards/003/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Tinker Bell - Generous Fairy", () => {
//   it("**MAKE A NEW FRIEND** When you play this character, look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Place the rest on the bottom of your deck in any order.", () => {
//     const testStore = new TestStore({
//       inkwell: tinkerBellGenerousFairy.cost,
//       hand: [tinkerBellGenerousFairy],
//       deck: [
//         cleansingRainwater,
//         wendyDarlingTalentedSailor,
//         wildcatsWrench,
//         wildcatsWrench,
//       ],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       tinkerBellGenerousFairy.id,
//     );
//     const targetCard = testStore.getByZoneAndId(
//       "deck",
//       wendyDarlingTalentedSailor.id,
//     );
//     const otherCards = [
//       testStore.getByZoneAndId("deck", cleansingRainwater.id),
//       testStore.getByZoneAndId("deck", wildcatsWrench.id),
//       testStore.getByZoneAndId("deck", wildcatsWrench.id),
//     ];
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({
//       scry: { bottom: otherCards, hand: [targetCard] },
//     });
//
//     expect(targetCard.zone).toBe("hand");
//     expect(
//       testStore.store.tableStore
//         .getPlayerZoneCards("player_one", "deck")
//         .map((card) => card.lorcanitoCard?.name),
//     ).toEqual([
//       cleansingRainwater.name,
//       wildcatsWrench.name,
//       wildcatsWrench.name,
//     ]);
//   });
// });
//
