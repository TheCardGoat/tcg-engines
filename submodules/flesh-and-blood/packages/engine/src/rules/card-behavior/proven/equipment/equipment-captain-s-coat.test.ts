/**
 * SEA181 Captain's Coat — Generic Chest d0.
 *
 * Printed:
 *   Action - Destroy this: Gain {r}. Activate this only if you've drawn a card
 *   this turn. Go again
 *
 * Reasoning (case-by-case):
 * 1. Action destroy-self → +1{r} + go again AP refund (blossom-of-spring sibling
 *    with a drawn-this-turn activation gate).
 * 2. Condition has-status drawn-a-card-this-turn reads facts.playerCardsDrawn
 *    (stamped on real draw events via history.turn.cardsDrawn).
 * 3. Without a draw this turn → illegal. After Tome draw → legal.
 * 4. Model: action + destroy-self + gain-resources 1 + layerKeywords goAgain.
 *
 * Status: ✅ destroy after draw → +1{r}+GA; no-draw illegal; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { captainSCoat } from "../../../../../../cards/src/cards/equipment/captain-s-coat.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.answerForcedDecision()) continue;
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
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

describe("captain-s-coat (SEA181)", () => {
  it("core mechanic: after drawing this turn, Action destroy → +1{r} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [captainSCoat],
        // Tome of Fyendal: cost 1, draw 2.
        hand: [tomeOfFyendalYellow],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 8,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Gate closed before any draw.
    expect(() => Bravo.activate(captainSCoat)).toThrow();

    Bravo.play(tomeOfFyendalYellow);
    drain(game);
    expect(game.getState().players[Bravo.id]?.history.turn.cardsDrawn).toBeGreaterThanOrEqual(1);

    const rpBefore = Bravo.resourcePoints();
    const apBefore = Bravo.actionPoints();
    Bravo.activate(captainSCoat);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(captainSCoat.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(captainSCoat.canonicalId);
    expect(Bravo.resourcePoints()).toBe(rpBefore + 1);
    // Action spent 1 AP; go again refunds it.
    expect(Bravo.actionPoints()).toBe(apBefore);
  });

  it("boundaries: no draw this turn illegal; model drawn-a-card gate + destroy + GA", () => {
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        chest: [captainSCoat],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(captainSCoat)).toThrow();

    const a1 = captainSCoat.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.condition).toMatchObject({
      type: "performed-this-turn",
      event: "draw",
      player: "controller",
    });
    expect(a1.effect).toMatchObject({ type: "gain-resources", amount: 1 });
    expect(a1.layerKeywords?.some((k) => k.name === "go-again")).toBe(true);
    expect(captainSCoat.base.numeric.defense).toBe(0);
  });
});
