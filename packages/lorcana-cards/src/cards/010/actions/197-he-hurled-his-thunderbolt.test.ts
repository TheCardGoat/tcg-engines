// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   balooFriendAndGuardian,
//   hadesLookingForADeal,
//   heHurledHisThunderbolt,
//   herculesMightyLeader,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("He Hurled His Thunderbolt", () => {
//   describe("Basic functionality", () => {
//     it("should deal 4 damage to chosen opponent character", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: heHurledHisThunderbolt.cost,
//           hand: [heHurledHisThunderbolt],
//         },
//         {
//           play: [balooFriendAndGuardian],
//         },
//       );
//
//       const cardTarget = testEngine.getCardModel(balooFriendAndGuardian, 1);
//
//       // Play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage resolution by choosing the opponent's character
//       await testEngine.resolveTopOfStack({ targets: [cardTarget] });
//
//       // Verify it took 4 damage or was removed if damage was lethal
//       const updatedOpponent = testEngine.getCardModel(
//         balooFriendAndGuardian,
//         1,
//       );
//       expect(updatedOpponent.damage).toBe(4);
//     });
//
//     it("should be able to target your own character and deal 4 damage", async () => {
//       const testEngine = new TestEngine({
//         inkwell: hadesLookingForADeal.cost + heHurledHisThunderbolt.cost,
//         play: [hadesLookingForADeal],
//         hand: [heHurledHisThunderbolt],
//       });
//
//       const myHades = testEngine.getCardModel(hadesLookingForADeal);
//
//       // Play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage resolution targeting our own character
//       await testEngine.resolveTopOfStack({ targets: [myHades] });
//
//       // Verify it took 4 damage or was removed if damage was lethal
//       const updatedMine = testEngine.getCardModel(hadesLookingForADeal);
//       expect(updatedMine.zone).toBe("discard");
//     });
//     it("should give Deity characters Challenger +2 this turn", async () => {
//       // Include an extra non-Deity (Baloo) so we can target it for the damage
//       // and leave the Deity characters alive to receive Challenger.
//       const testEngine = new TestEngine({
//         inkwell:
//           hadesLookingForADeal.cost +
//           herculesMightyLeader.cost +
//           heHurledHisThunderbolt.cost,
//         play: [
//           hadesLookingForADeal,
//           herculesMightyLeader,
//           balooFriendAndGuardian,
//         ],
//         hand: [heHurledHisThunderbolt],
//       });
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage by choosing Baloo so both Deities remain in play
//       await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Both Deity characters should have Challenger
//       expect(testEngine.getCardModel(hadesLookingForADeal).hasChallenger).toBe(
//         true,
//       );
//       expect(testEngine.getCardModel(herculesMightyLeader).hasChallenger).toBe(
//         true,
//       );
//     });
//
//     it("should only affect Deity characters, not other characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: balooFriendAndGuardian.cost + heHurledHisThunderbolt.cost,
//         play: [balooFriendAndGuardian],
//         hand: [heHurledHisThunderbolt],
//       });
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage (choose Baloo as the target) to allow the ability to resolve
//       await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Baloo (non-Deity) should not have Challenger
//       expect(
//         testEngine.getCardModel(balooFriendAndGuardian).hasChallenger,
//       ).toBe(false);
//     });
//
//     it("should work with multiple Deity characters", async () => {
//       // Add a non-Deity to absorb the damage so both Deities remain in play
//       const testEngine = new TestEngine({
//         inkwell:
//           hadesLookingForADeal.cost +
//           herculesMightyLeader.cost +
//           balooFriendAndGuardian.cost +
//           heHurledHisThunderbolt.cost,
//         play: [
//           hadesLookingForADeal,
//           herculesMightyLeader,
//           balooFriendAndGuardian,
//         ],
//         hand: [heHurledHisThunderbolt],
//       });
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage by choosing Baloo so both Deities remain in play
//       await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Both Deity characters should have Challenger
//       expect(testEngine.getCardModel(hadesLookingForADeal).hasChallenger).toBe(
//         true,
//       );
//       expect(testEngine.getCardModel(herculesMightyLeader).hasChallenger).toBe(
//         true,
//       );
//     });
//
//     it("should have no effect when there are no Deity characters in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: balooFriendAndGuardian.cost + heHurledHisThunderbolt.cost,
//         play: [balooFriendAndGuardian],
//         hand: [heHurledHisThunderbolt],
//       });
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage (choose Baloo) and then verify there's no Challenger
//       await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Baloo should not have Challenger
//       expect(
//         testEngine.getCardModel(balooFriendAndGuardian).hasChallenger,
//       ).toBe(false);
//     });
//   });
//
//   describe("Song mechanics", () => {
//     it("should be able to sing the song with sufficient ink", async () => {
//       const testEngine = new TestEngine({
//         inkwell: hadesLookingForADeal.cost + heHurledHisThunderbolt.cost,
//         play: [hadesLookingForADeal],
//         hand: [heHurledHisThunderbolt],
//       });
//
//       // Should be able to play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Verify the song was played successfully (songs go to discard after playing)
//       expect(testEngine.getZonesCardCount("player_one").play).toBe(1); // Hades
//       expect(testEngine.getZonesCardCount("player_one").discard).toBe(1); // Song
//     });
//
//     it("should have correct song characteristics", () => {
//       expect(heHurledHisThunderbolt.characteristics).toContain("song");
//       expect(heHurledHisThunderbolt.characteristics).toContain("action");
//     });
//   });
//
//   describe("Challenger mechanics", () => {
//     it("should give Deity characters +2 strength while challenging", async () => {
//       // Add a non-Deity so damage can be targeted without removing the Deity
//       const testEngine = new TestEngine({
//         inkwell:
//           hadesLookingForADeal.cost +
//           balooFriendAndGuardian.cost +
//           heHurledHisThunderbolt.cost,
//         play: [hadesLookingForADeal, balooFriendAndGuardian],
//         hand: [heHurledHisThunderbolt],
//       });
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve damage targeting Baloo so Hades remains in play
//       await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Hades should have Challenger which gives +2 strength during challenges
//       const hadesModel = testEngine.getCardModel(hadesLookingForADeal);
//       expect(hadesModel.hasChallenger).toBe(true);
//     });
//
//     it("should only apply the +2 during challenges, not regular strength", async () => {
//       const testEngine = new TestEngine({
//         inkwell:
//           hadesLookingForADeal.cost +
//           balooFriendAndGuardian.cost +
//           heHurledHisThunderbolt.cost,
//         play: [hadesLookingForADeal, balooFriendAndGuardian],
//         hand: [heHurledHisThunderbolt],
//       });
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve damage targeting Baloo so Hades remains in play
//       await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Regular strength should remain unchanged
//       const hadesModel = testEngine.getCardModel(hadesLookingForADeal);
//       expect(hadesModel.strength).toBe(3); // Base strength
//
//       // But should have Challenger
//       expect(hadesModel.hasChallenger).toBe(true);
//     });
//   });
//
//   describe("Duration", () => {
//     it("should only last for the current turn", async () => {
//       const testEngine = new TestEngine({
//         inkwell:
//           hadesLookingForADeal.cost +
//           balooFriendAndGuardian.cost +
//           heHurledHisThunderbolt.cost,
//         play: [hadesLookingForADeal, balooFriendAndGuardian],
//         hand: [heHurledHisThunderbolt],
//       });
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve damage targeting Baloo so Hades remains in play
//       await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Should have Challenger during current turn
//       expect(testEngine.getCardModel(hadesLookingForADeal).hasChallenger).toBe(
//         true,
//       );
//
//       // End turn and start new turn
//       await testEngine.passTurn();
//
//       // Should not have Challenger after turn ends
//       expect(testEngine.getCardModel(hadesLookingForADeal).hasChallenger).toBe(
//         false,
//       );
//     });
//   });
//
//   describe("Edge cases", () => {
//     it("should work when Deity character is exerted", async () => {
//       const testEngine = new TestEngine({
//         inkwell:
//           hadesLookingForADeal.cost +
//           balooFriendAndGuardian.cost +
//           heHurledHisThunderbolt.cost,
//         play: [hadesLookingForADeal, balooFriendAndGuardian],
//         hand: [heHurledHisThunderbolt],
//       });
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Exert Hades
//       await testEngine.exertCard(hadesLookingForADeal);
//
//       // Play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage targeting Baloo so Hades remains in play
//       await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Exerted Deity character should still get Challenger
//       expect(testEngine.getCardModel(hadesLookingForADeal).hasChallenger).toBe(
//         true,
//       );
//     });
//
//     it("should not affect opponent's Deity characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: heHurledHisThunderbolt.cost,
//           hand: [heHurledHisThunderbolt],
//         },
//         {
//           play: [hadesLookingForADeal], // Opponent's Deity
//         },
//       );
//
//       // Play the song
//       await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Verify opponent's Deity character count is unchanged (means it wasn't affected by our ability)
//       expect(testEngine.getZonesCardCount("player_two").play).toBe(1);
//     });
//   });
// });
//
