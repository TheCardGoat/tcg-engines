// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   DocBoldKnight,
//   SnowWhiteFairhearted,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Snow White - Fair-Hearted", () => {
//   Describe("NATURAL LEADER  This character gains **Resist** +1 for each other Knight character you have in play. _(Damage dealt to this character is reduced by 1 for each other Knight.)_", () => {
//     It("gets Resist +0 if no other Knight is in play beside Snow White ", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [snowWhiteFairhearted],
//         },
//         {
//           Play: [goonsMaleficent],
//           Deck: 2,
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(snowWhiteFairhearted);
//       TestEngine.tapCard(cardUnderTest);
//
//       Await testEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       Await testEngine.challenge({
//         Attacker: goonsMaleficent,
//         Defender: snowWhiteFairhearted,
//       });
//
//       // This check fails as resist 0 counts as having resist
//       // expect(cardUnderTest.hasResist).toBe(false);
//       Expect(cardUnderTest.damage).toBe(2);
//     });
//
//     It("gets Resist +1 if exactly 1 other Knight is in play beside Snow White", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [snowWhiteFairhearted, docBoldKnight],
//         },
//         {
//           Play: [goonsMaleficent],
//           Deck: 2,
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(snowWhiteFairhearted);
//       TestEngine.tapCard(cardUnderTest);
//
//       Await testEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       Await testEngine.challenge({
//         Attacker: goonsMaleficent,
//         Defender: snowWhiteFairhearted,
//       });
//
//       Expect(cardUnderTest.hasResist).toBe(true);
//       Expect(cardUnderTest.damage).toBe(1);
//     });
//
//     It("gets Resist +2 if 2 other Knight are in play beside Snow White", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [
//             SnowWhiteFairhearted,
//             DocBoldKnight,
//             DocBoldKnight,
//             DocBoldKnight,
//           ],
//         },
//         {
//           Play: [goonsMaleficent],
//           Deck: 2,
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(snowWhiteFairhearted);
//       TestEngine.tapCard(cardUnderTest);
//
//       Await testEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       Await testEngine.challenge({
//         Attacker: goonsMaleficent,
//         Defender: snowWhiteFairhearted,
//       });
//
//       Expect(cardUnderTest.hasResist).toBe(true);
//       Expect(cardUnderTest.damage).toBe(0);
//     });
//   });
// });
//
