// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   OutOfOrder,
//   YzmaChangedIntoAKitten,
// } from "@lorcanito/lorcana-engine/cards/007/";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Yzma - Changed into a Kitten", () => {
//   Describe("I WON When this character is banished, if you have more cards in hand than any opponent, you may return this character to your hand.", () => {
//     It("should NOT return to hand when banished if player does not have more cards in hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Hand: [outOfOrder],
//           Inkwell: outOfOrder.cost,
//         },
//         {
//           Play: [yzmaChangedIntoAKitten],
//         },
//       );
//
//       Await testEngine.playCard(outOfOrder, {
//         Targets: [yzmaChangedIntoAKitten],
//       });
//
//       Expect(testEngine.stackLayers).toHaveLength(0);
//       Expect(testEngine.getCardModel(yzmaChangedIntoAKitten).zone).toBe(
//         "discard",
//       );
//     });
//
//     It("should return to hand when banished if player has more cards in hand", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Hand: [outOfOrder],
//           Inkwell: outOfOrder.cost,
//         },
//         {
//           Play: [yzmaChangedIntoAKitten],
//           Hand: 3,
//         },
//       );
//
//       Await testEngine.playCard(
//         OutOfOrder,
//         {
//           Targets: [yzmaChangedIntoAKitten],
//         },
//         True,
//       );
//
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveOptionalAbility();
//       Expect(testEngine.getCardModel(yzmaChangedIntoAKitten).zone).toBe("hand");
//     });
//   });
// });
//
