// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GastonPureParagon,
//   MaximusTeamChampion,
//   ScroogeMcduckAficionadoOfAntiquities,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maximus - Team Champion", () => {
//   Describe("**A REWARD WORTHY OF A KING** At the end of your turn, if you have a character in play with 5 {S} or more, gain 2 lore. If that character has 10 {S} or more, gain 5 lore instead.", () => {
//     It("No characters 5 strength on more in play", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [maximusTeamChampion],
//         },
//         {
//           Deck: 1,
//         },
//       );
//
//       TestStore.passTurn();
//
//       Expect(testStore.getPlayerLore("player_one")).toEqual(0);
//     });
//
//     It("With char with 5 or more strength", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [maximusTeamChampion, scroogeMcduckAficionadoOfAntiquities],
//         },
//         {
//           Deck: 1,
//         },
//       );
//
//       TestStore.passTurn();
//
//       Expect(testStore.getPlayerLore("player_one")).toEqual(2);
//     });
//
//     It("With char with 10 or more strength", () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [maximusTeamChampion, gastonPureParagon],
//         },
//         {
//           Deck: 1,
//         },
//       );
//
//       TestEngine.passTurn();
//       TestEngine.changeActivePlayer("player_one");
//       TestEngine.acceptOptionalLayerBySource({ source: maximusTeamChampion });
//       // testEngine.acceptOptionalLayerBySource({ source: maximusTeamChampion });
//
//       Expect(testEngine.getPlayerLore("player_one")).toEqual(5);
//     });
//   });
// });
//
