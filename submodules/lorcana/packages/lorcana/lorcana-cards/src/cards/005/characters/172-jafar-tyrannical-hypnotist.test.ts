import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jafarTyrannicalHypnotist } from "./172-jafar-tyrannical-hypnotist";

const lowCostAttacker = createMockCharacter({
  id: "jafar-hypnotist-low-cost-attacker",
  name: "Low Cost Attacker",
  cost: 4,
  strength: 2,
  willpower: 4,
});

const highCostAttacker = createMockCharacter({
  id: "jafar-hypnotist-high-cost-attacker",
  name: "High Cost Attacker",
  cost: 5,
  strength: 2,
  willpower: 4,
});

const exertedTarget = createMockCharacter({
  id: "jafar-hypnotist-exerted-target",
  name: "Exerted Target",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Jafar - Tyrannical Hypnotist", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [jafarTyrannicalHypnotist],
      inkwell: jafarTyrannicalHypnotist.cost,
    });

    expect(testEngine.asPlayerOne().playCard(jafarTyrannicalHypnotist)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(jafarTyrannicalHypnotist)).toBe("play");
  });

  it("INTIMIDATING GAZE - opposing character with cost 4 can't challenge while Jafar is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [jafarTyrannicalHypnotist, { card: exertedTarget, exerted: true }],
        deck: 5,
      },
      {
        play: [lowCostAttacker],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Low cost (cost 4) opponent cannot challenge the exerted target because of Jafar
    expect(
      testEngine.asPlayerTwo().challenge(lowCostAttacker, exertedTarget),
    ).not.toBeSuccessfulCommand();
  });

  it("INTIMIDATING GAZE - opposing character with cost 5 or more can still challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [jafarTyrannicalHypnotist, { card: exertedTarget, exerted: true }],
        deck: 5,
      },
      {
        play: [highCostAttacker],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // High cost (cost 5) opponent can still challenge
    expect(
      testEngine.asPlayerTwo().challenge(highCostAttacker, exertedTarget),
    ).toBeSuccessfulCommand();
  });

  it("INTIMIDATING GAZE - does not restrict low cost character when Jafar is not in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: exertedTarget, exerted: true }],
        deck: 5,
      },
      {
        play: [lowCostAttacker],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Without Jafar, low cost character can challenge normally
    expect(
      testEngine.asPlayerTwo().challenge(lowCostAttacker, exertedTarget),
    ).toBeSuccessfulCommand();
  });
});
