// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { taffytaMuttonfudgeCrowdFavorite } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { rapunzelsTowerSecludedPrison } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Taffyta Muttonfudge - Crowd Favorite", () => {
//   Describe("**SHOWSTOPPER** When you play this character, if you have a location in play, each opponent loses 1 lore.", () => {
//     It("Has location in play", () => {
//       Const testStore = new TestStore({
//         Inkwell: taffytaMuttonfudgeCrowdFavorite.cost,
//         Hand: [taffytaMuttonfudgeCrowdFavorite],
//         Play: [rapunzelsTowerSecludedPrison],
//       });
//
//       TestStore.store.tableStore.getTable("player_two").lore = 5;
//       Const cardUnderTest = testStore.getCard(taffytaMuttonfudgeCrowdFavorite);
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({});
//       Expect(testStore.getPlayerLore("player_two")).toBe(4);
//     });
//
//     It("Doesn't have location in play", () => {
//       Const testStore = new TestStore({
//         Inkwell: taffytaMuttonfudgeCrowdFavorite.cost,
//         Hand: [taffytaMuttonfudgeCrowdFavorite],
//       });
//
//       TestStore.store.tableStore.getTable("player_two").lore = 5;
//       Const cardUnderTest = testStore.getCard(taffytaMuttonfudgeCrowdFavorite);
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({});
//       Expect(testStore.getPlayerLore("player_two")).toBe(5);
//     });
//   });
// });
//
