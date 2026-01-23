import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { flynnRiderCharmingRogue } from "./074-flynn-rider-charming-rogue";

describe("Flynn Rider - Charming Rogue", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [flynnRiderCharmingRogue] });
  //   expect(testEngine.getCardModel(flynnRiderCharmingRogue).hasKeyword()).toBe(true);
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
//   flynnRiderCharmingRogue,
//   heiheiBoatSnack,
//   mauiDemiGod,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Flynn Rider - Charming Rogue", () => {
//   describe("**HERE COMES THE SMOLDER** Whenever this character is challenged, the challenging player chooses and discards a card.", () => {
//     it("attacking does not trigger the effect", () => {
//       const testStore = new TestStore(
//         {
//           play: [flynnRiderCharmingRogue],
//         },
//         {
//           play: [heiheiBoatSnack],
//           hand: [mauiDemiGod],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         flynnRiderCharmingRogue.id,
//       );
//       const defender = testStore.getByZoneAndId(
//         "play",
//         heiheiBoatSnack.id,
//         "player_two",
//       );
//
//       cardUnderTest.challenge(defender);
//       expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//     });
//
//     it("as defender triggers the effect", () => {
//       const testStore = new TestStore(
//         {
//           play: [heiheiBoatSnack],
//           hand: [mauiDemiGod],
//         },
//         {
//           play: [flynnRiderCharmingRogue],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         flynnRiderCharmingRogue.id,
//         "player_two",
//       );
//       const attacker = testStore.getByZoneAndId("play", heiheiBoatSnack.id);
//       const cardToDiscard = testStore.getByZoneAndId(
//         "hand",
//         mauiDemiGod.id,
//         "player_one",
//       );
//
//       cardUnderTest.updateCardMeta({ exerted: true });
//
//       attacker.challenge(cardUnderTest);
//       testStore.resolveTopOfStack({
//         targets: [cardToDiscard],
//       });
//
//       expect(cardToDiscard.zone).toEqual("discard");
//     });
//   });
// });
//
