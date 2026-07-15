import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { randallBoggsScarySmart } from "./153-randall-boggs-scary-smart";

const friendlyCharacter = createMockCharacter({
  id: "randall-scary-smart-friendly",
  name: "Friendly Character",
  cost: 2,
});

const exertedInk = createMockCharacter({
  id: "randall-scary-smart-exerted-ink",
  name: "Exerted Ink",
  cost: 1,
});

describe("Randall Boggs - Scary Smart", () => {
  it("puts a chosen character of yours into your inkwell facedown and exerted when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [randallBoggsScarySmart],
      play: [friendlyCharacter],
      inkwell: randallBoggsScarySmart.cost,
      deck: 3,
    });

    expect(testEngine.asPlayerOne().playCard(randallBoggsScarySmart)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(randallBoggsScarySmart, {
        targets: [friendlyCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(friendlyCharacter)).toBe("inkwell");
  });

  it("gains 1 lore at end of turn if all cards in your inkwell are exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [randallBoggsScarySmart],
      inkwell: [{ card: exertedInk, exerted: true }],
      deck: 3,
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
