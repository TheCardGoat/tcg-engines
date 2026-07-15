import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { elsaSnowQueen } from "./041-elsa-snow-queen";

describe("Elsa - Snow Queen", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [elsaSnowQueen] });
  //   Expect(testEngine.getCardModel(elsaSnowQueen).hasKeyword()).toBe(true);
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
//   ElsaSnowQueen,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Elsa - Snow Queen", () => {
//   It("**Freeze** {E} - Exert chosen opposing character.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [elsaSnowQueen],
//       },
//       {
//         Play: [moanaOfMotunui],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", elsaSnowQueen.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       MoanaOfMotunui.id,
//       "player_two",
//     );
//
//     Expect(target.ready).toEqual(true);
//
//     CardUnderTest.activate();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.ready).toEqual(false);
//   });
// });
//
