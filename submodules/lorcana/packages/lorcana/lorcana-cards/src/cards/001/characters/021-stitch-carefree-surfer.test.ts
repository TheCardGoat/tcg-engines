import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { minnieMouseAlwaysClassy, simbaProtectiveCub } from ".";
import { stitchCarefreeSurfer } from "./021-stitch-carefree-surfer";

describe("Stitch - Carefree Surfer", () => {
  it("checks Ohana when the bag effect resolves", () => {
    const noDrawEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stitchCarefreeSurfer],
      inkwell: stitchCarefreeSurfer.cost,
      deck: 2,
      play: [simbaProtectiveCub, minnieMouseAlwaysClassy],
    });

    expect(noDrawEngine.asPlayerOne().playCard(stitchCarefreeSurfer)).toBeSuccessfulCommand();
    expect(noDrawEngine.asPlayerOne().getBagCount()).toBe(1);

    // Remove one character so the Ohana condition (2+ other chars) no longer holds.
    // The engine auto-cancels the queued bag effect — no player input needed (CRD 6.2.7).
    const minnieId = noDrawEngine.findCardInstanceId(minnieMouseAlwaysClassy, "play", PLAYER_ONE);
    expect(
      noDrawEngine.asServer().manualMoveCard(minnieId, `discard:${PLAYER_ONE}` as ZoneId).success,
    ).toBe(true);
    expect(noDrawEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(noDrawEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);

    const noTriggerEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stitchCarefreeSurfer],
      inkwell: stitchCarefreeSurfer.cost,
      deck: 2,
      play: [simbaProtectiveCub],
    });

    expect(noTriggerEngine.asPlayerOne().playCard(stitchCarefreeSurfer)).toBeSuccessfulCommand();
    // Board-state condition is checked at trigger time, ability is not queued when condition is false.
    expect(noTriggerEngine.asPlayerOne().getBagCount()).toBe(0);
    // No Ohana character in play — no card drawn
    expect(noTriggerEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });
});
