// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { bePrepared } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   BobbyPurplePigeon,
//   JoeyBluePigeon,
//   RhinoPowerHamster,
//   VinnieGreenPigeon,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Vinnie - Green Pigeon", () => {
//   It("LEARNING EXPERIENCE During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: vinnieGreenPigeon.cost,
//         Play: [vinnieGreenPigeon, joeyBluePigeon, bobbyPurplePigeon],
//         Hand: [],
//         Lore: 0,
//       },
//       {
//         Inkwell: 7,
//         Hand: [bePrepared],
//       },
//     );
//
//     TestEngine.passTurn();
//
//     Await testEngine.playCard(bePrepared);
//
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.resolveTopOfStack({}, true);
//
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(2);
//   });
//
//   It("LEARNING EXPERIENCE Does not trigger during your turn", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: vinnieGreenPigeon.cost,
//         Play: [vinnieGreenPigeon, joeyBluePigeon, bobbyPurplePigeon],
//         Hand: [],
//         Lore: 0,
//       },
//       {
//         Inkwell: 7,
//         Play: [rhinoPowerHamster],
//       },
//     );
//
//     Const defender = testEngine.getCardModel(rhinoPowerHamster);
//     Defender.updateCardMeta({ exerted: true });
//
//     Const challenger = testEngine.getCardModel(bobbyPurplePigeon);
//     Await testEngine.challenge({ attacker: challenger, defender: defender });
//
//     Expect(testEngine.getPlayerLore("player_one")).toEqual(0);
//   });
// });
//
