import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { motherKnowsBest } from "./095-mother-knows-best";

describe("Mother Knows Best - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [motherKnowsBest] });
  //   expect(testEngine.getCardModel(motherKnowsBest).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { motherKnowsBest } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mother Knows Best", () => {
//   it("Your own card", () => {
//     const testStore = new TestStore({
//       inkwell: motherKnowsBest.cost,
//       hand: [motherKnowsBest],
//       play: [moanaOfMotunui],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", motherKnowsBest.id);
//     const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({
//       targetId: target.instanceId,
//     });
//
//     expect(target.zone).toEqual("hand");
//   });
//
//   it("Opponent's card", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: motherKnowsBest.cost,
//         hand: [motherKnowsBest],
//       },
//       { play: [moanaOfMotunui] },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", motherKnowsBest.id);
//     const target = testStore.getByZoneAndId(
//       "play",
//       moanaOfMotunui.id,
//       "player_two",
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({
//       targetId: target.instanceId,
//     });
//
//     expect(target.zone).toEqual("hand");
//   });
// });
//
