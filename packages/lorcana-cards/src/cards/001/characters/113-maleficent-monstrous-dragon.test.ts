import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { maleficentMonstrousDragon } from "./113-maleficent-monstrous-dragon";

describe("Maleficent - Monstrous Dragon", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [maleficentMonstrousDragon] });
  //   Expect(testEngine.getCardModel(maleficentMonstrousDragon).hasKeyword()).toBe(true);
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
//   MaleficentMonstrousDragon,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maleficent Monstrous Dragon", () => {
//   It("**Dragon Fire** When you play this character, you may banish chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: maleficentMonstrousDragon.cost,
//       Hand: [maleficentMonstrousDragon],
//       Play: [moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MaleficentMonstrousDragon.id,
//     );
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
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
