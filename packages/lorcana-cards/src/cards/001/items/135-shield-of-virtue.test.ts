import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { shieldOfVirtue } from "./135-shield-of-virtue";

describe("Shield of Virtue - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [shieldOfVirtue] });
  //   Expect(testEngine.getCardModel(shieldOfVirtue).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { heiheiBoatSnack } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Shield of Virtue", () => {
//   It("Fireproof - Ready chosen character. They can't quest for the rest of this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: 3,
//       Play: [shieldOfVirtue, heiheiBoatSnack],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", shieldOfVirtue.id);
//     Const target = testStore.getByZoneAndId("play", heiheiBoatSnack.id);
//
//     Target.updateCardMeta({ exerted: true });
//
//     CardUnderTest.activate();
//
//     Expect(target.meta.exerted).toBeTruthy();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//     Expect(target.meta.exerted).toBeFalsy();
//
//     Target.quest();
//
//     Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//   });
// });
//
