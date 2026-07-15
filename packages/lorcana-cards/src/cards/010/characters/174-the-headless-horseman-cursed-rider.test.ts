// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HudsonDeterminedReader,
//   PlutoSteelChampion,
//   TheGamesAfoot,
//   TheHeadlessHorsemanCursedRider,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Headless Horseman - Cursed Rider", () => {
//   Describe("Shift ability", () => {
//     It("should have shift ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [theHeadlessHorsemanCursedRider],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanCursedRider,
//       );
//
//       Expect(cardUnderTest.hasShift).toBe(true);
//     });
//   });
//
//   Describe("WITCHING HOUR ability", () => {
//     It("both players draw 3 cards and discard 3 cards at random - no action cards", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theHeadlessHorsemanCursedRider.cost,
//           Hand: [theHeadlessHorsemanCursedRider],
//           Deck: [
//             HudsonDeterminedReader,
//             HudsonDeterminedReader,
//             HudsonDeterminedReader,
//           ],
//         },
//         {
//           Deck: [
//             HudsonDeterminedReader,
//             HudsonDeterminedReader,
//             HudsonDeterminedReader,
//           ],
//           Play: [plutoSteelChampion],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanCursedRider,
//       );
//
//       Const player1Before = testEngine.getZonesCardCount("player_one");
//       Const player2Before = testEngine.getZonesCardCount("player_two");
//
//       Expect(player1Before.hand).toBe(1); // The Horseman card
//       Expect(player1Before.deck).toBe(3);
//       Expect(player2Before.hand).toBe(0);
//       Expect(player2Before.deck).toBe(3);
//
//       Await testEngine.playCard(cardUnderTest);
//
//       Const player1After = testEngine.getZonesCardCount("player_one");
//       Const player2After = testEngine.getZonesCardCount("player_two");
//
//       // After drawing 3 and discarding 3, net change should be 0 for hand count
//       // Player 1: had 1 (Horseman) - 1 (played) + 3 (drew) = 3, then - 3 (discarded) = 0
//       // Player 2: had 0 + 3 (drew) = 3, then - 3 (discarded) = 0
//       Expect(player1After.hand).toBe(0);
//       Expect(player2After.hand).toBe(0);
//       Expect(player1After.discard).toBe(3);
//       Expect(player2After.discard).toBe(3);
//
//       // No action cards discarded, so no damage layer should be created
//       Expect(testEngine.stackLayers.length).toBe(0);
//     });
//
//     It("deals 2 damage per action card discarded - 1 action card from player", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theHeadlessHorsemanCursedRider.cost,
//           Hand: [theHeadlessHorsemanCursedRider],
//           Deck: [
//             TheGamesAfoot, // action
//             HudsonDeterminedReader,
//             HudsonDeterminedReader,
//           ],
//         },
//         {
//           Deck: [
//             HudsonDeterminedReader,
//             HudsonDeterminedReader,
//             HudsonDeterminedReader,
//           ],
//           Play: [plutoSteelChampion],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanCursedRider,
//       );
//       Const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         PlutoSteelChampion.id,
//         "player_two",
//       );
//
//       Await testEngine.playCard(cardUnderTest);
//
//       // Should have a damage layer since 1 action card was discarded
//       Expect(testEngine.stackLayers.length).toBe(1);
//
//       Await testEngine.resolveTopOfStack({ targets: [opponentCharacter] });
//
//       // 1 action card discarded = 2 damage
//       Expect(opponentCharacter.meta.damage).toBe(2);
//     });
//
//     It("deals 2 damage per action card discarded - multiple action cards from both players", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theHeadlessHorsemanCursedRider.cost,
//           Hand: [theHeadlessHorsemanCursedRider],
//           Deck: [theGamesAfoot, theGamesAfoot, hudsonDeterminedReader],
//         },
//         {
//           Deck: [theGamesAfoot, hudsonDeterminedReader, hudsonDeterminedReader],
//           Play: [plutoSteelChampion],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanCursedRider,
//       );
//
//       Await testEngine.playCard(cardUnderTest);
//
//       // Get the opponent character AFTER playing, to ensure we have the right instance
//       Const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         PlutoSteelChampion.id,
//         "player_two",
//       );
//
//       Await testEngine.resolveTopOfStack({ targets: [opponentCharacter] });
//
//       // 3 action cards discarded total = 6 damage (should put 6 damage on 5/5 Pluto, banishing it)
//       Expect(opponentCharacter.zone).toBe("discard");
//     });
//
//     It("deals 2 damage per action card discarded - all 6 cards are action cards", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theHeadlessHorsemanCursedRider.cost,
//           Hand: [theHeadlessHorsemanCursedRider],
//           Deck: [theGamesAfoot, theGamesAfoot, theGamesAfoot],
//         },
//         {
//           Deck: [theGamesAfoot, theGamesAfoot, theGamesAfoot],
//           Play: [plutoSteelChampion],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanCursedRider,
//       );
//       Const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         PlutoSteelChampion.id,
//         "player_two",
//       );
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveTopOfStack({ targets: [opponentCharacter] });
//
//       // 6 action cards discarded = 12 damage (should banish the 5/5 Pluto)
//       Expect(opponentCharacter.zone).toBe("discard");
//     });
//
//     It("targets only opposing characters for damage", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: theHeadlessHorsemanCursedRider.cost,
//           Hand: [theHeadlessHorsemanCursedRider],
//           Deck: [theGamesAfoot, hudsonDeterminedReader, hudsonDeterminedReader],
//           Play: [hudsonDeterminedReader],
//         },
//         {
//           Deck: [
//             HudsonDeterminedReader,
//             HudsonDeterminedReader,
//             HudsonDeterminedReader,
//           ],
//           Play: [plutoSteelChampion],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         TheHeadlessHorsemanCursedRider,
//       );
//
//       Await testEngine.playCard(cardUnderTest);
//
//       // Get characters AFTER playing to ensure correct instances
//       Const ownCharacter = testEngine.getByZoneAndId(
//         "play",
//         HudsonDeterminedReader.id,
//         "player_one",
//       );
//       Const opponentCharacter = testEngine.getByZoneAndId(
//         "play",
//         PlutoSteelChampion.id,
//         "player_two",
//       );
//
//       // 1 action card was discarded, should have damage layer
//       Expect(testEngine.stackLayers.length).toBe(1);
//
//       // Target the opponent character correctly
//       Await testEngine.resolveTopOfStack({ targets: [opponentCharacter] });
//
//       // Own character should not be damaged
//       Expect(ownCharacter.meta.damage || 0).toBe(0);
//       // Opponent character should take damage
//       Expect(opponentCharacter.meta.damage).toBe(2);
//     });
//   });
// });
//
