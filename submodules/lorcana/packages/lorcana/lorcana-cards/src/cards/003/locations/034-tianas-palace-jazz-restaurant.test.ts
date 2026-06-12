import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tianasPalaceJazzRestaurant } from "./034-tianas-palace-jazz-restaurant";

const protectedGuest = createMockCharacter({
  id: "tiana-protected-guest",
  name: "Protected Guest",
  cost: 2,
});

const exposedGuest = createMockCharacter({
  id: "tiana-exposed-guest",
  name: "Exposed Guest",
  cost: 2,
});

const challenger = createMockCharacter({
  id: "tiana-challenger",
  name: "Challenger",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Tiana's Palace - Jazz Restaurant", () => {
  it("prevents characters here from being challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          tianasPalaceJazzRestaurant,
          { card: protectedGuest, atLocation: tianasPalaceJazzRestaurant, exerted: true },
          { card: exposedGuest, exerted: true },
        ],
      },
      {
        play: [challenger],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().canChallenge(challenger, protectedGuest)).toBe(false);
    expect(testEngine.asPlayerTwo().canChallenge(challenger, exposedGuest)).toBe(true);
  });
});
