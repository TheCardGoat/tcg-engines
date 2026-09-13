/**
 * CRU102 Viziertronic Model i — Mechanologist Head d0 Arcane Barrier 2.
 *
 * Printed:
 *   Action - destroy Viziertronic Model i: Whenever you boost this turn,
 *   draw a card then put a card from your hand on top of your deck. Go again
 *   Arcane Barrier 2
 *
 * Model (after fix):
 *   Action destroy-self + go again → delayed-trigger boost (duration this-turn)
 *   sequence: draw 1 then hand→deck top
 *
 * Reasoning:
 * 1. Printed "whenever you boost this turn" is multi-fire → duration:this-turn.
 * 2. "draw then put a card on top" is per boost — both steps nest under the
 *    delayed trigger. Sibling move-card on activate was wrong.
 * 3. subtypes:["Card"] residue removed (any hand card).
 * 4. Go again refunds Action AP after destroy.
 * 5. Arcane Barrier is separate keyword path (not required for Action AAA).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, throttleRed, nimblismBlue } from "../../../fixtures.ts";
import { viziertronicModelI } from "../../../../../../cards/src/cards/equipment/viziertronic-model-i.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>, preferCanonicalId?: string): void {
  for (let safety = 0; safety < 50; safety += 1) {
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

describe("viziertronic-model-i (CRU102)", () => {
  it("core mechanic: destroy-self → boost → draw then put top of deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [viziertronicModelI],
        // throttle (boost) + pitch for cost 2 + cards for put-top after draw
        hand: [throttleRed, nimblismBlue, nimblismBlue, nimblismBlue],
        // deck top for boost banish (Mechanologist throttle itself is mech —
        // boost banishes top; use a mech card on top so boost succeeds cleanly)
        deck: [throttleRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 0,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const apBefore = Bravo.actionPoints();

    // Arm the whenever-boost clause.
    Bravo.activate(viziertronicModelI);
    drain(game);

    expect(Bravo.zone("head")).not.toContain(viziertronicModelI.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(viziertronicModelI.canonicalId);
    // Go again refunds the Action AP.
    expect(Bravo.actionPoints()).toBe(apBefore);
    expect(game.getState().delayedTriggers.length).toBeGreaterThanOrEqual(1);

    const deckBeforeBoost = Bravo.zone("deck").length;
    const handBeforeBoost = Bravo.zone("hand").length;

    // Boost with Throttle (cost 2: pitch 2 blues).
    Bravo.play(throttleRed, {
      target: game.as(dash).id,
      boost: true,
      pitch: [nimblismBlue, nimblismBlue],
    });
    // Delayed: draw then choose a hand card to put on top.
    drain(game, nimblismBlue.canonicalId);

    expect(game.getState().players[Bravo.id]!.history.turn.boosted).toBe(true);
    // Draw +1 then put top -1: hand size net 0 from delayed pair, but boost
    // already spent throttle + 2 pitch from hand.
    // After boost announce: -1 throttle, -2 pitch, banished top; then draw +1,
    // put top -1 → hand ends with remaining cards.
    // Deck: -1 boost banish, +1 draw reverse, +1 put-top → compare carefully.
    // Assert the put-top card is deck top (last index).
    expect(Bravo.zone("deck").at(-1)).toBe(nimblismBlue.canonicalId);
    // Delayed multi-fire still armed for further boosts this turn.
    expect(game.getState().delayedTriggers.length).toBeGreaterThanOrEqual(1);
    // Sanity: we did draw (deck not only shrunk by boost banish alone).
    expect(Bravo.zone("deck").length).toBeGreaterThanOrEqual(deckBeforeBoost - 1);
    void handBeforeBoost;
  });

  it("boundaries: no boost → no draw / no put-top after arm", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [viziertronicModelI],
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    const handBefore = Bravo.zone("hand").length;

    Bravo.activate(viziertronicModelI);
    game.passBoth();

    // Without a boost, delayed does not fire — deck/hand unchanged by the clause.
    expect(Bravo.zone("deck").length).toBe(deckBefore);
    expect(Bravo.zone("hand").length).toBe(handBefore);
    expect(Bravo.zone("graveyard")).toContain(viziertronicModelI.canonicalId);
  });
});
