import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { maleficentMonstrousDragon } from "./113-maleficent-monstrous-dragon";

describe("Maleficent - Monstrous Dragon", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [maleficentMonstrousDragon] });
  //   expect(testEngine.getCardModel(maleficentMonstrousDragon).hasKeyword()).toBe(true);
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
//   maleficentMonstrousDragon,
//   moanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Maleficent Monstrous Dragon", () => {
//   it("**Dragon Fire** When you play this character, you may banish chosen character.", () => {
//     const testStore = new TestStore({
//       inkwell: maleficentMonstrousDragon.cost,
//       hand: [maleficentMonstrousDragon],
//       play: [moanaOfMotunui],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       maleficentMonstrousDragon.id,
//     );
//     const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     cardUnderTest.playFromHand();
//
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({
//       targetId: target.instanceId,
//     });
//
//     expect(target.zone).toEqual("discard");
//   });
// });
//
