/**
 * APS006 Attention Grabbers — Guardian Arms d1 Blade Break.
 *
 * Printed:
 *   When this defends, you may remove a suspense counter from an aura you
 *   control. If you do, this gets +2{d} this chain link.
 *   Blade Break
 *
 * Reasoning (hand-authored; case-by-case — sibling of APS005 Virtuoso Bodice):
 * 1. "When this defends" requires subject:self (co-defenders must not fire).
 * 2. Optional remove suspense from controller aura; "if you do" → +2{d}
 *    this-chain-link on self (not gain-resources like the chest sibling).
 * 3. Filter: subtypes Aura + hasCounter suspense (types:["Aura"] residue was
 *    loose; empty auras must not be legal remove targets).
 * 4. Accept → −1 suspense, snatch 4 − (1+2) = 1 damage; Blade Break destroys.
 * 5. Decline → d1 only (3 damage), counter intact; BB still destroys.
 * 6. No suspense aura → accept cannot invent +2{d}.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { attentionGrabbers } from "../../../../../../cards/src/cards/equipment/attention-grabbers.ts";

const SNATCH = 4;
const LIFE = 20;
const ARMS_D = 1;

const suspenseAura = {
  canonicalId: "trainer-suspense-aura-attention-grabbers",
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

describe("attention-grabbers (APS006)", () => {
  it("core mechanic: defend remove suspense → +2{d} same link; Blade Break", () => {
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
        arms: [attentionGrabbers],
        arena: [suspenseAura],
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
    Defender.defendWith(attentionGrabbers);
    resolveWithOptional(game, true);
    game.helpers.resolveRestOfCombat();
    resolveWithOptional(game, false);

    // −1 suspense; +2{d} on this link → snatch 4 − 3 = 1.
    expect(suspenseOn(game, auraId)).toBe(suspenseBefore - 1);
    expect(Defender.life()).toBe(LIFE - (SNATCH - (ARMS_D + 2)));
    // Blade Break d1 → GY.
    expect(Defender.zone("arms")).not.toContain(attentionGrabbers.canonicalId);
    expect(Defender.zone("graveyard")).toContain(attentionGrabbers.canonicalId);
  });

  it("boundaries: decline; no aura; co-defender; model subject:self", () => {
    // Decline: d1 only, suspense intact, BB still destroys.
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
        arms: [attentionGrabbers],
        arena: [suspenseAura],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const auraId = decline.as(dash).findCardInZone("arena", suspenseAura);
    const suspenseBefore = suspenseOn(decline, auraId);
    decline.as(bravo).attackWith(snatchRed);
    decline.as(dash).defendWith(attentionGrabbers);
    resolveWithOptional(decline, false);
    decline.helpers.resolveRestOfCombat();
    resolveWithOptional(decline, false);

    expect(suspenseOn(decline, auraId)).toBe(suspenseBefore);
    expect(decline.as(dash).life()).toBe(LIFE - (SNATCH - ARMS_D));
    expect(decline.as(dash).zone("graveyard")).toContain(attentionGrabbers.canonicalId);

    // No aura: accept cannot invent +2{d} (full d1 only).
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
        arms: [attentionGrabbers],
        arena: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    noAura.as(bravo).attackWith(snatchRed);
    noAura.as(dash).defendWith(attentionGrabbers);
    resolveWithOptional(noAura, true);
    noAura.helpers.resolveRestOfCombat();
    resolveWithOptional(noAura, true);
    expect(noAura.as(dash).life()).toBe(LIFE - (SNATCH - ARMS_D));

    // Co-defender alone (hand): subject:self → no suspense remove on arms.
    const co = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [attentionGrabbers],
        arena: [suspenseAura],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const coAura = co.as(dash).findCardInZone("arena", suspenseAura);
    const coSuspenseBefore = suspenseOn(co, coAura);
    co.as(bravo).attackWith(snatchRed);
    co.as(dash).defendWith(nimblismBlue);
    resolveWithOptional(co, true);
    co.helpers.resolveRestOfCombat();
    resolveWithOptional(co, true);
    expect(suspenseOn(co, coAura)).toBe(coSuspenseBefore);
    // Arms not used as defender — still equipped (BB only when this defends).
    expect(co.as(dash).zone("arms")).toContain(attentionGrabbers.canonicalId);

    // Model surface.
    const a1 = attentionGrabbers.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (
      a1?.kind === "static" &&
      a1.staticKind === "triggered" &&
      a1.resolution.kind === "effect" &&
      a1.resolution.effect.type === "optional"
    ) {
      expect(a1.trigger).toMatchObject({
        kind: "event",
        event: { name: "defend", observes: { kind: "source", selector: "defender" } },
      });
      expect(a1.resolution.effect.effect).toMatchObject({
        type: "remove-counters",
        counter: { kind: "named", name: "suspense" },
        target: {
          filter: { typeBox: { subtypes: ["Aura"] }, hasCounter: "suspense" },
        },
      });
      expect(a1.resolution.effect.then).toMatchObject({
        type: "modify-numeric",
        property: "defense",
        amount: 2,
        duration: "this-chain-link",
        target: { selector: "self" },
      });
    }
    expect(attentionGrabbers.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
  });
});
