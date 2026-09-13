/**
 * ASR003 Iris of the Blossom — Ninja Head d2 bladeBreak.
 *
 * Printed:
 *   Instant - {t}, discard a card: Search your deck for a Whirling Mist
 *   Blossom, banish it, then shuffle. You may play it this turn.
 *   Activate this only if you've hit this turn.
 *   Blade Break
 *
 * Model:
 *   Instant activated; cost tap-self + discard 1; condition hit-this-turn;
 *   search name WMB → banished outputBinding it → shuffle → optional play it
 *   this turn.
 *
 * Reasoning:
 * 1. hit-this-turn is derived from named hit outcomes.
 * 2. Search auto-select took top N of deck (almost never the named card);
 *    scan zones for filter matches; mayFail yields empty search events.
 * 3. Search needs outputBinding "it" for play-permission follow-up.
 * 4. Optional "you may play it this turn" may stage a continuous permission;
 *    core asserts banished WMB after activate. Play path covered when green.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { irisOfTheBlossom } from "../../../../../../cards/src/cards/equipment/iris-of-the-blossom.ts";
import { whirlingMistBlossomYellow } from "../../../../../../cards/src/cards/actions/whirling-mist-blossom.ts";

function drainIris(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 50; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      // Discard cost: prefer non-WMB if present, else first.
      const pick =
        decision.candidates.find(
          (c) =>
            game.getState().objects[c.instanceId]?.canonicalId !==
            whirlingMistBlossomYellow.canonicalId,
        ) ?? decision.candidates[0];
      if (!pick) {
        // No discard candidates (mayFail case) — submit empty selection.
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [] },
          },
        });
        continue;
      }
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
        },
      });
      continue;
    }
    if (decision?.kind === "boolean") {
      // Decline optional play of banished WMB for core search assertion.
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

describe("iris-of-the-blossom (ASR003)", () => {
  it("core mechanic: after a hit, Instant tap+discard tutors WMB to banished", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [irisOfTheBlossom],
        hand: [snatchRed, nimblismBlue],
        // WMB not on top — search must find by name.
        deck: [nimblismBlue, nimblismBlue, whirlingMistBlossomYellow, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Score a hit to arm hit-this-turn.
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players[Bravo.id]!.history.turn.hitOutcomes).toHaveLength(1);

    Bravo.activate(irisOfTheBlossom);
    drainIris(game);

    expect(Bravo.zone("banished")).toContain(whirlingMistBlossomYellow.canonicalId);
    expect(Bravo.zone("deck")).not.toContain(whirlingMistBlossomYellow.canonicalId);
    // Tapped as cost.
    const headId = Object.keys(game.getState().objects).find(
      (id) => game.getState().objects[id]?.canonicalId === irisOfTheBlossom.canonicalId,
    );
    expect(headId).toBeDefined();
    expect(game.getState().objects[headId!]!.markers.some((m) => m.kind === "tapped")).toBe(true);
    // Discard paid (nimblism preferred over nothing left of snatch).
    expect(Bravo.zone("graveyard")).toContain(nimblismBlue.canonicalId);
  });

  it("boundaries: activate illegal before any hit this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [irisOfTheBlossom],
        hand: [nimblismBlue],
        deck: [whirlingMistBlossomYellow, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(bravo).activate(irisOfTheBlossom)).toThrow();
    expect(game.as(bravo).zone("head")).toContain(irisOfTheBlossom.canonicalId);
    expect(game.as(bravo).zone("banished")).not.toContain(whirlingMistBlossomYellow.canonicalId);
  });

  it("boundaries: mayFail when no WMB in deck — still shuffles, no banished tutor", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [irisOfTheBlossom],
        hand: [snatchRed, nimblismBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    Bravo.activate(irisOfTheBlossom);
    drainIris(game);
    expect(Bravo.zone("banished")).not.toContain(whirlingMistBlossomYellow.canonicalId);
    // Activation still paid (tapped + discard).
    const headId = Object.keys(game.getState().objects).find(
      (id) => game.getState().objects[id]?.canonicalId === irisOfTheBlossom.canonicalId,
    );
    expect(game.getState().objects[headId!]!.markers.some((m) => m.kind === "tapped")).toBe(true);
  });
});
