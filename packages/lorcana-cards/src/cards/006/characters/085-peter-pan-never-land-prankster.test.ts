// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { merlinGoat } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   DonaldDuckFirstMate,
//   PeterPanNeverLandPrankster,
//   Thievery,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Peter Pan - Never Land Prankster", () => {
//   It("LOOK INNOCENT This character enters play exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: peterPanNeverLandPrankster.cost,
//       Hand: [peterPanNeverLandPrankster],
//     });
//
//     Const cardUnderTest = await testEngine.playCard(peterPanNeverLandPrankster);
//
//     Expect(cardUnderTest.exerted).toEqual(true);
//   });
//
//   It("CAN'T TAKE A JOKE? While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: merlinGoat.cost + thievery.cost,
//         Hand: [merlinGoat, thievery],
//         Play: [donaldDuckFirstMate],
//       },
//       {
//         Play: [peterPanNeverLandPrankster],
//       },
//     );
//
//     Await testEngine.tapCard(peterPanNeverLandPrankster);
//
//     Await testEngine.playCard(merlinGoat);
//     Expect(testEngine.getLoreForPlayer("player_one")).toEqual(0);
//
//     Await testEngine.challenge({
//       Attacker: donaldDuckFirstMate,
//       Defender: peterPanNeverLandPrankster,
//     });
//
//     Await testEngine.playCard(thievery);
//     Expect(testEngine.getLoreForPlayer("player_one")).toEqual(1);
//   });
// });
//
