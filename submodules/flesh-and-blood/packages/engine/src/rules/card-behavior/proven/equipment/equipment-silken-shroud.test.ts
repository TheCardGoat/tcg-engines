/**
 * PEN123 Silken Shroud — Illusionist Head, Ward 1 (no printed defense).
 *
 * Printed:
 *   When this is destroyed, create a Ponder token.
 *   Ward 1
 *
 * Reasoning (hand-authored):
 * 1. Ward 1 (CR 8.3.20): when controller would take damage, destroy this to
 *    prevent 1 — auto-applied from equipped head seat.
 * 2. Ward's destroy cost is a destroy event → static "when this is destroyed"
 *    creates a Ponder under the controller.
 * 3. Boundary: no shroud → full damage, no Ponder.
 * 4. Model: destroy trigger + ward(1); no defense stat.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { silkenShroud } from "../../../../../../cards/src/cards/equipment/silken-shroud.ts";
import { ponder } from "../../../../../../cards/src/cards/tokens/ponder.ts";

const LIFE = 20;
const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function hasPonder(game: ReturnType<typeof FabTestEngine.start>, playerId: string): boolean {
  const arena = game.getState().containers.zonesByPlayerId[playerId]!.arena ?? [];
  return arena.some((id) => {
    const canonical = game.getState().objects[id]?.canonicalId ?? "";
    return (
      canonical === ponder.canonicalId || canonical === "token:ponder" || /ponder/i.test(canonical)
    );
  });
}

describe("silken-shroud (PEN123)", () => {
  it("core mechanic: Ward 1 destroys shroud on damage → create Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [silkenShroud],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    expect(Dash.zone("head")).toContain(silkenShroud.canonicalId);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Snatch 4 − ward 1 = 3 damage.
    expect(Dash.life()).toBe(LIFE - (SNATCH - 1));
    // Ward destroys the equipment.
    expect(Dash.zone("head")).not.toContain(silkenShroud.canonicalId);
    expect(Dash.zone("graveyard")).toContain(silkenShroud.canonicalId);
    // Destroy trigger creates Ponder.
    expect(hasPonder(game, Dash.id)).toBe(true);
  });

  it("boundaries: no shroud → full damage, no Ponder; model ward + destroy trigger", () => {
    const bare = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    bare.as(bravo).attackWith(snatchRed);
    bare.helpers.resolveRestOfCombat();
    expect(bare.as(dash).life()).toBe(LIFE - SNATCH);
    expect(hasPonder(bare, bare.as(dash).id)).toBe(false);

    const a1 = silkenShroud.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.staticKind).toBe("triggered");
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "destroy",
        actor: {
          kind: "any",
        },
        observes: {
          kind: "source",
          selector: "moved-object",
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "create-token",
      token: "ponder",
      controller: "controller",
    });
    expect(
      silkenShroud.base.keywords?.some(
        (k) => k.name === "ward" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
    expect(silkenShroud.base.numeric.defense).toBeUndefined();
  });
});
