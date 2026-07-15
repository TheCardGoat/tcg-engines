import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { fryingPan } from "./202-frying-pan";

describe("Frying Pan - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [fryingPan] });
  //   Expect(testEngine.getCardModel(fryingPan).hasKeyword()).toBe(true);
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
//   HeiheiBoatSnack,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { fryingPan } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Frying Pan", () => {
//   It("**CLANG!** Banish this item - Chosen character can't challenge during their next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [fryingPan, heiheiBoatSnack],
//       },
//       {
//         Play: [teKaTheBurningOne],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", fryingPan.id);
//     Const attacker = testStore.getByZoneAndId("play", heiheiBoatSnack.id);
//     Const defender = testStore.getByZoneAndId(
//       "play",
//       TeKaTheBurningOne.id,
//       "player_two",
//     );
//
//     Defender.updateCardMeta({ exerted: true });
//
//     CardUnderTest.activate();
//
//     TestStore.resolveTopOfStack({ targetId: attacker.instanceId });
//
//     Expect(attacker.canChallenge(defender)).toEqual(false);
//
//     Expect(defender.meta.damage).toBeFalsy();
//     Expect(attacker.meta.damage).toBeFalsy();
//     Expect(attacker.ready).toBeTruthy();
//   });
// });
//
