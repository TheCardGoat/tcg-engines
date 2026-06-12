import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { willOTheWispForestSpiritP3Challenge } from "./p3-051-will-o-the-wisp-forest-spirit-challenge";

const attacker = createMockCharacter({
  id: "wisp-p3-attacker",
  name: "Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Will o' the Wisp - Forest Spirit (P3 Challenge)", () => {
  it("COME ON OUT - returns to hand when banished in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: willOTheWispForestSpiritP3Challenge, exerted: true }],
        deck: 5,
      },
      {
        play: [attacker],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(attacker, willOTheWispForestSpiritP3Challenge),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getBagCount()).toBeGreaterThan(0);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(willOTheWispForestSpiritP3Challenge, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(willOTheWispForestSpiritP3Challenge)).toBe("hand");
  });
});
