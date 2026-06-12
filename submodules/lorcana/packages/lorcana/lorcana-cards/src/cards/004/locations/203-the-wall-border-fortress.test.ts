import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theWallBorderFortress } from "./203-the-wall-border-fortress";
import { thebesTheBigOlive } from "./204-thebes-the-big-olive";

const wallGuard = createMockCharacter({
  id: "wall-guard",
  name: "Wall Guard",
  cost: 2,
});

const wallAttacker = createMockCharacter({
  id: "wall-attacker",
  name: "Wall Attacker",
  cost: 3,
  strength: 4,
});

describe("The Wall - Border Fortress", () => {
  it("prevents your other locations from being challenged while you have an exerted character here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          theWallBorderFortress,
          thebesTheBigOlive,
          { card: wallGuard, atLocation: theWallBorderFortress, exerted: true },
        ],
      },
      {
        play: [wallAttacker],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().canChallenge(wallAttacker, thebesTheBigOlive)).toBe(false);
    expect(testEngine.asPlayerTwo().canChallenge(wallAttacker, theWallBorderFortress)).toBe(true);
  });
});
