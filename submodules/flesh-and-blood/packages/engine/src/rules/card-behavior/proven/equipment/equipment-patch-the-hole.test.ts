/**
 * SEA096 Patch the Hole — Ranger Head d0.
 *
 * Printed:
 *   Instant - Destroy this: Return a card from your arsenal to your hand.
 *
 * Reasoning (hand-authored):
 * 1. Instant destroy-self cost; hood leaves head.
 * 2. At-resolution choose 1 arsenal → hand (sole arsenal auto-binds).
 * 3. Empty arsenal → activation illegal / effect unsupported.
 * 4. d0 seat only (no defense keyword).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { patchTheHole } from "../../../../../../cards/src/cards/equipment/patch-the-hole.ts";

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

describe("patch-the-hole (SEA096)", () => {
  it("core mechanic: Instant destroy → return arsenal card to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [patchTheHole],
        arsenal: [snatchRed],
        hand: [],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arsenal")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("hand")).toHaveLength(0);

    Bravo.activate(patchTheHole);
    drain(game);

    expect(Bravo.zone("head")).not.toContain(patchTheHole.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(patchTheHole.canonicalId);
    expect(Bravo.zone("arsenal")).toHaveLength(0);
    expect(Bravo.zone("hand")).toContain(snatchRed.canonicalId);
  });

  it("boundaries: empty arsenal — no card returns to hand; model Instant destroy bounce", () => {
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        head: [patchTheHole],
        arsenal: [],
        hand: [],
        deck: 4,
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    // Cost may still be payable; effect has no arsenal candidate.
    // Accept either hard-reject at activate or soft resolve (destroy self, hand empty).
    try {
      empty.as(bravo).activate(patchTheHole);
      drain(empty);
    } catch {
      // hard reject is also a valid empty-arsenal boundary
    }
    expect(empty.as(bravo).zone("hand")).toHaveLength(0);
    expect(empty.as(bravo).zone("arsenal")).toHaveLength(0);

    const a1 = patchTheHole.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "move-card",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: ["arsenal"],
        count: 1,
      },
      to: { zone: "hand" },
    });
    expect(patchTheHole.base.numeric.defense).toBe(0);
  });
});
