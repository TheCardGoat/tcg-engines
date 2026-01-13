// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   aladdinHeroicOutlaw,
//   arielOnHumanLegs,
//   beastWolfbane,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { goofyGalumphingGumshoe } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Goofy - Galumphing Gumshoe", () => {
//   describe("Shift 5", () => {
//     it("has shift ability", () => {
//       const testEngine = new TestEngine({
//         play: [goofyGalumphingGumshoe],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(goofyGalumphingGumshoe);
//       expect(cardUnderTest.hasShift).toBe(true);
//     });
//   });
//
//   describe("HOT PURSUIT - When you play this character and whenever he quests, each opposing character gets -1 strength until the start of your next turn.", () => {
//     it("triggers when you play the character", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: goofyGalumphingGumshoe.cost,
//           hand: [goofyGalumphingGumshoe],
//         },
//         {
//           play: [aladdinHeroicOutlaw, arielOnHumanLegs],
//         },
//       );
//
//       const opponentChar1 = testEngine.getByZoneAndId(
//         "play",
//         aladdinHeroicOutlaw.id,
//         "player_two",
//       );
//       const opponentChar2 = testEngine.getByZoneAndId(
//         "play",
//         arielOnHumanLegs.id,
//         "player_two",
//       );
//
//       const initialStrength1 = opponentChar1.strength;
//       const initialStrength2 = opponentChar2.strength;
//
//       await testEngine.playCard(goofyGalumphingGumshoe);
//
//       // Characters should have reduced strength immediately
//       expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       // During opponent's turn, they should still have -1 strength
//       expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//
//       // Pass turn back to player one (start of your next turn)
//       testEngine.passTurn();
//
//       // Effect should wear off at start of your next turn
//       expect(opponentChar1.strength).toBe(initialStrength1);
//       expect(opponentChar2.strength).toBe(initialStrength2);
//     });
//
//     it("triggers when the character quests", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [goofyGalumphingGumshoe],
//         },
//         {
//           play: [aladdinHeroicOutlaw, arielOnHumanLegs],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(goofyGalumphingGumshoe);
//       const opponentChar1 = testEngine.getByZoneAndId(
//         "play",
//         aladdinHeroicOutlaw.id,
//         "player_two",
//       );
//       const opponentChar2 = testEngine.getByZoneAndId(
//         "play",
//         arielOnHumanLegs.id,
//         "player_two",
//       );
//
//       const initialStrength1 = opponentChar1.strength;
//       const initialStrength2 = opponentChar2.strength;
//
//       cardUnderTest.quest();
//
//       // Characters should have reduced strength immediately
//       expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       // During opponent's turn, they should still have -1 strength
//       expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//
//       // Pass turn back to player one
//       testEngine.passTurn();
//
//       // Effect should wear off at start of your next turn
//       expect(opponentChar1.strength).toBe(initialStrength1);
//       expect(opponentChar2.strength).toBe(initialStrength2);
//     });
//
//     it("affects ALL opposing characters in play", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: goofyGalumphingGumshoe.cost,
//           hand: [goofyGalumphingGumshoe],
//         },
//         {
//           play: [aladdinHeroicOutlaw, arielOnHumanLegs, beastWolfbane],
//         },
//       );
//
//       const opponentChar1 = testEngine.getByZoneAndId(
//         "play",
//         aladdinHeroicOutlaw.id,
//         "player_two",
//       );
//       const opponentChar2 = testEngine.getByZoneAndId(
//         "play",
//         arielOnHumanLegs.id,
//         "player_two",
//       );
//       const opponentChar3 = testEngine.getByZoneAndId(
//         "play",
//         beastWolfbane.id,
//         "player_two",
//       );
//       const initialStrength1 = opponentChar1.strength;
//       const initialStrength2 = opponentChar2.strength;
//       const initialStrength3 = opponentChar3.strength;
//
//       await testEngine.playCard(goofyGalumphingGumshoe);
//
//       // All characters should have -1 strength immediately
//       expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//       expect(opponentChar3.strength).toBe(initialStrength3 - 1);
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//
//       // All characters should still have -1 strength
//       expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//       expect(opponentChar3.strength).toBe(initialStrength3 - 1);
//
//       // Pass turn back to player one (start of your next turn)
//       testEngine.passTurn();
//
//       // Effect should wear off for all characters
//       expect(opponentChar1.strength).toBe(initialStrength1);
//       expect(opponentChar2.strength).toBe(initialStrength2);
//       expect(opponentChar3.strength).toBe(initialStrength3);
//     });
//
//     it("applies effect each time Goofy quests", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [goofyGalumphingGumshoe],
//         },
//         {
//           play: [aladdinHeroicOutlaw],
//         },
//       );
//
//       const cardUnderTest = testEngine.getCardModel(goofyGalumphingGumshoe);
//       const opponentChar = testEngine.getByZoneAndId(
//         "play",
//         aladdinHeroicOutlaw.id,
//         "player_two",
//       );
//       const initialStrength = opponentChar.strength;
//
//       // First quest
//       cardUnderTest.quest();
//       testEngine.passTurn();
//       expect(opponentChar.strength).toBe(initialStrength - 1);
//
//       // Return to player one's turn
//       testEngine.passTurn();
//       expect(opponentChar.strength).toBe(initialStrength);
//
//       // Goofy should be ready at start of turn, quest again
//       expect(cardUnderTest.ready).toBe(true);
//       cardUnderTest.quest();
//       testEngine.passTurn();
//
//       // Effect should apply again
//       expect(opponentChar.strength).toBe(initialStrength - 1);
//     });
//   });
// });
//
