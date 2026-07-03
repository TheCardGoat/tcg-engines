import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { darkwingDuckLaunchpadStCanardsFinest } from "./165-darkwing-duck-launchpad-st-canards-finest";

const darkwingShiftBase = createMockCharacter({
  id: "darkwing-launchpad-shift-base",
  name: "Darkwing Duck & Launchpad",
  cost: 3,
});

const weakDefender = createMockCharacter({
  id: "darkwing-launchpad-weak-defender",
  name: "Weak Defender",
  cost: 2,
  strength: 0,
  willpower: 3,
});

describe("Darkwing Duck & Launchpad - St. Canard's Finest", () => {
  it("can be played using Shift 5", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [darkwingDuckLaunchpadStCanardsFinest],
      play: [darkwingShiftBase],
      inkwell: 5,
    });
    const shiftTarget = testEngine.findCardInstanceId(darkwingShiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(darkwingDuckLaunchpadStCanardsFinest, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(darkwingDuckLaunchpadStCanardsFinest)).toBe("play");
  });

  it("has Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [darkwingDuckLaunchpadStCanardsFinest],
    });

    expect(testEngine.asPlayerOne().hasKeyword(darkwingDuckLaunchpadStCanardsFinest, "Ward")).toBe(
      true,
    );
  });

  it("gains 2 lore when banishing another character in a challenge during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: darkwingDuckLaunchpadStCanardsFinest, isDrying: false }],
      },
      {
        play: [{ card: weakDefender, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(darkwingDuckLaunchpadStCanardsFinest, weakDefender),
    ).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(darkwingDuckLaunchpadStCanardsFinest),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });
});
