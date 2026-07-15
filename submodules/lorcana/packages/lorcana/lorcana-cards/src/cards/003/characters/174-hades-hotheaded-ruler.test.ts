import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hadesHotheadedRuler } from "./174-hades-hotheaded-ruler";

const titanAlly = createMockCharacter({
  id: "hades-titan-ally",
  name: "Titan Ally",
  cost: 3,
  classifications: ["Storyborn", "Titan"],
});

const nonTitanAlly = createMockCharacter({
  id: "hades-non-titan-ally",
  name: "Non-Titan Ally",
  cost: 3,
  classifications: ["Storyborn", "Ally"],
});

const opposingTitan = createMockCharacter({
  id: "hades-opposing-titan",
  name: "Opposing Titan",
  cost: 4,
  classifications: ["Storyborn", "Titan"],
});

describe("Hades - Hotheaded Ruler", () => {
  it("readies your Titan characters and leaves other characters alone", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          hadesHotheadedRuler,
          { card: titanAlly, exerted: true },
          { card: nonTitanAlly, exerted: true },
        ],
      },
      {
        play: [{ card: opposingTitan, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(hadesHotheadedRuler, {
        ability: "CALL THE TITANS",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(hadesHotheadedRuler)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(titanAlly)).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(nonTitanAlly)).toBe(true);
    expect(testEngine.asPlayerTwo().isExerted(opposingTitan)).toBe(true);
  });
});
