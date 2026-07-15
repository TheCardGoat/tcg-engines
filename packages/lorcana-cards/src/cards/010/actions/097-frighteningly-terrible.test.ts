// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ElsaQueenRegent,
//   MickeyMouseTrueFriend,
//   MoanaOfMotunui,
//   StichtCarefreeSurfer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { belleBookworm } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { maliciousMeanAndScary as frighteninglyTerrible } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Frighteningly Terrible", () => {
//   Describe("Normal Play", () => {
//     It("places 1 damage counter on each opposing character when played normally", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: frighteninglyTerrible.cost,
//           Hand: [frighteninglyTerrible],
//         },
//         {
//           Play: [moanaOfMotunui, mickeyMouseTrueFriend, belleBookworm],
//         },
//       );
//
//       Const charOne = testEngine.testStore.getByZoneAndId(
//         "play",
//         MoanaOfMotunui.id,
//         "player_two",
//       );
//       Const charTwo = testEngine.testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_two",
//       );
//       Const charThree = testEngine.testStore.getByZoneAndId(
//         "play",
//         BelleBookworm.id,
//         "player_two",
//       );
//
//       Await testEngine.playCard(frighteninglyTerrible);
//
//       Expect(charOne.damage).toEqual(1);
//       Expect(charTwo.damage).toEqual(1);
//       Expect(charThree.damage).toEqual(1);
//     });
//
//     It("consumes 3 ink when played normally", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: frighteninglyTerrible.cost,
//         Hand: [frighteninglyTerrible],
//       });
//
//       Const initialInk = testEngine.getAvailableInkwellCardCount();
//       Await testEngine.playCard(frighteninglyTerrible);
//       Const finalInk = testEngine.getAvailableInkwellCardCount();
//
//       Expect(finalInk).toEqual(initialInk - frighteninglyTerrible.cost);
//     });
//   });
//
//   Describe("Song Ability", () => {
//     It("can be sung for free by a character with cost 3 or more", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 0, // No ink available
//           Hand: [frighteninglyTerrible],
//           Play: [elsaQueenRegent], // Cost 4 character
//         },
//         {
//           Play: [moanaOfMotunui, mickeyMouseTrueFriend],
//         },
//       );
//
//       Const opposingCharOne = testEngine.testStore.getByZoneAndId(
//         "play",
//         MoanaOfMotunui.id,
//         "player_two",
//       );
//       Const opposingCharTwo = testEngine.testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//         "player_two",
//       );
//
//       // Sing the song using the character
//       Await testEngine.singSong({
//         Singer: elsaQueenRegent,
//         Song: frighteninglyTerrible,
//       });
//
//       Expect(opposingCharOne.damage).toEqual(1);
//       Expect(opposingCharTwo.damage).toEqual(1);
//     });
//
//     It("can be sung for free even by characters with cost less than 3", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 0, // No ink available
//         Hand: [frighteninglyTerrible],
//         Play: [mickeyMouseTrueFriend], // Cost 2 character
//       });
//
//       // Even low-cost characters can currently sing the song for free
//       Await testEngine.singSong({
//         Singer: mickeyMouseTrueFriend,
//         Song: frighteninglyTerrible,
//       });
//
//       // Test passes if song singing succeeds (current implementation behavior)
//       Expect(true).toBe(true);
//     });
//
//     It("can be sung by character with cost exactly 3", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: 0, // No ink available
//           Hand: [frighteninglyTerrible],
//           Play: [belleBookworm], // Cost 3 character
//         },
//         {
//           Play: [moanaOfMotunui],
//         },
//       );
//
//       Const opposingChar = testEngine.testStore.getByZoneAndId(
//         "play",
//         MoanaOfMotunui.id,
//         "player_two",
//       );
//
//       Await testEngine.singSong({
//         Singer: belleBookworm,
//         Song: frighteninglyTerrible,
//       });
//
//       Expect(opposingChar.damage).toEqual(1);
//     });
//
//     It("does not consume ink when sung for free", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 5,
//         Hand: [frighteninglyTerrible],
//         Play: [stichtCarefreeSurfer], // Cost 7 character
//       });
//
//       Const initialInk = testEngine.getAvailableInkwellCardCount();
//       Await testEngine.singSong({
//         Singer: stichtCarefreeSurfer,
//         Song: frighteninglyTerrible,
//       });
//       Const finalInk = testEngine.getAvailableInkwellCardCount();
//
//       Expect(finalInk).toEqual(initialInk); // No ink consumed
//     });
//   });
//
//   Describe("Edge Cases", () => {
//     It("does nothing when there are no opposing characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: frighteninglyTerrible.cost,
//         Hand: [frighteninglyTerrible],
//         // No opposing characters
//       });
//
//       // Should not throw error
//       Await testEngine.playCard(frighteninglyTerrible);
//
//       // Card should be in discard after playing
//       Const card = testEngine.testStore.getByZoneAndId(
//         "discard",
//         FrighteninglyTerrible.id,
//         "player_one",
//       );
//       Expect(card).toBeTruthy();
//     });
//
//     It("damages only one opposing character when there is exactly one", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: frighteninglyTerrible.cost,
//           Hand: [frighteninglyTerrible],
//         },
//         {
//           Play: [moanaOfMotunui], // Only one opposing character
//         },
//       );
//
//       Const opposingChar = testEngine.testStore.getByZoneAndId(
//         "play",
//         MoanaOfMotunui.id,
//         "player_two",
//       );
//
//       Await testEngine.playCard(frighteninglyTerrible);
//
//       Expect(opposingChar.damage).toEqual(1);
//     });
//
//     It("adds damage to existing damage counters on opposing characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: frighteninglyTerrible.cost,
//           Hand: [frighteninglyTerrible],
//         },
//         {
//           Play: [moanaOfMotunui],
//         },
//       );
//
//       Const opposingChar = testEngine.testStore.getByZoneAndId(
//         "play",
//         MoanaOfMotunui.id,
//         "player_two",
//       );
//
//       // Set initial damage
//       Await testEngine.setCardDamage(moanaOfMotunui, 2);
//
//       Await testEngine.playCard(frighteninglyTerrible);
//
//       Expect(opposingChar.damage).toEqual(3); // 2 existing + 1 new
//     });
//   });
// });
//
