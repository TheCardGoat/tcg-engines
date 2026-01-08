// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008/index";
// import {
//   duckworthGhostButler,
//   minnieMouseAmethystChampion,
//   nibsLostBoy,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Minnie Mouse - Amethyst Champion", () => {
//   describe("MYSTICAL BALANCE - Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.", () => {
//     it("should trigger and draw a card when another Amethyst character is banished in a challenge", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 10,
//           deck: 5,
//           play: [minnieMouseAmethystChampion, duckworthGhostButler],
//         },
//         {
//           play: [deweyLovableShowoff],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         minnieMouseAmethystChampion,
//       );
//       const amethystAlly = testEngine.getCardModel(duckworthGhostButler);
//       const attacker = testEngine.getCardModel(deweyLovableShowoff);
//
//       // Exert ally to make it available for challenge
//       await testEngine.exertCard(amethystAlly);
//       expect(amethystAlly.meta.exerted).toBe(true);
//
//       const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//
//       // Opponent challenges our Amethyst character
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: amethystAlly });
//
//       // Verify the Amethyst character was banished
//       expect(amethystAlly.zone).toBe("discard");
//
//       // Change back to player_one to resolve the ability
//       await testEngine.changeActivePlayer("player_one");
//
//       // Accept the optional draw trigger
//       await testEngine.acceptOptionalLayer();
//
//       // Verify we drew a card
//       const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(finalHandSize).toBe(initialHandSize + 1);
//     });
//
//     it("should NOT trigger when Minnie Mouse herself is banished", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 10,
//           deck: 5,
//           play: [minnieMouseAmethystChampion],
//         },
//         {
//           play: [deweyLovableShowoff],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         minnieMouseAmethystChampion,
//       );
//       const attacker = testEngine.getCardModel(deweyLovableShowoff);
//
//       await testEngine.exertCard(cardUnderTest);
//
//       const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//
//       // Opponent challenges Minnie Mouse herself
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Verify Minnie was banished
//       expect(cardUnderTest.zone).toBe("discard");
//
//       // No trigger should fire
//       expect(testEngine.stackLayers.length).toBe(0);
//
//       // Hand size should not change
//       const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(finalHandSize).toBe(initialHandSize);
//     });
//
//     it("should NOT trigger when a non-Amethyst character is banished", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 10,
//           deck: 5,
//           play: [minnieMouseAmethystChampion, deweyLovableShowoff], // Dewey is not Amethyst
//         },
//         {
//           play: [duckworthGhostButler], // Duckworth has 3 strength, will banish Dewey with 2 willpower (if Dewey gets damaged)
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(
//         minnieMouseAmethystChampion,
//       );
//       const nonAmethystAlly = testEngine.getCardModel(deweyLovableShowoff);
//       const attacker = testEngine.getCardModel(duckworthGhostButler);
//
//       // Damage Dewey so he can be banished by Duckworth (3 strength)
//       nonAmethystAlly.updateCardDamage(1);
//       await testEngine.exertCard(nonAmethystAlly);
//
//       const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//
//       // Opponent challenges our non-Amethyst character
//       await testEngine.passTurn();
//       await testEngine.challenge({ attacker, defender: nonAmethystAlly });
//
//       // Verify the non-Amethyst character was banished
//       expect(nonAmethystAlly.zone).toBe("discard");
//
//       // No trigger should fire (Minnie doesn't care about non-Amethyst characters)
//       expect(testEngine.stackLayers.length).toBe(0);
//
//       // Hand size should not change
//       const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(finalHandSize).toBe(initialHandSize);
//     });
//
//     it("should NOT trigger when an Amethyst character is banished outside of a challenge", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 10,
//         deck: 5,
//         play: [minnieMouseAmethystChampion, duckworthGhostButler],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         minnieMouseAmethystChampion,
//       );
//       const amethystAlly = testEngine.getCardModel(duckworthGhostButler);
//
//       const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//
//       // Banish the Amethyst character directly (not in a challenge)
//       amethystAlly.banish();
//
//       // Verify the Amethyst character was banished
//       expect(amethystAlly.zone).toBe("discard");
//
//       // No trigger should fire
//       expect(testEngine.stackLayers.length).toBe(0);
//
//       // Hand size should not change
//       const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       expect(finalHandSize).toBe(initialHandSize);
//     });
//   });
// });
//
