import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { svenLeapingReindeer } from "./060-sven-leaping-reindeer";

const exertedDefender = createMockCharacter({
  id: "sven-exerted-defender",
  name: "Exerted Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const highWillpowerDefender = createMockCharacter({
  id: "sven-high-willpower-defender",
  name: "High Willpower Defender",
  cost: 3,
  strength: 1,
  willpower: 5,
});

const nonEvasiveAttacker = createMockCharacter({
  id: "sven-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
});

describe("Sven - Leaping Reindeer", () => {
  it("can challenge the turn it is played because of Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [svenLeapingReindeer],
        inkwell: svenLeapingReindeer.cost,
        deck: 5,
      },
      {
        play: [{ card: exertedDefender, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(svenLeapingReindeer)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(svenLeapingReindeer, exertedDefender),
    ).toBeSuccessfulCommand();
  });

  it("gets +3 strength while challenging", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [svenLeapingReindeer],
        inkwell: svenLeapingReindeer.cost,
        deck: 5,
      },
      {
        play: [{ card: highWillpowerDefender, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(svenLeapingReindeer)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(svenLeapingReindeer, highWillpowerDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(highWillpowerDefender)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(svenLeapingReindeer)).toBe("play");
  });

  it("cannot be challenged by a character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: nonEvasiveAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: svenLeapingReindeer, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(nonEvasiveAttacker, svenLeapingReindeer),
    ).not.toBeSuccessfulCommand();
  });
});
