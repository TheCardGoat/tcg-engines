/**
 * ELE213 New Horizon — Ranger Head d2 Blade Break.
 *
 * Printed:
 *   If you have a face up card in your arsenal, you have an additional arsenal
 *   zone.
 *   When this is destroyed, destroy all cards in your arsenal.
 *   Blade Break
 *
 * Model (after fix):
 *   continuous conditional face-up arsenal → rule-modification allow
 *   additional-arsenal-zone (capacity +1)
 *   destroy subject:self → destroy all arsenal
 *
 * Reasoning:
 * 1. Prior model used have-in-deck residue — not arsenal capacity.
 * 2. arsenalCapacity helper: base 1 + allow additional-arsenal-zone rules.
 * 3. End-turn arsenal placement uses capacity (second card legal with NH).
 * 4. Destroy path: bladeBreak after defend destroys arsenal cards via a2.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { newHorizon } from "../../../../../../cards/src/cards/equipment/new-horizon.ts";
import { arsenalCapacity } from "../../../arsenal-capacity.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
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
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
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

describe("new-horizon (ELE213)", () => {
  it("core mechanic: face-up arsenal + New Horizon → capacity 2; end-turn can arsenal a second card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [newHorizon],
        arsenal: [{ card: snatchRed, state: { faceDown: false } }],
        hand: [nimblismBlue],
        deck: 6,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    drain(game);

    expect(arsenalCapacity(game.getState(), Bravo.id)).toBe(2);
    expect(Bravo.zone("arsenal")).toHaveLength(1);

    // End turn putting second card into arsenal (additional zone).
    const nimblismId = Bravo.findCardInZone("hand", nimblismBlue);
    Bravo.endTurn({ arsenalInstanceId: nimblismId });
    drain(game);

    expect(Bravo.zone("arsenal")).toHaveLength(2);
    expect(Bravo.zone("arsenal")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("arsenal")).toContain(nimblismBlue.canonicalId);
  });

  it("boundaries: without face-up arsenal, capacity stays 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [newHorizon],
        arsenal: [],
        hand: [nimblismBlue],
        deck: 4,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(arsenalCapacity(game.getState(), Bravo.id)).toBe(1);

    // Without NH effect (no face-up arsenal card), first arsenal is fine.
    const nimblismId = Bravo.findCardInZone("hand", nimblismBlue);
    Bravo.endTurn({ arsenalInstanceId: nimblismId });
    drain(game);
    expect(Bravo.zone("arsenal")).toHaveLength(1);
  });

  it("boundaries: without New Horizon, second arsenal at end-turn is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
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
    expect(arsenalCapacity(game.getState(), Bravo.id)).toBe(1);
    const nimblismId = Bravo.findCardInZone("hand", nimblismBlue);
    expect(() => Bravo.endTurn({ arsenalInstanceId: nimblismId })).toThrow();
  });

  it("core mechanic: destroy New Horizon (bladeBreak) destroys arsenal cards", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [newHorizon],
        arsenal: [nimblismBlue],
        hand: [],
        deck: 6,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(newHorizon);
    game.helpers.resolveRestOfCombat();

    // Blade Break + a2: head and arsenal to GY.
    expect(Bravo.zone("head")).not.toContain(newHorizon.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(newHorizon.canonicalId);
    expect(Bravo.zone("arsenal")).toHaveLength(0);
    expect(Bravo.zone("graveyard")).toContain(nimblismBlue.canonicalId);
  });
});
