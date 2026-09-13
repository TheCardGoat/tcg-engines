/**
 * SEA010 Unicycle — Mechanologist Legs d1 Battleworn.
 * Printed: Instant - Destroy this: {u} a cog you control.
 * Mirrors proven SEA009 rust-belt (tap cog) + SEA007 spitfire (tap-cog pattern).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { unicycle } from "../../../../../../cards/src/cards/equipment/unicycle.ts";

const LIFE = 20;

describe("unicycle (SEA010)", () => {
  it("core: Instant destroy → untap a cog you control", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], deck: 6 },
      {
        hero: dash,
        life: LIFE,
        legs: [unicycle],
        arena: [{ card: fabToken("golden-cog"), state: { tapped: true } }],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const cogId = Dash.findCardInZone("arena", fabToken("golden-cog"));
    expect(game.getState().objects[cogId]?.markers.some((m) => m.kind === "tapped")).toBe(true);

    // It's bravo's turn (bravo is player-1). Pass priority to dash.
    const prio = game.getState().priority?.holderPlayerId;
    if (prio === Bravo.id) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
    }

    // Activate unicycle: destroy → untap target cog.
    Dash.activate(unicycle);
    // Answer the entity-target decision (pick the golden-cog).
    for (let s = 0; s < 16; s += 1) {
      const d = game.getState().decision;
      if (d?.kind === "entity-target") {
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "entity-target", instanceIds: [d.candidates[0]!.instanceId] },
          },
        });
        continue;
      }
      if (d && game.answerForcedDecision()) continue;
      if (d) break;
      if (game.getState().rulesStack.length > 0) {
        game.passBoth();
        continue;
      }
      break;
    }

    // Legs destroyed → GY.
    expect(Dash.zone("legs")).not.toContain(unicycle.canonicalId);
    expect(Dash.zone("graveyard")).toContain(unicycle.canonicalId);
    // Cog is untapped now (no tapped marker).
    expect(game.getState().objects[cogId]?.markers.some((m) => m.kind === "tapped")).toBe(false);
  });

  it("boundary: no cog → illegal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], deck: 6 },
      { hero: dash, life: LIFE, legs: [unicycle], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(dash).activate(unicycle)).toThrow();
    expect(game.as(dash).zone("legs")).toContain(unicycle.canonicalId);
  });
});
