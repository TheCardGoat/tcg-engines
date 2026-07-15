import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub, stitchRockStar } from "../../001";
import { beKingUndisputed } from "./129-be-king-undisputed";

describe("Be King Undisputed", () => {
  it("lets the opponent choose one of their characters to banish", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beKingUndisputed],
        inkwell: beKingUndisputed.cost,
      },
      {
        play: [simbaProtectiveCub, arielOnHumanLegs],
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "player_two");

    expect(testEngine.asPlayerOne().playCard(beKingUndisputed)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().resolveNextPending({ targets: [simbaId] }).success).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(arielOnHumanLegs)).toBe("play");
  });

  it("can be sung by a character with sufficient cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beKingUndisputed],
        play: [stitchRockStar], // cost 6, can sing a cost 4 song
      },
      {
        play: [simbaProtectiveCub, arielOnHumanLegs],
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "player_two");

    expect(
      testEngine.asPlayerOne().singSong(beKingUndisputed, stitchRockStar),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().resolveNextPending({ targets: [simbaId] }).success).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(arielOnHumanLegs)).toBe("play");
  });

  it("can be played even when opponent has no characters (fizzle)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beKingUndisputed],
        inkwell: beKingUndisputed.cost,
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(beKingUndisputed)).toBeSuccessfulCommand();
    // Effect fizzles — no pending selection for opponent, card goes to discard
    expect(testEngine.asPlayerOne().getCardZone(beKingUndisputed)).toBe("discard");
  });

  it("reports as playable via canPlayCard when ink is available", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beKingUndisputed],
        inkwell: beKingUndisputed.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().canPlayCard(beKingUndisputed)).toBe(true);
  });

  it("reports as playable via canPlayCard when a singer is available (no ink)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beKingUndisputed],
        play: [stitchRockStar], // cost 6, can sing a cost 4 song
        inkwell: 0,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().canPlayCard(beKingUndisputed)).toBe(true);
  });

  it("reports as playable even when opponent has no characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beKingUndisputed],
        inkwell: beKingUndisputed.cost,
      },
      {},
    );

    expect(testEngine.asPlayerOne().canPlayCard(beKingUndisputed)).toBe(true);
  });
});
