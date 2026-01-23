// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   christopherRobinAdventurer,
//   tiggerOneOfAKind,
//   winnieThePoohHunnyWizard,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Christopher Robin - Adventurer", () => {
//   describe("**WE'LL ALWAYS BE TOGETHER** Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.", () => {
//     it("Should gain 2 lore when readying with 2 other characters in play", () => {
//       const testStore = new TestStore({
//         play: [
//           christopherRobinAdventurer,
//           winnieThePoohHunnyWizard,
//           tiggerOneOfAKind,
//         ],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         christopherRobinAdventurer.id,
//       );
//
//       cardUnderTest.updateCardMeta({ exerted: true });
//       cardUnderTest.updateCardMeta({ exerted: false });
//
//       expect(testStore.store.tableStore.getTable("player_one").lore).toBe(2);
//     });
//
//     it("Should not gain 2 lore when readying with 1 other character in play", () => {
//       const testStore = new TestStore({
//         play: [christopherRobinAdventurer, winnieThePoohHunnyWizard],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         christopherRobinAdventurer.id,
//       );
//
//       cardUnderTest.updateCardMeta({ exerted: true });
//       cardUnderTest.updateCardMeta({ exerted: false });
//
//       expect(testStore.store.tableStore.getTable("player_one").lore).toBe(0);
//     });
//
//     it("Passing the turn triggers the ability", () => {
//       const testStore = new TestStore(
//         {},
//         {
//           deck: 1,
//           play: [
//             christopherRobinAdventurer,
//             winnieThePoohHunnyWizard,
//             tiggerOneOfAKind,
//           ],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         christopherRobinAdventurer.id,
//         "player_two",
//       );
//
//       cardUnderTest.updateCardMeta({ exerted: true });
//
//       testStore.passTurn();
//
//       expect(testStore.store.tableStore.getTable("player_two").lore).toBe(2);
//     });
//   });
// });
//
