import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { yzmaAlchemist } from "./060-yzma-alchemist";

describe("Yzma - Alchemist", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [yzmaAlchemist] });
  //   Expect(testEngine.getCardModel(yzmaAlchemist).hasKeyword()).toBe(true);
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
//   ArielSpectacularSinger,
//   HeiheiBoatSnack,
//   YzmaAlchemist,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Yzma - Alchemist", () => {
//   It("**YOU'RE EXCUSED** Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
//     Const testStore = new TestStore({
//       Play: [yzmaAlchemist],
//       Deck: [heiheiBoatSnack, friendsOnTheOtherSide, arielSpectacularSinger],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", yzmaAlchemist.id);
//     Const first = testStore.getByZoneAndId("deck", arielSpectacularSinger.id);
//
//     CardUnderTest.quest();
//
//     TestStore.resolveTopOfStack({ scry: { bottom: [first] } });
//
//     Const deck = testStore.store.tableStore.getPlayerZoneCards(
//       "player_one",
//       "deck",
//     );
//
//     Expect(deck[0]).toEqual(first);
//   });
// });
//
