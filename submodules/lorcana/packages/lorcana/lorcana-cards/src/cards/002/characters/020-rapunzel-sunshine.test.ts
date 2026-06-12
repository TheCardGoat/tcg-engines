import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { rapunzelSunshine } from "./020-rapunzel-sunshine";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

describe("Rapunzel - Sunshine", () => {
  it("MAGIC HAIR - Exert to remove up to 2 damage from chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: rapunzelSunshine, isDrying: false },
        { card: gastonBaritoneBully, damage: 3 },
      ],
    });

    const rapunzelId = testEngine.findCardInstanceId(rapunzelSunshine, "play");
    const gastonId = testEngine.findCardInstanceId(gastonBaritoneBully, "play");

    // Activate ability
    testEngine.asPlayerOne().activateAbility(rapunzelId, { abilityIndex: 0, targets: [gastonId] });

    // Since it's "up to 2", there might be a prompt to select the amount
    let pendingChoice = testEngine.asPlayerOne().getPendingChoice();
    if (pendingChoice) {
      testEngine.asPlayerOne().resolveNextPending({ amount: 2 });
    }

    // Verify damage removed
    const gaston = testEngine.asServer().getCard(gastonId);
    expect(gaston.damage).toBe(1);

    // Verify Rapunzel is exerted
    const rapunzel = testEngine.asServer().getCard(rapunzelId);
    expect(rapunzel.exerted).toBe(true);
  });

  it("MAGIC HAIR - removes only 1 damage when character has only 1 damage (up to behavior)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: rapunzelSunshine, isDrying: false },
        { card: gastonBaritoneBully, damage: 1 },
      ],
    });

    const rapunzelId = testEngine.findCardInstanceId(rapunzelSunshine, "play");
    const gastonId = testEngine.findCardInstanceId(gastonBaritoneBully, "play");

    // Activate ability
    testEngine.asPlayerOne().activateAbility(rapunzelId, { abilityIndex: 0, targets: [gastonId] });

    // Since it's "up to 2", there might be a prompt to select the amount
    const pendingChoice = testEngine.asPlayerOne().getPendingChoice();
    if (pendingChoice) {
      testEngine.asPlayerOne().resolveNextPending({ amount: 1 });
    }

    // Verify all damage removed (only had 1, and up to 2 means it removes at most the damage present)
    const gaston = testEngine.asServer().getCard(gastonId);
    expect(gaston.damage).toBe(0);

    // Verify Rapunzel is exerted
    const rapunzel = testEngine.asServer().getCard(rapunzelId);
    expect(rapunzel.exerted).toBe(true);
  });
});
