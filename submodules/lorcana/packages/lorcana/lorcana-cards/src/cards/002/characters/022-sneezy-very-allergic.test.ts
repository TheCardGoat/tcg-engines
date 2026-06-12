import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { sneezyVeryAllergic } from "./022-sneezy-very-allergic";
import { bashfulHopelessRomantic } from "./001-bashful-hopeless-romantic";
import { gastonBaritoneBully } from "./008-gaston-baritone-bully";

describe("Sneezy - Very Allergic", () => {
  it("AH-CHOO! - triggers when playing Sneezy", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: gastonBaritoneBully }],
      hand: [{ card: sneezyVeryAllergic }],
      inkwell: Array.from({ length: 5 }).map(() => ({ card: gastonBaritoneBully })),
    });

    const sneezyId = testEngine.findCardInstanceId(sneezyVeryAllergic, "hand");
    const gastonId = testEngine.findCardInstanceId(gastonBaritoneBully, "play");

    testEngine.asPlayerOne().playCard(sneezyId);

    testEngine.asPlayerOne().resolvePendingByCard(sneezyVeryAllergic, { resolveOptional: true });

    // Target a character
    let pendingChoice = testEngine.asPlayerOne().getPendingChoice();
    if (pendingChoice) {
      testEngine.asPlayerOne().resolveNextPending({ targets: [gastonId] });
    }

    const gaston = testEngine.asServer().getCard(gastonId);
    expect(gaston.strength).toBe(gastonBaritoneBully.strength - 1);
  });

  it("AH-CHOO! - triggers when playing another Seven Dwarfs character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: sneezyVeryAllergic }, { card: gastonBaritoneBully }],
      hand: [{ card: bashfulHopelessRomantic }],
      inkwell: Array.from({ length: 5 }).map(() => ({ card: gastonBaritoneBully })),
    });

    const bashfulId = testEngine.findCardInstanceId(bashfulHopelessRomantic, "hand");
    const gastonId = testEngine.findCardInstanceId(gastonBaritoneBully, "play");

    testEngine.asPlayerOne().playCard(bashfulId);

    testEngine.asPlayerOne().resolvePendingByCard(sneezyVeryAllergic, { resolveOptional: true });

    // Target a character
    let pendingChoice = testEngine.asPlayerOne().getPendingChoice();
    if (pendingChoice) {
      testEngine.asPlayerOne().resolveNextPending({ targets: [gastonId] });
    }

    const gaston = testEngine.asServer().getCard(gastonId);
    expect(gaston.strength).toBe(gastonBaritoneBully.strength - 1);
  });

  it("AH-CHOO! - does not trigger when playing non-Seven Dwarfs character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: sneezyVeryAllergic }],
      hand: [{ card: gastonBaritoneBully }],
      inkwell: Array.from({ length: 5 }).map(() => ({ card: gastonBaritoneBully })),
    });

    const gastonHandId = testEngine.findCardInstanceId(gastonBaritoneBully, "hand");

    testEngine.asPlayerOne().playCard(gastonHandId);

    // No triggers in bag
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("AH-CHOO! - does not trigger when opponent plays a Seven Dwarfs character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: sneezyVeryAllergic }],
      },
      {
        hand: [{ card: bashfulHopelessRomantic }],
        inkwell: Array.from({ length: 5 }).map(() => ({ card: gastonBaritoneBully })),
      },
    );

    const bashfulHandId = testEngine.findCardInstanceId(
      bashfulHopelessRomantic,
      "hand",
      "player_two",
    );

    testEngine.asPlayerTwo().playCard(bashfulHandId);

    // No triggers in bag for player one
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
