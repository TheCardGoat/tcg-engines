// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { iagoPrettyPolly } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/004/actions/128-a-pirates-life";
// Import {
//   DumboNinthWonderOfTheUniverse,
//   DumboTheFlyingElephant,
// } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dumbo - Ninth Wonder of the Universe", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [dumboNinthWonderOfTheUniverse],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       DumboNinthWonderOfTheUniverse,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("BREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 1,
//       Play: [dumboNinthWonderOfTheUniverse],
//       Deck: 3,
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       DumboNinthWonderOfTheUniverse,
//     );
//
//     Await testEngine.activateCard(cardUnderTest);
//     Expect(testEngine.getPlayerLore()).toEqual(1);
//     Expect(testEngine.getCardsByZone("hand").length).toEqual(1);
//   });
//
//   It("MAKING HISTORY Your other characters with Evasive gain '{E}, 1 {I} – Draw a card and gain 1 lore.'", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 1,
//       Play: [dumboNinthWonderOfTheUniverse, iagoPrettyPolly],
//       Deck: 3,
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(iagoPrettyPolly);
//
//     Await testEngine.activateCard(cardUnderTest);
//
//     Expect(cardUnderTest.ready).toEqual(false);
//     Expect(testEngine.getPlayerLore()).toEqual(1);
//     Expect(testEngine.getCardsByZone("hand").length).toEqual(1);
//   });
//
//   Describe("Regressions", () => {
//     It("Only give the ability to other characters", async () => {
//       Const testEngine = new TestEngine({
//         Play: [dumboNinthWonderOfTheUniverse],
//       });
//
//       Const dumbo = testEngine.getCardModel(dumboNinthWonderOfTheUniverse);
//
//       Expect(dumbo.activatedAbilities).toHaveLength(2);
//     });
//
//     It("A Pirate's Life interaction", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 1,
//           Play: [dumboNinthWonderOfTheUniverse, dumboTheFlyingElephant],
//           Hand: [aPiratesLife],
//           Deck: 3,
//         },
//         {
//           Lore: 5,
//         },
//       );
//
//       Await testEngine.singSongTogether({
//         Singers: [dumboNinthWonderOfTheUniverse, dumboTheFlyingElephant],
//         Song: aPiratesLife,
//       });
//
//       Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//       Expect(testEngine.getLoreForPlayer("player_two")).toBe(3);
//     });
//   });
// });
//
