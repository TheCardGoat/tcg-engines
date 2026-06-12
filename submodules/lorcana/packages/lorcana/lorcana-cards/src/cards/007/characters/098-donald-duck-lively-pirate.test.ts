import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { donaldDuckLivelyPirate } from "./098-donald-duck-lively-pirate";

const attacker = createMockCharacter({
  id: "donald-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const actionInDiscard = createMockAction({
  id: "donald-action-in-discard",
  name: "Action In Discard",
  cost: 3,
  text: "Do something.",
});

const songInDiscard = createMockSong({
  id: "donald-song-in-discard",
  name: "Song In Discard",
  cost: 3,
  text: "A song card.",
});

describe("Donald Duck - Lively Pirate", () => {
  describe("DUCK OF ACTION", () => {
    it("should return an action card that is not a song from discard to hand when challenged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: donaldDuckLivelyPirate, exerted: true }],
          discard: [{ card: actionInDiscard }],
          deck: 1,
        },
        {
          play: [attacker],
          deck: 1,
        },
      );

      // Player one passes their turn so player two can challenge Donald Duck
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(attacker, donaldDuckLivelyPirate),
      ).toBeSuccessfulCommand();

      // Triggered ability should create a bag entry for player one (the controller of Donald)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckLivelyPirate, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Choose the action card from discard if a pending choice exists
      const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
      if (pendingChoice) {
        const actionDiscardId = testEngine.findCardInstanceId(actionInDiscard, "discard");
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [actionDiscardId] }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("hand");
    });

    it("should not return a song card from discard to hand when challenged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: donaldDuckLivelyPirate, exerted: true }],
          discard: [{ card: songInDiscard }],
          deck: 1,
        },
        {
          play: [attacker],
          deck: 1,
        },
      );

      // Player one passes their turn so player two can challenge Donald Duck
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(attacker, donaldDuckLivelyPirate),
      ).toBeSuccessfulCommand();

      // Triggered ability fires (bag entry created), but resolving with a song target is invalid
      // The song should remain in discard after accepting the optional ability
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(donaldDuckLivelyPirate, {
            resolveOptional: true,
          }),
        ).toBeSuccessfulCommand();
      }

      // Song card should remain in discard (songs are excluded from the filter)
      expect(testEngine.asPlayerOne().getCardZone(songInDiscard)).toBe("discard");
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: donaldDuckLivelyPirate, exerted: true }],
          discard: [{ card: actionInDiscard }],
          deck: 1,
        },
        {
          play: [attacker],
          deck: 1,
        },
      );

      // Player one passes their turn so player two can challenge Donald Duck
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(attacker, donaldDuckLivelyPirate),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donaldDuckLivelyPirate, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Action card should remain in discard
      expect(testEngine.asPlayerOne().getCardZone(actionInDiscard)).toBe("discard");
    });

    it("does not trigger when not being challenged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [donaldDuckLivelyPirate],
        discard: [{ card: actionInDiscard }],
        deck: 1,
      });

      // Quest instead of being challenged
      expect(testEngine.asPlayerOne().quest(donaldDuckLivelyPirate)).toBeSuccessfulCommand();

      // No bag entry should be created
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
