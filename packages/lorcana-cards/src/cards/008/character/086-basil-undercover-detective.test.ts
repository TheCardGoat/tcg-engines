// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   basilUndercoverDetective,
//   daleBumbler,
//   deweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Basil - Undercover Detective", () => {
//   it("INCAPACITATE When you play this character, you may return chosen character to their player's hand.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: basilUndercoverDetective.cost,
//       hand: [basilUndercoverDetective],
//       play: [deweyLovableShowoff],
//     });
//
//     const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     await testEngine.playCard(basilUndercoverDetective);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toEqual("hand");
//   });
//
//   it("INTERFERE Whenever this character quests, chosen opponent discards a card at random.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [basilUndercoverDetective],
//       },
//       {
//         hand: [deweyLovableShowoff, daleBumbler],
//       },
//     );
//
//     expect(testEngine.getCardsByZone("discard", "player_two").length).toEqual(
//       0,
//     );
//
//     const cardUnderTest = testEngine.getCardModel(basilUndercoverDetective);
//     await testEngine.questCard(cardUnderTest);
//
//     expect(testEngine.getCardsByZone("discard", "player_two").length).toEqual(
//       1,
//     );
//   });
// });
//
