// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { motherKnowsBest } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { andThenAlongCameZeus } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import {
//   GantuStubbornCaptain,
//   LiloEscapeArtist,
//   WreckitRalphHamHands,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import {
//   BagheeraGuardianJaguar,
//   BoltHeadstrongDog,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bagheera - Guardian Jaguar", () => {
//   It.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [bagheeraGuardianJaguar],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(bagheeraGuardianJaguar);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//   Describe("YOU’VE GOT TO BE BRAVE When this character is banished during an opponent's turn, deal 2 damage to each opposing character.", () => {
//     It.skip("deals 2 damage to each opposing character when Bagheera is banished on the opponent's turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: bagheeraGuardianJaguar.cost,
//           Play: [bagheeraGuardianJaguar],
//         },
//         {
//           Deck: 2,
//           Inkwell: dragonFire.cost,
//           Play: [goonsMaleficent, gantuStubbornCaptain],
//           Hand: [dragonFire],
//         },
//       );
//
//       Await testEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       Await testEngine.playCard(dragonFire, {
//         Targets: [bagheeraGuardianJaguar],
//       });
//
//       Const goons = testEngine.getCardModel(goonsMaleficent);
//       Const gantu = testEngine.getCardModel(gantuStubbornCaptain);
//
//       Await testEngine.passTurn();
//
//       Expect(gantu.meta.damage).toBe(2);
//       Expect(goons.zone).toBe("discard");
//     });
//
//     It.skip("does NOT deal 2 damage if Bagheera is banished on your own turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: dragonFire.cost,
//           Play: [bagheeraGuardianJaguar],
//           Hand: [dragonFire],
//         },
//         {
//           Play: [gantuStubbornCaptain],
//         },
//       );
//
//       Await testEngine.playCard(dragonFire, {
//         Targets: [bagheeraGuardianJaguar],
//       });
//
//       Const gantu = testEngine.getCardModel(gantuStubbornCaptain);
//
//       Expect(gantu.meta.damage).toBeUndefined();
//     });
//
//     It.skip("does NOT trigger if Bagheera leaves play another way (e.g., returned to hand)", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [bagheeraGuardianJaguar],
//         },
//         {
//           Deck: 2,
//           Inkwell: motherKnowsBest.cost,
//           Play: [gantuStubbornCaptain],
//           Hand: [motherKnowsBest],
//         },
//       );
//
//       Await testEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       Const cardUnderTest = testEngine.getCardModel(bagheeraGuardianJaguar);
//       Await testEngine.playCard(motherKnowsBest, {
//         Targets: [cardUnderTest],
//       });
//
//       Const gantu = testEngine.getCardModel(gantuStubbornCaptain);
//
//       Expect(gantu.meta.damage).toBeUndefined();
//     });
//
//     It("only damages opposing characters, not your own, when Bagheera is banished on the opponent's turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: bagheeraGuardianJaguar.cost,
//           Play: [bagheeraGuardianJaguar, boltHeadstrongDog],
//         },
//         {
//           Deck: 2,
//           Inkwell: dragonFire.cost,
//           Play: [gantuStubbornCaptain],
//           Hand: [dragonFire],
//         },
//       );
//
//       Await testEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       Await testEngine.playCard(dragonFire, {
//         Targets: [bagheeraGuardianJaguar],
//       });
//
//       Const gantu = testEngine.getCardModel(gantuStubbornCaptain);
//       Const bolt = testEngine.getCardModel(boltHeadstrongDog);
//
//       Expect(gantu.meta.damage).toBe(2);
//       Expect(bolt.meta.damage).toBeUndefined();
//     });
//
//     It("BUG-REPORT - Banish bagheera with a song on my opponents turn", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: bagheeraGuardianJaguar.cost,
//           Play: [bagheeraGuardianJaguar],
//         },
//         {
//           Deck: 2,
//           Inkwell: andThenAlongCameZeus.cost,
//           Play: [goonsMaleficent, gantuStubbornCaptain, deweyLovableShowoff],
//           Hand: [andThenAlongCameZeus],
//         },
//       );
//
//       Await testEngine.passTurn();
//       TestEngine.changeActivePlayer("player_two");
//
//       Const song = testEngine.getCardModel(andThenAlongCameZeus);
//
//       Await testEngine.playCard(song, {
//         Targets: [bagheeraGuardianJaguar],
//       });
//
//       Const goons = testEngine.getCardModel(goonsMaleficent);
//       Const gantu = testEngine.getCardModel(gantuStubbornCaptain);
//       Const dewey = testEngine.getCardModel(deweyLovableShowoff);
//
//       Await testEngine.passTurn();
//
//       Expect(gantu.meta.damage).toBe(2);
//       Expect(goons.zone).toBe("discard");
//       Expect(dewey.damage).toBe(2);
//     });
//   });
// });
//
// Describe("Regression Tests for Bagheera - Guardian Jaguar", () => {
//   It("Trying to replicate a bug, this test is not relevant", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: andThenAlongCameZeus.cost,
//         Play: [goonsMaleficent, gantuStubbornCaptain, wreckitRalphHamHands],
//         Hand: [andThenAlongCameZeus],
//       },
//       {
//         Inkwell: bagheeraGuardianJaguar.cost,
//         Play: [bagheeraGuardianJaguar, liloEscapeArtist],
//       },
//     );
//
//     Await testEngine.playCard(andThenAlongCameZeus, {
//       Targets: [bagheeraGuardianJaguar],
//     });
//
//     Expect(testEngine.getCardModel(gantuStubbornCaptain).meta.damage).toBe(2);
//     Expect(testEngine.getCardModel(wreckitRalphHamHands).meta.damage).toBe(2);
//   });
// });
//
