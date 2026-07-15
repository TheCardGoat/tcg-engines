import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { lefouInstigator } from "./112-lefou-instigator";

describe("Lefou - Instigator", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [lefouInstigator] });
  //   Expect(testEngine.getCardModel(lefouInstigator).hasKeyword()).toBe(true);
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
//   HerculesTrueHero,
//   LefouInstigator,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lefou Instigator", () => {
//   It("FAN THE FLAMES effect- Ready chosen character they can't quest", () => {
//     Const testStore = new TestStore({
//       Inkwell: lefouInstigator.cost,
//       Play: [herculesTrueHero],
//       Hand: [lefouInstigator],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", lefouInstigator.id);
//     Const target = testStore.getByZoneAndId("play", herculesTrueHero.id);
//     Target.updateCardMeta({ exerted: true });
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(testStore.getByZoneAndId("play", herculesTrueHero.id).meta).toEqual(
//       Expect.objectContaining({ exerted: false }),
//     );
//   });
// });
//
