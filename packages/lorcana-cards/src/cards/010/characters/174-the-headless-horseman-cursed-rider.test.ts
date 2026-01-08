// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   hudsonDeterminedReader,
//   plutoSteelChampion,
//   theGamesAfoot,
//   theHeadlessHorsemanCursedRider,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("The Headless Horseman - Cursed Rider", () => {
//   describe("Shift ability", () => {
//     it("should have shift ability", () => {
//       const testEngine = new TestEngine({
//         play: [theHeadlessHorsemanCursedRider],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanCursedRider,
//       );
//
//       expect(cardUnderTest.hasShift).toBe(true);
//     });
//   });
//
//   describe("WITCHING HOUR ability", () => {
//     it("both players draw 3 cards and discard 3 cards at random - no action cards", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theHeadlessHorsemanCursedRider.cost,
//           hand: [theHeadlessHorsemanCursedRider],
//           deck: [
//             hudsonDeterminedReader,
//             hudsonDeterminedReader,
//             hudsonDeterminedReader,
//           ],
//         },
//         {
//           deck: [
//             hudsonDeterminedReader,
//             hudsonDeterminedReader,
//             hudsonDeterminedReader,
//           ],
//           play: [plutoSteelChampion],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanCursedRider,
//       );
//
//       const player1Before = testEngine.getZonesCardCount("player_one");
//       const player2Before = testEngine.getZonesCardCount("player_two");
//
//       expect(player1Before.hand).toBe(1); // The Horseman card
//       expect(player1Before.deck).toBe(3);
//       expect(player2Before.hand).toBe(0);
//       expect(player2Before.deck).toBe(3);
//
//       await testEngine.playCard(cardUnderTest);
//
//       const player1After = testEngine.getZonesCardCount("player_one");
//       const player2After = testEngine.getZonesCardCount("player_two");
//
//       // After drawing 3 and discarding 3, net change should be 0 for hand count
//       // Player 1: had 1 (Horseman) - 1 (played) + 3 (drew) = 3, then - 3 (discarded) = 0
//       // Player 2: had 0 + 3 (drew) = 3, then - 3 (discarded) = 0
//       expect(player1After.hand).toBe(0);
//       expect(player2After.hand).toBe(0);
//       expect(player1After.discard).toBe(3);
//       expect(player2After.discard).toBe(3);
//
//       // No action cards discarded, so no damage layer should be created
//       expect(testEngine.stackLayers.length).toBe(0);
//     });
//
//     it("deals 2 damage per action card discarded - 1 action card from player", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theHeadlessHorsemanCursedRider.cost,
//           hand: [theHeadlessHorsemanCursedRider],
//           deck: [
//             theGamesAfoot, // action
//             hudsonDeterminedReader,
//             hudsonDeterminedReader,
//           ],
//         },
//         {
//           deck: [
//             hudsonDeterminedReader,
//             hudsonDeterminedReader,
//             hudsonDeterminedReader,
//           ],
//           play: [plutoSteelChampion],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanCursedRider,
//       );
//       const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         plutoSteelChampion.id,
//         "player_two",
//       );
//
//       await testEngine.playCard(cardUnderTest);
//
//       // Should have a damage layer since 1 action card was discarded
//       expect(testEngine.stackLayers.length).toBe(1);
//
//       await testEngine.resolveTopOfStack({ targets: [opponentCharacter] });
//
//       // 1 action card discarded = 2 damage
//       expect(opponentCharacter.meta.damage).toBe(2);
//     });
//
//     it("deals 2 damage per action card discarded - multiple action cards from both players", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theHeadlessHorsemanCursedRider.cost,
//           hand: [theHeadlessHorsemanCursedRider],
//           deck: [theGamesAfoot, theGamesAfoot, hudsonDeterminedReader],
//         },
//         {
//           deck: [theGamesAfoot, hudsonDeterminedReader, hudsonDeterminedReader],
//           play: [plutoSteelChampion],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanCursedRider,
//       );
//
//       await testEngine.playCard(cardUnderTest);
//
//       // Get the opponent character AFTER playing, to ensure we have the right instance
//       const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         plutoSteelChampion.id,
//         "player_two",
//       );
//
//       await testEngine.resolveTopOfStack({ targets: [opponentCharacter] });
//
//       // 3 action cards discarded total = 6 damage (should put 6 damage on 5/5 Pluto, banishing it)
//       expect(opponentCharacter.zone).toBe("discard");
//     });
//
//     it("deals 2 damage per action card discarded - all 6 cards are action cards", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theHeadlessHorsemanCursedRider.cost,
//           hand: [theHeadlessHorsemanCursedRider],
//           deck: [theGamesAfoot, theGamesAfoot, theGamesAfoot],
//         },
//         {
//           deck: [theGamesAfoot, theGamesAfoot, theGamesAfoot],
//           play: [plutoSteelChampion],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanCursedRider,
//       );
//       const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         plutoSteelChampion.id,
//         "player_two",
//       );
//
//       await testEngine.playCard(cardUnderTest);
//       await testEngine.resolveTopOfStack({ targets: [opponentCharacter] });
//
//       // 6 action cards discarded = 12 damage (should banish the 5/5 Pluto)
//       expect(opponentCharacter.zone).toBe("discard");
//     });
//
//     it("targets only opposing characters for damage", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: theHeadlessHorsemanCursedRider.cost,
//           hand: [theHeadlessHorsemanCursedRider],
//           deck: [theGamesAfoot, hudsonDeterminedReader, hudsonDeterminedReader],
//           play: [hudsonDeterminedReader],
//         },
//         {
//           deck: [
//             hudsonDeterminedReader,
//             hudsonDeterminedReader,
//             hudsonDeterminedReader,
//           ],
//           play: [plutoSteelChampion],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         theHeadlessHorsemanCursedRider,
//       );
//
//       await testEngine.playCard(cardUnderTest);
//
//       // Get characters AFTER playing to ensure correct instances
//       const ownCharacter = testEngine.getByZoneAndId(
//         "play",
//         hudsonDeterminedReader.id,
//         "player_one",
//       );
//       const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         plutoSteelChampion.id,
//         "player_two",
//       );
//
//       // 1 action card was discarded, should have damage layer
//       expect(testEngine.stackLayers.length).toBe(1);
//
//       // Target the opponent character correctly
//       await testEngine.resolveTopOfStack({ targets: [opponentCharacter] });
//
//       // Own character should not be damaged
//       expect(ownCharacter.meta.damage || 0).toBe(0);
//       // Opponent character should take damage
//       expect(opponentCharacter.meta.damage).toBe(2);
//     });
//   });
// });
//
