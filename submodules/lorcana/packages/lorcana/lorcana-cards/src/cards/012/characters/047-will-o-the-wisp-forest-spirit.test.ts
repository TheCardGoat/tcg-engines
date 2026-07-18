import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { willOTheWispForestSpirit } from "./047-will-o-the-wisp-forest-spirit";
import { snowFort } from "../../011/items/098-snow-fort";

const attacker = createMockCharacter({
  id: "wisp-attacker",
  name: "Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Will o' the Wisp - Forest Spirit", () => {
  it("can challenge an exerted character while Snow Fort gives it +1 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: willOTheWispForestSpirit, isDrying: false }, snowFort],
      },
      {
        play: [{ card: attacker, exerted: true, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(willOTheWispForestSpirit, attacker),
    ).toBeSuccessfulCommand();
  });

  it("COME ON OUT - returns to hand when banished in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: willOTheWispForestSpirit, exerted: true }],
        deck: 5,
      },
      {
        play: [attacker],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(attacker, willOTheWispForestSpirit),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getBagCount()).toBeGreaterThan(0);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(willOTheWispForestSpirit, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(willOTheWispForestSpirit)).toBe("hand");
  });
});
