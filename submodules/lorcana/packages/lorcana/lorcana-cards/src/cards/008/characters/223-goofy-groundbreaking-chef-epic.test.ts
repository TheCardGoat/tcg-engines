import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyGroundbreakingChefEpic } from "./223-goofy-groundbreaking-chef-epic";

const damagedAlly = createMockCharacter({
  id: "goofy-epic-test-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const undamagedAlly = createMockCharacter({
  id: "goofy-epic-test-undamaged-ally",
  name: "Undamaged Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Goofy - Groundbreaking Chef - Epic", () => {
  it("heals each other damaged ally and readies only characters healed this way at the end of your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: goofyGroundbreakingChefEpic, damage: 2, exerted: true },
          { card: damagedAlly, damage: 2, exerted: true },
          { card: undamagedAlly, exerted: true },
        ],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goofyGroundbreakingChefEpic, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(goofyGroundbreakingChefEpic)).toBe(2);
    expect(testEngine.asPlayerOne().isExerted(goofyGroundbreakingChefEpic)).toBe(true);

    expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(1);
    expect(testEngine.asPlayerOne().isExerted(damagedAlly)).toBe(false);

    expect(testEngine.asPlayerOne().getDamage(undamagedAlly)).toBe(0);
    expect(testEngine.asPlayerOne().isExerted(undamagedAlly)).toBe(true);
  });
});
