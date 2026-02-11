// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { wrechitRalphDemolitionDude } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Wrech-It Ralph - Demolition Dude", () => {
//   Describe("**REFRESHING BREAK** Whenever you ready this character, gain 1 lore for each 1 damage on him.", () => {
//     It("Gains lore passing turn", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [wrechitRalphDemolitionDude],
//           Deck: 5,
//         },
//         {
//           Deck: 5,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(wrechitRalphDemolitionDude);
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//
//       TestStore.passTurn();
//       TestStore.passTurn();
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//
//       CardUnderTest.updateCardMeta({ exerted: true, damage: 3 });
//
//       TestStore.passTurn();
//       TestStore.passTurn();
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(3);
//     });
//   });
// });
//
