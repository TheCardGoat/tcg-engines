// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// import { ichabodCraneScaredOutOfHisMind } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Ichabod Crane - Scared Out of His Mind", () => {
//   describe("CHILLING TALE - When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
//     it("should allow moving the card to inkwell facedown and exerted when banished", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [ichabodCraneScaredOutOfHisMind],
//         },
//         {
//           play: [deweyLovableShowoff],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         ichabodCraneScaredOutOfHisMind,
//       );
//       const attacker = testEngine.getCardModel(deweyLovableShowoff);
//
//       // Exert Ichabod to allow challenge
//       await testEngine.exertCard(cardUnderTest);
//
//       const initialInkwellCount =
//         testEngine.getZonesCardCount("player_one").inkwell;
//
//       // Opponent challenges and banishes Ichabod
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Verify Ichabod was banished
//       expect(cardUnderTest.zone).toBe("discard");
//
//       // Change back to player_one to resolve the triggered ability
//       await testEngine.changeActivePlayer("player_one");
//
//       // Accept the optional trigger to move to inkwell
//       await testEngine.acceptOptionalLayer();
//
//       // Verify the card moved to inkwell
//       expect(cardUnderTest.zone).toBe("inkwell");
//       expect(cardUnderTest.meta.exerted).toBe(true);
//
//       const finalInkwellCount =
//         testEngine.getZonesCardCount("player_one").inkwell;
//       expect(finalInkwellCount).toBe(initialInkwellCount + 1);
//     });
//
//     it("should be optional - can decline and leave in discard", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [ichabodCraneScaredOutOfHisMind],
//         },
//         {
//           play: [deweyLovableShowoff],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         ichabodCraneScaredOutOfHisMind,
//       );
//       const attacker = testEngine.getCardModel(deweyLovableShowoff);
//
//       await testEngine.exertCard(cardUnderTest);
//
//       const initialInkwellCount =
//         testEngine.getZonesCardCount("player_one").inkwell;
//
//       // Opponent challenges and banishes Ichabod
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the triggered ability
//       await testEngine.changeActivePlayer("player_one");
//
//       // Decline the optional trigger
//       await testEngine.skipTopOfStack();
//
//       // Verify the card stayed in discard
//       expect(cardUnderTest.zone).toBe("discard");
//
//       const finalInkwellCount =
//         testEngine.getZonesCardCount("player_one").inkwell;
//       expect(finalInkwellCount).toBe(initialInkwellCount);
//     });
//
//     it("should trigger when banished via direct banish effect", async () => {
//       const testEngine = new TestEngine({
//         play: [ichabodCraneScaredOutOfHisMind],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         ichabodCraneScaredOutOfHisMind,
//       );
//
//       const initialInkwellCount =
//         testEngine.getZonesCardCount("player_one").inkwell;
//
//       // Banish Ichabod directly
//       cardUnderTest.banish();
//
//       // Verify Ichabod was banished
//       expect(cardUnderTest.zone).toBe("discard");
//
//       // Accept the optional trigger
//       await testEngine.acceptOptionalLayer();
//
//       // Verify the card moved to inkwell
//       expect(cardUnderTest.zone).toBe("inkwell");
//       expect(cardUnderTest.meta.exerted).toBe(true);
//
//       const finalInkwellCount =
//         testEngine.getZonesCardCount("player_one").inkwell;
//       expect(finalInkwellCount).toBe(initialInkwellCount + 1);
//     });
//   });
// });
//
