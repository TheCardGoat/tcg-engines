import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { fanTheFlames } from "./131-fan-the-flames";

describe("Fan The Flames - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [fanTheFlames] });
  //   Expect(testEngine.getCardModel(fanTheFlames).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fanTheFlames } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fan The Flames", () => {
//   It("Ready chosen character. They can't quest for the rest of this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: fanTheFlames.cost,
//       Hand: [fanTheFlames],
//       Play: [moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", fanTheFlames.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     Target.updateCardMeta({ exerted: true });
//     Expect(target.meta).toEqual(expect.objectContaining({ exerted: true }));
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.meta).toEqual(expect.objectContaining({ exerted: false }));
//     Expect(target.hasQuestRestriction).toBe(true);
//   });
// });
//
