// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   aliceClumsyAsCanBe,
//   daleBumbler,
//   deweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Alice - Clumsy as Can Be", () => {
//   it("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Alice.)", async () => {
//     const testEngine = new TestEngine({
//       play: [aliceClumsyAsCanBe],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(aliceClumsyAsCanBe);
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it("ACCIDENT PRONE Whenever this character quests, put 1 damage counter on each other character.", async () => {
//     const testEngine = new TestEngine(
//       {
//         play: [aliceClumsyAsCanBe],
//       },
//       {
//         play: [deweyLovableShowoff, daleBumbler],
//       },
//     );
//
//     const cardUnderTest = testEngine.getCardModel(aliceClumsyAsCanBe);
//     const target1 = testEngine.getCardModel(deweyLovableShowoff);
//     const target2 = testEngine.getCardModel(daleBumbler);
//
//     expect(target1.damage).toEqual(0);
//     expect(target2.damage).toEqual(0);
//
//     await testEngine.questCard(cardUnderTest);
//     // await testEngine.acceptOptionalLayer();
//     // await testEngine.resolveTopOfStack({targets: [target]});
//
//     expect(target1.damage).toEqual(1);
//     expect(target2.damage).toEqual(1);
//     expect(cardUnderTest.damage).toEqual(0);
//   });
// });
//
