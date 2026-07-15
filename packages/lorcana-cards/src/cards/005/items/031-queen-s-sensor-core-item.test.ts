// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { herculesTrueHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { theQueenCruelestOfAll } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { queensSensorCoreItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Queen's Sensor Core - Item", () => {
//   Describe("**SYMBOL OF NOBILITY** At the start of your turn, if you have a Princess or Queen character in play, gain 1 lore.", () => {
//     It("Should gain 1 lore if you have a Princess or Queen character in play", () => {
//       Const testStore = new TestStore(
//         {},
//         {
//           Play: [queensSensorCoreItem, theQueenCruelestOfAll],
//           Deck: 1,
//         },
//       );
//
//       TestStore.passTurn();
//
//       Expect(testStore.getPlayerLore("player_two")).toBe(1);
//     });
//
//     It("Should not gain 1 lore if you do not have a Princess or Queen character in play", () => {
//       Const testStore = new TestStore(
//         {},
//         {
//           Play: [queensSensorCoreItem, herculesTrueHero],
//           Deck: 1,
//         },
//       );
//
//       TestStore.passTurn();
//
//       Expect(testStore.getPlayerLore("player_two")).toBe(0);
//     });
//   });
//
//   It("**ROYAL SEARCH** {E}, 2 {I} – Reveal the top card of your deck. If it’s a Princess or Queen character card, you may put it into your hand. Otherwise, put it on the top of your deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 2,
//       Play: [queensSensorCoreItem],
//       Deck: [theQueenCruelestOfAll],
//     });
//
//     Const cardUnderTest = testStore.getCard(queensSensorCoreItem);
//     Const topCard = testStore.getCard(theQueenCruelestOfAll);
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ scry: { hand: [topCard] } });
//
//     Expect(cardUnderTest.meta.exerted).toBe(true);
//     Expect(topCard.zone).toBe("hand");
//   });
// });
//
