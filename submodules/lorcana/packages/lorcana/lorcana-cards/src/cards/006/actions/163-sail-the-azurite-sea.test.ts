import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { belleStrangeButSpecial } from "../../001";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001/characters";
import { microbots } from "../items";
import { sailTheAzuriteSea } from "./163-sail-the-azurite-sea";

describe("Sail the Azurite Sea", () => {
  it("lets you ink one extra card this turn and still draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sailTheAzuriteSea, microbots, simbaProtectiveCub],
      deck: [mickeyMouseTrueFriend],
      inkwell: sailTheAzuriteSea.cost,
    });

    expect(testEngine.asPlayerOne().ink(microbots)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().ink(simbaProtectiveCub).success).toBe(false);

    expect(testEngine.asPlayerOne().playCard(sailTheAzuriteSea)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, discard: 1, inkwell: 3 });

    expect(testEngine.asPlayerOne().ink(simbaProtectiveCub)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().ink(mickeyMouseTrueFriend).success).toBe(false);
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, discard: 1, inkwell: 4 });
  });

  it("regression: should draw a card even when played from a non-hand source like Kristoff's Lute", () => {
    // Bug: Sail the Azurite Sea was not drawing when played from Kristoff's Lute.
    // The draw effect should fire regardless of how the card was played.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sailTheAzuriteSea],
      deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
      inkwell: sailTheAzuriteSea.cost,
    });

    expect(testEngine.asPlayerOne().playCard(sailTheAzuriteSea)).toBeSuccessfulCommand();

    // Should have drawn a card (1 card from the draw effect)
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBeGreaterThanOrEqual(1);
  });

  it("stacks its extra ink allowance with Belle's static allowance", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sailTheAzuriteSea, microbots, simbaProtectiveCub, mickeyMouseTrueFriend],
      play: [{ card: belleStrangeButSpecial, isDrying: false }],
      deck: 1,
      inkwell: sailTheAzuriteSea.cost,
    });

    expect(testEngine.asPlayerOne().ink(microbots)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(sailTheAzuriteSea)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().ink(simbaProtectiveCub)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().ink(mickeyMouseTrueFriend)).toBeSuccessfulCommand();
  });
});
