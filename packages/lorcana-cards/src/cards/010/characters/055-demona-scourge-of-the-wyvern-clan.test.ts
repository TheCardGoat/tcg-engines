// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   broadwaySturdyAndStrong,
//   demonaScourgeOfTheWyvernClan,
//   hudsonDeterminedReader,
//   lexingtonSmallInStature,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Demona - Scourge of the Wyvern Clan", () => {
//   describe("AD SAXUM COMMUTATE When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3. STONE BY DAY If you have 3 or more cards in your hand, this character can't ready.", () => {
//     it("Exerts all opponsing characters.", async () => {
//       const cardsInPlay = [hudsonDeterminedReader, lexingtonSmallInStature];
//
//       const testEngine = new TestEngine(
//         {
//           inkwell: demonaScourgeOfTheWyvernClan.cost,
//           hand: [demonaScourgeOfTheWyvernClan],
//         },
//         {
//           play: cardsInPlay,
//         },
//       );
//
//       for (const card of cardsInPlay) {
//         expect(testEngine.getCardModel(card).exerted).toBe(false);
//       }
//
//       await testEngine.playCard(demonaScourgeOfTheWyvernClan);
//
//       for (const card of cardsInPlay) {
//         expect(testEngine.getCardModel(card).exerted).toBe(true);
//       }
//     });
//
//     it("Both Players 0 cards in hand", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: demonaScourgeOfTheWyvernClan.cost,
//           hand: [demonaScourgeOfTheWyvernClan],
//         },
//         {
//           hand: [],
//         },
//       );
//
//       await testEngine.playCard(demonaScourgeOfTheWyvernClan);
//
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(3);
//     });
//
//     it("Both Players 3 cards in hand", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: demonaScourgeOfTheWyvernClan.cost,
//           hand: [
//             broadwaySturdyAndStrong,
//             demonaScourgeOfTheWyvernClan,
//             hudsonDeterminedReader,
//             lexingtonSmallInStature,
//           ],
//         },
//         {
//           hand: 3,
//         },
//       );
//
//       await testEngine.playCard(demonaScourgeOfTheWyvernClan);
//
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(3);
//     });
//
//     it("Mixture of hand sizes", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: demonaScourgeOfTheWyvernClan.cost,
//           hand: [demonaScourgeOfTheWyvernClan],
//         },
//         {
//           hand: 4,
//         },
//       );
//
//       await testEngine.playCard(demonaScourgeOfTheWyvernClan);
//
//       expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//       expect(testEngine.getZonesCardCount("player_two").hand).toBe(4);
//     });
//   });
// });
//
