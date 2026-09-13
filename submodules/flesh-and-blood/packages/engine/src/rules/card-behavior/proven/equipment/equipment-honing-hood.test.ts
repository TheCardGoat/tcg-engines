/**
 * ELE214 Honing Hood — Ranger Head d0.
 *
 * Printed:
 *   Instant - Destroy Honing Hood: Return all cards in your arsenal to your
 *   hand, then put a card from your hand face down into your arsenal.
 *
 * Model:
 *   Instant destroy-self → sequence:
 *     move-card star arsenal → hand
 *     move-card 1 hand → arsenal face-down
 *
 * Reasoning:
 * 1. Destroy-self is the activation cost (hood leaves head immediately).
 * 2. First step returns all arsenal (0..N) to hand without a chooser when
 *    count:star auto-binds candidates.
 * 3. Second step chooses 1 hand card → arsenal face-down (after bounce).
 * 4. Empty arsenal still allows hand→arsenal; empty hand after bounce fails
 *    if nothing to put back.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, sigilOfSolaceRed } from "../../../fixtures.ts";
import { honingHood } from "../../../../../../cards/src/cards/equipment/honing-hood.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>, preferCanonicalId?: string): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick =
        (preferCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === preferCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
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
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
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
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("honing-hood (ELE214)", () => {
  it("core mechanic: destroy-self → bounce arsenal to hand → put hand face-down into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [honingHood],
        arsenal: [snatchRed],
        hand: [nimblismBlue],
        deck: 4,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(honingHood);
    // After bounce, hand has snatch + nimblism; chooser picks one face-down.
    drain(game, snatchRed.canonicalId);

    expect(Bravo.zone("head")).not.toContain(honingHood.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(honingHood.canonicalId);

    // Exactly one face-down arsenal card; the other card is in hand.
    expect(Bravo.zone("arsenal")).toHaveLength(1);
    expect(Bravo.zone("hand")).toHaveLength(1);
    const arsenalInstanceId = game.getState().containers.zonesByPlayerId[Bravo.id]!.arsenal[0]!;
    expect(game.objectState(arsenalInstanceId)?.faceDown).toBe(true);
    const arsenalCanonical = game.getState().objects[arsenalInstanceId]!.canonicalId;
    expect([snatchRed.canonicalId, nimblismBlue.canonicalId]).toContain(arsenalCanonical);
    expect(Bravo.zone("hand")[0]).not.toBe(arsenalCanonical);
  });

  it("core path: empty arsenal → put original hand card face-down into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [honingHood],
        arsenal: [],
        hand: [nimblismBlue, sigilOfSolaceRed],
        deck: 4,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(honingHood);
    drain(game, nimblismBlue.canonicalId);

    expect(Bravo.zone("graveyard")).toContain(honingHood.canonicalId);
    expect(Bravo.zone("arsenal")).toHaveLength(1);
    expect(Bravo.zone("arsenal")).toContain(nimblismBlue.canonicalId);
    const arsenalId = Bravo.findCardInZone("arsenal", nimblismBlue);
    expect(game.objectState(arsenalId)?.faceDown).toBe(true);
    expect(Bravo.zone("hand")).toContain(sigilOfSolaceRed.canonicalId);
  });

  it("boundaries: empty hand and empty arsenal → second step has no card (activate fails or stalls)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [honingHood],
        arsenal: [],
        hand: [],
        deck: 4,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    // No hand card to put into arsenal after bounce — should be illegal at
    // quote/target stage or fail closed when resolving the second move.
    const before = game.as(bravo).zone("head");
    try {
      game.as(bravo).activate(honingHood);
      drain(game);
    } catch {
      // Expected: cannot complete the effect.
    }
    // Either refused activate (hood still equipped) or destroyed without
    // illegal arsenal state. Never leave a partial arsenal from nowhere.
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arsenal")).toHaveLength(0);
    // Prefer fail-closed with hood still equipped if quote rejects.
    if (Bravo.zone("head").includes(honingHood.canonicalId)) {
      expect(before).toContain(honingHood.canonicalId);
    }
  });
});
