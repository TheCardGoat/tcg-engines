import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  cinderellaGentleAndKind,
  mickeyMouseTrueFriend,
  moanaOfMotunui,
} from "../../001/characters";
import { iagoGiantSpectralParrot } from "../../007/characters";
import { swoopingStrike } from "./063-swooping-strike";

describe("Swooping Strike", () => {
  it("lets the opponent choose one of their ready characters to exert", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [swoopingStrike],
        inkwell: swoopingStrike.cost,
      },
      {
        play: [mickeyMouseTrueFriend, moanaOfMotunui],
      },
    );

    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", "p2");

    expect(testEngine.asPlayerOne().playCard(swoopingStrike)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().resolveNextPending({ targets: [mickeyId] }).success).toBe(true);

    expect(testEngine.asServer().getCard(mickeyId)?.exerted).toBe(true);
    expect(testEngine.asPlayerTwo()).toBeReady(moanaOfMotunui);
  });

  it("does not affect your own characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [swoopingStrike],
        inkwell: swoopingStrike.cost,
        play: [cinderellaGentleAndKind],
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", "p2");

    expect(testEngine.asPlayerOne().playCard(swoopingStrike)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().resolveNextPending({ targets: [mickeyId] }).success).toBe(true);

    expect(testEngine.asPlayerOne()).toBeReady(cinderellaGentleAndKind);
    expect(testEngine.asServer().getCard(mickeyId)?.exerted).toBe(true);
  });

  it("creates no pending choice when the opponent has no ready characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [swoopingStrike],
        inkwell: swoopingStrike.cost,
      },
      {
        play: [{ card: mickeyMouseTrueFriend, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(swoopingStrike)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHavePendingEffectCount(0);
    expect(testEngine.asPlayerTwo().isExerted(mickeyMouseTrueFriend)).toBe(true);
  });

  it("does not banish Vanish characters chosen by their own controller", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [swoopingStrike],
        inkwell: swoopingStrike.cost,
      },
      {
        play: [iagoGiantSpectralParrot],
      },
    );

    const iagoId = testEngine.findCardInstanceId(iagoGiantSpectralParrot, "play", "p2");

    expect(testEngine.asPlayerOne().playCard(swoopingStrike)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().resolveNextPending({ targets: [iagoId] }).success).toBe(true);

    expect(testEngine.asServer().getCard(iagoId)?.exerted).toBe(true);
    expect(testEngine.asPlayerTwo().getCardZone(iagoGiantSpectralParrot)).toBe("play");
  });

  it("regression: opponent cannot decline exerting a character - choice is mandatory when they have ready characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [swoopingStrike],
        inkwell: swoopingStrike.cost,
      },
      {
        play: [mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(swoopingStrike)).toBeSuccessfulCommand();

    // Opponent must have a pending effect (mandatory choice)
    expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(1);

    // Opponent must choose and exert a character
    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", "p2");
    expect(testEngine.asPlayerTwo().resolveNextPending({ targets: [mickeyId] }).success).toBe(true);
    expect(testEngine.asServer().getCard(mickeyId)?.exerted).toBe(true);
  });
});
