import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { aWholeNewWorld } from "./195-a-whole-new-world";

describe("A Whole New World - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [aWholeNewWorld] });
  //   Expect(testEngine.getCardModel(aWholeNewWorld).hasKeyword()).toBe(true);
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
//   MagicBroomBucketBrigade,
//   MoanaOfMotunui,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { aWholeNewWorld } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("A Whole New World", () => {
//   It("Each player discards their hand and draws 7 cards.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: aWholeNewWorld.cost,
//         Hand: [dingleHopper, aWholeNewWorld],
//         Deck: 7,
//       },
//       {
//         Hand: [magicBroomBucketBrigade, teKaTheBurningOne, moanaOfMotunui],
//         Deck: 7,
//       },
//     );
//
//     TestStore.store.playCardFromHand(
//       TestStore.getByZoneAndId("hand", aWholeNewWorld.id).instanceId,
//     );
//
//     Expect(testStore.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ hand: 7, discard: 2, deck: 0 }),
//     );
//     Expect(testStore.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ hand: 7, discard: 3, deck: 0 }),
//     );
//   });
//
//   It("Should also trigger on empty hand", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: aWholeNewWorld.cost,
//         Hand: [aWholeNewWorld],
//         Deck: 7,
//       },
//       {
//         Hand: [],
//         Deck: 7,
//       },
//     );
//
//     TestStore.store.playCardFromHand(
//       TestStore.getByZoneAndId("hand", aWholeNewWorld.id).instanceId,
//     );
//
//     Expect(testStore.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({ hand: 7, discard: 1, deck: 0 }),
//     );
//     Expect(testStore.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ hand: 7, discard: 0, deck: 0 }),
//     );
//   });
// });
//
