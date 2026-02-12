// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   GoofyKnightForADay,
//   LadyTremaineImperiousQueen,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   FlynnRiderFrenemy,
//   HadesMeticulousPlotter,
//   NessusRiverGuardian,
//   SisuWiseFriend,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Flynn Rider - Frenemy", () => {
//   Describe("**NARROW ADVANTAGE** At the start of your turn, if you have a character in play with more {S}than each opposing character, gain 3 lore.", () => {
//     It("meets the condition", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [hadesMeticulousPlotter, sisuWiseFriend],
//           Deck: 1,
//         },
//         {
//           Play: [flynnRiderFrenemy, nessusRiverGuardian],
//           Deck: 2,
//         },
//       );
//
//       Expect(testStore.getPlayerLore("player_two")).toEqual(0);
//       Expect(testStore.getPlayerLore("player_one")).toEqual(0);
//
//       // testStore.passTurn();
//       // expect(testStore.getPlayerLore("player_one")).toEqual(0);
//       // expect(testStore.getPlayerLore("player_two")).toEqual(3);
//       //
//       // testStore.passTurn();
//       // expect(testStore.getPlayerLore("player_one")).toEqual(0);
//       // expect(testStore.getPlayerLore("player_two")).toEqual(3);
//       //
//       // testStore.passTurn();
//       // expect(testStore.getPlayerLore("player_one")).toEqual(0);
//       // expect(testStore.getPlayerLore("player_two")).toEqual(6);
//     });
//
//     It("does NOT meet the condition", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [hadesMeticulousPlotter, nessusRiverGuardian],
//           Deck: 2,
//         },
//         {
//           Play: [flynnRiderFrenemy, sisuWiseFriend],
//           Deck: 1,
//         },
//       );
//
//       Expect(testStore.getPlayerLore("player_one")).toEqual(0);
//       Expect(testStore.getPlayerLore("player_two")).toEqual(0);
//
//       TestStore.passTurn();
//       Expect(testStore.getPlayerLore("player_one")).toEqual(0);
//       Expect(testStore.getPlayerLore("player_two")).toEqual(0);
//
//       TestStore.passTurn();
//       Expect(testStore.getPlayerLore("player_one")).toEqual(0);
//       Expect(testStore.getPlayerLore("player_two")).toEqual(0);
//
//       TestStore.passTurn();
//       Expect(testStore.getPlayerLore("player_one")).toEqual(0);
//       Expect(testStore.getPlayerLore("player_two")).toEqual(0);
//     });
//   });
// });
//
// Describe("Regression Test", () => {
//   It("Should trigger when alone", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [flynnRiderFrenemy],
//         Deck: 2,
//       },
//       {
//         Deck: 2,
//       },
//     );
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(0);
//     Expect(testEngine.getPlayerLore("player_two")).toEqual(0);
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(3);
//     Expect(testEngine.getPlayerLore("player_two")).toEqual(0);
//   });
//
//   It("Should trigger when alone", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Deck: 2,
//       },
//       {
//         Play: [flynnRiderFrenemy],
//         Deck: 2,
//       },
//     );
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(0);
//     Expect(testEngine.getPlayerLore("player_two")).toEqual(3);
//   });
//
//   It("Should not trigger on tie, after being removed", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: ladyTremaineImperiousQueen.cost,
//         Hand: [ladyTremaineImperiousQueen],
//         Play: [arielSpectacularSinger],
//         Deck: 2,
//       },
//       {
//         Play: [flynnRiderFrenemy, goofyKnightForADay],
//         Deck: 2,
//       },
//     );
//
//     Await testEngine.playCard(ladyTremaineImperiousQueen);
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveTopOfStack({ targets: [flynnRiderFrenemy] });
//     Expect(testEngine.getCardModel(flynnRiderFrenemy).zone).toEqual("discard");
//
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(0);
//     Expect(testEngine.getPlayerLore("player_two")).toEqual(0);
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(0);
//     Expect(testEngine.getPlayerLore("player_two")).toEqual(0);
//   });
//
//   It("Tie is not a a win", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [arielSpectacularSinger],
//         Deck: 2,
//       },
//       {
//         Play: [flynnRiderFrenemy],
//         Deck: 1,
//       },
//     );
//
//     Expect(testStore.getPlayerLore("player_one")).toEqual(0);
//     Expect(testStore.getPlayerLore("player_two")).toEqual(0);
//
//     TestStore.passTurn();
//     Expect(testStore.getPlayerLore("player_one")).toEqual(0);
//     Expect(testStore.getPlayerLore("player_two")).toEqual(0);
//
//     TestStore.passTurn();
//     Expect(testStore.getPlayerLore("player_one")).toEqual(0);
//     Expect(testStore.getPlayerLore("player_two")).toEqual(0);
//
//     TestStore.passTurn();
//     Expect(testStore.getPlayerLore("player_one")).toEqual(0);
//     Expect(testStore.getPlayerLore("player_two")).toEqual(0);
//   });
// });
//
