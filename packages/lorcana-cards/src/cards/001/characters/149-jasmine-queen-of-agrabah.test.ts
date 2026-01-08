import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { jasmineQueenOfAgrabah } from "./149-jasmine-queen-of-agrabah";

describe("Jasmine - Queen of Agrabah", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [jasmineQueenOfAgrabah] });
  //   expect(testEngine.getCardModel(jasmineQueenOfAgrabah).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   jasmineQueenOfAgrabah,
//   mauiHeroToAll,
//   mickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Jasmine - Queen of Agrabah", () => {
//   describe("Caretaker - When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.", () => {
//     it("On play", () => {
//       const testStore = new TestStore({
//         deck: 2,
//         inkwell: jasmineQueenOfAgrabah.cost,
//         play: [mauiHeroToAll, mickeyMouseTrueFriend],
//         hand: [jasmineQueenOfAgrabah],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         jasmineQueenOfAgrabah.id,
//       );
//       const aDamagedChar = testStore.getByZoneAndId("play", mauiHeroToAll.id);
//       const anotherDamagedChar = testStore.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//       );
//
//       [aDamagedChar, anotherDamagedChar].forEach((char) => {
//         char.updateCardMeta({ damage: 4 });
//       });
//
//       cardUnderTest.playFromHand();
//       testStore.resolveTopOfStack({});
//
//       [aDamagedChar, anotherDamagedChar].forEach((char) => {
//         expect(char.meta.damage).toBe(2);
//       });
//     });
//
//     it("On quest", () => {
//       const testStore = new TestStore({
//         play: [jasmineQueenOfAgrabah, mauiHeroToAll, mickeyMouseTrueFriend],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         jasmineQueenOfAgrabah.id,
//       );
//       const aDamagedChar = testStore.getByZoneAndId("play", mauiHeroToAll.id);
//       const anotherDamagedChar = testStore.getByZoneAndId(
//         "play",
//         mickeyMouseTrueFriend.id,
//       );
//
//       [aDamagedChar, anotherDamagedChar].forEach((char) => {
//         char.updateCardMeta({ damage: 2 });
//       });
//
//       cardUnderTest.quest();
//       testStore.resolveTopOfStack({});
//
//       [aDamagedChar, anotherDamagedChar].forEach((char) => {
//         expect(char.meta.damage).toBe(0);
//       });
//     });
//   });
// });
//
