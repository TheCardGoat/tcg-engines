import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { reflection } from "./065-reflection";

describe("reflection", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [reflection] });
  //   Expect(testEngine.getCardModel(reflection).hasKeyword()).toBe(true);
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
//   ChiefTui,
//   HeiheiBoatSnack,
//   LiloMakingAWish,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { reflection } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
// Import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
//
// Describe("Reflection", () => {
//   It("Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.", () => {
//     Const testStore = new TestStore({
//       Deck: [liloMakingAWish, moanaOfMotunui, chiefTui, heiheiBoatSnack],
//       Hand: [reflection],
//       Inkwell: reflection.cost,
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", reflection.id);
//     Const one = testStore.getByZoneAndId("deck", heiheiBoatSnack.id);
//     Const two = testStore.getByZoneAndId("deck", chiefTui.id);
//     Const three = testStore.getByZoneAndId("deck", moanaOfMotunui.id);
//
//     CardUnderTest.playFromHand();
//
//     Const top: CardModel[] = [two, one, three];
//
//     TestStore.resolveTopOfStack({ scry: { top } });
//
//     Expect(
//       TestStore.store.tableStore
//         .getPlayerZoneCards("player_one", "deck")
//         .map((card) => card.lorcanitoCard?.name),
//     ).toEqual([
//       LiloMakingAWish.name,
//       ...top.map((card) => card.lorcanitoCard?.name),
//     ]);
//   });
// });
//
