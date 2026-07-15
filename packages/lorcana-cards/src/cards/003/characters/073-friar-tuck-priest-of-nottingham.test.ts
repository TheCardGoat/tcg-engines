// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloGalacticHero,
//   MickeyMouseDetective,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { friarTuckPriestOfNottingham } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Friar Tuck - Priest of Nottingham", () => {
//   Describe("**YOU THIEVING SCOUNDREL** When you play this character, the player or players with the most cards in their hand chooses and discards a card.", () => {
//     It("Same amount of cards in hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: friarTuckPriestOfNottingham.cost,
//           Hand: [friarTuckPriestOfNottingham, liloGalacticHero],
//           Deck: 5,
//         },
//         {
//           Hand: [stichtNewDog],
//           Deck: 5,
//         },
//       );
//
//       Await testEngine.playCard(friarTuckPriestOfNottingham);
//       Expect(testEngine.stackLayers).toHaveLength(2);
//
//       TestEngine.changeActivePlayer("player_one");
//       Expect(testEngine.store.priorityPlayer).toEqual("player_one");
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [liloGalacticHero],
//           LayerId: testEngine.getLayerIdForPlayer("player_one"),
//         },
//         True,
//       );
//       Expect(testEngine.getZonesCardCount("player_one").hand).toEqual(0);
//
//       TestEngine.changeActivePlayer("player_two");
//       Expect(testEngine.store.priorityPlayer).toEqual("player_two");
//       Await testEngine.resolveTopOfStack({ targets: [stichtNewDog] });
//       Expect(testEngine.getZonesCardCount("player_two").hand).toEqual(0);
//     });
//
//     It("No cards in hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: friarTuckPriestOfNottingham.cost,
//           Hand: [friarTuckPriestOfNottingham],
//           Deck: 5,
//         },
//         {
//           Deck: 5,
//         },
//       );
//
//       Await testEngine.playCard(friarTuckPriestOfNottingham);
//       Expect(testEngine.stackLayers).toHaveLength(0);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toEqual(0);
//       Expect(testEngine.getZonesCardCount("player_two").hand).toEqual(0);
//     });
//
//     It("opponent has more", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: friarTuckPriestOfNottingham.cost,
//           Hand: [friarTuckPriestOfNottingham, liloGalacticHero],
//           Deck: 5,
//         },
//         {
//           Hand: [stichtNewDog, mickeyMouseDetective],
//           Deck: 5,
//         },
//       );
//
//       Await testEngine.playCard(friarTuckPriestOfNottingham);
//       Expect(testEngine.stackLayers).toHaveLength(1);
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({ targets: [stichtNewDog] }, true);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toEqual(1);
//       Expect(testEngine.getZonesCardCount("player_two").hand).toEqual(1);
//     });
//
//     It("active player has more", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: friarTuckPriestOfNottingham.cost,
//           Hand: [
//             FriarTuckPriestOfNottingham,
//             LiloGalacticHero,
//             MickeyMouseDetective,
//           ],
//           Deck: 5,
//         },
//         {
//           Hand: [stichtNewDog],
//           Deck: 5,
//         },
//       );
//
//       Await testEngine.playCard(friarTuckPriestOfNottingham);
//       Expect(testEngine.stackLayers).toHaveLength(1);
//
//       Await testEngine.resolveTopOfStack({ targets: [liloGalacticHero] }, true);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toEqual(1);
//       Expect(testEngine.getZonesCardCount("player_two").hand).toEqual(1);
//     });
//   });
// });
//
