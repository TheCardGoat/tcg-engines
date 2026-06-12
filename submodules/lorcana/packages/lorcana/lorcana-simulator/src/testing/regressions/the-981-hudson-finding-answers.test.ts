import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  basilTenaciousMouse,
  hudsonDeterminedReader,
  launchpadExceptionalPilot,
} from "@tcg/lorcana-cards/cards/010";

/**
 * THE-981: Hudson — FINDING ANSWERS should draw a card before the discard choice.
 * Regression: optional { sequence: [draw, discard] } must execute draw when the ability is accepted.
 */
describe("THE-981 Hudson — FINDING ANSWERS (draw then discard)", () => {
  it("draws a card before prompting to discard when the optional is accepted", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hudsonDeterminedReader, basilTenaciousMouse],
      inkwell: hudsonDeterminedReader.cost,
      deck: [launchpadExceptionalPilot],
    });

    expect(engine.asPlayerOne().playCard(hudsonDeterminedReader)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(1);

    // Accept optional: should draw deck top, then require discarding one card from hand.
    expect(
      engine.asPlayerOne().resolvePendingByCard(hudsonDeterminedReader, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getPendingEffects().length).toBe(1);

    const drawnId = engine.findCardInstanceId(launchpadExceptionalPilot, "hand", PLAYER_ONE);
    expect(drawnId).toBeDefined();

    expect(
      engine.asPlayerOne().resolveNextPending({
        targets: drawnId !== undefined ? [drawnId] : [],
      }),
    ).toBeSuccessfulCommand();

    expect(engine.asPlayerOne().getCardZone(launchpadExceptionalPilot)).toBe("discard");
    expect(engine.asPlayerOne().getCardZone(basilTenaciousMouse)).toBe("hand");
    expect(engine.asPlayerOne().getCardZone(hudsonDeterminedReader)).toBe("play");
  });
});
