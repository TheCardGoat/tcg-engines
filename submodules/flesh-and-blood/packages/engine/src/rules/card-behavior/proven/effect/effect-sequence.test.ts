/**
 * AAA test for effect:sequence.
 * Representative card: Heartbeat of Candlehold (ROS016) — Earth Wizard Action.
 * Resolution effect: sequence of three gain-life 1 steps, each targeting controller.
 * Tests that all steps in the sequence execute in order.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, cosmicFlareRed, dash, heartbeatOfCandleholdBlue } from "../../../fixtures.ts";

describe("effect: sequence", () => {
  it("Arrange/Act/Assert: Heartbeat of Candlehold sequence grants 3 life (3 × gain-life 1)", () => {
    // Arrange — Bravo has Heartbeat of Candlehold (cost 1 Action) in hand.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [heartbeatOfCandleholdBlue], deck: 4, resourcePoints: 1, life: 10 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    // Act — Play the action; the sequence of 3 gain-life steps resolves.
    Bravo.play(heartbeatOfCandleholdBlue);
    game.passBoth();

    // Assert — All 3 sequence steps executed: +3 life total.
    expect(Bravo.life()).toBe(lifeBefore + 3);
  });

  it("AAA boundary: a non-sequence card does not produce stacked life gain", () => {
    // Arrange — Cosmic Flare is an Instant with gain-resources (not gain-life).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 4, life: 10 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    // Act
    Bravo.play(cosmicFlareRed);
    game.passBoth();

    // Assert — Life unchanged (no gain-life effect, sequence or otherwise).
    expect(Bravo.life()).toBe(lifeBefore);
  });
});
