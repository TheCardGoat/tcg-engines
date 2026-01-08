// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import {
//   moanaOfMotunui,
//   seargentTibbies,
//   stitchAbomination,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { herculesMightyLeader } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hercules - Mighty Leader", () => {
//   describe("EVER VIGILANT", () => {
//     it("should protect Hercules from damage outside challenges", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: fireTheCannons.cost,
//           hand: [fireTheCannons],
//           play: [stitchAbomination],
//         },
//         {
//           play: [herculesMightyLeader],
//         },
//       );
//
//       const hercules = testEngine.getCardModel(herculesMightyLeader);
//
//       await testEngine.playCard(fireTheCannons, {
//         targets: [hercules],
//       });
//
//       // Hercules should take no damage outside challenges
//       expect(hercules.damage).toBe(0);
//     });
//
//     it("should allow Hercules to take damage when being challenged (as defender)", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [herculesMightyLeader],
//         },
//         {
//           play: [stitchAbomination],
//         },
//       );
//
//       const hercules = testEngine.getCardModel(herculesMightyLeader);
//
//       // Exert Hercules so he can be challenged
//       await testEngine.exertCard(hercules);
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       const stitch = testEngine.getCardModel(stitchAbomination);
//
//       // Stitch challenges Hercules (Hercules is defender)
//       await testEngine.challenge({
//         attacker: stitch,
//         defender: hercules,
//       });
//
//       // Hercules should take damage when being challenged as defender and be banished
//       expect(hercules.isBanished).toBe(true);
//       expect(stitch.damage).toBe(herculesMightyLeader.strength);
//     });
//
//     it("should NOT take damage when challenging (as attacker)", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [herculesMightyLeader],
//         },
//         {
//           play: [stitchAbomination],
//         },
//       );
//
//       const hercules = testEngine.getCardModel(herculesMightyLeader);
//
//       // Exert Stitch so Hercules can challenge him
//       await testEngine.exertCard(stitchAbomination);
//
//       const stitch = testEngine.getCardModel(stitchAbomination);
//
//       // Hercules challenges Stitch (Hercules is attacker)
//       await testEngine.challenge({
//         attacker: hercules,
//         defender: stitch,
//       });
//
//       // Hercules should NOT take damage when challenging as attacker (protected by EVER VIGILANT)
//       expect(hercules.damage).toBe(0);
//       // Stitch should take full damage from Hercules
//       expect(stitch.damage).toBe(herculesMightyLeader.strength);
//     });
//   });
//
//   describe("EVER VALIANT", () => {
//     it("should protect other Hero characters from damage when Hercules is exerted", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [herculesMightyLeader, moanaOfMotunui],
//         },
//         {
//           inkwell: fireTheCannons.cost,
//           hand: [fireTheCannons],
//           play: [stitchAbomination],
//         },
//       );
//
//       const hercules = testEngine.getCardModel(herculesMightyLeader);
//       const moana = testEngine.getCardModel(moanaOfMotunui);
//
//       // Exert Hercules to activate EVER VALIANT
//       await testEngine.exertCard(hercules);
//
//       // Pass turn and change to opponent
//       testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       // Opponent plays Fire the Cannons targeting Moana (a Hero)
//       await testEngine.playCard(fireTheCannons, {
//         targets: [moana],
//       });
//
//       // Moana should take no damage due to EVER VALIANT
//       expect(moana.damage).toBe(0);
//     });
//
//     it("should NOT protect other Hero characters when Hercules is ready", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [herculesMightyLeader, moanaOfMotunui],
//         },
//         {
//           inkwell: fireTheCannons.cost,
//           hand: [fireTheCannons],
//           play: [stitchAbomination],
//         },
//       );
//
//       const moana = testEngine.getCardModel(moanaOfMotunui);
//
//       // Hercules is ready (not exerted), so EVER VALIANT is not active
//
//       // Pass turn and change to opponent
//       testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       // Opponent plays Fire the Cannons targeting Moana
//       await testEngine.playCard(fireTheCannons, {
//         targets: [moana],
//       });
//
//       // Moana should take damage because Hercules is not exerted
//       expect(moana.damage).toBe(2); // Fire the Cannons deals 2 damage
//     });
//
//     it("should allow other Hero characters to take damage when being challenged (as defender)", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [herculesMightyLeader, moanaOfMotunui],
//         },
//         {
//           play: [stitchAbomination],
//         },
//       );
//
//       const hercules = testEngine.getCardModel(herculesMightyLeader);
//       const moana = testEngine.getCardModel(moanaOfMotunui);
//
//       // Exert Hercules to activate EVER VALIANT
//       await testEngine.exertCard(hercules);
//       // Exert Moana so she can be challenged
//       await testEngine.exertCard(moana);
//
//       // Pass turn to opponent
//       testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       const stitch = testEngine.getCardModel(stitchAbomination);
//
//       // Stitch challenges Moana (Moana is defender)
//       await testEngine.challenge({
//         attacker: stitch,
//         defender: moana,
//       });
//
//       // Moana should take damage when being challenged as defender despite EVER VALIANT
//       expect(moana.damage).toBe(stitchAbomination.strength);
//       expect(stitch.damage).toBe(moanaOfMotunui.strength);
//     });
//
//     it("should NOT protect non-Hero characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [herculesMightyLeader, seargentTibbies], // Sergeant Tibbs is not a Hero
//         },
//         {
//           inkwell: fireTheCannons.cost,
//           hand: [fireTheCannons],
//           play: [stitchAbomination],
//         },
//       );
//
//       const hercules = testEngine.getCardModel(herculesMightyLeader);
//       const tibbs = testEngine.getCardModel(seargentTibbies);
//
//       // Exert Hercules to activate EVER VALIANT
//       await testEngine.exertCard(hercules);
//
//       // Pass turn and change to opponent
//       testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       // Opponent plays Fire the Cannons targeting Tibbs (not a Hero)
//       await testEngine.playCard(fireTheCannons, {
//         targets: [tibbs],
//       });
//
//       // Tibbs should take damage and be banished because he's not a Hero (willpower 2, damage 2)
//       expect(tibbs.zone).toBe("discard");
//     });
//   });
// });
//
