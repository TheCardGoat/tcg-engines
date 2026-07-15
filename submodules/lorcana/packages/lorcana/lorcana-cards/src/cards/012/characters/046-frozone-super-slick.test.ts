import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { frozoneSuperSlick } from "./046-frozone-super-slick";

const nonEvasiveAttacker = createMockCharacter({
  id: "frozone-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "frozone-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
  abilities: [{ type: "keyword", keyword: "Evasive", text: "Evasive" }],
});

describe("Frozone - Super Slick", () => {
  it("cannot be challenged by a character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: nonEvasiveAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: frozoneSuperSlick, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(nonEvasiveAttacker, frozoneSuperSlick),
    ).not.toBeSuccessfulCommand();
  });

  it("can be challenged by a character with Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: evasiveAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: frozoneSuperSlick, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(evasiveAttacker, frozoneSuperSlick),
    ).toBeSuccessfulCommand();
  });

  it("quests for 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: frozoneSuperSlick, isDrying: false }],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(frozoneSuperSlick)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
