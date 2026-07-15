// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { auroraLoreGuardian } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Aurora - Lore Guardian", () => {
//   It("**ROYAL ASSORTMENT** {E} one of your items – look at the top card of your deck. Put it on either the top or the bottom of your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [auroraLoreGuardian, pawpsicle],
//       Deck: [liloMakingAWish, stichtNewDog],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(auroraLoreGuardian);
//     Const itemToPayCost = testEngine.getCardModel(pawpsicle);
//     Const first = testEngine.getCardModel(liloMakingAWish);
//
//     Await testEngine.activateCard(cardUnderTest, {
//       Ability: "ROYAL INVENTORY",
//       Costs: [itemToPayCost],
//     });
//
//     Await testEngine.resolveTopOfStack({ scry: { bottom: [liloMakingAWish] } });
//
//     Const deck = testEngine.store.tableStore.getPlayerZoneCards(
//       "player_one",
//       "deck",
//     );
//
//     Expect(deck[0]).toEqual(first);
//   });
// });
//
