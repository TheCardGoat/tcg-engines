import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { mauiHalfshark } from "./124-maui-half-shark";

const actionInDiscard = createMockAction({
  id: "maui-test-action-in-discard",
  name: "Test Action In Discard",
  cost: 2,
});

const simpleAction = createMockAction({
  id: "maui-simple-action",
  name: "Simple Action",
  cost: 1,
});

const defender = createMockCharacter({
  id: "maui-defender",
  name: "Opposing Defender",
  cost: 3,
  strength: 2,
  willpower: 3,
});

describe("Maui - Half-Shark", () => {
  describe("Evasive", () => {
    it("has the Evasive keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mauiHalfshark],
      });

      expect(testEngine.hasKeyword(mauiHalfshark, "Evasive")).toBe(true);
    });
  });

  describe("CHEEEEOHOOOO! - Whenever this character challenges another character, you may return an action card from your discard to your hand.", () => {
    it("may return an action card from discard to hand when challenging", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mauiHalfshark],
          discard: [{ card: actionInDiscard }],
          deck: 1,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().challenge(mauiHalfshark, defender)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mauiHalfshark, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        const actionId = testEngine.findCardInstanceId(actionInDiscard, "discard");
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [actionId] }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("hand");
    });

    it("can decline the optional ability and not return a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mauiHalfshark],
          discard: [{ card: actionInDiscard }],
          deck: 1,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().challenge(mauiHalfshark, defender)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(mauiHalfshark, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("discard");
    });

    it("does not trigger when not challenging", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mauiHalfshark],
        discard: [{ card: actionInDiscard }],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(mauiHalfshark)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("regression: CHEEEEOHOOOO! does not trigger when challenging a location", () => {
      const location = createMockLocation({
        id: "maui-test-location",
        name: "Test Location",
        cost: 2,
        moveCost: 1,
        lore: 1,
        willpower: 5,
      });
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mauiHalfshark],
          discard: [{ card: actionInDiscard }],
          deck: 1,
        },
        {
          play: [{ card: location }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().challenge(mauiHalfshark, location)).toBeSuccessfulCommand();

      // CHEEEEOHOOOO! must not fire — card text says "another character", not "another card"
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("discard");
    });
  });

  describe("WAYFINDING - Whenever you play an action, gain 1 lore.", () => {
    it("gains 1 lore when playing an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mauiHalfshark],
        hand: [simpleAction],
        inkwell: simpleAction.cost,
        deck: 2,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine
          .asPlayerOne()
          .playCard(simpleAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(testEngine.asPlayerOne().resolvePendingByCard(mauiHalfshark)).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("does not gain lore when opponent plays an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mauiHalfshark],
          deck: 2,
        },
        {
          hand: [simpleAction],
          inkwell: simpleAction.cost,
          deck: 2,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerTwo()
          .playCard(simpleAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("does NOT trigger if Maui is in discard when the action is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        discard: [mauiHalfshark],
        hand: [simpleAction],
        inkwell: simpleAction.cost,
        deck: 2,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine
          .asPlayerOne()
          .playCard(simpleAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });
  });
});
