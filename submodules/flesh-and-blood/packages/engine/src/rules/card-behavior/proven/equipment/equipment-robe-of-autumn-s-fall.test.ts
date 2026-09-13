/**
 * ASR004 Robe of Autumn's Fall — Ninja Chest d0 Arcane Barrier 1.
 *
 * Printed:
 *   When an Edge of Autumn you control hits, you may destroy this. If you do,
 *   gain {r}.
 *   Arcane Barrier 1
 *
 * Reasoning (hand-authored):
 * 1. Prior hit filter subtypes Edge/Of/Autumn is English residue — never
 *    matches type-boxes. Fixed to filter.name "Edge of Autumn" (slug-derived
 *    display name matches via normalizeText).
 * 2. Edge of Autumn OPT Attack {r} + go again (IRA002) — hit opens optional.
 * 3. Accept → chest destroy to GY, +1{r}.
 * 4. Decline → robe stays, RP unchanged.
 * 5. Non-Edge AAC hit (snatch) → no optional, robe stays.
 * 6. Arcane Barrier 1 is keyword stamp (keyword suite); not re-proven here.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { robeOfAutumnSFall } from "../../../../../../cards/src/cards/equipment/robe-of-autumn-s-fall.ts";
import { edgeOfAutumn } from "../../../../../../cards/src/cards/weapons/edge-of-autumn.ts";
import { iraCrimsonHaze as ira } from "../../../../../../cards/src/cards/heroes/ira-crimson-haze.ts";

/**
 * Walk combat/stack; answer the first boolean with `accept`, auto-pass rest.
 */
function resolveWithOptional(
  game: ReturnType<typeof FabTestEngine.start>,
  accept: boolean | null,
): void {
  let answered = false;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (!answered && decision?.kind === "boolean") {
      if (accept === null) {
        throw new Error("unexpected boolean decision when no optional expected");
      }
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      answered = true;
      continue;
    }
    if (decision?.kind === "boolean" && answered) {
      // Decline residual optionals (if any).
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
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((entry) => entry.id),
          },
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
    if (decision) {
      throw new Error(`unexpected decision kind: ${decision.kind}`);
    }
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("robe-of-autumn-s-fall (ASR004)", () => {
  it("core mechanic: Edge of Autumn hit → optional destroy → gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: ira,
        weapon1: [edgeOfAutumn],
        chest: [robeOfAutumnSFall],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    const Ira = game.as(ira);
    const rpBeforeAttack = Ira.resourcePoints();

    // Pay 1{r} for Edge OPT Attack; hit opens the robe optional.
    Ira.activate(edgeOfAutumn);
    const rpAfterPay = Ira.resourcePoints();
    expect(rpAfterPay).toBe(rpBeforeAttack - 1);

    resolveWithOptional(game, true);

    expect(Ira.zone("chest")).not.toContain(robeOfAutumnSFall.canonicalId);
    expect(Ira.zone("graveyard")).toContain(robeOfAutumnSFall.canonicalId);
    // Destroy if-you-do → +1{r} (nets back the Edge attack cost when started at 1).
    expect(Ira.resourcePoints()).toBe(rpAfterPay + 1);
    expect(game.as(dash).life()).toBe(40 - 1);
  });

  it("boundaries: decline keeps robe; non-Edge hit does not trigger", () => {
    // Decline optional.
    const decline = FabTestEngine.start(
      {
        hero: ira,
        weapon1: [edgeOfAutumn],
        chest: [robeOfAutumnSFall],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    const D = decline.as(ira);
    D.activate(edgeOfAutumn);
    const rpAfterPay = D.resourcePoints();
    resolveWithOptional(decline, false);
    expect(D.zone("chest")).toContain(robeOfAutumnSFall.canonicalId);
    expect(D.resourcePoints()).toBe(rpAfterPay);

    // Non-Edge AAC hit → no robe optional.
    const nonEdge = FabTestEngine.start(
      {
        hero: bravo,
        chest: [robeOfAutumnSFall],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = nonEdge.as(bravo);
    Bravo.attackWith(snatchRed);
    resolveWithOptional(nonEdge, null);
    expect(Bravo.zone("chest")).toContain(robeOfAutumnSFall.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);

    // Model guard.
    const a1 = robeOfAutumnSFall.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered" || a1.resolution.kind !== "effect")
      return;
    expect(a1.trigger).toMatchObject({
      event: {
        name: "hit",
        actor: { kind: "player", player: "ability-controller" },
        observes: {
          kind: "event-object",
          selector: "attack",
          filter: { name: "Edge of Autumn" },
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "optional",
      effect: { type: "destroy", target: { selector: "self" } },
      then: { type: "gain-resources", amount: 1 },
    });
    expect(robeOfAutumnSFall.base.keywords).toContainEqual({
      name: "arcane-barrier",
      value: 1,
    });
  });
});
