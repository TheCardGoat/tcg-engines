/** CHN002 Lord Sutcliffe — start-phase face-up trigger and on-play arcane damage. */
import { describe, expect, it } from "vitest";

import { lordSutcliffe } from "../../../../cards/src/cards/mentors/lord-sutcliffe.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";

describe("Lord Sutcliffe mentor (CHN002)", () => {
  it("a1 AAA: controller turns him face-up from face-down Arsenal at start of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [{ card: lordSutcliffe, state: { faceDown: true } }],
        deck: 4,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const instanceId = Bravo.findCardInZone("arsenal", lordSutcliffe);

    expect(game.objectState(instanceId).faceDown).toBe(true);

    Bravo.endTurn();
    Dash.endTurn();
    // Auto-accept the optional "turn face-up" decision
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(Bravo.zone("arsenal")).toContain(lordSutcliffe.canonicalId);
    expect(game.objectState(instanceId).faceDown).toBe(false);
  });

  it("a1 boundary: optional decline keeps Lord Sutcliffe face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [{ card: lordSutcliffe, state: { faceDown: true } }],
        deck: 4,
      },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const instanceId = Bravo.findCardInZone("arsenal", lordSutcliffe);

    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(game.objectState(instanceId).faceDown).toBe(true);
  });
});
