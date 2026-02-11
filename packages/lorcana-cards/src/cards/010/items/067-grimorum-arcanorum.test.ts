// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { hydrosIceTitan } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   DemonaScourgeOfTheWyvernClan,
//   GrimorumArcanorum,
//   MickeyMouseAmberChampion,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Grimorum Arcanorum", () => {
//   Describe("DOCTRINA ADDUCERE - During your turn, whenever an opposing character becomes exerted, gain 1 lore.", () => {
//     It("Gains 1 Lore", async () => {
//       Const testStore = new TestEngine(
//         {
//           Inkwell: 3,
//           Play: [grimorumArcanorum, hydrosIceTitan],
//         },
//         {
//           Play: [hiramFlavershamToymaker],
//         },
//       );
//
//       Const opponentCharacter = testStore.getCardModel(hiramFlavershamToymaker);
//       Await testStore.activateCard(hydrosIceTitan, {
//         Targets: [opponentCharacter],
//       });
//
//       Expect(opponentCharacter.exerted).toBe(true);
//
//       Expect(testStore.getPlayerLore("player_one")).toBe(1);
//     });
//
//     It("does NOT gain lore when an opposing character is exerted during opponent's turn", async () => {
//       Const testStore = new TestEngine(
//         {
//           Play: [grimorumArcanorum],
//         },
//         {
//           Play: [hiramFlavershamToymaker],
//         },
//       );
//
//       Const opponentCharacter = testStore.getCardModel(hiramFlavershamToymaker);
//
//       // Switch to opponent's turn
//       Await testStore.passTurn();
//
//       // Opponent quests - should NOT trigger during opponent's turn
//       OpponentCharacter.quest();
//
//       // Player one should not have gained lore
//       Expect(testStore.getPlayerLore("player_two")).toBe(
//         OpponentCharacter.lore,
//       );
//       Expect(testStore.getPlayerLore("player_one")).toBe(0);
//     });
//
//     It("does not gain lore when your own character is exerted", async () => {
//       Const testStore = new TestEngine({
//         Play: [grimorumArcanorum, mickeyMouseAmberChampion],
//       });
//
//       Const ownCharacter = testStore.getCardModel(mickeyMouseAmberChampion);
//
//       // Quest with own character
//       OwnCharacter.quest();
//
//       // Should gain 1 lore from quest but NOT 1 extra from Grimorum
//       Expect(testStore.getPlayerLore("player_one")).toBe(ownCharacter.lore);
//     });
//   });
//
//   Describe("CELERITAS - Your characters named Demona gain Rush.", () => {
//     It("grants Rush to characters named Demona", () => {
//       Const testStore = new TestEngine({
//         Play: [grimorumArcanorum, demonaScourgeOfTheWyvernClan],
//       });
//
//       Const demona = testStore.getCardModel(demonaScourgeOfTheWyvernClan);
//
//       Expect(demona.hasRush).toBe(true);
//     });
//
//     It("does not grant Rush to other characters", () => {
//       Const testStore = new TestEngine({
//         Play: [grimorumArcanorum, mickeyMouseAmberChampion],
//       });
//
//       Const mickey = testStore.getCardModel(mickeyMouseAmberChampion);
//
//       Expect(mickey.hasRush).toBe(false);
//     });
//   });
// });
//
