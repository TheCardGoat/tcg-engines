// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { hiramFlavershamToymaker } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { hydrosIceTitan } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import {
//   demonaScourgeOfTheWyvernClan,
//   grimorumArcanorum,
//   mickeyMouseAmberChampion,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Grimorum Arcanorum", () => {
//   describe("DOCTRINA ADDUCERE - During your turn, whenever an opposing character becomes exerted, gain 1 lore.", () => {
//     it("Gains 1 Lore", async () => {
//       const testStore = new TestEngine(
//         {
//           inkwell: 3,
//           play: [grimorumArcanorum, hydrosIceTitan],
//         },
//         {
//           play: [hiramFlavershamToymaker],
//         },
//       );
//
//       const opponentCharacter = testStore.getCardModel(hiramFlavershamToymaker);
//       await testStore.activateCard(hydrosIceTitan, {
//         targets: [opponentCharacter],
//       });
//
//       expect(opponentCharacter.exerted).toBe(true);
//
//       expect(testStore.getPlayerLore("player_one")).toBe(1);
//     });
//
//     it("does NOT gain lore when an opposing character is exerted during opponent's turn", async () => {
//       const testStore = new TestEngine(
//         {
//           play: [grimorumArcanorum],
//         },
//         {
//           play: [hiramFlavershamToymaker],
//         },
//       );
//
//       const opponentCharacter = testStore.getCardModel(hiramFlavershamToymaker);
//
//       // Switch to opponent's turn
//       await testStore.passTurn();
//
//       // Opponent quests - should NOT trigger during opponent's turn
//       opponentCharacter.quest();
//
//       // Player one should not have gained lore
//       expect(testStore.getPlayerLore("player_two")).toBe(
//         opponentCharacter.lore,
//       );
//       expect(testStore.getPlayerLore("player_one")).toBe(0);
//     });
//
//     it("does not gain lore when your own character is exerted", async () => {
//       const testStore = new TestEngine({
//         play: [grimorumArcanorum, mickeyMouseAmberChampion],
//       });
//
//       const ownCharacter = testStore.getCardModel(mickeyMouseAmberChampion);
//
//       // Quest with own character
//       ownCharacter.quest();
//
//       // Should gain 1 lore from quest but NOT 1 extra from Grimorum
//       expect(testStore.getPlayerLore("player_one")).toBe(ownCharacter.lore);
//     });
//   });
//
//   describe("CELERITAS - Your characters named Demona gain Rush.", () => {
//     it("grants Rush to characters named Demona", () => {
//       const testStore = new TestEngine({
//         play: [grimorumArcanorum, demonaScourgeOfTheWyvernClan],
//       });
//
//       const demona = testStore.getCardModel(demonaScourgeOfTheWyvernClan);
//
//       expect(demona.hasRush).toBe(true);
//     });
//
//     it("does not grant Rush to other characters", () => {
//       const testStore = new TestEngine({
//         play: [grimorumArcanorum, mickeyMouseAmberChampion],
//       });
//
//       const mickey = testStore.getCardModel(mickeyMouseAmberChampion);
//
//       expect(mickey.hasRush).toBe(false);
//     });
//   });
// });
//
