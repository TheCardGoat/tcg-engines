// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { archimedesExceptionalOwl } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { lightTheFuse } from "../../008";
//
// Describe("Archimedes - Exceptional Owl", () => {
//   It("LEARN MORE Every time this character is targeted by an action or ability of an opposing person, you may draw 1 card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [archimedesExceptionalOwl],
//       },
//       {
//         Inkwell: lightTheFuse.cost,
//         Hand: [lightTheFuse],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(archimedesExceptionalOwl);
//     Const actionCard = testEngine.getCardModel(lightTheFuse);
//
//     TestEngine.passTurn();
//     TestEngine.playCard(actionCard);
//     Await testEngine.resolveTopOfStack({ targets: [cardUnderTest] });
//
//     Expect(cardUnderTest.damage).toBe(0);
//     Expect(testEngine.getCardsByZone("hand", "player_one").length).toBe(1);
//   });
// });
//
