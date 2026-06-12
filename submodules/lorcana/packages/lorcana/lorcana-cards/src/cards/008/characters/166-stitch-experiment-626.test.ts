import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { stitchExperiment626 } from "./166-stitch-experiment-626";
import { arthurDeterminedSquire } from "./168-arthur-determined-squire";
import { roquefortLockExpert } from "./172-roquefort-lock-expert";

const nonInkableCharacter = createMockCharacter({
  id: "stitch-test-non-inkable-character",
  name: "Non Inkable Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: false,
});

describe("Stitch - Experiment 626", () => {
  describe("SO NAUGHTY - When you play this character, each opponent puts the top card of their deck into their inkwell facedown and exerted.", () => {
    it("forces each opponent to put the top card of their deck into their inkwell when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [stitchExperiment626],
          inkwell: stitchExperiment626.cost,
          deck: 10,
        },
        {
          deck: 10,
        },
      );

      expect(testEngine.asPlayerTwo().getZonesCardCount()).toMatchObject({
        deck: 10,
        inkwell: 0,
      });

      expect(testEngine.asPlayerOne().playCard(stitchExperiment626)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getZonesCardCount()).toMatchObject({
        deck: 9,
        inkwell: 1,
      });
    });

    it("does not affect player one's inkwell when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [stitchExperiment626],
          inkwell: stitchExperiment626.cost,
          deck: 10,
        },
        {
          deck: 10,
        },
      );

      const inkBefore = testEngine.asPlayerOne().getZonesCardCount().inkwell;
      expect(testEngine.asPlayerOne().playCard(stitchExperiment626)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(inkBefore);
    });
  });

  describe("STEALTH MODE - At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play this character for free and he enters play exerted.", () => {
    it("triggers at the start of your turn when this card is in your discard and lets you discard an inkable card to play it for free exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [arthurDeterminedSquire, roquefortLockExpert],
          discard: [stitchExperiment626],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      // Pass both turns to get back to player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // STEALTH MODE should trigger - accept the optional
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(stitchExperiment626, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose to discard an inkable card from hand
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [arthurDeterminedSquire] }),
      ).toBeSuccessfulCommand();

      // Arthur should be in discard, Stitch should be in play (exerted)
      expect(testEngine.asPlayerOne().getCardZone(arthurDeterminedSquire)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(stitchExperiment626)).toBe("play");
      expect(
        testEngine
          .asPlayerOne()
          .isExerted(testEngine.findCardInstanceId(stitchExperiment626, "play")!),
      ).toBe(true);
    });

    it("can be declined - Stitch stays in discard and the discarded hand card is not affected", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [arthurDeterminedSquire],
          discard: [stitchExperiment626],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // STEALTH MODE triggers, decline it
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(stitchExperiment626, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(arthurDeterminedSquire)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(stitchExperiment626)).toBe("discard");
    });

    it("does not trigger when Stitch is NOT in your discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [arthurDeterminedSquire],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // No STEALTH MODE trigger since Stitch is not in discard
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("only accepts inkable cards as the discard cost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nonInkableCharacter],
          discard: [stitchExperiment626],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // STEALTH MODE cannot trigger because there's no inkable card in hand
      // The engine should either not show the ability or reject the attempt
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
