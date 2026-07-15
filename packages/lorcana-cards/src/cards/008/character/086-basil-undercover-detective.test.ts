// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BasilUndercoverDetective,
//   DaleBumbler,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Basil - Undercover Detective", () => {
//   It("INCAPACITATE When you play this character, you may return chosen character to their player's hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: basilUndercoverDetective.cost,
//       Hand: [basilUndercoverDetective],
//       Play: [deweyLovableShowoff],
//     });
//
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.playCard(basilUndercoverDetective);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("hand");
//   });
//
//   It("INTERFERE Whenever this character quests, chosen opponent discards a card at random.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [basilUndercoverDetective],
//       },
//       {
//         Hand: [deweyLovableShowoff, daleBumbler],
//       },
//     );
//
//     Expect(testEngine.getCardsByZone("discard", "player_two").length).toEqual(
//       0,
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(basilUndercoverDetective);
//     Await testEngine.questCard(cardUnderTest);
//
//     Expect(testEngine.getCardsByZone("discard", "player_two").length).toEqual(
//       1,
//     );
//   });
// });
//
