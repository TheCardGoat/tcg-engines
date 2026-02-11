// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008/index";
// Import {
//   DuckworthGhostButler,
//   MinnieMouseAmethystChampion,
//   NibsLostBoy,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Minnie Mouse - Amethyst Champion", () => {
//   Describe("MYSTICAL BALANCE - Whenever one of your other Amethyst characters is banished in a challenge, you may draw a card.", () => {
//     It("should trigger and draw a card when another Amethyst character is banished in a challenge", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 10,
//           Deck: 5,
//           Play: [minnieMouseAmethystChampion, duckworthGhostButler],
//         },
//         {
//           Play: [deweyLovableShowoff],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MinnieMouseAmethystChampion,
//       );
//       Const amethystAlly = testEngine.getCardModel(duckworthGhostButler);
//       Const attacker = testEngine.getCardModel(deweyLovableShowoff);
//
//       // Exert ally to make it available for challenge
//       Await testEngine.exertCard(amethystAlly);
//       Expect(amethystAlly.meta.exerted).toBe(true);
//
//       Const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//
//       // Opponent challenges our Amethyst character
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: amethystAlly });
//
//       // Verify the Amethyst character was banished
//       Expect(amethystAlly.zone).toBe("discard");
//
//       // Change back to player_one to resolve the ability
//       Await testEngine.changeActivePlayer("player_one");
//
//       // Accept the optional draw trigger
//       Await testEngine.acceptOptionalLayer();
//
//       // Verify we drew a card
//       Const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(finalHandSize).toBe(initialHandSize + 1);
//     });
//
//     It("should NOT trigger when Minnie Mouse herself is banished", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 10,
//           Deck: 5,
//           Play: [minnieMouseAmethystChampion],
//         },
//         {
//           Play: [deweyLovableShowoff],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MinnieMouseAmethystChampion,
//       );
//       Const attacker = testEngine.getCardModel(deweyLovableShowoff);
//
//       Await testEngine.exertCard(cardUnderTest);
//
//       Const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//
//       // Opponent challenges Minnie Mouse herself
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: cardUnderTest });
//
//       // Verify Minnie was banished
//       Expect(cardUnderTest.zone).toBe("discard");
//
//       // No trigger should fire
//       Expect(testEngine.stackLayers.length).toBe(0);
//
//       // Hand size should not change
//       Const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(finalHandSize).toBe(initialHandSize);
//     });
//
//     It("should NOT trigger when a non-Amethyst character is banished", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 10,
//           Deck: 5,
//           Play: [minnieMouseAmethystChampion, deweyLovableShowoff], // Dewey is not Amethyst
//         },
//         {
//           Play: [duckworthGhostButler], // Duckworth has 3 strength, will banish Dewey with 2 willpower (if Dewey gets damaged)
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MinnieMouseAmethystChampion,
//       );
//       Const nonAmethystAlly = testEngine.getCardModel(deweyLovableShowoff);
//       Const attacker = testEngine.getCardModel(duckworthGhostButler);
//
//       // Damage Dewey so he can be banished by Duckworth (3 strength)
//       NonAmethystAlly.updateCardDamage(1);
//       Await testEngine.exertCard(nonAmethystAlly);
//
//       Const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//
//       // Opponent challenges our non-Amethyst character
//       Await testEngine.passTurn();
//       Await testEngine.challenge({ attacker, defender: nonAmethystAlly });
//
//       // Verify the non-Amethyst character was banished
//       Expect(nonAmethystAlly.zone).toBe("discard");
//
//       // No trigger should fire (Minnie doesn't care about non-Amethyst characters)
//       Expect(testEngine.stackLayers.length).toBe(0);
//
//       // Hand size should not change
//       Const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(finalHandSize).toBe(initialHandSize);
//     });
//
//     It("should NOT trigger when an Amethyst character is banished outside of a challenge", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 10,
//         Deck: 5,
//         Play: [minnieMouseAmethystChampion, duckworthGhostButler],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         MinnieMouseAmethystChampion,
//       );
//       Const amethystAlly = testEngine.getCardModel(duckworthGhostButler);
//
//       Const initialHandSize = testEngine.getZonesCardCount("player_one").hand;
//
//       // Banish the Amethyst character directly (not in a challenge)
//       AmethystAlly.banish();
//
//       // Verify the Amethyst character was banished
//       Expect(amethystAlly.zone).toBe("discard");
//
//       // No trigger should fire
//       Expect(testEngine.stackLayers.length).toBe(0);
//
//       // Hand size should not change
//       Const finalHandSize = testEngine.getZonesCardCount("player_one").hand;
//       Expect(finalHandSize).toBe(initialHandSize);
//     });
//   });
// });
//
