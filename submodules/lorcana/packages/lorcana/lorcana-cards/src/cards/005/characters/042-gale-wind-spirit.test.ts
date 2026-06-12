import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { galeWindSpirit } from "./042-gale-wind-spirit";

const attacker = createMockCharacter({
  id: "gale-wind-spirit-attacker",
  name: "Attacker",
  cost: 3,
  strength: 5,
  willpower: 4,
  lore: 1,
});

describe("Gale - Wind Spirit", () => {
  it("RECURRING GUST returns to hand when banished in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: attacker, isDrying: false }],
        deck: 1,
      },
      {
        play: [{ card: galeWindSpirit, exerted: true }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().challenge(attacker, galeWindSpirit)).toBeSuccessfulCommand();

    // RECURRING GUST fires as player two's bag effect — resolve it
    const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
    expect(testEngine.asPlayerTwo().resolvePendingByCard(galeWindSpirit)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(galeWindSpirit)).toBe("hand");
  });

  it("does NOT trigger when banished by a non-challenge effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [galeWindSpirit],
      deck: 1,
    });

    // Banish by setting damage to willpower (simulates action/removal)
    expect(
      testEngine.asServer().manualSetDamage(galeWindSpirit, galeWindSpirit.willpower),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(galeWindSpirit)).toBe("discard");
  });
});
