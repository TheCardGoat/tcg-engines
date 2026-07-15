import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { cogsworthTalkingClock } from "./143-cogsworth-talking-clock";

const recklessCharacter = createMockCharacter({
  id: "cogsworth-test-reckless",
  name: "Reckless Character",
  cost: 2,
  abilities: [
    {
      id: "cogsworth-test-reckless-1",
      keyword: "Reckless",
      text: "Reckless",
      type: "keyword",
    },
  ],
});

const ordinaryCharacter = createMockCharacter({
  id: "cogsworth-test-ordinary",
  name: "Ordinary Character",
  cost: 2,
});

describe("Cogsworth - Talking Clock", () => {
  it('gives your Reckless characters "{E} — Gain 1 lore."', () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: cogsworthTalkingClock, isDrying: false },
        { card: recklessCharacter, isDrying: false },
        { card: ordinaryCharacter, isDrying: false },
      ],
    });

    const recklessId = testEngine.findCardInstanceId(recklessCharacter, "play", "player_one");
    const ordinaryId = testEngine.findCardInstanceId(ordinaryCharacter, "play", "player_one");

    expect(testEngine.asPlayerOne().activateAbility(recklessId, { abilityIndex: 0 }).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
    expect(testEngine.asPlayerOne().isExerted(recklessId)).toBe(true);

    expect(testEngine.asPlayerOne().activateAbility(ordinaryId, { abilityIndex: 0 }).success).toBe(
      false,
    );
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });
});
