// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FaZhouWarHero,
//   HelgaSinclairToughAsNails,
//   MerlinCleverClairvoyant,
//   ThePrinceChallengerOfTheRise,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Fa Zhou - War Hero", () => {
//   It("TRAINING EXERCISES Each time one of your characters challenges another, if it is the second challenge of this turn, gain 3 lore shards.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [faZhouWarHero, thePrinceChallengerOfTheRise],
//       },
//       {
//         Play: [helgaSinclairToughAsNails, merlinCleverClairvoyant],
//       },
//     );
//
//     Expect(testEngine.getPlayerLore("player_one")).toBe(0);
//     Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//     Const cardUnderTest = testEngine.getCardModel(faZhouWarHero);
//
//     Const challenger = testEngine.getCardModel(thePrinceChallengerOfTheRise);
//
//     Const defender1 = testEngine.getCardModel(helgaSinclairToughAsNails);
//
//     Const defender2 = testEngine.getCardModel(merlinCleverClairvoyant);
//
//     Await testEngine.tapCard(defender1);
//
//     // First challenge of the turn.
//     Challenger.challenge(defender1);
//
//     Expect(testEngine.getPlayerLore("player_one")).toBe(0);
//     Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//     // Ready the challanger (so it can challenge again).
//     Await testEngine.tapCard(thePrinceChallengerOfTheRise, true);
//
//     // Second challenge of the turn.
//     Challenger.challenge(defender1);
//
//     // Verify that there was 3 lore gained (second challenge of the turn).
//     Expect(testEngine.getPlayerLore("player_one")).toBe(3);
//     Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//     Await testEngine.tapCard(defender2);
//
//     Await cardUnderTest.challenge(defender2);
//
//     // Verify that there was no lore gained (third challenge of the turn).
//     Expect(testEngine.getPlayerLore("player_one")).toBe(3);
//     Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//
//     // Ready the challanger (so it can challenge again)
//     Await testEngine.tapCard(cardUnderTest, true);
//
//     CardUnderTest.challenge(defender1);
//
//     // Verify that there was still no lore gained (fourth challenge of the turn).
//     Expect(testEngine.getPlayerLore("player_one")).toBe(3);
//     Expect(testEngine.getPlayerLore("player_two")).toBe(0);
//   });
// });
//
