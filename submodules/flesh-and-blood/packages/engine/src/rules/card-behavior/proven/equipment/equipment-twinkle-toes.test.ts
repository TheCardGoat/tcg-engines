import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, sigilOfSolaceRed, snatchRed } from "../../../fixtures.ts";
import { twinkleToes } from "../../../../../../cards/src/cards/equipment/twinkle-toes.ts";

describe("twinkle-toes (OSC006)", () => {
  it("AAA: after a real Instant this turn, destroy-self prevents the next 2 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, legs: [twinkleToes], hand: [sigilOfSolaceRed], deck: 6, life: 20 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    Bravo.attackWith(snatchRed, { target: Dash.id });
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    Dash.play(sigilOfSolaceRed);
    Dash.activate(twinkleToes);
    game.helpers.resolveUntilIdle();
    expect(Dash.zone("graveyard")).toContain(twinkleToes.canonicalId);
    expect(Dash.life()).toBe(21);
  });

  it("boundary: activation is illegal before an Instant has been played this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [twinkleToes], actionPoints: 1, deck: 4 },
      { hero: bravo, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(dash).activate(twinkleToes)).toThrow();
    expect(game.as(dash).zone("legs")).toContain(twinkleToes.canonicalId);
  });
});
