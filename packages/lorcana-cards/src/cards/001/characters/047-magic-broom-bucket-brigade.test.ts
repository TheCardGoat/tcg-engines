import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { magicBroomBucketBrigade } from "./047-magic-broom-bucket-brigade";

describe("Magic Broom - Bucket Brigade", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [magicBroomBucketBrigade] });
  //   Expect(testEngine.getCardModel(magicBroomBucketBrigade).hasKeyword()).toBe(true);
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
//   CaptainColonelsLieutenant,
//   HeiheiBoatSnack,
//   MagicBroomBucketBrigade,
//   MickeyMouseTrueFriend,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magic Broom - Bucket Brigade", () => {
//   It("Weep effect - Own Discard", () => {
//     Const testStore = new TestStore({
//       Inkwell: [magicBroomBucketBrigade, magicBroomBucketBrigade],
//       Hand: [magicBroomBucketBrigade],
//       Discard: [mickeyMouseTrueFriend, moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MagicBroomBucketBrigade.id,
//     );
//
//     Expect(testStore.getZonesCardCount("player_one").discard).toEqual(2);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
//
//     Const target = testStore.getByZoneAndId(
//       "discard",
//       MickeyMouseTrueFriend.id,
//     );
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     Expect(testStore.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Discard: 1,
//         Play: 1,
//         Deck: 1,
//       }),
//     );
//   });
//
//   It("Weep effect - Opponent's Discard", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: [magicBroomBucketBrigade, magicBroomBucketBrigade],
//         Hand: [magicBroomBucketBrigade],
//       },
//       {
//         Discard: [mickeyMouseTrueFriend, moanaOfMotunui],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MagicBroomBucketBrigade.id,
//     );
//
//     Expect(testStore.getZonesCardCount("player_two").discard).toEqual(2);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
//
//     Const target = testStore.getByZoneAndId(
//       "discard",
//       MickeyMouseTrueFriend.id,
//       "player_two",
//     );
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     Expect(testStore.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({
//         Discard: 1,
//         Deck: 1,
//       }),
//     );
//   });
//
//   It("Weep effect - Skipping", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: 2,
//         Discard: [heiheiBoatSnack, captainColonelsLieutenant],
//         Hand: [magicBroomBucketBrigade],
//       },
//       {
//         Discard: [mickeyMouseTrueFriend, moanaOfMotunui],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MagicBroomBucketBrigade.id,
//     );
//
//     Expect(testStore.getZonesCardCount("player_one").discard).toEqual(2);
//     Expect(testStore.getZonesCardCount("player_two").discard).toEqual(2);
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(1);
//
//     TestStore.resolveTopOfStack({ skip: true });
//
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     Expect(testStore.getZonesCardCount("player_two").discard).toEqual(2);
//     Expect(testStore.getZonesCardCount("player_one")).toEqual(
//       Expect.objectContaining({
//         Discard: 2,
//         Play: 1,
//       }),
//     );
//   });
// });
//
