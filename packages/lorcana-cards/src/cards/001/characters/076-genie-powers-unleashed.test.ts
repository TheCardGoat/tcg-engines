import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { geniePowersUnleashed } from "./076-genie-powers-unleashed";

describe("Genie - Powers Unleashed", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [geniePowerUnleashed] });
  //   expect(testEngine.getCardModel(geniePowerUnleashed).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import {
//   cinderellaGentleAndKind,
//   geniePowerUnleashed,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Genie - Powers Unleashed", () => {
//   describe("Phenomenal Cosmic Power - Whenever this character quests, you may play an action with cost 5 or less for free.", () => {
//     it("On quest - play an action for free", () => {
//       const testStore = new TestStore({
//         deck: 2,
//         play: [geniePowerUnleashed],
//         hand: [dragonFire],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         geniePowerUnleashed.id,
//       );
//       const target = testStore.getByZoneAndId("hand", dragonFire.id);
//
//       cardUnderTest.quest();
//       testStore.resolveOptionalAbility();
//       testStore.resolveTopOfStack({ targetId: target.instanceId });
//
//       expect(target.zone).toEqual("play");
//     });
//
//     it("On quest - if no valid target is available, skip it", () => {
//       const testStore = new TestStore({
//         deck: 2,
//         play: [geniePowerUnleashed],
//         hand: [cinderellaGentleAndKind],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         geniePowerUnleashed.id,
//       );
//       const shouldNotBeTarget = testStore.getByZoneAndId(
//         "hand",
//         cinderellaGentleAndKind.id,
//       );
//
//       cardUnderTest.quest();
//       testStore.resolveTopOfStack();
//
//       expect(shouldNotBeTarget.zone).toEqual("hand");
//     });
//   });
// });
//
