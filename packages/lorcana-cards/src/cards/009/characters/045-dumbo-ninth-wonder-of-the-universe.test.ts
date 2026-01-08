// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { iagoPrettyPolly } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { aPiratesLife } from "@lorcanito/lorcana-engine/cards/004/actions/128-a-pirates-life";
// import {
//   dumboNinthWonderOfTheUniverse,
//   dumboTheFlyingElephant,
// } from "@lorcanito/lorcana-engine/cards/009";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dumbo - Ninth Wonder of the Universe", () => {
//   it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [dumboNinthWonderOfTheUniverse],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(
//       dumboNinthWonderOfTheUniverse,
//     );
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it("BREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 1,
//       play: [dumboNinthWonderOfTheUniverse],
//       deck: 3,
//     });
//
//     const cardUnderTest = testEngine.getCardModel(
//       dumboNinthWonderOfTheUniverse,
//     );
//
//     await testEngine.activateCard(cardUnderTest);
//     expect(testEngine.getPlayerLore()).toEqual(1);
//     expect(testEngine.getCardsByZone("hand").length).toEqual(1);
//   });
//
//   it("MAKING HISTORY Your other characters with Evasive gain '{E}, 1 {I} – Draw a card and gain 1 lore.'", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 1,
//       play: [dumboNinthWonderOfTheUniverse, iagoPrettyPolly],
//       deck: 3,
//     });
//
//     const cardUnderTest = testEngine.getCardModel(iagoPrettyPolly);
//
//     await testEngine.activateCard(cardUnderTest);
//
//     expect(cardUnderTest.ready).toEqual(false);
//     expect(testEngine.getPlayerLore()).toEqual(1);
//     expect(testEngine.getCardsByZone("hand").length).toEqual(1);
//   });
//
//   describe("Regressions", () => {
//     it("Only give the ability to other characters", async () => {
//       const testEngine = new TestEngine({
//         play: [dumboNinthWonderOfTheUniverse],
//       });
//
//       const dumbo = testEngine.getCardModel(dumboNinthWonderOfTheUniverse);
//
//       expect(dumbo.activatedAbilities).toHaveLength(2);
//     });
//
//     it("A Pirate's Life interaction", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 1,
//           play: [dumboNinthWonderOfTheUniverse, dumboTheFlyingElephant],
//           hand: [aPiratesLife],
//           deck: 3,
//         },
//         {
//           lore: 5,
//         },
//       );
//
//       await testEngine.singSongTogether({
//         singers: [dumboNinthWonderOfTheUniverse, dumboTheFlyingElephant],
//         song: aPiratesLife,
//       });
//
//       expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//       expect(testEngine.getLoreForPlayer("player_two")).toBe(3);
//     });
//   });
// });
//
