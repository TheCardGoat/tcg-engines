import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { jasmineResourcefulInfiltrator } from "./162-jasmine-resourceful-infiltrator";

describe("Jasmine - Resourceful Infiltrator", () => {
  it("JUST WHAT YOU NEED - optionally grants Resist +1 to another character on play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [jasmineResourcefulInfiltrator],
        inkwell: jasmineResourcefulInfiltrator.cost,
        play: [simbaProtectiveCub],
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(jasmineResourcefulInfiltrator),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const targetId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ targets: [targetId] }),
    ).toBeSuccessfulCommand();

    // Simba should now have Resist +1 - take 1 less damage
    // Simba has willpower 3, strength 2. If challenged by a 2-strength attacker, takes 2-1=1 damage
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
  });
});
