import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { owlPirateLookout, liloEscapeArtist } from "../characters";
import { bendToMyWill } from "./093-bend-to-my-will";

describe("Bend to My Will", () => {
  it("Each opponent discards all cards in their hand.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bendToMyWill],
        inkwell: bendToMyWill.cost,
      },
      {
        hand: [owlPirateLookout, liloEscapeArtist],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(bendToMyWill);
    expect(playResult).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 0, discard: 2 });
  });

  it("does nothing when opponent has no cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bendToMyWill],
        inkwell: bendToMyWill.cost,
      },
      {
        hand: [],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(bendToMyWill);
    expect(playResult).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 0, discard: 0 });
  });
});
