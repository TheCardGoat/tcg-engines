/**
 * APS005 Virtuoso Bodice — Guardian Chest d2 Blade Break.
 *
 * Printed (i18n):
 *   When this defends, you may remove a suspense counter from an aura you
 *   control. If you do, gain {r}{r}.
 *   Blade Break
 *
 * Model (after fix):
 *   static triggered defend subject:self → optional remove-counters suspense
 *   from controller aura with hasCounter:suspense → then gain-resources 2
 *
 * Reasoning (hand-authored):
 * 1. subject:self — "When this defends"; co-defenders must not fire.
 * 2. Optional remove suspense is the "you may"; "if you do" needs principal
 *    events — named remove-counters previously always proposed events even
 *    with no stack (unlike numeric); fail-closed empty events when missing.
 * 3. Target filter subtypes Aura + hasCounter suspense (types:["Aura"] residue
 *    was loose; hasCounter avoids empty-aura candidates).
 * 4. Accept → −1 suspense + +2{r}; decline → no RP change, counter intact.
 * 5. No suspense aura → accept cannot invent RP (no legal remove / empty
 *    principal).
 * 6. Blade Break d2 after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { virtuosoBodice } from "../../../../../../cards/src/cards/equipment/virtuoso-bodice.ts";

const SNATCH = 4;
const LIFE = 20;

const suspenseAura = {
  canonicalId: "trainer-suspense-aura-virtuoso",
  types: ["Generic", "Action", "Aura"] as const,
  cost: 0,
  keywords: [{ name: "suspense" as const }],
};

function suspenseOn(game: ReturnType<typeof FabTestEngine.start>, instanceId: string): number {
  const meta = game.objectState(instanceId) as
    | { suspenseCounters?: number; namedCounters?: Record<string, number> }
    | undefined;
  if (typeof meta?.suspenseCounters === "number") return meta.suspenseCounters;
  if (typeof meta?.namedCounters?.suspense === "number") return meta.namedCounters.suspense;
  const live = game.getState().objects[instanceId];
  if (!live) return 0;
  return live.counters
    .filter((c) => c.kind === "named" && c.name === "suspense")
    .reduce((sum, c) => sum + c.count, 0);
}

/**
 * Walk combat / stack; boolean optionals answered with `accept`.
 * Entity targets pick first candidate (suspense aura).
 */
function resolveWithOptional(game: ReturnType<typeof FabTestEngine.start>, accept: boolean): void {
  for (let safety = 0; safety < 64; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const need = decision.min ?? 1;
      const picks = decision.candidates.slice(0, need).map((c) => c.instanceId);
      if (picks.length < need && need > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks },
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
            orderedIds: decision.entries.map((e) => e.id),
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

describe("virtuoso-bodice (APS005)", () => {
  it("core mechanic: defend → remove suspense from aura → gain {r}{r}; BB d2", () => {
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
        chest: [virtuosoBodice],
        // Suspense keyword seats with 2 counters (test-fixtures default).
        arena: [suspenseAura],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    const auraId = Defender.findCardInZone("arena", suspenseAura);
    expect(suspenseOn(game, auraId)).toBeGreaterThanOrEqual(1);
    const suspenseBefore = suspenseOn(game, auraId);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(virtuosoBodice);
    resolveWithOptional(game, true);
    game.helpers.resolveRestOfCombat();
    resolveWithOptional(game, false);

    expect(suspenseOn(game, auraId)).toBe(suspenseBefore - 1);
    // Exactly +2{r} (optional.then once — generic then no longer double-fires).
    expect(Defender.resourcePoints()).toBe(2);
    // Blade Break: chest destroyed.
    expect(Defender.zone("chest")).not.toContain(virtuosoBodice.canonicalId);
    expect(Defender.zone("graveyard")).toContain(virtuosoBodice.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
  });

  it("boundaries: decline optional; no aura → no free RP; model subject:self", () => {
    // Decline: counter stays, no RP.
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [virtuosoBodice],
        arena: [suspenseAura],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const auraId = decline.as(dash).findCardInZone("arena", suspenseAura);
    const suspenseBefore = suspenseOn(decline, auraId);
    decline.as(bravo).attackWith(snatchRed);
    decline.as(dash).defendWith(virtuosoBodice);
    resolveWithOptional(decline, false);
    decline.helpers.resolveRestOfCombat();
    resolveWithOptional(decline, false);

    expect(suspenseOn(decline, auraId)).toBe(suspenseBefore);
    expect(decline.as(dash).resourcePoints()).toBe(0);

    // No aura: accept cannot invent +2{r}.
    const noAura = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [virtuosoBodice],
        arena: [],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    noAura.as(bravo).attackWith(snatchRed);
    noAura.as(dash).defendWith(virtuosoBodice);
    // May still open optional; accepting without a legal remove must not grant RP.
    resolveWithOptional(noAura, true);
    noAura.helpers.resolveRestOfCombat();
    resolveWithOptional(noAura, true);
    expect(noAura.as(dash).resourcePoints()).toBe(0);

    const a1 = virtuosoBodice.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered" || a1.resolution.kind !== "effect")
      return;
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "defend",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "defender",
        },
      },
    });
    expect(a1.resolution.effect).toMatchObject({
      type: "optional",
      effect: {
        type: "remove-counters",
        counter: { kind: "named", name: "suspense" },
        count: 1,
      },
      then: { type: "gain-resources", amount: 2 },
    });
  });
});
