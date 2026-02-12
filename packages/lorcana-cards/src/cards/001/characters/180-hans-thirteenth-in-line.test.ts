import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { hansThirteenthInLine } from "./180-hans-thirteenth-in-line";

describe("Hans - Thirteenth in Line", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [hansThirteenthInLine] });
  //   Expect(testEngine.getCardModel(hansThirteenthInLine).hasKeyword()).toBe(true);
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
//   HansThirteenthInLine,
//   MagicBroomBucketBrigade,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hans Blaster - Thirteenth in Line", () => {
//   It("**STAGE LITTLE ACCIDENT** Whenever this character quests, you may deal 1 damage to chosen character.", () => {
//     Const testStore = new TestStore({
//       Play: [hansThirteenthInLine, mickeyMouseTrueFriend],
//     });
//
//     Const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);
//     Target.updateCardMeta({ damage: 1 });
//     Expect(target.meta).toEqual(expect.objectContaining({ damage: 1 }));
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       HansThirteenthInLine.id,
//     );
//
//     CardUnderTest.quest();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.meta).toEqual(expect.objectContaining({ damage: 2 }));
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
//
//   It("skip effect.", () => {
//     Const testStore = new TestStore({
//       Play: [hansThirteenthInLine, magicBroomBucketBrigade],
//     });
//
//     Const target = testStore.getByZoneAndId("play", magicBroomBucketBrigade.id);
//     Target.updateCardMeta({ damage: 1 });
//     Expect(
//       TestStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 1 }));
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       HansThirteenthInLine.id,
//     );
//
//     CardUnderTest.quest();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack();
//
//     Expect(
//       TestStore.getByZoneAndId("play", magicBroomBucketBrigade.id).meta,
//     ).toEqual(expect.objectContaining({ damage: 1 }));
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
