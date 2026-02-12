// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/169-pawpsicle";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { aliceAccidentallyAdrift } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Alice - Accidentally Adrift", () => {
//   It("WASHED AWAY When you play this character, you may put chosen item into its player's inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: aliceAccidentallyAdrift.cost,
//       Hand: [aliceAccidentallyAdrift],
//       Play: [pawpsicle],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(aliceAccidentallyAdrift);
//     Const target = testEngine.getCardModel(pawpsicle);
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("inkwell");
//   });
//
//   It("MAKING WAVES Whenever this character quests, chosen opposing character gets -2 {S} this turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [aliceAccidentallyAdrift],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(aliceAccidentallyAdrift);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.questCard(cardUnderTest);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toEqual(deweyLovableShowoff.strength - 2);
//   });
// });
//
