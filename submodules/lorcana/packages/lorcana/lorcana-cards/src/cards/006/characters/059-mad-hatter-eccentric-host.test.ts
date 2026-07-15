import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { madHatterEccentricHost } from "./059-mad-hatter-eccentric-host";

const opponentTopCard = createMockCharacter({
  id: "hatter-opponent-top",
  name: "Opponent Top Card",
  cost: 2,
});

const ownTopCard = createMockCharacter({
  id: "hatter-own-top",
  name: "Own Top Card",
  cost: 2,
});

describe("Mad Hatter - Eccentric Host", () => {
  describe("WE'LL HAVE TO LOOK INTO THIS - Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.", () => {
    it("triggers a bag effect when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: madHatterEccentricHost, isDrying: false }],
          deck: 2,
        },
        {
          deck: [opponentTopCard],
        },
      );

      expect(testEngine.asPlayerOne().quest(madHatterEccentricHost)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("triage 2026-05-05 — accepts the optional, looks at chosen opponent's top card, and discards it", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: madHatterEccentricHost, isDrying: false }],
          deck: 2,
        },
        {
          deck: [opponentTopCard],
        },
      );

      expect(testEngine.asPlayerOne().quest(madHatterEccentricHost)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Step 1: accept the optional, choose opponent as the scry target.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(madHatterEccentricHost, {
          resolveOptional: true,
          playerTargets: PLAYER_TWO,
        }),
      ).toBeSuccessfulCommand();

      // Step 2: send the revealed top card to opponent's discard.
      expect(
        testEngine.asPlayerOne().resolvePendingEffect(madHatterEccentricHost, {
          destinations: [{ zone: "discard", cards: [opponentTopCard] }],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentTopCard)).toBe("discard");
    });

    it("triage 2026-05-05 — accepts the optional, peeks own deck, and keeps the card on top", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: madHatterEccentricHost, isDrying: false }],
        deck: [ownTopCard],
      });

      expect(testEngine.asPlayerOne().quest(madHatterEccentricHost)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(madHatterEccentricHost, {
          resolveOptional: true,
          playerTargets: PLAYER_ONE,
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingEffect(madHatterEccentricHost, {
          destinations: [{ zone: "deck-top", cards: [ownTopCard] }],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownTopCard)).toBe("deck");
    });

    it("does not scry when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: madHatterEccentricHost, isDrying: false }],
          deck: 2,
        },
        {
          deck: [opponentTopCard],
        },
      );

      expect(testEngine.asPlayerOne().quest(madHatterEccentricHost)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(madHatterEccentricHost, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentTopCard)).toBe("deck");
    });
  });
});
