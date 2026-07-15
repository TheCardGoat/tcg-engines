// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { beastTragicHero } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Beast- Tragic Hero", () => {
//   Describe("IT’S BETTER THIS WAY** At the start of your turn, if this character has no damage, draw a card. Otherwise, he gets +4 {S} this turn.", () => {
//     It("No damage", () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [beastTragicHero],
//           Deck: 3,
//         },
//         {
//           Deck: 2,
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(beastTragicHero);
//
//       TestEngine.passTurn();
//       TestEngine.passTurn();
//
//       Expect(testEngine.getZonesCardCount().deck).toBe(1);
//       Expect(cardUnderTest.strength).toEqual(beastTragicHero.strength);
//     });
//
//     It("With Damage", () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [beastTragicHero],
//           Deck: 3,
//         },
//         {
//           Deck: 2,
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(beastTragicHero);
//       CardUnderTest.updateCardDamage(1);
//
//       TestEngine.passTurn();
//       TestEngine.passTurn();
//
//       Expect(cardUnderTest.strength).toEqual(beastTragicHero.strength + 4);
//       Expect(testEngine.getZonesCardCount().deck).toBe(2);
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("Drawing a card when the character was banished", () => {
//     Const testEngine = new TestEngine(
//       {
//         Deck: 2,
//       },
//       {
//         Play: [beastTragicHero],
//         Deck: 3,
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(beastTragicHero);
//
//     CardUnderTest.banish();
//
//     TestEngine.passTurn();
//
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Deck: 2,
//         Hand: 1,
//       }),
//     );
//   });
// });
//
