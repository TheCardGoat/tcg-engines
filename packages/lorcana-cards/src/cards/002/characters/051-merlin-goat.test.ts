// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { merlinGoat } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Merlin - Goat", () => {
//   Describe("**HERE I COME!** When you play this character and when he leaves play, gain 1 lore.", () => {
//     It("When you play", () => {
//       Const testStore = new TestStore({
//         Inkwell: merlinGoat.cost,
//         Hand: [merlinGoat],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", merlinGoat.id);
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
//     });
//
//     It("When he leaves play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: smash.cost,
//         Hand: [smash],
//         Play: [merlinGoat],
//       });
//
//       Await testEngine.playCard(smash);
//       Await testEngine.resolveTopOfStack({
//         Targets: [merlinGoat],
//       });
//
//       Expect(testEngine.getLoreForPlayer()).toEqual(1);
//     });
//   });
// });
//
