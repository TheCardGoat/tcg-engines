/**
 * AAA test for trigger:end-phase.
 * Representative card: Hypothermia (UPR139) — Ice Action Affliction Aura, cost 0.
 * Static triggered ability: "At the beginning of your end phase, destroy Hypothermia."
 * The end-phase event is a production event fired by the persisted end-turn procedure.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "../../../../index.ts";
import { bravo, cosmicFlareRed, dash, hypothermiaBlue } from "../../../fixtures.ts";

describe("trigger: end-phase", () => {
  it("Arrange/Act/Assert: Hypothermia destroys itself at the end of its controller's turn", () => {
    // Arrange — Bravo has Hypothermia already in the arena.
    const game = FabTestEngine.start(
      { hero: bravo, arena: [hypothermiaBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arena")).toContain(hypothermiaBlue.canonicalId);

    // Act — Bravo ends the turn. The end-phase event fires Hypothermia's
    // destroy-self trigger, which auto-resolves via pass priority.
    Bravo.endTurn();

    // Assert — Hypothermia was destroyed and sent to the graveyard.
    expect(Bravo.zone("arena")).not.toContain(hypothermiaBlue.canonicalId);
    expectFabCard(Bravo, hypothermiaBlue).toBeIn("graveyard");
  });

  it("AAA boundary: a non-aura action card does not survive the end-phase — it goes to graveyard during resolution, not via end-phase trigger", () => {
    // Arrange — Cosmic Flare is a Lightning Instant (not an aura, no end-phase trigger).
    // It resolves and goes to graveyard during the action phase, before the end phase.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    Bravo.play(cosmicFlareRed);
    game.passBoth();

    // Assert — It went to graveyard during resolution, not because of an end-phase trigger.
    expectFabCard(Bravo, cosmicFlareRed).toBeIn("graveyard");
    expect(Bravo.zone("arena")).not.toContain(cosmicFlareRed.canonicalId);
  });
});
