// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BroadwaySturdyAndStrong,
//   DemonaScourgeOfTheWyvernClan,
//   HudsonDeterminedReader,
//   LexingtonSmallInStature,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Demona - Scourge of the Wyvern Clan", () => {
//   Describe("AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3. STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.", () => {
//     It("Exerts all opponsing characters.", async () => {
//       Const cardsInPlay = [hudsonDeterminedReader, lexingtonSmallInStature];
//
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: demonaScourgeOfTheWyvernClan.cost,
//           Hand: [demonaScourgeOfTheWyvernClan],
//         },
//         {
//           Play: cardsInPlay,
//         },
//       );
//
//       For (const card of cardsInPlay) {
//         Expect(testEngine.getCardModel(card).exerted).toBe(false);
//       }
//
//       Await testEngine.playCard(demonaScourgeOfTheWyvernClan);
//
//       For (const card of cardsInPlay) {
//         Expect(testEngine.getCardModel(card).exerted).toBe(true);
//       }
//     });
//
//     It("Both Players 0 cards in hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: demonaScourgeOfTheWyvernClan.cost,
//           Hand: [demonaScourgeOfTheWyvernClan],
//         },
//         {
//           Hand: [],
//         },
//       );
//
//       Await testEngine.playCard(demonaScourgeOfTheWyvernClan);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(3);
//     });
//
//     It("Both Players 3 cards in hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: demonaScourgeOfTheWyvernClan.cost,
//           Hand: [
//             BroadwaySturdyAndStrong,
//             DemonaScourgeOfTheWyvernClan,
//             HudsonDeterminedReader,
//             LexingtonSmallInStature,
//           ],
//         },
//         {
//           Hand: 3,
//         },
//       );
//
//       Await testEngine.playCard(demonaScourgeOfTheWyvernClan);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(3);
//     });
//
//     It("Mixture of hand sizes", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: demonaScourgeOfTheWyvernClan.cost,
//           Hand: [demonaScourgeOfTheWyvernClan],
//         },
//         {
//           Hand: 4,
//         },
//       );
//
//       Await testEngine.playCard(demonaScourgeOfTheWyvernClan);
//
//       Expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//       Expect(testEngine.getZonesCardCount("player_two").hand).toBe(4);
//     });
//   });
// });
//
