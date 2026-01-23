import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { fryingPan } from "./202-frying-pan";

describe("Frying Pan - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [fryingPan] });
  //   expect(testEngine.getCardModel(fryingPan).hasKeyword()).toBe(true);
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
//   heiheiBoatSnack,
//   teKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { fryingPan } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Frying Pan", () => {
//   it("**CLANG!** Banish this item - Chosen character can't challenge during their next turn.", () => {
//     const testStore = new TestStore(
//       {
//         play: [fryingPan, heiheiBoatSnack],
//       },
//       {
//         play: [teKaTheBurningOne],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId("play", fryingPan.id);
//     const attacker = testStore.getByZoneAndId("play", heiheiBoatSnack.id);
//     const defender = testStore.getByZoneAndId(
//       "play",
//       teKaTheBurningOne.id,
//       "player_two",
//     );
//
//     defender.updateCardMeta({ exerted: true });
//
//     cardUnderTest.activate();
//
//     testStore.resolveTopOfStack({ targetId: attacker.instanceId });
//
//     expect(attacker.canChallenge(defender)).toEqual(false);
//
//     expect(defender.meta.damage).toBeFalsy();
//     expect(attacker.meta.damage).toBeFalsy();
//     expect(attacker.ready).toBeTruthy();
//   });
// });
//
