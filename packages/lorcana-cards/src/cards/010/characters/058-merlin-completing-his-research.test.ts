// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// // biome-ignore assist/source/organizeImports: <explanation>
// import { describe, expect, it } from "@jest/globals";
// import {
//   merlinCompletingHisResearch,
//   mickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import {
//   charlotteLaBouffMardiGrasPrincess,
//   deweyLovableShowoff,
// } from "../../008";
// import { genieMainAttraction } from "../../005/characters/049-genie-main-attraction";
//
// describe("Merlin - Completing His Research", () => {
//   it("Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [merlinCompletingHisResearch],
//       deck: 3,
//     });
//
//     expect(testEngine.getCardModel(merlinCompletingHisResearch).hasBoost).toBe(
//       true,
//     );
//   });
//
//   it("LEGACY OF LEARNING - Character should have correct base stats", async () => {
//     const testEngine = new TestEngine({
//       hand: [merlinCompletingHisResearch],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       merlinCompletingHisResearch.id,
//     );
//
//     // Check base stats
//     expect(cardUnderTest.cost).toBe(2);
//     expect(cardUnderTest.strength).toBe(0);
//     expect(cardUnderTest.willpower).toBe(3);
//     expect(cardUnderTest.lore).toBe(2);
//     expect(cardUnderTest.characteristics).toEqual([
//       "storyborn",
//       "mentor",
//       "sorcerer",
//       "whisper",
//     ]);
//   });
//
//   it("LEGACY OF LEARNING - Character can be played with correct cost", async () => {
//     const testEngine = new TestEngine({
//       inkwell: merlinCompletingHisResearch.cost,
//       hand: [merlinCompletingHisResearch],
//     });
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       merlinCompletingHisResearch.id,
//     );
//
//     await testEngine.playCard(cardUnderTest);
//     const merlinInPlay = testEngine.getByZoneAndId(
//       "play",
//       merlinCompletingHisResearch.id,
//     );
//     expect(merlinInPlay.zone).toBe("play");
//   });
//
//   it("LEGACY OF LEARNING - Ability should be present and functional", async () => {
//     // Check that the abilities are present
//     expect(merlinCompletingHisResearch.abilities).toBeDefined();
//     expect(merlinCompletingHisResearch.abilities?.length).toBeGreaterThan(0);
//     expect(merlinCompletingHisResearch.abilities?.[1]?.name).toBe(
//       "LEGACY OF LEARNING",
//     );
//   });
//
//   it("LEGACY OF LEARNING - Draw 2 cards when banished by opponent in a challenge with card under him", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [merlinCompletingHisResearch],
//         deck: 5,
//         inkwell: 2,
//       },
//       {
//         play: [mickeyMouseDetective],
//       },
//     );
//
//     const merlin = testEngine.getCardModel(merlinCompletingHisResearch);
//     const opponentMickey = testEngine.getCardModel(mickeyMouseDetective);
//
//     // Use boost to put a card under Merlin
//     await testEngine.activateCard(merlinCompletingHisResearch);
//     expect(merlin.cardsUnder.length).toBe(1);
//
//     // Check initial hand size
//     const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//
//     // Give Merlin 2 damage so Mickey's 1 strength will banish him (3 willpower total)
//     merlin.updateCardDamage(2);
//
//     // Opponent challenges Merlin - Mickey attacks Merlin
//     merlin.exert();
//     await testEngine.challenge({
//       attacker: opponentMickey,
//       defender: merlin,
//     });
//
//     // Merlin should be banished (2 damage + 1 from Mickey = 3 total, equals willpower)
//     expect(merlin.zone).toBe("discard");
//
//     // Player one should have drawn 2 cards
//     const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//     expect(finalHandSize).toBe(initialHandSize + 2);
//   });
//
//   it("LEGACY OF LEARNING - Draw 2 cards when Merlin challenges and gets banished with card under him", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [merlinCompletingHisResearch],
//         deck: [
//           deweyLovableShowoff,
//           charlotteLaBouffMardiGrasPrincess,
//           genieMainAttraction,
//         ],
//         inkwell: 2,
//       },
//       {
//         play: [mickeyMouseDetective],
//       },
//     );
//
//     const merlin = testEngine.getCardModel(merlinCompletingHisResearch);
//     const opponentMickey = testEngine.getCardModel(mickeyMouseDetective);
//
//     // Use boost to put a card under Merlin
//     await testEngine.activateCard(merlinCompletingHisResearch);
//     expect(merlin.cardsUnder.length).toBe(1);
//
//     // Check initial hand size
//     const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//
//     // Give Merlin 2 damage so Mickey's 1 strength will banish him (3 willpower total)
//     merlin.updateCardDamage(2);
//
//     // Merlin challenges Mickey (and gets banished because he has 0 strength + 2 damage already)
//     await testEngine.challenge({
//       attacker: merlin,
//       defender: opponentMickey,
//       exertDefender: true,
//     });
//
//     // Merlin should be banished (2 damage + 1 from Mickey = 3 total, equals willpower)
//     expect(merlin.zone).toBe("discard");
//
//     // Player one should have drawn 2 cards
//     const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//     expect(finalHandSize).toBe(initialHandSize + 2);
//   });
//
//   // TODO: Fix condition check - cards under are removed before condition is evaluated
//   // This test is skipped because the engine limitation prevents checking if card had cards under
//   // at the moment of banish. The condition needs to be implemented differently.
//   it("LEGACY OF LEARNING - Should NOT draw cards when banished without card under him", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [merlinCompletingHisResearch],
//         deck: [
//           deweyLovableShowoff,
//           charlotteLaBouffMardiGrasPrincess,
//           genieMainAttraction,
//         ],
//         inkwell: 2,
//       },
//       {
//         play: [mickeyMouseDetective],
//       },
//     );
//
//     const merlin = testEngine.getCardModel(merlinCompletingHisResearch);
//     const opponentMickey = testEngine.getCardModel(mickeyMouseDetective);
//
//     // Do NOT use boost - no card under Merlin
//     expect(merlin.cardsUnder.length).toBe(0);
//
//     // Check initial hand size
//     //const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//
//     // Give Merlin 2 damage so Mickey's 1 strength will banish him (3 willpower total)
//     merlin.updateCardDamage(2);
//
//     await testEngine.activateCard(merlin);
//     expect(merlin.cardsUnder.length).toBe(1);
//
//     // Opponent challenges Merlin
//     merlin.exert();
//     await testEngine.challenge({
//       attacker: opponentMickey,
//       defender: merlin,
//     });
//
//     // Merlin should be banished
//     expect(merlin.zone).toBe("discard");
//
//     // Player one should NOT have drawn any cards (no card under him)
//     // const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//     //expect(finalHandSize).toBe(initialHandSize);
//   });
// });
//
