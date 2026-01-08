// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { motherKnowsBest } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { andThenAlongCameZeus } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// import {
//   gantuStubbornCaptain,
//   liloEscapeArtist,
//   wreckitRalphHamHands,
// } from "@lorcanito/lorcana-engine/cards/006";
// import {
//   bagheeraGuardianJaguar,
//   boltHeadstrongDog,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bagheera - Guardian Jaguar", () => {
//   it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     const testEngine = new TestEngine({
//       play: [bagheeraGuardianJaguar],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(bagheeraGuardianJaguar);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//   describe("YOU’VE GOT TO BE BRAVE When this character is banished during an opponent's turn, deal 2 damage to each opposing character.", () => {
//     it.skip("deals 2 damage to each opposing character when Bagheera is banished on the opponent's turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: bagheeraGuardianJaguar.cost,
//           play: [bagheeraGuardianJaguar],
//         },
//         {
//           deck: 2,
//           inkwell: dragonFire.cost,
//           play: [goonsMaleficent, gantuStubbornCaptain],
//           hand: [dragonFire],
//         },
//       );
//
//       await testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       await testEngine.playCard(dragonFire, {
//         targets: [bagheeraGuardianJaguar],
//       });
//
//       const goons = testEngine.getCardModel(goonsMaleficent);
//       const gantu = testEngine.getCardModel(gantuStubbornCaptain);
//
//       await testEngine.passTurn();
//
//       expect(gantu.meta.damage).toBe(2);
//       expect(goons.zone).toBe("discard");
//     });
//
//     it.skip("does NOT deal 2 damage if Bagheera is banished on your own turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: dragonFire.cost,
//           play: [bagheeraGuardianJaguar],
//           hand: [dragonFire],
//         },
//         {
//           play: [gantuStubbornCaptain],
//         },
//       );
//
//       await testEngine.playCard(dragonFire, {
//         targets: [bagheeraGuardianJaguar],
//       });
//
//       const gantu = testEngine.getCardModel(gantuStubbornCaptain);
//
//       expect(gantu.meta.damage).toBeUndefined();
//     });
//
//     it.skip("does NOT trigger if Bagheera leaves play another way (e.g., returned to hand)", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [bagheeraGuardianJaguar],
//         },
//         {
//           deck: 2,
//           inkwell: motherKnowsBest.cost,
//           play: [gantuStubbornCaptain],
//           hand: [motherKnowsBest],
//         },
//       );
//
//       await testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       const cardUnderTest = testEngine.getCardModel(bagheeraGuardianJaguar);
//       await testEngine.playCard(motherKnowsBest, {
//         targets: [cardUnderTest],
//       });
//
//       const gantu = testEngine.getCardModel(gantuStubbornCaptain);
//
//       expect(gantu.meta.damage).toBeUndefined();
//     });
//
//     it("only damages opposing characters, not your own, when Bagheera is banished on the opponent's turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: bagheeraGuardianJaguar.cost,
//           play: [bagheeraGuardianJaguar, boltHeadstrongDog],
//         },
//         {
//           deck: 2,
//           inkwell: dragonFire.cost,
//           play: [gantuStubbornCaptain],
//           hand: [dragonFire],
//         },
//       );
//
//       await testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       await testEngine.playCard(dragonFire, {
//         targets: [bagheeraGuardianJaguar],
//       });
//
//       const gantu = testEngine.getCardModel(gantuStubbornCaptain);
//       const bolt = testEngine.getCardModel(boltHeadstrongDog);
//
//       expect(gantu.meta.damage).toBe(2);
//       expect(bolt.meta.damage).toBeUndefined();
//     });
//
//     it("BUG-REPORT - Banish bagheera with a song on my opponents turn", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: bagheeraGuardianJaguar.cost,
//           play: [bagheeraGuardianJaguar],
//         },
//         {
//           deck: 2,
//           inkwell: andThenAlongCameZeus.cost,
//           play: [goonsMaleficent, gantuStubbornCaptain, deweyLovableShowoff],
//           hand: [andThenAlongCameZeus],
//         },
//       );
//
//       await testEngine.passTurn();
//       testEngine.changeActivePlayer("player_two");
//
//       const song = testEngine.getCardModel(andThenAlongCameZeus);
//
//       await testEngine.playCard(song, {
//         targets: [bagheeraGuardianJaguar],
//       });
//
//       const goons = testEngine.getCardModel(goonsMaleficent);
//       const gantu = testEngine.getCardModel(gantuStubbornCaptain);
//       const dewey = testEngine.getCardModel(deweyLovableShowoff);
//
//       await testEngine.passTurn();
//
//       expect(gantu.meta.damage).toBe(2);
//       expect(goons.zone).toBe("discard");
//       expect(dewey.damage).toBe(2);
//     });
//   });
// });
//
// describe("Regression Tests for Bagheera - Guardian Jaguar", () => {
//   it("Trying to replicate a bug, this test is not relevant", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: andThenAlongCameZeus.cost,
//         play: [goonsMaleficent, gantuStubbornCaptain, wreckitRalphHamHands],
//         hand: [andThenAlongCameZeus],
//       },
//       {
//         inkwell: bagheeraGuardianJaguar.cost,
//         play: [bagheeraGuardianJaguar, liloEscapeArtist],
//       },
//     );
//
//     await testEngine.playCard(andThenAlongCameZeus, {
//       targets: [bagheeraGuardianJaguar],
//     });
//
//     expect(testEngine.getCardModel(gantuStubbornCaptain).meta.damage).toBe(2);
//     expect(testEngine.getCardModel(wreckitRalphHamHands).meta.damage).toBe(2);
//   });
// });
//
