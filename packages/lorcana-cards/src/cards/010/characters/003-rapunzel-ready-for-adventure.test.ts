// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { heiheiBoatSnack } from "@lorcanito/lorcana-engine/cards/001/characters/007-heihei-boat-snack";
// import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/014-moana-of-motunui";
// import { seargentTibbies } from "@lorcanito/lorcana-engine/cards/001/characters/124-sergeant-tibbs-courageous-cat";
// import { stitchAbomination } from "@lorcanito/lorcana-engine/cards/001/characters/125-stitch-abomination";
// import { teKaTheBurningOne } from "@lorcanito/lorcana-engine/cards/001/characters/126-te-ka-the-burning-one";
// import { tianaCelebratingPrincess } from "@lorcanito/lorcana-engine/cards/002/characters/196-tiana-celebrating-princess";
// import { herculesBelovedHero } from "@lorcanito/lorcana-engine/cards/004/characters/180-hercules-beloved-hero";
// import { theQueenCruelestOfAll } from "@lorcanito/lorcana-engine/cards/005/characters/139-the-queen-cruelest-of-all";
// import { rapunzelReadyForAdventure } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Rapunzel - Ready for Adventure", () => {
//   it("Support (Whenever this character quests, you may add their {S} this turn to the {S} of another character of your choice.)", async () => {
//     const testEngine = new TestEngine({
//       play: [rapunzelReadyForAdventure],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(rapunzelReadyForAdventure);
//     expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   describe("ACT OF KINDNESS Whenever one of your characters is chosen for Support, it gains: Until the start of your next turn, the next time it would take damage, prevent that damage instead.", () => {
//     it("Do not trigger without rapunzel", async () => {
//       const testStore = new TestEngine(
//         {
//           play: [moanaOfMotunui, heiheiBoatSnack],
//         },
//         {
//           play: [stitchAbomination],
//         },
//       );
//
//       await testStore.questCard(heiheiBoatSnack, {
//         targets: [moanaOfMotunui],
//       });
//
//       await testStore.exertCard(stitchAbomination);
//
//       await testStore.challenge({
//         attacker: moanaOfMotunui,
//         defender: stitchAbomination,
//       });
//
//       expect(testStore.getCardModel(stitchAbomination).damage).toEqual(
//         moanaOfMotunui.strength + heiheiBoatSnack.strength,
//       );
//       expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(
//         stitchAbomination.strength,
//       );
//     });
//
//     it("Last until next turn", async () => {
//       const testStore = new TestEngine(
//         {
//           play: [moanaOfMotunui, rapunzelReadyForAdventure],
//         },
//         {
//           play: [seargentTibbies, stitchAbomination],
//         },
//       );
//
//       await testStore.questCard(rapunzelReadyForAdventure, {
//         targets: [moanaOfMotunui],
//       });
//
//       await testStore.exertCard(moanaOfMotunui);
//
//       await testStore.passTurn();
//
//       await testStore.challenge({
//         attacker: stitchAbomination,
//         defender: moanaOfMotunui,
//       });
//
//       expect(testStore.getCardModel(stitchAbomination).damage).toEqual(
//         moanaOfMotunui.strength,
//       );
//       expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(0);
//
//       await testStore.challenge({
//         attacker: seargentTibbies,
//         defender: moanaOfMotunui,
//       });
//
//       expect(testStore.getCardModel(seargentTibbies).damage).toEqual(
//         moanaOfMotunui.strength,
//       );
//       expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(
//         seargentTibbies.strength,
//       );
//     });
//
//     it("Shield should NOT be consumed by 0 damage attack", async () => {
//       const testStore = new TestEngine(
//         {
//           play: [moanaOfMotunui, rapunzelReadyForAdventure],
//         },
//         {
//           play: [theQueenCruelestOfAll, heiheiBoatSnack],
//         },
//       );
//
//       // Player 1 turn
//       // Quest with Rapunzel, targeting Moana to give her the shield
//       await testStore.questCard(rapunzelReadyForAdventure, {
//         targets: [moanaOfMotunui],
//       });
//
//       // Exert Moana so she can be challenged
//       await testStore.exertCard(moanaOfMotunui);
//
//       await testStore.passTurn();
//
//       // Player 2 turn
//       // Attack Moana with 0 strength card (The Queen)
//       await testStore.challenge({
//         attacker: theQueenCruelestOfAll,
//         defender: moanaOfMotunui,
//       });
//
//       // Moana should have taken 0 damage
//       expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(0);
//
//       // Attack Moana with 1 strength card (Heihei)
//       // The shield should still be active, so Moana should take 0 damage (prevented)
//       await testStore.challenge({
//         attacker: heiheiBoatSnack,
//         defender: moanaOfMotunui,
//       });
//
//       expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(0);
//     });
//
//     it("Shield should NOT be consumed if Resist reduces damage to 0", async () => {
//       const testStore = new TestEngine(
//         {
//           play: [herculesBelovedHero, rapunzelReadyForAdventure],
//         },
//         {
//           play: [heiheiBoatSnack, seargentTibbies],
//         },
//       );
//
//       // Player 1 turn
//       // Quest with Rapunzel, targeting Hercules (Resist +1) to give him the shield
//       await testStore.questCard(rapunzelReadyForAdventure, {
//         targets: [herculesBelovedHero],
//       });
//
//       // Exert Hercules so he can be challenged
//       await testStore.exertCard(herculesBelovedHero);
//
//       await testStore.passTurn();
//
//       // Player 2 turn
//       // Attack Hercules with 1 strength card (Heihei)
//       // Damage = 1 - 1 (Resist) = 0.
//       // Shield should NOT be consumed.
//       await testStore.challenge({
//         attacker: heiheiBoatSnack,
//         defender: herculesBelovedHero,
//       });
//
//       // Hercules should have taken 0 damage
//       expect(testStore.getCardModel(herculesBelovedHero).damage).toEqual(0);
//
//       // Attack Hercules with 3 strength card (Seargent Tibbs)
//       // Damage = 3 - 1 (Resist) = 2.
//       // Shield should prevent this damage.
//       await testStore.challenge({
//         attacker: seargentTibbies,
//         defender: herculesBelovedHero,
//       });
//
//       expect(testStore.getCardModel(herculesBelovedHero).damage).toEqual(0);
//     });
//
//     it("Should NOT trigger when Opponent supports their character", async () => {
//       const testStore = new TestEngine(
//         {
//           play: [rapunzelReadyForAdventure],
//         },
//         {
//           play: [heiheiBoatSnack, moanaOfMotunui, stitchAbomination],
//         },
//       );
//
//       await testStore.passTurn();
//
//       // Player 2 turn
//       // Quest with Heihei, supporting Moana
//       await testStore.questCard(heiheiBoatSnack, {
//         targets: [moanaOfMotunui],
//       });
//
//       // Exert Moana so she can be challenged
//       await testStore.exertCard(moanaOfMotunui);
//
//       await testStore.passTurn();
//
//       // Player 1 turn
//       // Attack Moana with Rapunzel (1 strength)
//       // Moana should NOT have the shield, so she takes 1 damage.
//       await testStore.challenge({
//         // I need an attacker for P1.
//         // Let's use Rapunzel to attack, she has 1 strength.
//         attacker: rapunzelReadyForAdventure,
//         defender: moanaOfMotunui,
//       });
//
//       // Rapunzel (1 str) attacks Moana. Moana takes 1 damage.
//       expect(testStore.getCardModel(moanaOfMotunui).damage).toEqual(1);
//     });
//
//     it("Protection is NOT consumed when damage is already 0 (e.g., from Tiana's Resist)", async () => {
//       const testEngine = new TestEngine(
//         {
//           play: [tianaCelebratingPrincess, rapunzelReadyForAdventure],
//         },
//         {
//           play: [heiheiBoatSnack, stitchAbomination, teKaTheBurningOne],
//         },
//       );
//
//       // Use Rapunzel's Support ability on Tiana to give her protection
//       await testEngine.questCard(rapunzelReadyForAdventure, {
//         targets: [tianaCelebratingPrincess],
//       });
//
//       await testEngine.passTurn();
//
//       await testEngine.challenge({
//         attacker: heiheiBoatSnack,
//         defender: tianaCelebratingPrincess,
//         exertDefender: true,
//       });
//
//       // Tiana should take 0 damage (1 strength - 2 resist = 0)
//       expect(testEngine.getCardModel(tianaCelebratingPrincess).damage).toEqual(
//         0,
//       );
//       // Protection should still be active (not consumed) since no damage was actually dealt
//
//       await testEngine.challenge({
//         attacker: stitchAbomination,
//         defender: tianaCelebratingPrincess,
//       });
//
//       // Protection should have prevented the damage (4 strength - 2 resist = 2 damage prevented)
//       expect(testEngine.getCardModel(tianaCelebratingPrincess).damage).toEqual(
//         0,
//       );
//
//       await testEngine.challenge({
//         attacker: teKaTheBurningOne,
//         defender: tianaCelebratingPrincess,
//       });
//
//       // This time, protection is gone, so damage should be dealt (4 strength - 2 resist = 2 damage)
//       expect(testEngine.getCardModel(tianaCelebratingPrincess).isDead).toEqual(
//         true,
//       );
//     });
//   });
// });
//
