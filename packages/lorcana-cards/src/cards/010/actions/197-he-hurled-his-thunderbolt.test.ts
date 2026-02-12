// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BalooFriendAndGuardian,
//   HadesLookingForADeal,
//   HeHurledHisThunderbolt,
//   HerculesMightyLeader,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("He Hurled His Thunderbolt", () => {
//   Describe("Basic functionality", () => {
//     It("should deal 4 damage to chosen opponent character", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: heHurledHisThunderbolt.cost,
//           Hand: [heHurledHisThunderbolt],
//         },
//         {
//           Play: [balooFriendAndGuardian],
//         },
//       );
//
//       Const cardTarget = testEngine.getCardModel(balooFriendAndGuardian, 1);
//
//       // Play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage resolution by choosing the opponent's character
//       Await testEngine.resolveTopOfStack({ targets: [cardTarget] });
//
//       // Verify it took 4 damage or was removed if damage was lethal
//       Const updatedOpponent = testEngine.getCardModel(
//         BalooFriendAndGuardian,
//         1,
//       );
//       Expect(updatedOpponent.damage).toBe(4);
//     });
//
//     It("should be able to target your own character and deal 4 damage", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: hadesLookingForADeal.cost + heHurledHisThunderbolt.cost,
//         Play: [hadesLookingForADeal],
//         Hand: [heHurledHisThunderbolt],
//       });
//
//       Const myHades = testEngine.getCardModel(hadesLookingForADeal);
//
//       // Play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage resolution targeting our own character
//       Await testEngine.resolveTopOfStack({ targets: [myHades] });
//
//       // Verify it took 4 damage or was removed if damage was lethal
//       Const updatedMine = testEngine.getCardModel(hadesLookingForADeal);
//       Expect(updatedMine.zone).toBe("discard");
//     });
//     It("should give Deity characters Challenger +2 this turn", async () => {
//       // Include an extra non-Deity (Baloo) so we can target it for the damage
//       // and leave the Deity characters alive to receive Challenger.
//       Const testEngine = new TestEngine({
//         Inkwell:
//           HadesLookingForADeal.cost +
//           HerculesMightyLeader.cost +
//           HeHurledHisThunderbolt.cost,
//         Play: [
//           HadesLookingForADeal,
//           HerculesMightyLeader,
//           BalooFriendAndGuardian,
//         ],
//         Hand: [heHurledHisThunderbolt],
//       });
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage by choosing Baloo so both Deities remain in play
//       Await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Both Deity characters should have Challenger
//       Expect(testEngine.getCardModel(hadesLookingForADeal).hasChallenger).toBe(
//         True,
//       );
//       Expect(testEngine.getCardModel(herculesMightyLeader).hasChallenger).toBe(
//         True,
//       );
//     });
//
//     It("should only affect Deity characters, not other characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: balooFriendAndGuardian.cost + heHurledHisThunderbolt.cost,
//         Play: [balooFriendAndGuardian],
//         Hand: [heHurledHisThunderbolt],
//       });
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage (choose Baloo as the target) to allow the ability to resolve
//       Await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Baloo (non-Deity) should not have Challenger
//       Expect(
//         TestEngine.getCardModel(balooFriendAndGuardian).hasChallenger,
//       ).toBe(false);
//     });
//
//     It("should work with multiple Deity characters", async () => {
//       // Add a non-Deity to absorb the damage so both Deities remain in play
//       Const testEngine = new TestEngine({
//         Inkwell:
//           HadesLookingForADeal.cost +
//           HerculesMightyLeader.cost +
//           BalooFriendAndGuardian.cost +
//           HeHurledHisThunderbolt.cost,
//         Play: [
//           HadesLookingForADeal,
//           HerculesMightyLeader,
//           BalooFriendAndGuardian,
//         ],
//         Hand: [heHurledHisThunderbolt],
//       });
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage by choosing Baloo so both Deities remain in play
//       Await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Both Deity characters should have Challenger
//       Expect(testEngine.getCardModel(hadesLookingForADeal).hasChallenger).toBe(
//         True,
//       );
//       Expect(testEngine.getCardModel(herculesMightyLeader).hasChallenger).toBe(
//         True,
//       );
//     });
//
//     It("should have no effect when there are no Deity characters in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: balooFriendAndGuardian.cost + heHurledHisThunderbolt.cost,
//         Play: [balooFriendAndGuardian],
//         Hand: [heHurledHisThunderbolt],
//       });
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage (choose Baloo) and then verify there's no Challenger
//       Await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Baloo should not have Challenger
//       Expect(
//         TestEngine.getCardModel(balooFriendAndGuardian).hasChallenger,
//       ).toBe(false);
//     });
//   });
//
//   Describe("Song mechanics", () => {
//     It("should be able to sing the song with sufficient ink", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: hadesLookingForADeal.cost + heHurledHisThunderbolt.cost,
//         Play: [hadesLookingForADeal],
//         Hand: [heHurledHisThunderbolt],
//       });
//
//       // Should be able to play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Verify the song was played successfully (songs go to discard after playing)
//       Expect(testEngine.getZonesCardCount("player_one").play).toBe(1); // Hades
//       Expect(testEngine.getZonesCardCount("player_one").discard).toBe(1); // Song
//     });
//
//     It("should have correct song characteristics", () => {
//       Expect(heHurledHisThunderbolt.characteristics).toContain("song");
//       Expect(heHurledHisThunderbolt.characteristics).toContain("action");
//     });
//   });
//
//   Describe("Challenger mechanics", () => {
//     It("should give Deity characters +2 strength while challenging", async () => {
//       // Add a non-Deity so damage can be targeted without removing the Deity
//       Const testEngine = new TestEngine({
//         Inkwell:
//           HadesLookingForADeal.cost +
//           BalooFriendAndGuardian.cost +
//           HeHurledHisThunderbolt.cost,
//         Play: [hadesLookingForADeal, balooFriendAndGuardian],
//         Hand: [heHurledHisThunderbolt],
//       });
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve damage targeting Baloo so Hades remains in play
//       Await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Hades should have Challenger which gives +2 strength during challenges
//       Const hadesModel = testEngine.getCardModel(hadesLookingForADeal);
//       Expect(hadesModel.hasChallenger).toBe(true);
//     });
//
//     It("should only apply the +2 during challenges, not regular strength", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell:
//           HadesLookingForADeal.cost +
//           BalooFriendAndGuardian.cost +
//           HeHurledHisThunderbolt.cost,
//         Play: [hadesLookingForADeal, balooFriendAndGuardian],
//         Hand: [heHurledHisThunderbolt],
//       });
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve damage targeting Baloo so Hades remains in play
//       Await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Regular strength should remain unchanged
//       Const hadesModel = testEngine.getCardModel(hadesLookingForADeal);
//       Expect(hadesModel.strength).toBe(3); // Base strength
//
//       // But should have Challenger
//       Expect(hadesModel.hasChallenger).toBe(true);
//     });
//   });
//
//   Describe("Duration", () => {
//     It("should only last for the current turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell:
//           HadesLookingForADeal.cost +
//           BalooFriendAndGuardian.cost +
//           HeHurledHisThunderbolt.cost,
//         Play: [hadesLookingForADeal, balooFriendAndGuardian],
//         Hand: [heHurledHisThunderbolt],
//       });
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve damage targeting Baloo so Hades remains in play
//       Await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Should have Challenger during current turn
//       Expect(testEngine.getCardModel(hadesLookingForADeal).hasChallenger).toBe(
//         True,
//       );
//
//       // End turn and start new turn
//       Await testEngine.passTurn();
//
//       // Should not have Challenger after turn ends
//       Expect(testEngine.getCardModel(hadesLookingForADeal).hasChallenger).toBe(
//         False,
//       );
//     });
//   });
//
//   Describe("Edge cases", () => {
//     It("should work when Deity character is exerted", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell:
//           HadesLookingForADeal.cost +
//           BalooFriendAndGuardian.cost +
//           HeHurledHisThunderbolt.cost,
//         Play: [hadesLookingForADeal, balooFriendAndGuardian],
//         Hand: [heHurledHisThunderbolt],
//       });
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//
//       // Exert Hades
//       Await testEngine.exertCard(hadesLookingForADeal);
//
//       // Play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Resolve the damage targeting Baloo so Hades remains in play
//       Await testEngine.resolveTopOfStack({ targets: [baloo] });
//
//       // Exerted Deity character should still get Challenger
//       Expect(testEngine.getCardModel(hadesLookingForADeal).hasChallenger).toBe(
//         True,
//       );
//     });
//
//     It("should not affect opponent's Deity characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: heHurledHisThunderbolt.cost,
//           Hand: [heHurledHisThunderbolt],
//         },
//         {
//           Play: [hadesLookingForADeal], // Opponent's Deity
//         },
//       );
//
//       // Play the song
//       Await testEngine.playCard(heHurledHisThunderbolt);
//
//       // Verify opponent's Deity character count is unchanged (means it wasn't affected by our ability)
//       Expect(testEngine.getZonesCardCount("player_two").play).toBe(1);
//     });
//   });
// });
//
