// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AliceClumsyAsCanBe,
//   DaleBumbler,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Alice - Clumsy as Can Be", () => {
//   It("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Alice.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [aliceClumsyAsCanBe],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(aliceClumsyAsCanBe);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("ACCIDENT PRONE Whenever this character quests, put 1 damage counter on each other character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [aliceClumsyAsCanBe],
//       },
//       {
//         Play: [deweyLovableShowoff, daleBumbler],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(aliceClumsyAsCanBe);
//     Const target1 = testEngine.getCardModel(deweyLovableShowoff);
//     Const target2 = testEngine.getCardModel(daleBumbler);
//
//     Expect(target1.damage).toEqual(0);
//     Expect(target2.damage).toEqual(0);
//
//     Await testEngine.questCard(cardUnderTest);
//     // await testEngine.acceptOptionalLayer();
//     // await testEngine.resolveTopOfStack({targets: [target]});
//
//     Expect(target1.damage).toEqual(1);
//     Expect(target2.damage).toEqual(1);
//     Expect(cardUnderTest.damage).toEqual(0);
//   });
// });
//
