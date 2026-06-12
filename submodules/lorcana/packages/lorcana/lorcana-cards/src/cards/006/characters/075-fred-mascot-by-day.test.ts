import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { fredMascotByDay } from "./075-fred-mascot-by-day";

const challenger = createMockCharacter({
  id: "fred-mascot-challenger",
  name: "Challenger",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Fred - Mascot by Day", () => {
  it("gains 2 lore when he is challenged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: challenger, isDrying: false }],
        deck: 1,
      },
      {
        play: [{ card: fredMascotByDay, exerted: true }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(0);
    expect(testEngine.asPlayerOne().challenge(challenger, fredMascotByDay)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(testEngine.asPlayerTwo().resolvePendingByCard(fredMascotByDay)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(2);
  });
});
