// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   MoanaOfMotunui,
//   SeargentTibbies,
//   StitchAbomination,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { herculesMightyLeader } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hercules - Mighty Leader", () => {
//   Describe("EVER VIGILANT", () => {
//     It("should protect Hercules from damage outside challenges", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: fireTheCannons.cost,
//           Hand: [fireTheCannons],
//           Play: [stitchAbomination],
//         },
//         {
//           Play: [herculesMightyLeader],
//         },
//       );
//
//       Const hercules = testEngine.getCardModel(herculesMightyLeader);
//
//       Await testEngine.playCard(fireTheCannons, {
//         Targets: [hercules],
//       });
//
//       // Hercules should take no damage outside challenges
//       Expect(hercules.damage).toBe(0);
//     });
//
//     It("should allow Hercules to take damage when being challenged (as defender)", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [herculesMightyLeader],
//         },
//         {
//           Play: [stitchAbomination],
//         },
//       );
//
//       Const hercules = testEngine.getCardModel(herculesMightyLeader);
//
//       // Exert Hercules so he can be challenged
//       Await testEngine.exertCard(hercules);
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       Const stitch = testEngine.getCardModel(stitchAbomination);
//
//       // Stitch challenges Hercules (Hercules is defender)
//       Await testEngine.challenge({
//         Attacker: stitch,
//         Defender: hercules,
//       });
//
//       // Hercules should take damage when being challenged as defender and be banished
//       Expect(hercules.isBanished).toBe(true);
//       Expect(stitch.damage).toBe(herculesMightyLeader.strength);
//     });
//
//     It("should NOT take damage when challenging (as attacker)", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [herculesMightyLeader],
//         },
//         {
//           Play: [stitchAbomination],
//         },
//       );
//
//       Const hercules = testEngine.getCardModel(herculesMightyLeader);
//
//       // Exert Stitch so Hercules can challenge him
//       Await testEngine.exertCard(stitchAbomination);
//
//       Const stitch = testEngine.getCardModel(stitchAbomination);
//
//       // Hercules challenges Stitch (Hercules is attacker)
//       Await testEngine.challenge({
//         Attacker: hercules,
//         Defender: stitch,
//       });
//
//       // Hercules should NOT take damage when challenging as attacker (protected by EVER VIGILANT)
//       Expect(hercules.damage).toBe(0);
//       // Stitch should take full damage from Hercules
//       Expect(stitch.damage).toBe(herculesMightyLeader.strength);
//     });
//   });
//
//   Describe("EVER VALIANT", () => {
//     It("should protect other Hero characters from damage when Hercules is exerted", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [herculesMightyLeader, moanaOfMotunui],
//         },
//         {
//           Inkwell: fireTheCannons.cost,
//           Hand: [fireTheCannons],
//           Play: [stitchAbomination],
//         },
//       );
//
//       Const hercules = testEngine.getCardModel(herculesMightyLeader);
//       Const moana = testEngine.getCardModel(moanaOfMotunui);
//
//       // Exert Hercules to activate EVER VALIANT
//       Await testEngine.exertCard(hercules);
//
//       // Pass turn and change to opponent
//       TestEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       // Opponent plays Fire the Cannons targeting Moana (a Hero)
//       Await testEngine.playCard(fireTheCannons, {
//         Targets: [moana],
//       });
//
//       // Moana should take no damage due to EVER VALIANT
//       Expect(moana.damage).toBe(0);
//     });
//
//     It("should NOT protect other Hero characters when Hercules is ready", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [herculesMightyLeader, moanaOfMotunui],
//         },
//         {
//           Inkwell: fireTheCannons.cost,
//           Hand: [fireTheCannons],
//           Play: [stitchAbomination],
//         },
//       );
//
//       Const moana = testEngine.getCardModel(moanaOfMotunui);
//
//       // Hercules is ready (not exerted), so EVER VALIANT is not active
//
//       // Pass turn and change to opponent
//       TestEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       // Opponent plays Fire the Cannons targeting Moana
//       Await testEngine.playCard(fireTheCannons, {
//         Targets: [moana],
//       });
//
//       // Moana should take damage because Hercules is not exerted
//       Expect(moana.damage).toBe(2); // Fire the Cannons deals 2 damage
//     });
//
//     It("should allow other Hero characters to take damage when being challenged (as defender)", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [herculesMightyLeader, moanaOfMotunui],
//         },
//         {
//           Play: [stitchAbomination],
//         },
//       );
//
//       Const hercules = testEngine.getCardModel(herculesMightyLeader);
//       Const moana = testEngine.getCardModel(moanaOfMotunui);
//
//       // Exert Hercules to activate EVER VALIANT
//       Await testEngine.exertCard(hercules);
//       // Exert Moana so she can be challenged
//       Await testEngine.exertCard(moana);
//
//       // Pass turn to opponent
//       TestEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       Const stitch = testEngine.getCardModel(stitchAbomination);
//
//       // Stitch challenges Moana (Moana is defender)
//       Await testEngine.challenge({
//         Attacker: stitch,
//         Defender: moana,
//       });
//
//       // Moana should take damage when being challenged as defender despite EVER VALIANT
//       Expect(moana.damage).toBe(stitchAbomination.strength);
//       Expect(stitch.damage).toBe(moanaOfMotunui.strength);
//     });
//
//     It("should NOT protect non-Hero characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [herculesMightyLeader, seargentTibbies], // Sergeant Tibbs is not a Hero
//         },
//         {
//           Inkwell: fireTheCannons.cost,
//           Hand: [fireTheCannons],
//           Play: [stitchAbomination],
//         },
//       );
//
//       Const hercules = testEngine.getCardModel(herculesMightyLeader);
//       Const tibbs = testEngine.getCardModel(seargentTibbies);
//
//       // Exert Hercules to activate EVER VALIANT
//       Await testEngine.exertCard(hercules);
//
//       // Pass turn and change to opponent
//       TestEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       // Opponent plays Fire the Cannons targeting Tibbs (not a Hero)
//       Await testEngine.playCard(fireTheCannons, {
//         Targets: [tibbs],
//       });
//
//       // Tibbs should take damage and be banished because he's not a Hero (willpower 2, damage 2)
//       Expect(tibbs.zone).toBe("discard");
//     });
//   });
// });
//
