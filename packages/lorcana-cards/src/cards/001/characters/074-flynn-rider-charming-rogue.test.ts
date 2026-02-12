import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { flynnRiderCharmingRogue } from "./074-flynn-rider-charming-rogue";

describe("Flynn Rider - Charming Rogue", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [flynnRiderCharmingRogue] });
  //   Expect(testEngine.getCardModel(flynnRiderCharmingRogue).hasKeyword()).toBe(true);
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
//   FlynnRiderCharmingRogue,
//   HeiheiBoatSnack,
//   MauiDemiGod,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Flynn Rider - Charming Rogue", () => {
//   Describe("**HERE COMES THE SMOLDER** Whenever this character is challenged, the challenging player chooses and discards a card.", () => {
//     It("attacking does not trigger the effect", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [flynnRiderCharmingRogue],
//         },
//         {
//           Play: [heiheiBoatSnack],
//           Hand: [mauiDemiGod],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         FlynnRiderCharmingRogue.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         HeiheiBoatSnack.id,
//         "player_two",
//       );
//
//       CardUnderTest.challenge(defender);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     It("as defender triggers the effect", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [heiheiBoatSnack],
//           Hand: [mauiDemiGod],
//         },
//         {
//           Play: [flynnRiderCharmingRogue],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         FlynnRiderCharmingRogue.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId("play", heiheiBoatSnack.id);
//       Const cardToDiscard = testStore.getByZoneAndId(
//         "hand",
//         MauiDemiGod.id,
//         "player_one",
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(cardUnderTest);
//       TestStore.resolveTopOfStack({
//         Targets: [cardToDiscard],
//       });
//
//       Expect(cardToDiscard.zone).toEqual("discard");
//     });
//   });
// });
//
