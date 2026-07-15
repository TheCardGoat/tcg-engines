import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { queenOfHeartsHaughtyMonarch } from "./105-queen-of-hearts-haughty-monarch";

const damagedChar = (id: string) =>
  createMockCharacter({
    id,
    name: `Damaged Character ${id}`,
    cost: 2,
    strength: 2,
    willpower: 3,
  });

describe("Queen of Hearts - Haughty Monarch", () => {
  it("COUNT OFF! - base lore without 5 damaged characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: queenOfHeartsHaughtyMonarch }],
    });

    const queenId = testEngine.findCardInstanceId(queenOfHeartsHaughtyMonarch, "play");

    // Without damaged characters, lore should be base value (3)
    expect(testEngine.asServer().getCard(queenId).lore).toBe(queenOfHeartsHaughtyMonarch.lore);
  });

  it("COUNT OFF! - base lore with only 4 damaged characters in play", () => {
    const char1 = damagedChar("dmg-1");
    const char2 = damagedChar("dmg-2");
    const char3 = damagedChar("dmg-3");
    const char4 = damagedChar("dmg-4");

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: queenOfHeartsHaughtyMonarch },
        { card: char1, damage: 1 },
        { card: char2, damage: 1 },
        { card: char3, damage: 1 },
        { card: char4, damage: 1 },
      ],
    });

    const queenId = testEngine.findCardInstanceId(queenOfHeartsHaughtyMonarch, "play");

    // With only 4 damaged characters, lore should still be base value
    expect(testEngine.asServer().getCard(queenId).lore).toBe(queenOfHeartsHaughtyMonarch.lore);
  });

  it("COUNT OFF! - gets +3 lore with exactly 5 damaged characters in play", () => {
    const char1 = damagedChar("dmg-1");
    const char2 = damagedChar("dmg-2");
    const char3 = damagedChar("dmg-3");
    const char4 = damagedChar("dmg-4");
    const char5 = damagedChar("dmg-5");

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: queenOfHeartsHaughtyMonarch },
        { card: char1, damage: 1 },
        { card: char2, damage: 1 },
        { card: char3, damage: 1 },
        { card: char4, damage: 1 },
        { card: char5, damage: 1 },
      ],
    });

    const queenId = testEngine.findCardInstanceId(queenOfHeartsHaughtyMonarch, "play");

    // With exactly 5 damaged characters in play, lore should be base + 3
    expect(testEngine.asServer().getCard(queenId).lore).toBe(queenOfHeartsHaughtyMonarch.lore + 3);
  });

  it("COUNT OFF! - gets +3 lore with 5 or more damaged characters across both players", () => {
    const allyChar1 = damagedChar("ally-1");
    const allyChar2 = damagedChar("ally-2");
    const opponentChar1 = damagedChar("opp-1");
    const opponentChar2 = damagedChar("opp-2");
    const opponentChar3 = damagedChar("opp-3");

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: queenOfHeartsHaughtyMonarch },
          { card: allyChar1, damage: 1 },
          { card: allyChar2, damage: 1 },
        ],
      },
      {
        play: [
          { card: opponentChar1, damage: 1 },
          { card: opponentChar2, damage: 1 },
          { card: opponentChar3, damage: 1 },
        ],
      },
    );

    const queenId = testEngine.findCardInstanceId(queenOfHeartsHaughtyMonarch, "play");

    // With 5 damaged characters total (across both players), lore should be base + 3
    expect(testEngine.asServer().getCard(queenId).lore).toBe(queenOfHeartsHaughtyMonarch.lore + 3);
  });
});
