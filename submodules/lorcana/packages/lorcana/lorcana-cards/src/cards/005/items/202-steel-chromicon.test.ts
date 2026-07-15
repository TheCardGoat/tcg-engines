import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { steelChromicon } from "./202-steel-chromicon";

const damagedTarget = createMockCharacter({
  id: "steel-chromicon-target",
  name: "Damaged Target",
  cost: 2,
});

describe("Steel Chromicon", () => {
  it("deals 1 damage to the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [],
        play: [steelChromicon],
      },
      {
        deck: [],
        play: [damagedTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(steelChromicon, {
        targets: [damagedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(damagedTarget)).toBe(1);
  });
});
