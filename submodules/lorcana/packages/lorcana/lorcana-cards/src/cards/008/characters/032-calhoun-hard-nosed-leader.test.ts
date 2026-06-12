import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { calhounHardnosedLeader } from "./032-calhoun-hard-nosed-leader";

const challenger = createMockCharacter({
  id: "calhoun-challenger",
  name: "Challenger",
  cost: 2,
  strength: 5,
  willpower: 5,
});

describe("Calhoun - Hard-Nosed Leader", () => {
  it("has Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [calhounHardnosedLeader],
    });

    expect(testEngine.hasKeyword(calhounHardnosedLeader, "Bodyguard")).toBe(true);
  });

  it("LOOT DROP - gains 1 lore when this character is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [calhounHardnosedLeader],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    expect(
      testEngine.asServer().manualSetDamage(calhounHardnosedLeader, 5),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(calhounHardnosedLeader)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });

  it("LOOT DROP - gains 1 lore when banished in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [calhounHardnosedLeader],
      },
      {
        play: [{ card: challenger, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    expect(
      testEngine.asPlayerOne().challenge(calhounHardnosedLeader, challenger),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(calhounHardnosedLeader)).toBe("discard");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
