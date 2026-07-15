// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CaterpillarCalmAndCollected,
//   HiramFlavershamToymaker,
//   JasmineHeirOfAgrabah,
//   QueenOfHeartsSensingWeakness,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Queen of Hearts - Sensing Weakness", () => {
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [queenOfHeartsSensingWeakness],
//       Deck: 5,
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       QueenOfHeartsSensingWeakness.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toEqual(true);
//   });
//
//   Describe("**LET THE GAME BEGIN** Whenever one of your characters challenges another character, you may draw a card.", () => {
//     It("Challenges another character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 5,
//           Play: [
//             QueenOfHeartsSensingWeakness,
//             CaterpillarCalmAndCollected,
//             JasmineHeirOfAgrabah,
//           ],
//         },
//         {
//           Play: [hiramFlavershamToymaker],
//         },
//       );
//
//       Const defender = testEngine.getCardModel(hiramFlavershamToymaker);
//       Await testEngine.tapCard(defender);
//
//       Const attackerOne = testEngine.getCardModel(caterpillarCalmAndCollected);
//       Const attackerTwo = testEngine.getCardModel(jasmineHeirOfAgrabah);
//
//       Await testEngine.challenge({ attacker: attackerOne, defender });
//       Await testEngine.resolveOptionalAbility();
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 1, deck: 4 }),
//       );
//
//       Await testEngine.challenge({ attacker: attackerTwo, defender });
//       Await testEngine.resolveOptionalAbility();
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 2, deck: 3 }),
//       );
//     });
//
//     It("Challenges a location", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Deck: 5,
//           Play: [queenOfHeartsSensingWeakness, caterpillarCalmAndCollected],
//         },
//         {
//           Play: [hiddenCoveTranquilHaven],
//         },
//       );
//
//       Await testEngine.challenge({
//         Attacker: caterpillarCalmAndCollected,
//         Defender: hiddenCoveTranquilHaven,
//       });
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Expect(testEngine.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 0, deck: 5 }),
//       );
//     });
//   });
// });
//
