import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockSong } from "@tcg/lorcana-engine/testing";
import { signedContract } from "./099-signed-contract";

const drawnCard = createMockSong({
  id: "signed-contract-drawn-card",
  name: "Drawn Card Song",
  cost: 1,
  text: "A test song.",
  abilities: [],
});

const opponentSong = createMockSong({
  id: "signed-contract-opponent-song",
  name: "Opponent Song",
  cost: 2,
  text: "An opponent's song.",
  abilities: [],
});

const controllerSong = createMockSong({
  id: "signed-contract-controller-song",
  name: "Controller Song",
  cost: 2,
  text: "The controller's song.",
  abilities: [],
});

describe("Signed Contract", () => {
  describe("FINE PRINT — Whenever an opponent plays a song, you may draw a card.", () => {
    it("queues an optional draw when the opponent plays a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [signedContract],
          deck: [drawnCard],
        },
        {
          hand: [opponentSong],
          inkwell: opponentSong.cost,
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(opponentSong)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(signedContract)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    });

    it("can decline the optional draw when the opponent plays a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [signedContract],
          deck: [drawnCard],
        },
        {
          hand: [opponentSong],
          inkwell: opponentSong.cost,
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(opponentSong)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(signedContract, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });

    it("does not trigger when the controller plays a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [signedContract],
        hand: [controllerSong],
        inkwell: controllerSong.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(controllerSong)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });
  });
});
