import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  CANONICAL_PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { geniePowersUnleashed } from "./076-genie-powers-unleashed";

const cheapAction = createMockAction({
  id: "genie-test-cheap-action",
  name: "Cheap Action",
  cost: 5,
  text: "A cheap action for testing.",
  abilities: [],
});

const expensiveAction = createMockAction({
  id: "genie-test-expensive-action",
  name: "Expensive Action",
  cost: 6,
  text: "An expensive action for testing.",
  abilities: [],
});

const cheapCharacter = createMockCharacter({
  id: "genie-test-cheap-character",
  name: "Cheap Character",
  cost: 3,
  strength: 2,
  willpower: 2,
});

describe("Genie - Powers Unleashed", () => {
  it("has Shift keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [geniePowersUnleashed],
    });

    expect(testEngine.asPlayerOne().hasKeyword(geniePowersUnleashed, "Shift")).toBe(true);
  });

  it("has Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [geniePowersUnleashed],
    });

    expect(testEngine.asPlayerOne().hasKeyword(geniePowersUnleashed, "Evasive")).toBe(true);
  });

  it("is a Floodborn Hero character", () => {
    expect(geniePowersUnleashed.classifications).toEqual(["Floodborn", "Hero"]);
  });

  it("has cost 8, strength 3, willpower 5, lore 3", () => {
    expect(geniePowersUnleashed.cost).toBe(8);
    expect(geniePowersUnleashed.strength).toBe(3);
    expect(geniePowersUnleashed.willpower).toBe(5);
    expect(geniePowersUnleashed.lore).toBe(3);
  });

  describe("PHENOMENAL COSMIC POWER! - Whenever this character quests, you may play an action with cost 5 or less for free.", () => {
    it("plays an action with cost 5 or less for free when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: geniePowersUnleashed, isDrying: false }],
        hand: [cheapAction],
        inkwell: 10,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(geniePowersUnleashed)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(geniePowersUnleashed, {
          resolveOptional: true,
          targets: [cheapAction],
        }),
      ).toBeSuccessfulCommand();

      // Action should be in discard (played and resolved)
      expect(testEngine.asPlayerOne().getCardZone(cheapAction)).toBe("discard");

      // Ink should not have been spent (played for free)
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(10);
    });

    it("does not play an action with cost 6 or more for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: geniePowersUnleashed, isDrying: false }],
        hand: [expensiveAction],
        inkwell: 10,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(geniePowersUnleashed)).toBeSuccessfulCommand();

      // If a bag is created but only has the expensive action, it should not let you play it
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
        // Attempting to target an expensive action should fail or be rejected
        const result = testEngine.asPlayerOne().resolvePendingByCard(geniePowersUnleashed, {
          resolveOptional: true,
          targets: [expensiveAction],
        });
        // Either the command fails or the expensive action stays in hand
        if (!result.success) {
          expect(testEngine.asPlayerOne().getCardZone(expensiveAction)).toBe("hand");
        }
      }

      expect(testEngine.asPlayerOne().getCardZone(expensiveAction)).toBe("hand");
    });

    it("does not play a character card for free (action restriction)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: geniePowersUnleashed, isDrying: false }],
        hand: [cheapCharacter],
        inkwell: 10,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(geniePowersUnleashed)).toBeSuccessfulCommand();

      // Either no bag is created (no valid targets) or the bag can be declined
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
        // Decline the optional
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(geniePowersUnleashed, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      // Character should still be in hand
      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("hand");
    });

    it("allows declining the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: geniePowersUnleashed, isDrying: false }],
        hand: [cheapAction],
        inkwell: 10,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(geniePowersUnleashed)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(geniePowersUnleashed, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Action should still be in hand
      expect(testEngine.asPlayerOne().getCardZone(cheapAction)).toBe("hand");
    });
  });
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
