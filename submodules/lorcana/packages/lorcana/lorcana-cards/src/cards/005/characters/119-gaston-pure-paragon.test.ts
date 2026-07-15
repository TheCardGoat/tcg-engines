import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gastonPureParagon } from "./119-gaston-pure-paragon";

const damagedAlly = createMockCharacter({
  id: "gaston-pure-paragon-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const defender = createMockCharacter({
  id: "gaston-pure-paragon-defender",
  name: "Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Gaston - Pure Paragon", () => {
  describe("A MAN AMONG MEN! For each damaged character you have in play, you pay 2 less to play this character.", () => {
    it("costs full price without damaged characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gastonPureParagon],
        inkwell: gastonPureParagon.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCard(gastonPureParagon).playCost).toBe(
        gastonPureParagon.cost,
      );
      expect(testEngine.asPlayerOne().playCard(gastonPureParagon)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(gastonPureParagon)).toBe("play");
    });

    it("reduces the cost by 2 for each damaged character you have in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gastonPureParagon],
        inkwell: gastonPureParagon.cost - 2,
        play: [{ card: damagedAlly, damage: 1 }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCard(gastonPureParagon).playCost).toBe(
        gastonPureParagon.cost - 2,
      );
      expect(testEngine.asPlayerOne().playCard(gastonPureParagon)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(gastonPureParagon)).toBe("play");
    });
  });

  it("has Rush and can challenge the turn he is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [gastonPureParagon],
        inkwell: gastonPureParagon.cost,
        deck: 2,
      },
      {
        play: [{ card: defender, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(gastonPureParagon)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(gastonPureParagon, "Rush")).toBe(true);
    expect(testEngine.asPlayerOne().challenge(gastonPureParagon, defender)).toBeSuccessfulCommand();
  });
});
