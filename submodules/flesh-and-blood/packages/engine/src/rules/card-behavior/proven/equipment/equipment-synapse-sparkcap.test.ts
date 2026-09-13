import { typeBoxTokens } from "@tcg/flesh-and-blood-types";
/**
 * PEN057 Synapse Sparkcap — Mechanologist Base Head d1 Battleworn.
 *
 * Printed:
 *   Action - {t}, banish an Evo from your hand: Create a Ponder token.
 *   Battleworn
 *
 * Reasoning (hand-authored):
 * 1. Action activate: mixed cost tap-self + banish 1 hand card filter subtype Evo.
 * 2. Effect: create-token ponder under controller.
 * 3. No Evo in hand → activation illegal (quote-time banish gate).
 * 4. After first use, source is tapped → second activate illegal.
 * 5. Battleworn keyword present (d1 lifecycle covered by battleworn suite).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { synapseSparkcap } from "../../../../../../cards/src/cards/equipment/synapse-sparkcap.ts";
import { evoRecallBlue } from "../../../../../../cards/src/cards/instants/evo-recall.ts";
import { ponder } from "../../../../../../cards/src/cards/tokens/ponder.ts";

const LIFE = 20;

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
    if (decision?.kind === "payment") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [] },
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

describe("synapse-sparkcap (PEN057)", () => {
  it("core mechanic: Action tap + banish Evo from hand → create Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: LIFE,
        head: [synapseSparkcap],
        hand: [evoRecallBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("hand")).toContain(evoRecallBlue.canonicalId);
    expect(Bravo.zone("head")).toContain(synapseSparkcap.canonicalId);

    Bravo.activate(synapseSparkcap);
    drain(game);

    // Cost: Evo banished from hand; helm stays equipped and is tapped.
    expect(Bravo.zone("hand")).not.toContain(evoRecallBlue.canonicalId);
    expect(Bravo.zone("banished")).toContain(evoRecallBlue.canonicalId);
    expect(Bravo.zone("head")).toContain(synapseSparkcap.canonicalId);

    // Effect: Ponder token under controller (catalog id or synthetic token id).
    expect(
      Bravo.zone("arena").includes(ponder.canonicalId) ||
        Bravo.zone("arena").some((id) => /ponder/i.test(id)),
    ).toBe(true);
  });

  it("boundaries: no Evo illegal; tapped second activate illegal; model + battleworn", () => {
    const noEvo = FabTestEngine.start(
      {
        hero: bravo,
        head: [synapseSparkcap],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => noEvo.as(bravo).activate(synapseSparkcap)).toThrow();

    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [synapseSparkcap],
        hand: [evoRecallBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).activate(synapseSparkcap);
    drain(game);
    // Still tapped; even with spare AP and no remaining Evo, second activate fails.
    expect(() => game.as(bravo).activate(synapseSparkcap)).toThrow();

    const a1 = synapseSparkcap.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { type: "tap-self" },
        {
          type: "banish",
          from: "hand",
          count: 1,
          filter: { typeBox: { subtypes: ["Evo"] } },
        },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "create-token",
      token: "ponder",
      controller: "controller",
    });
    expect(synapseSparkcap.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);
    expect(typeBoxTokens(synapseSparkcap.base.typeBox)).toEqual(
      expect.arrayContaining(["Mechanologist", "Equipment", "Base", "Head"]),
    );
  });
});
