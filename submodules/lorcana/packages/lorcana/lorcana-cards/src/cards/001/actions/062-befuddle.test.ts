import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../characters";
import { shieldOfVirtue } from "../items";
import { befuddle } from "./062-befuddle";

describe("Befuddle", () => {
  it("returns a chosen character with cost 2 or less to its player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [befuddle],
        inkwell: befuddle.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(befuddle, {
      targets: [simbaProtectiveCub],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toEqual("hand");
    expect(testEngine.asPlayerOne().getCardZone(befuddle)).toEqual("discard");
  });

  it("returns a chosen item with cost 2 or less to its player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [befuddle],
      inkwell: befuddle.cost,
      play: [shieldOfVirtue],
    });

    const playResult = testEngine.asPlayerOne().playCard(befuddle, {
      targets: [shieldOfVirtue],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(shieldOfVirtue)).toEqual("hand");
    expect(testEngine.asPlayerOne().getCardZone(befuddle)).toEqual("discard");
  });
});
