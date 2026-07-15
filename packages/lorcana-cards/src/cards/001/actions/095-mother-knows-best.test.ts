import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { motherKnowsBest } from "./095-mother-knows-best";

describe("Mother Knows Best - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [motherKnowsBest] });
  //   Expect(testEngine.getCardModel(motherKnowsBest).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { motherKnowsBest } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mother Knows Best", () => {
//   It("Your own card", () => {
//     Const testStore = new TestStore({
//       Inkwell: motherKnowsBest.cost,
//       Hand: [motherKnowsBest],
//       Play: [moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", motherKnowsBest.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("hand");
//   });
//
//   It("Opponent's card", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: motherKnowsBest.cost,
//         Hand: [motherKnowsBest],
//       },
//       { play: [moanaOfMotunui] },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", motherKnowsBest.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       MoanaOfMotunui.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("hand");
//   });
// });
//
