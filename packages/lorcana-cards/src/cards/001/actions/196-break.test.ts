import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { breakCard } from "./196-break";

describe("breakCard - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [breakAction] });
  //   Expect(testEngine.getCardModel(breakAction).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { breakAction } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Break", () => {
//   It("Banish chosen item.", () => {
//     Const testStore = new TestStore({
//       Inkwell: breakAction.cost,
//       Hand: [breakAction],
//       Play: [dingleHopper],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", breakAction.id);
//     Const target = testStore.getByZoneAndId("play", dingleHopper.id);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
