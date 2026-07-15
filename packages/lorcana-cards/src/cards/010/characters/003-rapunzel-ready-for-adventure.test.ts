// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { heiheiBoatSnack } from "@lorcanito/lorcana-engine/cards/001/characters/007-heihei-boat-snack";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/014-moana-of-motunui";
// Import { seargentTibbies } from "@lorcanito/lorcana-engine/cards/001/characters/124-sergeant-tibbs-courageous-cat";
// Import { stitchAbomination } from "@lorcanito/lorcana-engine/cards/001/characters/125-stitch-abomination";
// Import { teKaTheBurningOne } from "@lorcanito/lorcana-engine/cards/001/characters/126-te-ka-the-burning-one";
// Import { tianaCelebratingPrincess } from "@lorcanito/lorcana-engine/cards/002/characters/196-tiana-celebrating-princess";
// Import { herculesBelovedHero } from "@lorcanito/lorcana-engine/cards/004/characters/180-hercules-beloved-hero";
// Import { theQueenCruelestOfAll } from "@lorcanito/lorcana-engine/cards/005/characters/139-the-queen-cruelest-of-all";
// Import { rapunzelReadyForAdventure } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Rapunzel - Ready for Adventure", () => {
//   It("Support (Whenever this character quests, you may add their {S} this turn to the {S} of another character of your choice.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [rapunzelReadyForAdventure],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(rapunzelReadyForAdventure);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   Describe("ACT OF KINDNESS Whenever one of your characters is chosen for Support, it gains: Until the start of your next turn, the next time it would take damage, prevent that damage instead.", () => {
//     It("Do not trigger without rapunzel", async () => {
//       Const testStore = new TestEngine(
//         {
//           Play: [moanaOfMotunui, heiheiBoatSnack],
//         },
//         {
//           Play: [stitchAbomination],
//         },
//       );
//
//       Await testStore.questCard(heiheiBoatSnack, {
//         Targets: [moanaOfMotunui],
//       });
//
//       Await testStore.exertCard(stitchAbomination);
//
//       Await testStore.challenge({
//         Attacker: moanaOfMotunui,
//         Defender: stitchAbomination,
//       });
//
//       Expect(testStore.getCardModel(stitchAbomination).damage).toEqual(
//         MoanaOfMotunui.strength + heiheiBoatSnack.strength,
//       );
//       Expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(
//         StitchAbomination.strength,
//       );
//     });
//
//     It("Last until next turn", async () => {
//       Const testStore = new TestEngine(
//         {
//           Play: [moanaOfMotunui, rapunzelReadyForAdventure],
//         },
//         {
//           Play: [seargentTibbies, stitchAbomination],
//         },
//       );
//
//       Await testStore.questCard(rapunzelReadyForAdventure, {
//         Targets: [moanaOfMotunui],
//       });
//
//       Await testStore.exertCard(moanaOfMotunui);
//
//       Await testStore.passTurn();
//
//       Await testStore.challenge({
//         Attacker: stitchAbomination,
//         Defender: moanaOfMotunui,
//       });
//
//       Expect(testStore.getCardModel(stitchAbomination).damage).toEqual(
//         MoanaOfMotunui.strength,
//       );
//       Expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(0);
//
//       Await testStore.challenge({
//         Attacker: seargentTibbies,
//         Defender: moanaOfMotunui,
//       });
//
//       Expect(testStore.getCardModel(seargentTibbies).damage).toEqual(
//         MoanaOfMotunui.strength,
//       );
//       Expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(
//         SeargentTibbies.strength,
//       );
//     });
//
//     It("Shield should NOT be consumed by 0 damage attack", async () => {
//       Const testStore = new TestEngine(
//         {
//           Play: [moanaOfMotunui, rapunzelReadyForAdventure],
//         },
//         {
//           Play: [theQueenCruelestOfAll, heiheiBoatSnack],
//         },
//       );
//
//       // Player 1 turn
//       // Quest with Rapunzel, targeting Moana to give her the shield
//       Await testStore.questCard(rapunzelReadyForAdventure, {
//         Targets: [moanaOfMotunui],
//       });
//
//       // Exert Moana so she can be challenged
//       Await testStore.exertCard(moanaOfMotunui);
//
//       Await testStore.passTurn();
//
//       // Player 2 turn
//       // Attack Moana with 0 strength card (The Queen)
//       Await testStore.challenge({
//         Attacker: theQueenCruelestOfAll,
//         Defender: moanaOfMotunui,
//       });
//
//       // Moana should have taken 0 damage
//       Expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(0);
//
//       // Attack Moana with 1 strength card (Heihei)
//       // The shield should still be active, so Moana should take 0 damage (prevented)
//       Await testStore.challenge({
//         Attacker: heiheiBoatSnack,
//         Defender: moanaOfMotunui,
//       });
//
//       Expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(0);
//     });
//
//     It("Shield should NOT be consumed if Resist reduces damage to 0", async () => {
//       Const testStore = new TestEngine(
//         {
//           Play: [herculesBelovedHero, rapunzelReadyForAdventure],
//         },
//         {
//           Play: [heiheiBoatSnack, seargentTibbies],
//         },
//       );
//
//       // Player 1 turn
//       // Quest with Rapunzel, targeting Hercules (Resist +1) to give him the shield
//       Await testStore.questCard(rapunzelReadyForAdventure, {
//         Targets: [herculesBelovedHero],
//       });
//
//       // Exert Hercules so he can be challenged
//       Await testStore.exertCard(herculesBelovedHero);
//
//       Await testStore.passTurn();
//
//       // Player 2 turn
//       // Attack Hercules with 1 strength card (Heihei)
//       // Damage = 1 - 1 (Resist) = 0.
//       // Shield should NOT be consumed.
//       Await testStore.challenge({
//         Attacker: heiheiBoatSnack,
//         Defender: herculesBelovedHero,
//       });
//
//       // Hercules should have taken 0 damage
//       Expect(testStore.getCardModel(herculesBelovedHero).damage).toEqual(0);
//
//       // Attack Hercules with 3 strength card (Seargent Tibbs)
//       // Damage = 3 - 1 (Resist) = 2.
//       // Shield should prevent this damage.
//       Await testStore.challenge({
//         Attacker: seargentTibbies,
//         Defender: herculesBelovedHero,
//       });
//
//       Expect(testStore.getCardModel(herculesBelovedHero).damage).toEqual(0);
//     });
//
//     It("Should NOT trigger when Opponent supports their character", async () => {
//       Const testStore = new TestEngine(
//         {
//           Play: [rapunzelReadyForAdventure],
//         },
//         {
//           Play: [heiheiBoatSnack, moanaOfMotunui, stitchAbomination],
//         },
//       );
//
//       Await testStore.passTurn();
//
//       // Player 2 turn
//       // Quest with Heihei, supporting Moana
//       Await testStore.questCard(heiheiBoatSnack, {
//         Targets: [moanaOfMotunui],
//       });
//
//       // Exert Moana so she can be challenged
//       Await testStore.exertCard(moanaOfMotunui);
//
//       Await testStore.passTurn();
//
//       // Player 1 turn
//       // Attack Moana with Rapunzel (1 strength)
//       // Moana should NOT have the shield, so she takes 1 damage.
//       Await testStore.challenge({
//         // I need an attacker for P1.
//         // Let's use Rapunzel to attack, she has 1 strength.
//         Attacker: rapunzelReadyForAdventure,
//         Defender: moanaOfMotunui,
//       });
//
//       // Rapunzel (1 str) attacks Moana. Moana takes 1 damage.
//       Expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(1);
//     });
//
//     It("Protection is NOT consumed when damage is already 0 (e.g., from Tiana's Resist)", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Play: [tianaCelebratingPrincess, rapunzelReadyForAdventure],
//         },
//         {
//           Play: [heiheiBoatSnack, stitchAbomination, teKaTheBurningOne],
//         },
//       );
//
//       // Use Rapunzel's Support ability on Tiana to give her protection
//       Await testEngine.questCard(rapunzelReadyForAdventure, {
//         Targets: [tianaCelebratingPrincess],
//       });
//
//       Await testEngine.passTurn();
//
//       Await testEngine.challenge({
//         Attacker: heiheiBoatSnack,
//         Defender: tianaCelebratingPrincess,
//         ExertDefender: true,
//       });
//
//       // Tiana should take 0 damage (1 strength - 2 resist = 0)
//       Expect(testEngine.getCardModel(tianaCelebratingPrincess).damage).toEqual(
//         0,
//       );
//       // Protection should still be active (not consumed) since no damage was actually dealt
//
//       Await testEngine.challenge({
//         Attacker: stitchAbomination,
//         Defender: tianaCelebratingPrincess,
//       });
//
//       // Protection should have prevented the damage (4 strength - 2 resist = 2 damage prevented)
//       Expect(testEngine.getCardModel(tianaCelebratingPrincess).damage).toEqual(
//         0,
//       );
//
//       Await testEngine.challenge({
//         Attacker: teKaTheBurningOne,
//         Defender: tianaCelebratingPrincess,
//       });
//
//       // This time, protection is gone, so damage should be dealt (4 strength - 2 resist = 2 damage)
//       Expect(testEngine.getCardModel(tianaCelebratingPrincess).isDead).toEqual(
//         True,
//       );
//     });
//   });
// });
//
