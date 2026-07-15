import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { geniePowersUnleashed } from "./076-genie-powers-unleashed";

describe("Genie - Powers Unleashed", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [geniePowerUnleashed] });
  //   Expect(testEngine.getCardModel(geniePowerUnleashed).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   CinderellaGentleAndKind,
//   GeniePowerUnleashed,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Genie - Powers Unleashed", () => {
//   Describe("Phenomenal Cosmic Power - Whenever this character quests, you may play an action with cost 5 or less for free.", () => {
//     It("On quest - play an action for free", () => {
//       Const testStore = new TestStore({
//         Deck: 2,
//         Play: [geniePowerUnleashed],
//         Hand: [dragonFire],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         GeniePowerUnleashed.id,
//       );
//       Const target = testStore.getByZoneAndId("hand", dragonFire.id);
//
//       CardUnderTest.quest();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//       Expect(target.zone).toEqual("play");
//     });
//
//     It("On quest - if no valid target is available, skip it", () => {
//       Const testStore = new TestStore({
//         Deck: 2,
//         Play: [geniePowerUnleashed],
//         Hand: [cinderellaGentleAndKind],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         GeniePowerUnleashed.id,
//       );
//       Const shouldNotBeTarget = testStore.getByZoneAndId(
//         "hand",
//         CinderellaGentleAndKind.id,
//       );
//
//       CardUnderTest.quest();
//       TestStore.resolveTopOfStack();
//
//       Expect(shouldNotBeTarget.zone).toEqual("hand");
//     });
//   });
// });
//
