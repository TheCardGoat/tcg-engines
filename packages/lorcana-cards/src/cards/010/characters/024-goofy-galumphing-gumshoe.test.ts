// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AladdinHeroicOutlaw,
//   ArielOnHumanLegs,
//   BeastWolfbane,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { goofyGalumphingGumshoe } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goofy - Galumphing Gumshoe", () => {
//   Describe("Shift 5", () => {
//     It("has shift ability", () => {
//       Const testEngine = new TestEngine({
//         Play: [goofyGalumphingGumshoe],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(goofyGalumphingGumshoe);
//       Expect(cardUnderTest.hasShift).toBe(true);
//     });
//   });
//
//   Describe("HOT PURSUIT - When you play this character and whenever he quests, each opposing character gets -1 strength until the start of your next turn.", () => {
//     It("triggers when you play the character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: goofyGalumphingGumshoe.cost,
//           Hand: [goofyGalumphingGumshoe],
//         },
//         {
//           Play: [aladdinHeroicOutlaw, arielOnHumanLegs],
//         },
//       );
//
//       Const opponentChar1 = testEngine.getByZoneAndId(
//         "play",
//         AladdinHeroicOutlaw.id,
//         "player_two",
//       );
//       Const opponentChar2 = testEngine.getByZoneAndId(
//         "play",
//         ArielOnHumanLegs.id,
//         "player_two",
//       );
//
//       Const initialStrength1 = opponentChar1.strength;
//       Const initialStrength2 = opponentChar2.strength;
//
//       Await testEngine.playCard(goofyGalumphingGumshoe);
//
//       // Characters should have reduced strength immediately
//       Expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       Expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       // During opponent's turn, they should still have -1 strength
//       Expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       Expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//
//       // Pass turn back to player one (start of your next turn)
//       TestEngine.passTurn();
//
//       // Effect should wear off at start of your next turn
//       Expect(opponentChar1.strength).toBe(initialStrength1);
//       Expect(opponentChar2.strength).toBe(initialStrength2);
//     });
//
//     It("triggers when the character quests", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [goofyGalumphingGumshoe],
//         },
//         {
//           Play: [aladdinHeroicOutlaw, arielOnHumanLegs],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(goofyGalumphingGumshoe);
//       Const opponentChar1 = testEngine.getByZoneAndId(
//         "play",
//         AladdinHeroicOutlaw.id,
//         "player_two",
//       );
//       Const opponentChar2 = testEngine.getByZoneAndId(
//         "play",
//         ArielOnHumanLegs.id,
//         "player_two",
//       );
//
//       Const initialStrength1 = opponentChar1.strength;
//       Const initialStrength2 = opponentChar2.strength;
//
//       CardUnderTest.quest();
//
//       // Characters should have reduced strength immediately
//       Expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       Expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       // During opponent's turn, they should still have -1 strength
//       Expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       Expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//
//       // Pass turn back to player one
//       TestEngine.passTurn();
//
//       // Effect should wear off at start of your next turn
//       Expect(opponentChar1.strength).toBe(initialStrength1);
//       Expect(opponentChar2.strength).toBe(initialStrength2);
//     });
//
//     It("affects ALL opposing characters in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: goofyGalumphingGumshoe.cost,
//           Hand: [goofyGalumphingGumshoe],
//         },
//         {
//           Play: [aladdinHeroicOutlaw, arielOnHumanLegs, beastWolfbane],
//         },
//       );
//
//       Const opponentChar1 = testEngine.getByZoneAndId(
//         "play",
//         AladdinHeroicOutlaw.id,
//         "player_two",
//       );
//       Const opponentChar2 = testEngine.getByZoneAndId(
//         "play",
//         ArielOnHumanLegs.id,
//         "player_two",
//       );
//       Const opponentChar3 = testEngine.getByZoneAndId(
//         "play",
//         BeastWolfbane.id,
//         "player_two",
//       );
//       Const initialStrength1 = opponentChar1.strength;
//       Const initialStrength2 = opponentChar2.strength;
//       Const initialStrength3 = opponentChar3.strength;
//
//       Await testEngine.playCard(goofyGalumphingGumshoe);
//
//       // All characters should have -1 strength immediately
//       Expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       Expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//       Expect(opponentChar3.strength).toBe(initialStrength3 - 1);
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//
//       // All characters should still have -1 strength
//       Expect(opponentChar1.strength).toBe(initialStrength1 - 1);
//       Expect(opponentChar2.strength).toBe(initialStrength2 - 1);
//       Expect(opponentChar3.strength).toBe(initialStrength3 - 1);
//
//       // Pass turn back to player one (start of your next turn)
//       TestEngine.passTurn();
//
//       // Effect should wear off for all characters
//       Expect(opponentChar1.strength).toBe(initialStrength1);
//       Expect(opponentChar2.strength).toBe(initialStrength2);
//       Expect(opponentChar3.strength).toBe(initialStrength3);
//     });
//
//     It("applies effect each time Goofy quests", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [goofyGalumphingGumshoe],
//         },
//         {
//           Play: [aladdinHeroicOutlaw],
//         },
//       );
//
//       Const cardUnderTest = testEngine.getCardModel(goofyGalumphingGumshoe);
//       Const opponentChar = testEngine.getByZoneAndId(
//         "play",
//         AladdinHeroicOutlaw.id,
//         "player_two",
//       );
//       Const initialStrength = opponentChar.strength;
//
//       // First quest
//       CardUnderTest.quest();
//       TestEngine.passTurn();
//       Expect(opponentChar.strength).toBe(initialStrength - 1);
//
//       // Return to player one's turn
//       TestEngine.passTurn();
//       Expect(opponentChar.strength).toBe(initialStrength);
//
//       // Goofy should be ready at start of turn, quest again
//       Expect(cardUnderTest.ready).toBe(true);
//       CardUnderTest.quest();
//       TestEngine.passTurn();
//
//       // Effect should apply again
//       Expect(opponentChar.strength).toBe(initialStrength - 1);
//     });
//   });
// });
//
