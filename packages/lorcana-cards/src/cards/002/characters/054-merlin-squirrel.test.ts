// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   ChipTheTeacupGentleSoul,
//   MerlinSquirrel,
//   PrinceNaveenPennilessRoyal,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Merlin - Squirrel", () => {
//   Describe("**LOOK BEFORE YOU LEAP** When you play this character and when he leaves play, look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
//     It.skip("When you play", () => {
//       Const testStore = new TestStore({
//         Deck: [chipTheTeacupGentleSoul, princeNaveenPennilessRoyal],
//         Inkwell: merlinSquirrel.cost,
//         Hand: [merlinSquirrel],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId("hand", merlinSquirrel.id);
//       Const first = testStore.getByZoneAndId(
//         "deck",
//         PrinceNaveenPennilessRoyal.id,
//       );
//       Const last = testStore.getByZoneAndId("deck", chipTheTeacupGentleSoul.id);
//
//       Expect(testStore.store.tableStore.getTable().zones.deck.cards).toEqual([
//         Last,
//         First,
//       ]);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ scry: { top: [last] } });
//
//       Expect(testStore.store.tableStore.getTable().zones.deck.cards).toEqual([
//         First,
//         Last,
//       ]);
//     });
//
//     It.skip("When he leaves play", async () => {
//       Const testStore = new TestStore({
//         Inkwell: smash.cost,
//         Deck: [chipTheTeacupGentleSoul, princeNaveenPennilessRoyal],
//         Hand: [smash],
//         Play: [merlinSquirrel],
//       });
//
//       Const testEngine = new TestEngine({
//         Inkwell: smash.cost,
//         Deck: [chipTheTeacupGentleSoul, princeNaveenPennilessRoyal],
//         Hand: [smash],
//         Play: [merlinSquirrel],
//       });
//
//       Const first = testStore.getByZoneAndId(
//         "deck",
//         PrinceNaveenPennilessRoyal.id,
//       );
//       Const last = testStore.getByZoneAndId("deck", chipTheTeacupGentleSoul.id);
//
//       Expect(testStore.store.tableStore.getTable().zones.deck.cards).toEqual([
//         Last,
//         First,
//       ]);
//
//       Await testEngine.playCard(smash);
//       Await testEngine.resolveTopOfStack(
//         {
//           Targets: [merlinSquirrel],
//         },
//         True,
//       );
//
//       Await testEngine.resolveTopOfStack({
//         Scry: { bottom: [princeNaveenPennilessRoyal] },
//       });
//
//       Expect(testEngine.store.tableStore.getTable().zones.deck.cards).toEqual([
//         TestEngine.getCardModel(princeNaveenPennilessRoyal),
//         TestEngine.getCardModel(chipTheTeacupGentleSoul),
//       ]);
//     });
//   });
// });
//
