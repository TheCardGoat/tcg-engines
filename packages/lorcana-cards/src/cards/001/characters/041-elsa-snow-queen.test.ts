import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { elsaSnowQueen } from "./041-elsa-snow-queen";

describe("Elsa - Snow Queen", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [elsaSnowQueen] });
  //   expect(testEngine.getCardModel(elsaSnowQueen).hasKeyword()).toBe(true);
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
//   elsaSnowQueen,
//   moanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Elsa - Snow Queen", () => {
//   it("**Freeze** {E} - Exert chosen opposing character.", () => {
//     const testStore = new TestStore(
//       {
//         play: [elsaSnowQueen],
//       },
//       {
//         play: [moanaOfMotunui],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId("play", elsaSnowQueen.id);
//     const target = testStore.getByZoneAndId(
//       "play",
//       moanaOfMotunui.id,
//       "player_two",
//     );
//
//     expect(target.ready).toEqual(true);
//
//     cardUnderTest.activate();
//
//     testStore.resolveTopOfStack({
//       targetId: target.instanceId,
//     });
//
//     expect(target.ready).toEqual(false);
//   });
// });
//
