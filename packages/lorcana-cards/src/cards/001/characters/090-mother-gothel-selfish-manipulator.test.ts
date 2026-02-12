import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { motherGothelSelfishManipulator } from "./090-mother-gothel-selfish-manipulator";

describe("Mother Gothel - Selfish Manipulator", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [motherGoethelSelfishManipulator] });
  //   Expect(testEngine.getCardModel(motherGoethelSelfishManipulator).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MegaraPullingTheStrings,
//   MickeyMouseTrueFriend,
//   MotherGoethelSelfishManipulator,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mother Gothel - Selfish Manipulator", () => {
//   Describe("**SKIP THE DRAMA, STAY WITH MAMA** While this character is exerted, opposing character can't quest.", () => {
//     It("Opposing character CANNOT quest when she's exerted", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [megaraPullingTheStrings, mickeyMouseTrueFriend],
//         },
//         {
//           Play: [motherGoethelSelfishManipulator],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         MotherGoethelSelfishManipulator.id,
//         "player_two",
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         MegaraPullingTheStrings.id,
//       );
//       Const anotherTarget = testStore.getByZoneAndId(
//         "play",
//         MickeyMouseTrueFriend.id,
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       [target, anotherTarget].forEach((char) => {
//         Expect(char.hasQuestRestriction).toBe(true);
//       });
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//       Target.quest();
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//       AnotherTarget.quest();
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//     });
//
//     It("Opposing character CAN quest when she's NOT exerted", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [megaraPullingTheStrings],
//         },
//         {
//           Play: [motherGoethelSelfishManipulator],
//         },
//       );
//
//       Const target = testStore.getByZoneAndId(
//         "play",
//         MegaraPullingTheStrings.id,
//       );
//
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//       Target.quest();
//       Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
//     });
//   });
// });
//
