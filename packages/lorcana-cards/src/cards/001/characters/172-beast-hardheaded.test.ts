import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { beastHardheaded } from "./172-beast-hardheaded";

describe("Beast - Hardheaded", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [beastHardheaded] });
  //   Expect(testEngine.getCardModel(beastHardheaded).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { beastHardheaded } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Beast - Hardheaded", () => {
//   It("**DESTRUCTION** When you play this character, you may banish chosen item card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: beastHardheaded.cost,
//       Hand: [beastHardheaded],
//       Play: [dingleHopper],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", beastHardheaded.id);
//     Const target = testStore.getByZoneAndId("play", dingleHopper.id);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
