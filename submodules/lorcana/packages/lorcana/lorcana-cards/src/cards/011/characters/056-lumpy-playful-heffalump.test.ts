import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { lumpyPlayfulHeffalump } from "./056-lumpy-playful-heffalump";

const nonEvasiveAttacker = createMockCharacter({
  id: "lumpy-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "lumpy-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
  abilities: [{ type: "keyword", keyword: "Evasive", text: "Evasive" }],
});

describe("Lumpy - Playful Heffalump", () => {
  it("cannot be challenged by a character without Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: nonEvasiveAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: lumpyPlayfulHeffalump, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(nonEvasiveAttacker, lumpyPlayfulHeffalump),
    ).not.toBeSuccessfulCommand();
  });

  it("can be challenged by a character with Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: evasiveAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: lumpyPlayfulHeffalump, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(evasiveAttacker, lumpyPlayfulHeffalump),
    ).toBeSuccessfulCommand();
  });

  it("quests for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: lumpyPlayfulHeffalump, isDrying: false }],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(lumpyPlayfulHeffalump)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
  });
});
