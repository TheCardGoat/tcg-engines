import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { freeze } from "./063-freeze";

describe("freeze - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [freeze] });
  //   Expect(testEngine.getCardModel(freeze).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { freeze } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Freeze", () => {
//   It("Exert chosen opponent character.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: freeze.cost,
//         Hand: [freeze],
//       },
//       {
//         Play: [moanaOfMotunui],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", freeze.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       MoanaOfMotunui.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(
//       TestStore.getByZoneAndId("play", moanaOfMotunui.id, "player_two").meta,
//     ).toEqual(expect.objectContaining({ exerted: true }));
//   });
//
//   It("Exert chosen opponent character already exerted.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: freeze.cost,
//         Hand: [freeze],
//       },
//       {
//         Play: [moanaOfMotunui],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", freeze.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       MoanaOfMotunui.id,
//       "player_two",
//     );
//
//     Target.updateCardMeta({ exerted: true });
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(
//       TestStore.getByZoneAndId("play", moanaOfMotunui.id, "player_two").meta,
//     ).toEqual(expect.objectContaining({ exerted: true }));
//   });
// });
//
