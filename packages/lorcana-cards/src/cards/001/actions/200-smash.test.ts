import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { smashundefined } from "./200-smash";

describe("Smash - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [smash] });
  //   expect(testEngine.getCardModel(smash).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { aladdinHeroicOutlaw } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Smash", () => {
//   it("Deal 3 damage to chosen character", () => {
//     const testStore = new TestStore({
//       inkwell: smash.cost,
//       hand: [smash],
//       play: [aladdinHeroicOutlaw],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", smash.id);
//     const target = testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id);
//     target.updateCardMeta({ damage: 0 });
//     expect(
//       testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 0 }));
//
//     cardUnderTest.playFromHand();
//
//     testStore.resolveTopOfStack({
//       targetId: target.instanceId,
//     });
//
//     expect(
//       testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 3 }));
//   });
// });
//
