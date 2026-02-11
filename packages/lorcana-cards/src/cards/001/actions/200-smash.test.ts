import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { smashundefined } from "./200-smash";

describe("Smash - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [smash] });
  //   Expect(testEngine.getCardModel(smash).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { aladdinHeroicOutlaw } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Smash", () => {
//   It("Deal 3 damage to chosen character", () => {
//     Const testStore = new TestStore({
//       Inkwell: smash.cost,
//       Hand: [smash],
//       Play: [aladdinHeroicOutlaw],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", smash.id);
//     Const target = testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id);
//     Target.updateCardMeta({ damage: 0 });
//     Expect(
//       TestStore.getByZoneAndId("play", aladdinHeroicOutlaw.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 0 }));
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(
//       TestStore.getByZoneAndId("play", aladdinHeroicOutlaw.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 3 }));
//   });
// });
//
