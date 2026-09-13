/**
 * AUA003 Flash of Brilliance — Lightning Head d1 bladeBreak.
 *
 * Printed:
 *   When this defends, you may discard a Lightning card. If you do, return an
 *   aura you control to its owner's hand. Blade Break
 *
 * Model (after fix):
 *   defend subject:self → optional discard Lightning hand → then bounce aura
 *   you control (permanent, types Aura) to hand
 *
 * Reasoning:
 * 1. subject:self so only this equipment's defend arms the trigger.
 * 2. Bounce was combat-chain + subtypes You/Control residue — auras you control
 *    are arena permanents with types:["Aura"].
 * 3. Lightning filter types:["Lightning"] matches type-line (Flash ELE177).
 * 4. Embodiment of Lightning self-destroys on AAC play — tests use Up on a
 *    Pedestal as a stable aura destination.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import {
  bravo,
  dash,
  snatchRed,
  flash,
  nimblismBlue,
  upOnAPedestalBlue,
} from "../../../fixtures.ts";
import { flashOfBrilliance } from "../../../../../../cards/src/cards/equipment/flash-of-brilliance.ts";

function drainAll(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean | null; preferCanonicalIds?: readonly string[] } = {},
): void {
  for (let safety = 0; safety < 60; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      const value = opts.acceptOptional ?? false;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      if (decision.candidates.length === 0) {
        // No legal pick (e.g. optional then with no aura) — stop and let
        // resolution fail-closed / complete via pass.
        break;
      }
      const pick =
        (opts.preferCanonicalIds ?? [])
          .map((cid) =>
            decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === cid,
            ),
          )
          .find(Boolean) ?? decision.candidates[0]!;
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

/** Seat Bravo, play pedestal to arena, end turn, receive attack. */
function setupDefend(
  opts: { handExtra?: readonly { canonicalId: string }[]; aura?: boolean } = {},
) {
  const game = FabTestEngine.start(
    {
      hero: bravo,
      head: [flashOfBrilliance],
      hand: [flash, ...(opts.aura !== false ? [upOnAPedestalBlue] : []), ...(opts.handExtra ?? [])],
      deck: 6,
      life: 20,
      actionPoints: 1,
      resourcePoints: 0,
    },
    { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  const Bravo = game.as(bravo);
  if (opts.aura !== false) {
    Bravo.play(upOnAPedestalBlue);
    drainAll(game, { acceptOptional: false });
    expect(Bravo.zone("arena")).toContain(upOnAPedestalBlue.canonicalId);
  }
  Bravo.endTurn();
  game.as(dash).attackWith(snatchRed);
  return { game, Bravo };
}

describe("flash-of-brilliance (AUA003)", () => {
  it("core mechanic: defend → discard Lightning → bounce aura to hand", () => {
    const { game, Bravo } = setupDefend();
    Bravo.defendWith(flashOfBrilliance);
    drainAll(game, {
      acceptOptional: true,
      preferCanonicalIds: [flash.canonicalId, upOnAPedestalBlue.canonicalId],
    });

    expect(Bravo.zone("graveyard")).toContain(flash.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(flash.canonicalId);
    expect(Bravo.zone("arena")).not.toContain(upOnAPedestalBlue.canonicalId);
    expect(Bravo.zone("hand")).toContain(upOnAPedestalBlue.canonicalId);
    // Blade Break.
    expect(Bravo.zone("head")).not.toContain(flashOfBrilliance.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(flashOfBrilliance.canonicalId);
  });

  it("boundaries: decline optional → aura stays, Lightning stays in hand", () => {
    const { game, Bravo } = setupDefend();
    Bravo.defendWith(flashOfBrilliance);
    drainAll(game, { acceptOptional: false });

    expect(Bravo.zone("hand")).toContain(flash.canonicalId);
    expect(Bravo.zone("arena")).toContain(upOnAPedestalBlue.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(flashOfBrilliance.canonicalId);
  });

  it("boundaries: no Lightning in hand → cannot complete bounce (aura remains)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [flashOfBrilliance],
        hand: [nimblismBlue, upOnAPedestalBlue],
        deck: 6,
        life: 20,
        actionPoints: 1,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    Bravo.play(upOnAPedestalBlue);
    drainAll(game, { acceptOptional: false });
    Bravo.endTurn();
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(flashOfBrilliance);
    // Optional may open; accepting with no Lightning candidates should not bounce.
    drainAll(game, {
      acceptOptional: true,
      preferCanonicalIds: [nimblismBlue.canonicalId, upOnAPedestalBlue.canonicalId],
    });

    expect(Bravo.zone("arena")).toContain(upOnAPedestalBlue.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(flashOfBrilliance.canonicalId);
  });
});
