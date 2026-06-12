import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hydrosIceTitan } from "./039-hydros-ice-titan";

const blizzardTarget = createMockCharacter({
  id: "hydros-blizzard-target",
  name: "Blizzard Target",
  cost: 2,
});

describe("Hydros - Ice Titan", () => {
  it("exerts the chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [hydrosIceTitan],
      },
      {
        play: [blizzardTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(hydrosIceTitan, {
        ability: "BLIZZARD",
        targets: [blizzardTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(hydrosIceTitan)).toBe(true);
    expect(testEngine.asPlayerTwo().isExerted(blizzardTarget)).toBe(true);
  });
});
