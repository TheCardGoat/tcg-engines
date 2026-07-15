// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GenieOnTheJob,
//   GeniePowerUnleashed,
//   GenieTheEverImpressive,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { genieMainAttraction } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { healingDecanterItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Genie - Main Attraction", () => {
//   It("**SPECTACULAR ENTERTAINER** When this character is exerted, opposing characters cannot ready at the start of your opponents turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [genieMainAttraction],
//         Deck: 4,
//       },
//       {
//         Play: [genieOnTheJob, genieTheEverImpressive, geniePowerUnleashed],
//         Deck: 4,
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(genieMainAttraction);
//     Const target = testStore.getCard(genieOnTheJob);
//     Const anotherTarget = testStore.getCard(genieTheEverImpressive);
//     Const thirdTarget = testStore.getCard(geniePowerUnleashed);
//
//     [cardUnderTest, target, anotherTarget, thirdTarget].forEach((card) => {
//       Card.updateCardMeta({ exerted: true });
//     });
//
//     TestStore.passTurn();
//
//     [cardUnderTest, target, anotherTarget, thirdTarget].forEach((card) => {
//       Expect(card.ready).toBe(false);
//     });
//
//     TestStore.passTurn();
//     CardUnderTest.updateCardMeta({ exerted: true });
//
//     TestStore.passTurn();
//     [target, anotherTarget, thirdTarget].forEach((card) => {
//       Expect(card.ready).toBe(false);
//     });
//
//     TestStore.passTurn();
//     TestStore.passTurn();
//
//     [cardUnderTest, target, anotherTarget, thirdTarget].forEach((card) => {
//       Expect(card.ready).toBe(true);
//     });
//   });
//
//   It("**SPECTACULAR ENTERTAINER** Items should be able to ready even when Genie is exerted, as the ability only affects characters", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [genieMainAttraction],
//         Deck: 4,
//       },
//       {
//         Play: [healingDecanterItem],
//         Deck: 4,
//       },
//     );
//
//     Const genie = testStore.getCard(genieMainAttraction);
//     Const item = testStore.getCard(healingDecanterItem);
//
//     // Exert both Genie and the item
//     Genie.updateCardMeta({ exerted: true });
//     Item.updateCardMeta({ exerted: true });
//
//     // Pass turn - item should ready even though Genie is exerted
//     TestStore.passTurn();
//
//     // Genie should still be exerted (it's on the opponent's side)
//     Expect(genie.ready).toBe(false);
//     // Item should ready because Genie's ability only affects characters
//     Expect(item.ready).toBe(true);
//   });
// });
//
