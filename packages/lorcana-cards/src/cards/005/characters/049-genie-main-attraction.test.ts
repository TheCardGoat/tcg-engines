// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   genieOnTheJob,
//   geniePowerUnleashed,
//   genieTheEverImpressive,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { genieMainAttraction } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { healingDecanterItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Genie - Main Attraction", () => {
//   it("**SPECTACULAR ENTERTAINER** When this character is exerted, opposing characters cannot ready at the start of your opponents turn.", () => {
//     const testStore = new TestStore(
//       {
//         play: [genieMainAttraction],
//         deck: 4,
//       },
//       {
//         play: [genieOnTheJob, genieTheEverImpressive, geniePowerUnleashed],
//         deck: 4,
//       },
//     );
//
//     const cardUnderTest = testStore.getCard(genieMainAttraction);
//     const target = testStore.getCard(genieOnTheJob);
//     const anotherTarget = testStore.getCard(genieTheEverImpressive);
//     const thirdTarget = testStore.getCard(geniePowerUnleashed);
//
//     [cardUnderTest, target, anotherTarget, thirdTarget].forEach((card) => {
//       card.updateCardMeta({ exerted: true });
//     });
//
//     testStore.passTurn();
//
//     [cardUnderTest, target, anotherTarget, thirdTarget].forEach((card) => {
//       expect(card.ready).toBe(false);
//     });
//
//     testStore.passTurn();
//     cardUnderTest.updateCardMeta({ exerted: true });
//
//     testStore.passTurn();
//     [target, anotherTarget, thirdTarget].forEach((card) => {
//       expect(card.ready).toBe(false);
//     });
//
//     testStore.passTurn();
//     testStore.passTurn();
//
//     [cardUnderTest, target, anotherTarget, thirdTarget].forEach((card) => {
//       expect(card.ready).toBe(true);
//     });
//   });
//
//   it("**SPECTACULAR ENTERTAINER** Items should be able to ready even when Genie is exerted, as the ability only affects characters", () => {
//     const testStore = new TestStore(
//       {
//         play: [genieMainAttraction],
//         deck: 4,
//       },
//       {
//         play: [healingDecanterItem],
//         deck: 4,
//       },
//     );
//
//     const genie = testStore.getCard(genieMainAttraction);
//     const item = testStore.getCard(healingDecanterItem);
//
//     // Exert both Genie and the item
//     genie.updateCardMeta({ exerted: true });
//     item.updateCardMeta({ exerted: true });
//
//     // Pass turn - item should ready even though Genie is exerted
//     testStore.passTurn();
//
//     // Genie should still be exerted (it's on the opponent's side)
//     expect(genie.ready).toBe(false);
//     // Item should ready because Genie's ability only affects characters
//     expect(item.ready).toBe(true);
//   });
// });
//
