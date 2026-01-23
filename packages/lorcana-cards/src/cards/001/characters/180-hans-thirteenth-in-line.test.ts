import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { hansThirteenthInLine } from "./180-hans-thirteenth-in-line";

describe("Hans - Thirteenth in Line", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [hansThirteenthInLine] });
  //   expect(testEngine.getCardModel(hansThirteenthInLine).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   hansThirteenthInLine,
//   magicBroomBucketBrigade,
//   mickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Hans Blaster - Thirteenth in Line", () => {
//   it("**STAGE LITTLE ACCIDENT** Whenever this character quests, you may deal 1 damage to chosen character.", () => {
//     const testStore = new TestStore({
//       play: [hansThirteenthInLine, mickeyMouseTrueFriend],
//     });
//
//     const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);
//     target.updateCardMeta({ damage: 1 });
//     expect(target.meta).toEqual(expect.objectContaining({ damage: 1 }));
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       hansThirteenthInLine.id,
//     );
//
//     cardUnderTest.quest();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     expect(target.meta).toEqual(expect.objectContaining({ damage: 2 }));
//     expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
//
//   it("skip effect.", () => {
//     const testStore = new TestStore({
//       play: [hansThirteenthInLine, magicBroomBucketBrigade],
//     });
//
//     const target = testStore.getByZoneAndId("play", magicBroomBucketBrigade.id);
//     target.updateCardMeta({ damage: 1 });
//     expect(
//       testStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 1 }));
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       hansThirteenthInLine.id,
//     );
//
//     cardUnderTest.quest();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack();
//
//     expect(
//       testStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 1 }));
//     expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
