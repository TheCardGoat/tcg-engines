import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { ifItsNotBaroque } from "./162-if-its-not-baroque";

describe("If It - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [ifItsNotBaroque] });
  //   Expect(testEngine.getCardModel(ifItsNotBaroque).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { ifItsNotBaroque } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("If it's Not Baroque", () => {
//   It("Return item from discard.", () => {
//     Const testStore = new TestStore({
//       Inkwell: ifItsNotBaroque.cost,
//       Hand: [ifItsNotBaroque],
//       Discard: [shieldOfVirtue],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", ifItsNotBaroque.id);
//     Const target = testStore.getByZoneAndId("discard", shieldOfVirtue.id);
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
