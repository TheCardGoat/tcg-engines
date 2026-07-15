// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { bellwetherMasterManipulator } from "./082-bellwether-master-manipulator";
//
// Describe("Bellwether - Master Manipulator", () => {
//   Describe("VENDETTA - Basic Functionality", () => {
//     It.skip("puts 1 damage counter on each opposing character when challenged and banished", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [bellwetherMasterManipulator],
//         },
//         {
//           Play: [bellwetherMasterManipulator, bellwetherMasterManipulator],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         BellwetherMasterManipulator,
//         0,
//       );
//       Const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//       Const target2 = testEngine.getCardModel(bellwetherMasterManipulator, 2);
//
//       Expect(cardUnderTest.zone).toBe("play");
//       Expect(attacker.damage).toBe(0);
//       Expect(target2.damage).toBe(0);
//
//       // Exert defender to allow challenge
//       Await testEngine.exertCard(cardUnderTest);
//
//       // Opponent challenges and banishes Bellwether
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       Await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability (no targets needed, targets all opposing characters automatically)
//       Await testEngine.resolveTopOfStack({});
//
//       // Bellwether should be banished
//       Expect(cardUnderTest.zone).toBe("discard");
//
//       // Attacker should also be banished from the challenge
//       Expect(attacker.zone).toBe("discard");
//       // Only target2 (the other opposing character still in play) should have 1 damage
//       Expect(target2.damage).toBe(1);
//     });
//
//     It("triggers even when all opposing characters are banished in the challenge", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [bellwetherMasterManipulator],
//         },
//         {
//           Play: [bellwetherMasterManipulator],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         BellwetherMasterManipulator,
//         0,
//       );
//       Const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//
//       Expect(attacker.damage).toBe(0);
//
//       // Exert defender to allow challenge
//       Await testEngine.exertCard(cardUnderTest);
//
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       Await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability (no valid targets since attacker is also banished)
//       Await testEngine.resolveTopOfStack({});
//
//       Expect(cardUnderTest.zone).toBe("discard");
//       // Attacker should also be banished from the challenge (no characters left to damage)
//       Expect(attacker.zone).toBe("discard");
//     });
//
//     It.skip("affects all opposing characters in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [bellwetherMasterManipulator],
//         },
//         {
//           Play: [
//             BellwetherMasterManipulator,
//             BellwetherMasterManipulator,
//             BellwetherMasterManipulator,
//           ],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         BellwetherMasterManipulator,
//         0,
//       );
//       Const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//       Const target2 = testEngine.getCardModel(bellwetherMasterManipulator, 2);
//       Const target3 = testEngine.getCardModel(bellwetherMasterManipulator, 3);
//
//       // Exert defender to allow challenge
//       Await testEngine.exertCard(cardUnderTest);
//
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       Await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability
//       Await testEngine.resolveTopOfStack({});
//
//       Expect(cardUnderTest.zone).toBe("discard");
//       // Attacker should be banished from the challenge
//       Expect(attacker.zone).toBe("discard");
//       // The other two opposing characters should each have 1 damage
//       Expect(target2.damage).toBe(1);
//       Expect(target3.damage).toBe(1);
//     });
//   });
//
//   Describe("VENDETTA - Does Not Affect Own Characters", () => {
//     It("only damages opposing characters, not own characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [bellwetherMasterManipulator, bellwetherMasterManipulator],
//         },
//         {
//           Play: [bellwetherMasterManipulator],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         BellwetherMasterManipulator,
//         0,
//       );
//       Const ownCharacter = testEngine.getCardModel(
//         BellwetherMasterManipulator,
//         1,
//       );
//       Const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 2);
//
//       Expect(ownCharacter.damage).toBe(0);
//       Expect(attacker.damage).toBe(0);
//
//       // Exert defender to allow challenge
//       Await testEngine.exertCard(cardUnderTest);
//
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       Await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability
//       Await testEngine.resolveTopOfStack({});
//
//       Expect(cardUnderTest.zone).toBe("discard");
//       // Own character should not be damaged
//       Expect(ownCharacter.damage).toBe(0);
//       // Attacker should be banished from the challenge (no damage from VENDETTA)
//       Expect(attacker.zone).toBe("discard");
//     });
//   });
//
//   Describe("VENDETTA - Edge Cases", () => {
//     It("damages all other opposing characters when attacker is also banished in the challenge", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [bellwetherMasterManipulator],
//         },
//         {
//           Play: [
//             BellwetherMasterManipulator,
//             BellwetherMasterManipulator,
//             BellwetherMasterManipulator,
//           ],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         BellwetherMasterManipulator,
//         0,
//       );
//       Const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//       Const target2 = testEngine.getCardModel(bellwetherMasterManipulator, 2);
//       Const target3 = testEngine.getCardModel(bellwetherMasterManipulator, 3);
//
//       Expect(cardUnderTest.zone).toBe("play");
//       Expect(attacker.zone).toBe("play");
//       Expect(target2.zone).toBe("play");
//       Expect(target3.zone).toBe("play");
//       Expect(target2.damage).toBe(0);
//       Expect(target3.damage).toBe(0);
//
//       // Exert defender to allow challenge
//       Await testEngine.exertCard(cardUnderTest);
//
//       // Opponent challenges and both characters are banished (3 strength vs 3 willpower each)
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       Await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability
//       Await testEngine.resolveTopOfStack({});
//
//       // Both Bellwether and attacker should be banished from the challenge
//       Expect(cardUnderTest.zone).toBe("discard");
//       Expect(attacker.zone).toBe("discard");
//
//       // The other two opposing characters should each have 1 damage from VENDETTA
//       // (VENDETTA triggers only once when Bellwether as defender is banished)
//       Expect(target2.damage).toBe(1);
//       Expect(target3.damage).toBe(1);
//     });
//
//     It.skip("damages surviving opposing characters that were already damaged", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [bellwetherMasterManipulator],
//         },
//         {
//           Play: [bellwetherMasterManipulator, bellwetherMasterManipulator],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         BellwetherMasterManipulator,
//         0,
//       );
//       Const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//       Const target2 = testEngine.getCardModel(bellwetherMasterManipulator, 2);
//
//       // Pre-damage target2
//       Target2.updateCardDamage(1, "add");
//       Expect(target2.damage).toBe(1);
//
//       // Exert defender to allow challenge
//       Await testEngine.exertCard(cardUnderTest);
//
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       Await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability
//       Await testEngine.resolveTopOfStack({});
//
//       Expect(cardUnderTest.zone).toBe("discard");
//       // Attacker should be banished from the challenge
//       Expect(attacker.zone).toBe("discard");
//       // Should add 1 more damage to already damaged character (1 + 1 = 2)
//       Expect(target2.damage).toBe(2);
//     });
//
//     It("can banish characters if damage exceeds willpower", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [bellwetherMasterManipulator],
//         },
//         {
//           Play: [bellwetherMasterManipulator],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         BellwetherMasterManipulator,
//         0,
//       );
//       Const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//
//       // Pre-damage attacker to 2 (willpower is 3)
//       Attacker.updateCardDamage(2, "add");
//       Expect(attacker.damage).toBe(2);
//
//       // Exert defender to allow challenge
//       Await testEngine.exertCard(cardUnderTest);
//
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       Await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability
//       Await testEngine.resolveTopOfStack({});
//
//       Expect(cardUnderTest.zone).toBe("discard");
//       // Attacker should be banished (2 + 1 = 3 damage on 3 willpower)
//       Expect(attacker.zone).toBe("discard");
//     });
//   });
// });
//
