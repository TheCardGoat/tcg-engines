// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { ichabodCraneScaredOutOfHisMind } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Ichabod Crane - Scared Out of His Mind", () => {
//   Describe("CHILLING TALE - When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
//     It("should allow moving the card to inkwell facedown and exerted when banished", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [ichabodCraneScaredOutOfHisMind],
//         },
//         {
//           Play: [deweyLovableShowoff],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         IchabodCraneScaredOutOfHisMind,
//       );
//       Const attacker = testEngine.getCardModel(deweyLovableShowoff);
//
//       // Exert Ichabod to allow challenge
//       Await testEngine.exertCard(cardUnderTest);
//
//       Const initialInkwellCount =
//         TestEngine.getZonesCardCount("player_one").inkwell;
//
//       // Opponent challenges and banishes Ichabod
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Verify Ichabod was banished
//       Expect(cardUnderTest.zone).toBe("discard");
//
//       // Change back to player_one to resolve the triggered ability
//       Await testEngine.changeActivePlayer("player_one");
//
//       // Accept the optional trigger to move to inkwell
//       Await testEngine.acceptOptionalLayer();
//
//       // Verify the card moved to inkwell
//       Expect(cardUnderTest.zone).toBe("inkwell");
//       Expect(cardUnderTest.meta.exerted).toBe(true);
//
//       Const finalInkwellCount =
//         TestEngine.getZonesCardCount("player_one").inkwell;
//       Expect(finalInkwellCount).toBe(initialInkwellCount + 1);
//     });
//
//     It("should be optional - can decline and leave in discard", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [ichabodCraneScaredOutOfHisMind],
//         },
//         {
//           Play: [deweyLovableShowoff],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         IchabodCraneScaredOutOfHisMind,
//       );
//       Const attacker = testEngine.getCardModel(deweyLovableShowoff);
//
//       Await testEngine.exertCard(cardUnderTest);
//
//       Const initialInkwellCount =
//         TestEngine.getZonesCardCount("player_one").inkwell;
//
//       // Opponent challenges and banishes Ichabod
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the triggered ability
//       Await testEngine.changeActivePlayer("player_one");
//
//       // Decline the optional trigger
//       Await testEngine.skipTopOfStack();
//
//       // Verify the card stayed in discard
//       Expect(cardUnderTest.zone).toBe("discard");
//
//       Const finalInkwellCount =
//         TestEngine.getZonesCardCount("player_one").inkwell;
//       Expect(finalInkwellCount).toBe(initialInkwellCount);
//     });
//
//     It("should trigger when banished via direct banish effect", async () => {
//       Const testEngine = new TestEngine({
//         Play: [ichabodCraneScaredOutOfHisMind],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         IchabodCraneScaredOutOfHisMind,
//       );
//
//       Const initialInkwellCount =
//         TestEngine.getZonesCardCount("player_one").inkwell;
//
//       // Banish Ichabod directly
//       CardUnderTest.banish();
//
//       // Verify Ichabod was banished
//       Expect(cardUnderTest.zone).toBe("discard");
//
//       // Accept the optional trigger
//       Await testEngine.acceptOptionalLayer();
//
//       // Verify the card moved to inkwell
//       Expect(cardUnderTest.zone).toBe("inkwell");
//       Expect(cardUnderTest.meta.exerted).toBe(true);
//
//       Const finalInkwellCount =
//         TestEngine.getZonesCardCount("player_one").inkwell;
//       Expect(finalInkwellCount).toBe(initialInkwellCount + 1);
//     });
//   });
// });
//
