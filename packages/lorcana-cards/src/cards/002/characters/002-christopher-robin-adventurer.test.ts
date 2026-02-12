// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChristopherRobinAdventurer,
//   TiggerOneOfAKind,
//   WinnieThePoohHunnyWizard,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Christopher Robin - Adventurer", () => {
//   Describe("**WE'LL ALWAYS BE TOGETHER** Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.", () => {
//     It("Should gain 2 lore when readying with 2 other characters in play", () => {
//       Const testStore = new TestStore({
//         Play: [
//           ChristopherRobinAdventurer,
//           WinnieThePoohHunnyWizard,
//           TiggerOneOfAKind,
//         ],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         ChristopherRobinAdventurer.id,
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//       CardUnderTest.updateCardMeta({ exerted: false });
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toBe(2);
//     });
//
//     It("Should not gain 2 lore when readying with 1 other character in play", () => {
//       Const testStore = new TestStore({
//         Play: [christopherRobinAdventurer, winnieThePoohHunnyWizard],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         ChristopherRobinAdventurer.id,
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//       CardUnderTest.updateCardMeta({ exerted: false });
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toBe(0);
//     });
//
//     It("Passing the turn triggers the ability", () => {
//       Const testStore = new TestStore(
//         {},
//         {
//           Deck: 1,
//           Play: [
//             ChristopherRobinAdventurer,
//             WinnieThePoohHunnyWizard,
//             TiggerOneOfAKind,
//           ],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         ChristopherRobinAdventurer.id,
//         "player_two",
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       TestStore.passTurn();
//
//       Expect(testStore.store.tableStore.getTable("player_two").lore).toBe(2);
//     });
//   });
// });
//
