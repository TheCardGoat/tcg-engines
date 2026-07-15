import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { jasmineQueenOfAgrabah } from "./149-jasmine-queen-of-agrabah";

describe("Jasmine - Queen of Agrabah", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [jasmineQueenOfAgrabah] });
  //   Expect(testEngine.getCardModel(jasmineQueenOfAgrabah).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   JasmineQueenOfAgrabah,
//   MauiHeroToAll,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jasmine - Queen of Agrabah", () => {
//   Describe("Caretaker - When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.", () => {
//     It("On play", () => {
//       Const testStore = new TestStore({
//         Deck: 2,
//         Inkwell: jasmineQueenOfAgrabah.cost,
//         Play: [mauiHeroToAll, mickeyMouseTrueFriend],
//         Hand: [jasmineQueenOfAgrabah],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         JasmineQueenOfAgrabah.id,
//       );
//       Const aDamagedChar = testStore.getByZoneAndId("play", mauiHeroToAll.id);
//       Const anotherDamagedChar = testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//       );
//
//       [aDamagedChar, anotherDamagedChar].forEach((char) => {
//         Char.updateCardMeta({ damage: 4 });
//       });
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({});
//
//       [aDamagedChar, anotherDamagedChar].forEach((char) => {
//         Expect(char.meta.damage).toBe(2);
//       });
//     });
//
//     It("On quest", () => {
//       Const testStore = new TestStore({
//         Play: [jasmineQueenOfAgrabah, mauiHeroToAll, mickeyMouseTrueFriend],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         JasmineQueenOfAgrabah.id,
//       );
//       Const aDamagedChar = testStore.getByZoneAndId("play", mauiHeroToAll.id);
//       Const anotherDamagedChar = testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//       );
//
//       [aDamagedChar, anotherDamagedChar].forEach((char) => {
//         Char.updateCardMeta({ damage: 2 });
//       });
//
//       CardUnderTest.quest();
//       TestStore.resolveTopOfStack({});
//
//       [aDamagedChar, anotherDamagedChar].forEach((char) => {
//         Expect(char.meta.damage).toBe(0);
//       });
//     });
//   });
// });
//
