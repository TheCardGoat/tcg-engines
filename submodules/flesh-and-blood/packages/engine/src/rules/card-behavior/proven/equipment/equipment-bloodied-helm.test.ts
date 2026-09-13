/**
 * SMP014 Bloodied Helm — Event Head d0.
 *
 * Printed:
 *   You may equip this.
 *   Instant - Destroy this: Put a card from your arsenal on the bottom of your
 *   deck. If you do, draw a card.
 *
 * Reasoning (hand-authored):
 * 1. Core Instant: destroy-self → arsenal → deck bottom, then draw (if-you-do).
 * 2. Pre-game head seat covers equip; mid-game "you may equip this" Event path
 *    is optional continuous equip (not re-proved here).
 * 3. Empty arsenal: destroy still pays; no bottom move ⇒ no draw.
 * 4. d0 seat, no BB keyword.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { bloodiedHelm } from "../../../../../../cards/src/cards/equipment/bloodied-helm.ts";

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

function deckBottomCanonical(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): string | undefined {
  const deck = game.getState().containers.zonesByPlayerId[playerId]!.deck ?? [];
  const bottomId = deck[0];
  return bottomId ? game.getState().objects[bottomId]?.canonicalId : undefined;
}

describe("bloodied-helm (SMP014)", () => {
  it("core mechanic: Instant destroy → arsenal to deck bottom + draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [bloodiedHelm],
        arsenal: [snatchRed],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.zone("hand").length;
    const deckBefore = Bravo.zone("deck").length;

    Bravo.activate(bloodiedHelm);
    drain(game);

    expect(Bravo.zone("head")).not.toContain(bloodiedHelm.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bloodiedHelm.canonicalId);
    expect(Bravo.zone("arsenal")).toHaveLength(0);
    // Arsenal card on deck bottom.
    expect(deckBottomCanonical(game, Bravo.id)).toBe(snatchRed.canonicalId);
    // If you do, draw 1.
    expect(Bravo.zone("hand").length).toBe(handBefore + 1);
    // Deck: −1 top drawn +1 bottom from arsenal = same length as before?
    // Before: 3 deck + 1 arsenal. After: snatch bottom + 2 nimblism remaining + 1 drawn to hand
    // = deck length 3. Yes same as deckBefore if draw took one from the 3.
    expect(Bravo.zone("deck").length).toBe(deckBefore); // 3 - 1 draw + 1 bottom
  });

  it("boundaries: empty arsenal → no draw; model Instant arsenal-bottom then draw", () => {
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        head: [bloodiedHelm],
        arsenal: [],
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 4 },
      { autoPassPriority: false },
    );
    const handBefore = empty.as(bravo).zone("hand").length;
    try {
      empty.as(bravo).activate(bloodiedHelm);
      drain(empty);
    } catch {
      // hard reject OK
    }
    // No if-you-do draw when arsenal empty.
    expect(empty.as(bravo).zone("hand").length).toBe(handBefore);

    const a2 = bloodiedHelm.base.abilities?.find(
      (a) => a.id === "HjWHLmGhtLQTKjzGRRrdF:instantDestroyPutFromArsenalBottomDeckIfDo",
    );
    expect(a2?.kind).toBe("activated");
    if (a2?.kind !== "activated") return;
    expect(a2.abilityType).toBe("instant");
    expect(a2.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a2.effect).toMatchObject({
      type: "if-you-do",
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          zones: ["arsenal"],
          count: 1,
        },
        to: { zone: "deck", position: "bottom" },
      },
      then: { type: "draw", count: 1, player: "controller" },
    });
    expect(bloodiedHelm.base.numeric.defense).toBe(0);
  });
});
