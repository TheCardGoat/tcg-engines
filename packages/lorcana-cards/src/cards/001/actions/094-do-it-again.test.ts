import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { doItAgain } from "./094-do-it-again";

describe("Do It Again! - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [doItAgain] });
  //   Expect(testEngine.getCardModel(doItAgain).hasKeyword()).toBe(true);
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
//   Befuddle,
//   DoItAgain,
// } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Do It Again", () => {
//   It("Return an action card from your discard to your hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: doItAgain.cost,
//       Hand: [doItAgain],
//       Discard: [befuddle],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", doItAgain.id);
//     Const target = testStore.getByZoneAndId("discard", befuddle.id);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("hand");
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, discard: 1, play: 0 }),
//     );
//   });
// });
//
