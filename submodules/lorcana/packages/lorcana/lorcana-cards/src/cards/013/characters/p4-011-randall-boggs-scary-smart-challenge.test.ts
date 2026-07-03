import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { randallBoggsScarySmartP4Challenge } from "./p4-011-randall-boggs-scary-smart-challenge";

const friendlyCharacter = createMockCharacter({
  id: "randall-scary-smart-p4-friendly",
  name: "Friendly Character",
  cost: 2,
});

const exertedInk = createMockCharacter({
  id: "randall-scary-smart-p4-exerted-ink",
  name: "Exerted Ink",
  cost: 1,
});

describe("Randall Boggs - Scary Smart - Challenge", () => {
  it("puts a chosen character of yours into your inkwell facedown and exerted when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [randallBoggsScarySmartP4Challenge],
      play: [friendlyCharacter],
      inkwell: randallBoggsScarySmartP4Challenge.cost,
      deck: 3,
    });

    expect(
      testEngine.asPlayerOne().playCard(randallBoggsScarySmartP4Challenge),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(randallBoggsScarySmartP4Challenge, {
        targets: [friendlyCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(friendlyCharacter)).toBe("inkwell");
  });

  it("gains 1 lore at end of turn if all cards in your inkwell are exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [randallBoggsScarySmartP4Challenge],
      inkwell: [{ card: exertedInk, exerted: true }],
      deck: 3,
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
