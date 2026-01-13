// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   docBoldKnight,
//   snowWhiteFairhearted,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Snow White - Fair-Hearted", () => {
//   describe("NATURAL LEADER  This character gains **Resist** +1 for each other Knight character you have in play. _(Damage dealt to this character is reduced by 1 for each other Knight.)_", () => {
//     it("gets Resist +0 if no other Knight is in play beside Snow White ", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [snowWhiteFairhearted],
//         },
//         {
//           play: [goonsMaleficent],
//           deck: 2,
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(snowWhiteFairhearted);
//       testEngine.tapCard(cardUnderTest);
//
//       await testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       await testEngine.challenge({
//         attacker: goonsMaleficent,
//         defender: snowWhiteFairhearted,
//       });
//
//       // This check fails as resist 0 counts as having resist
//       // expect(cardUnderTest.hasResist).toBe(false);
//       expect(cardUnderTest.damage).toBe(2);
//     });
//
//     it("gets Resist +1 if exactly 1 other Knight is in play beside Snow White", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [snowWhiteFairhearted, docBoldKnight],
//         },
//         {
//           play: [goonsMaleficent],
//           deck: 2,
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(snowWhiteFairhearted);
//       testEngine.tapCard(cardUnderTest);
//
//       await testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       await testEngine.challenge({
//         attacker: goonsMaleficent,
//         defender: snowWhiteFairhearted,
//       });
//
//       expect(cardUnderTest.hasResist).toBe(true);
//       expect(cardUnderTest.damage).toBe(1);
//     });
//
//     it("gets Resist +2 if 2 other Knight are in play beside Snow White", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [
//             snowWhiteFairhearted,
//             docBoldKnight,
//             docBoldKnight,
//             docBoldKnight,
//           ],
//         },
//         {
//           play: [goonsMaleficent],
//           deck: 2,
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(snowWhiteFairhearted);
//       testEngine.tapCard(cardUnderTest);
//
//       await testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       await testEngine.challenge({
//         attacker: goonsMaleficent,
//         defender: snowWhiteFairhearted,
//       });
//
//       expect(cardUnderTest.hasResist).toBe(true);
//       expect(cardUnderTest.damage).toBe(0);
//     });
//   });
// });
//
