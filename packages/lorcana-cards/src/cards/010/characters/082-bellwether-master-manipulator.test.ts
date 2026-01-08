// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { bellwetherMasterManipulator } from "./082-bellwether-master-manipulator";
//
// describe("Bellwether - Master Manipulator", () => {
//   describe("VENDETTA - Basic Functionality", () => {
//     it.skip("puts 1 damage counter on each opposing character when challenged and banished", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [bellwetherMasterManipulator],
//         },
//         {
//           play: [bellwetherMasterManipulator, bellwetherMasterManipulator],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         bellwetherMasterManipulator,
//         0,
//       );
//       const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//       const target2 = testEngine.getCardModel(bellwetherMasterManipulator, 2);
//
//       expect(cardUnderTest.zone).toBe("play");
//       expect(attacker.damage).toBe(0);
//       expect(target2.damage).toBe(0);
//
//       // Exert defender to allow challenge
//       await testEngine.exertCard(cardUnderTest);
//
//       // Opponent challenges and banishes Bellwether
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability (no targets needed, targets all opposing characters automatically)
//       await testEngine.resolveTopOfStack({});
//
//       // Bellwether should be banished
//       expect(cardUnderTest.zone).toBe("discard");
//
//       // Attacker should also be banished from the challenge
//       expect(attacker.zone).toBe("discard");
//       // Only target2 (the other opposing character still in play) should have 1 damage
//       expect(target2.damage).toBe(1);
//     });
//
//     it("triggers even when all opposing characters are banished in the challenge", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [bellwetherMasterManipulator],
//         },
//         {
//           play: [bellwetherMasterManipulator],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         bellwetherMasterManipulator,
//         0,
//       );
//       const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//
//       expect(attacker.damage).toBe(0);
//
//       // Exert defender to allow challenge
//       await testEngine.exertCard(cardUnderTest);
//
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability (no valid targets since attacker is also banished)
//       await testEngine.resolveTopOfStack({});
//
//       expect(cardUnderTest.zone).toBe("discard");
//       // Attacker should also be banished from the challenge (no characters left to damage)
//       expect(attacker.zone).toBe("discard");
//     });
//
//     it.skip("affects all opposing characters in play", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [bellwetherMasterManipulator],
//         },
//         {
//           play: [
//             bellwetherMasterManipulator,
//             bellwetherMasterManipulator,
//             bellwetherMasterManipulator,
//           ],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         bellwetherMasterManipulator,
//         0,
//       );
//       const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//       const target2 = testEngine.getCardModel(bellwetherMasterManipulator, 2);
//       const target3 = testEngine.getCardModel(bellwetherMasterManipulator, 3);
//
//       // Exert defender to allow challenge
//       await testEngine.exertCard(cardUnderTest);
//
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability
//       await testEngine.resolveTopOfStack({});
//
//       expect(cardUnderTest.zone).toBe("discard");
//       // Attacker should be banished from the challenge
//       expect(attacker.zone).toBe("discard");
//       // The other two opposing characters should each have 1 damage
//       expect(target2.damage).toBe(1);
//       expect(target3.damage).toBe(1);
//     });
//   });
//
//   describe("VENDETTA - Does Not Affect Own Characters", () => {
//     it("only damages opposing characters, not own characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [bellwetherMasterManipulator, bellwetherMasterManipulator],
//         },
//         {
//           play: [bellwetherMasterManipulator],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         bellwetherMasterManipulator,
//         0,
//       );
//       const ownCharacter = testEngine.getCardModel(
//         bellwetherMasterManipulator,
//         1,
//       );
//       const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 2);
//
//       expect(ownCharacter.damage).toBe(0);
//       expect(attacker.damage).toBe(0);
//
//       // Exert defender to allow challenge
//       await testEngine.exertCard(cardUnderTest);
//
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability
//       await testEngine.resolveTopOfStack({});
//
//       expect(cardUnderTest.zone).toBe("discard");
//       // Own character should not be damaged
//       expect(ownCharacter.damage).toBe(0);
//       // Attacker should be banished from the challenge (no damage from VENDETTA)
//       expect(attacker.zone).toBe("discard");
//     });
//   });
//
//   describe("VENDETTA - Edge Cases", () => {
//     it("damages all other opposing characters when attacker is also banished in the challenge", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [bellwetherMasterManipulator],
//         },
//         {
//           play: [
//             bellwetherMasterManipulator,
//             bellwetherMasterManipulator,
//             bellwetherMasterManipulator,
//           ],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         bellwetherMasterManipulator,
//         0,
//       );
//       const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//       const target2 = testEngine.getCardModel(bellwetherMasterManipulator, 2);
//       const target3 = testEngine.getCardModel(bellwetherMasterManipulator, 3);
//
//       expect(cardUnderTest.zone).toBe("play");
//       expect(attacker.zone).toBe("play");
//       expect(target2.zone).toBe("play");
//       expect(target3.zone).toBe("play");
//       expect(target2.damage).toBe(0);
//       expect(target3.damage).toBe(0);
//
//       // Exert defender to allow challenge
//       await testEngine.exertCard(cardUnderTest);
//
//       // Opponent challenges and both characters are banished (3 strength vs 3 willpower each)
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability
//       await testEngine.resolveTopOfStack({});
//
//       // Both Bellwether and attacker should be banished from the challenge
//       expect(cardUnderTest.zone).toBe("discard");
//       expect(attacker.zone).toBe("discard");
//
//       // The other two opposing characters should each have 1 damage from VENDETTA
//       // (VENDETTA triggers only once when Bellwether as defender is banished)
//       expect(target2.damage).toBe(1);
//       expect(target3.damage).toBe(1);
//     });
//
//     it.skip("damages surviving opposing characters that were already damaged", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [bellwetherMasterManipulator],
//         },
//         {
//           play: [bellwetherMasterManipulator, bellwetherMasterManipulator],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         bellwetherMasterManipulator,
//         0,
//       );
//       const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//       const target2 = testEngine.getCardModel(bellwetherMasterManipulator, 2);
//
//       // Pre-damage target2
//       target2.updateCardDamage(1, "add");
//       expect(target2.damage).toBe(1);
//
//       // Exert defender to allow challenge
//       await testEngine.exertCard(cardUnderTest);
//
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability
//       await testEngine.resolveTopOfStack({});
//
//       expect(cardUnderTest.zone).toBe("discard");
//       // Attacker should be banished from the challenge
//       expect(attacker.zone).toBe("discard");
//       // Should add 1 more damage to already damaged character (1 + 1 = 2)
//       expect(target2.damage).toBe(2);
//     });
//
//     it("can banish characters if damage exceeds willpower", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [bellwetherMasterManipulator],
//         },
//         {
//           play: [bellwetherMasterManipulator],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         bellwetherMasterManipulator,
//         0,
//       );
//       const attacker = testEngine.getCardModel(bellwetherMasterManipulator, 1);
//
//       // Pre-damage attacker to 2 (willpower is 3)
//       attacker.updateCardDamage(2, "add");
//       expect(attacker.damage).toBe(2);
//
//       // Exert defender to allow challenge
//       await testEngine.exertCard(cardUnderTest);
//
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Change back to player_one to resolve the ability
//       await testEngine.changeActivePlayer("player_one");
//       // Resolve the triggered ability
//       await testEngine.resolveTopOfStack({});
//
//       expect(cardUnderTest.zone).toBe("discard");
//       // Attacker should be banished (2 + 1 = 3 damage on 3 willpower)
//       expect(attacker.zone).toBe("discard");
//     });
//   });
// });
//
