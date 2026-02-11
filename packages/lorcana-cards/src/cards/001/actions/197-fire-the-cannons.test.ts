import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { fireTheCannonsundefined } from "./197-fire-the-cannons";

describe("Fire the Cannons! - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [fireTheCannons] });
  //   Expect(testEngine.getCardModel(fireTheCannons).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fire The Cannons!", () => {
//   It("Deal 2 damage to chosen character", () => {
//     Const testStore = new TestStore({
//       Inkwell: fireTheCannons.cost,
//       Hand: [fireTheCannons],
//       Play: [moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", fireTheCannons.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//     Target.updateCardMeta({ damage: 0 });
//     Expect(target.meta).toEqual(expect.objectContaining({ damage: 0 }));
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.meta).toEqual(expect.objectContaining({ damage: 2 }));
//   });
// });
//
