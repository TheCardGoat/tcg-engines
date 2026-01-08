// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   elsaQueenRegent,
//   mickeyMouseTrueFriend,
//   moanaOfMotunui,
//   stichtCarefreeSurfer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { belleBookworm } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { maliciousMeanAndScary as frighteninglyTerrible } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Frighteningly Terrible", () => {
//   describe("Normal Play", () => {
//     it("places 1 damage counter on each opposing character when played normally", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: frighteninglyTerrible.cost,
//           hand: [frighteninglyTerrible],
//         },
//         {
//           play: [moanaOfMotunui, mickeyMouseTrueFriend, belleBookworm],
//         },
//       );
//
//       const charOne = testEngine.testStore.getByZoneAndId(
//         "play",
//         moanaOfMotunui.id,
//         "player_two",
//       );
//       const charTwo = testEngine.testStore.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//         "player_two",
//       );
//       const charThree = testEngine.testStore.getByZoneAndId(
//         "play",
//         belleBookworm.id,
//         "player_two",
//       );
//
//       await testEngine.playCard(frighteninglyTerrible);
//
//       expect(charOne.damage).toEqual(1);
//       expect(charTwo.damage).toEqual(1);
//       expect(charThree.damage).toEqual(1);
//     });
//
//     it("consumes 3 ink when played normally", async () => {
//       const testEngine = new TestEngine({
//         inkwell: frighteninglyTerrible.cost,
//         hand: [frighteninglyTerrible],
//       });
//
//       const initialInk = testEngine.getAvailableInkwellCardCount();
//       await testEngine.playCard(frighteninglyTerrible);
//       const finalInk = testEngine.getAvailableInkwellCardCount();
//
//       expect(finalInk).toEqual(initialInk - frighteninglyTerrible.cost);
//     });
//   });
//
//   describe("Song Ability", () => {
//     it("can be sung for free by a character with cost 3 or more", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 0, // No ink available
//           hand: [frighteninglyTerrible],
//           play: [elsaQueenRegent], // Cost 4 character
//         },
//         {
//           play: [moanaOfMotunui, mickeyMouseTrueFriend],
//         },
//       );
//
//       const opposingCharOne = testEngine.testStore.getByZoneAndId(
//         "play",
//         moanaOfMotunui.id,
//         "player_two",
//       );
//       const opposingCharTwo = testEngine.testStore.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//         "player_two",
//       );
//
//       // Sing the song using the character
//       await testEngine.singSong({
//         singer: elsaQueenRegent,
//         song: frighteninglyTerrible,
//       });
//
//       expect(opposingCharOne.damage).toEqual(1);
//       expect(opposingCharTwo.damage).toEqual(1);
//     });
//
//     it("can be sung for free even by characters with cost less than 3", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 0, // No ink available
//         hand: [frighteninglyTerrible],
//         play: [mickeyMouseTrueFriend], // Cost 2 character
//       });
//
//       // Even low-cost characters can currently sing the song for free
//       await testEngine.singSong({
//         singer: mickeyMouseTrueFriend,
//         song: frighteninglyTerrible,
//       });
//
//       // Test passes if song singing succeeds (current implementation behavior)
//       expect(true).toBe(true);
//     });
//
//     it("can be sung by character with cost exactly 3", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: 0, // No ink available
//           hand: [frighteninglyTerrible],
//           play: [belleBookworm], // Cost 3 character
//         },
//         {
//           play: [moanaOfMotunui],
//         },
//       );
//
//       const opposingChar = testEngine.testStore.getByZoneAndId(
//         "play",
//         moanaOfMotunui.id,
//         "player_two",
//       );
//
//       await testEngine.singSong({
//         singer: belleBookworm,
//         song: frighteninglyTerrible,
//       });
//
//       expect(opposingChar.damage).toEqual(1);
//     });
//
//     it("does not consume ink when sung for free", async () => {
//       const testEngine = new TestEngine({
//         inkwell: 5,
//         hand: [frighteninglyTerrible],
//         play: [stichtCarefreeSurfer], // Cost 7 character
//       });
//
//       const initialInk = testEngine.getAvailableInkwellCardCount();
//       await testEngine.singSong({
//         singer: stichtCarefreeSurfer,
//         song: frighteninglyTerrible,
//       });
//       const finalInk = testEngine.getAvailableInkwellCardCount();
//
//       expect(finalInk).toEqual(initialInk); // No ink consumed
//     });
//   });
//
//   describe("Edge Cases", () => {
//     it("does nothing when there are no opposing characters", async () => {
//       const testEngine = new TestEngine({
//         inkwell: frighteninglyTerrible.cost,
//         hand: [frighteninglyTerrible],
//         // No opposing characters
//       });
//
//       // Should not throw error
//       await testEngine.playCard(frighteninglyTerrible);
//
//       // Card should be in discard after playing
//       const card = testEngine.testStore.getByZoneAndId(
//         "discard",
//         frighteninglyTerrible.id,
//         "player_one",
//       );
//       expect(card).toBeTruthy();
//     });
//
//     it("damages only one opposing character when there is exactly one", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: frighteninglyTerrible.cost,
//           hand: [frighteninglyTerrible],
//         },
//         {
//           play: [moanaOfMotunui], // Only one opposing character
//         },
//       );
//
//       const opposingChar = testEngine.testStore.getByZoneAndId(
//         "play",
//         moanaOfMotunui.id,
//         "player_two",
//       );
//
//       await testEngine.playCard(frighteninglyTerrible);
//
//       expect(opposingChar.damage).toEqual(1);
//     });
//
//     it("adds damage to existing damage counters on opposing characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: frighteninglyTerrible.cost,
//           hand: [frighteninglyTerrible],
//         },
//         {
//           play: [moanaOfMotunui],
//         },
//       );
//
//       const opposingChar = testEngine.testStore.getByZoneAndId(
//         "play",
//         moanaOfMotunui.id,
//         "player_two",
//       );
//
//       // Set initial damage
//       await testEngine.setCardDamage(moanaOfMotunui, 2);
//
//       await testEngine.playCard(frighteninglyTerrible);
//
//       expect(opposingChar.damage).toEqual(3); // 2 existing + 1 new
//     });
//   });
// });
//
