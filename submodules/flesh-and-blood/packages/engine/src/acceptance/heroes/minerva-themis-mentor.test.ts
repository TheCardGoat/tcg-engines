/** BOL002 Minerva Themis — optional face-up transition at controller turn start. */
import { describe, expect, it } from "vitest";

import { minervaThemis } from "../../../../cards/src/cards/mentors/minerva-themis.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Minerva Themis mentor (BOL002)", () => {
  it("a1 AAA: controller turns her face-up from face-down Arsenal at start of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [{ card: minervaThemis, state: { faceDown: true } }],
        deck: 4,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const instanceId = Bravo.findCardInZone("arsenal", minervaThemis);

    expect(game.objectState(instanceId).faceDown).toBe(true);

    // Bravo ends turn → Dash's turn
    Bravo.endTurn();
    // Dash ends turn → Bravo's next turn begins, start-phase triggers fire
    Dash.endTurn();
    // Auto-accept the optional "turn face-up" decision
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Minerva should now be face-up in Arsenal
    expect(Bravo.zone("arsenal")).toContain(minervaThemis.canonicalId);
    expect(game.objectState(instanceId).faceDown).toBe(false);
  });

  it("a1 boundary: declining the optional keeps Minerva face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [{ card: minervaThemis, state: { faceDown: true } }],
        deck: 4,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const instanceId = Bravo.findCardInZone("arsenal", minervaThemis);

    expect(game.objectState(instanceId).faceDown).toBe(true);

    Bravo.endTurn();
    Dash.endTurn();
    // Decline the optional — Minerva stays face-down
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Bravo.zone("arsenal")).toContain(minervaThemis.canonicalId);
    expect(game.objectState(instanceId).faceDown).toBe(true);
  });

  it("a1 boundary: does NOT trigger when already face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [{ card: minervaThemis, state: { faceDown: false } }],
        deck: 4,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const instanceId = Bravo.findCardInZone("arsenal", minervaThemis);

    expect(game.objectState(instanceId).faceDown).toBe(false);

    // Cycle turns — the trigger condition (face-down-in-arsenal) is false
    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // Minerva should still be face-up (trigger never fired)
    expect(Bravo.zone("arsenal")).toContain(minervaThemis.canonicalId);
    expect(game.objectState(instanceId).faceDown).toBe(false);
  });
});
