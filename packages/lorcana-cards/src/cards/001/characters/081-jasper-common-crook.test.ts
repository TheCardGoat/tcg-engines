import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { jasperCommonCrook } from "./081-jasper-common-crook";

describe("Jasper - Common Crook", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [jasperCommonCrook] });
  //   Expect(testEngine.getCardModel(jasperCommonCrook).hasKeyword()).toBe(true);
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
//   JasperCommonCrook,
//   LiloMakingAWish,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jasper - Common Crook", () => {
//   It("**PUPPYNAPPING** Whenever this character quests, chosen opposing character can't quest during their next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Deck: 2,
//         Inkwell: jasperCommonCrook.cost,
//         Play: [jasperCommonCrook],
//       },
//       {
//         Deck: 2,
//         Play: [liloMakingAWish],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       JasperCommonCrook.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       LiloMakingAWish.id,
//       "player_two",
//     );
//
//     CardUnderTest.quest();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     TestStore.store.passTurn("player_one");
//
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toEqual(0);
//     Target.quest();
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toEqual(0);
//   });
// });
//
