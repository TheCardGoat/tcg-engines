import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { imStuck } from "../../002/actions/063-im-stuck";
import { marshmallowCrankyClimber } from "./053-marshmallow-cranky-climber";

const readyTargetA = createMockCharacter({
  id: "marshmallow-ready-target-a",
  name: "Ready Target A",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const readyTargetB = createMockCharacter({
  id: "marshmallow-ready-target-b",
  name: "Ready Target B",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const readyTargetC = createMockCharacter({
  id: "marshmallow-ready-target-c",
  name: "Ready Target C",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const secondMarshmallowCrankyClimber = {
  ...marshmallowCrankyClimber,
  id: "marshmallow-cranky-climber-second-copy",
  canonicalId: "ci_marshmallow_cranky_climber_second_copy",
} as typeof marshmallowCrankyClimber;

describe("Marshmallow - Cranky Climber", () => {
  it("quests normally and gains lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: marshmallowCrankyClimber, isDrying: false }],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(marshmallowCrankyClimber)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
    expect(testEngine.isExerted(marshmallowCrankyClimber)).toBe(true);
  });

  it("lets the opponent ready only 1 exerted character on their next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: marshmallowCrankyClimber, isDrying: false }],
        deck: 5,
      },
      {
        play: [
          { card: readyTargetA, exerted: true, isDrying: false },
          { card: readyTargetB, exerted: true, isDrying: false },
          { card: readyTargetC, exerted: true, isDrying: false },
        ],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().quest(marshmallowCrankyClimber)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    const readyCount = [readyTargetA, readyTargetB, readyTargetC].filter(
      (card) => !testEngine.isExerted(card),
    ).length;

    expect(readyCount).toBe(1);
  });

  it("does not affect a turn after the next opponent turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: marshmallowCrankyClimber, isDrying: false }],
        deck: 5,
      },
      {
        play: [
          { card: readyTargetA, exerted: true, isDrying: false },
          { card: readyTargetB, exerted: true, isDrying: false },
        ],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().quest(marshmallowCrankyClimber)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    const stillExerted = [readyTargetA, readyTargetB].find((card) => testEngine.isExerted(card));
    expect(stillExerted).toBeDefined();

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    if (!stillExerted) {
      throw new Error("Expected one character to remain exerted after ICY BLAST");
    }

    expect(testEngine.isExerted(stillExerted)).toBe(false);
  });

  it("does not stack into zero ready characters when two Marshmallows quest", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: marshmallowCrankyClimber, isDrying: false },
          { card: secondMarshmallowCrankyClimber, isDrying: false },
        ],
        deck: 5,
      },
      {
        play: [
          { card: readyTargetA, exerted: true, isDrying: false },
          { card: readyTargetB, exerted: true, isDrying: false },
          { card: readyTargetC, exerted: true, isDrying: false },
        ],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().quest(marshmallowCrankyClimber)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(secondMarshmallowCrankyClimber)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    const readyCount = [readyTargetA, readyTargetB, readyTargetC].filter(
      (card) => !testEngine.isExerted(card),
    ).length;

    expect(readyCount).toBe(1);
  });

  it("does not ready a character already prevented from readying by another effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: marshmallowCrankyClimber, isDrying: false }],
        hand: [imStuck],
        inkwell: imStuck.cost,
        deck: 5,
      },
      {
        play: [
          { card: readyTargetA, exerted: true, isDrying: false },
          { card: readyTargetB, exerted: true, isDrying: false },
        ],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(imStuck, {
        targets: [readyTargetA],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(marshmallowCrankyClimber)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.isExerted(readyTargetA)).toBe(true);
    expect(testEngine.isExerted(readyTargetB)).toBe(false);
  });
});
