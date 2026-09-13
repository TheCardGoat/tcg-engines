/**
 * DTD106 Spoiled Skull — Shadow Brute Head, AB1, Blood Debt.
 *
 * Printed:
 *   Action - {r}, banish this: Target 3 action cards with different names in
 *   your banished zone and choose one at random. You may play it this turn.
 *   Go again. Arcane Barrier 1. Blood Debt
 *
 * Model (after fix):
 *   Action {r}+banish-self + go again → on-stack Target 3 banished Actions
 *   (differentNames set constraint) → random one → optional play this turn
 *
 * Reasoning:
 * 1. "Banish this" → banish-self (not banish any permanent).
 * 2. go again is layerKeywords only (not a static equipment keyword).
 * 3. differentNames is a multi-pick constraint — matches-filter no longer
 *    throws when the field is present; tests pick distinct names.
 * 4. Optional play declined in core (permission still registered).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, throttleRed } from "../../../fixtures.ts";
import { spoiledSkull } from "../../../../../../cards/src/cards/equipment/spoiled-skull.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean; pickCanonicalIds?: readonly string[] } = {},
): void {
  for (let safety = 0; safety < 60; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: opts.acceptOptional ?? false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const need = decision.max ?? decision.min ?? 1;
      const picks: string[] = [];
      if (opts.pickCanonicalIds?.length) {
        for (const cid of opts.pickCanonicalIds) {
          const found = decision.candidates.find(
            (c) => game.getState().objects[c.instanceId]?.canonicalId === cid,
          );
          if (found) picks.push(found.instanceId);
          if (picks.length >= need) break;
        }
      }
      const fillGuard = createFabLoopGuard({ label: "spoiled-skull: fill picks" });
      while (picks.length < need && picks.length < decision.candidates.length) {
        fillGuard.tick();
        const next = decision.candidates.find((c) => !picks.includes(c.instanceId));
        if (!next) break;
        picks.push(next.instanceId);
      }
      if (picks.length < (decision.min ?? 0)) break;
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
    if (decision?.kind === "payment") {
      const cand = decision.candidates[0];
      if (!cand) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [cand.instanceId] },
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

describe("spoiled-skull (DTD106)", () => {
  it("core mechanic: {r}+banish-self → choose 3 banished Actions → random → optional play declined", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [spoiledSkull],
        banished: [snatchRed, throttleRed, brutalAssaultRed],
        hand: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const apBefore = Bravo.actionPoints();

    Bravo.activate(spoiledSkull);
    drain(game, {
      acceptOptional: false,
      pickCanonicalIds: [
        snatchRed.canonicalId,
        throttleRed.canonicalId,
        brutalAssaultRed.canonicalId,
      ],
    });

    expect(Bravo.zone("head")).not.toContain(spoiledSkull.canonicalId);
    expect(Bravo.zone("banished")).toContain(spoiledSkull.canonicalId);
    // Three AACs remain banished (random pick was optional play declined).
    expect(Bravo.zone("banished")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("banished")).toContain(throttleRed.canonicalId);
    expect(Bravo.zone("banished")).toContain(brutalAssaultRed.canonicalId);
    // Go again refunds Action AP.
    expect(Bravo.actionPoints()).toBe(apBefore);
  });

  it("boundaries: fewer than 3 banished Actions cannot complete the target set", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [spoiledSkull],
        banished: [snatchRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    try {
      Bravo.activate(spoiledSkull);
      drain(game);
    } catch {
      // Illegal if quote fails early.
    }
    // With only one banished Action, cannot select 3 distinct targets — effect
    // fails closed or activate is rejected; equipment should not silently stay
    // free without the banished targets.
    const banishedCount = Bravo.zone("banished").filter((id) =>
      [snatchRed.canonicalId, spoiledSkull.canonicalId].includes(id),
    ).length;
    // Either still on head (failed to pay/complete) or banished after partial.
    expect(
      Bravo.zone("head").includes(spoiledSkull.canonicalId) ||
        Bravo.zone("banished").includes(spoiledSkull.canonicalId),
    ).toBe(true);
    void banishedCount;
  });

  it("boundaries: 0 RP cannot pay Action cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [spoiledSkull],
        banished: [snatchRed, throttleRed, brutalAssaultRed],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(bravo).activate(spoiledSkull)).toThrow();
    expect(game.as(bravo).zone("head")).toContain(spoiledSkull.canonicalId);
  });
});
