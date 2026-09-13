/**
 * HVY010 Monstrous Veil — Brute Head d1 Battleworn, Rhinar Specialization.
 *
 * Printed:
 *   Action - Destroy this: Draw a card then discard a random card. Go again
 *   Battleworn
 *
 * Reasoning (hand-authored):
 * 1. destroy-self Action → draw 1 then discard random from hand.
 * 2. layerKeywords goAgain refunds the Action AP.
 * 3. Battleworn first defend d1 → −1 counter (equipment may remain at 0{d}).
 * 4. Second activate illegal after destroy.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { monstrousVeil } from "../../../../../../cards/src/cards/equipment/monstrous-veil.ts";

const SNATCH = 4;
const LIFE = 20;

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

describe("monstrous-veil (HVY010)", () => {
  it("core mechanic: destroy → draw then random discard; go again refunds AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [monstrousVeil],
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, seed: "veil1" },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.zone("hand").length;
    const deckBefore = Bravo.zone("deck").length;

    Bravo.activate(monstrousVeil);
    drain(game);
    game.passBoth();

    expect(Bravo.zone("head")).not.toContain(monstrousVeil.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(monstrousVeil.canonicalId);
    // Draw then random discard → hand size returns to pre-activate size.
    expect(Bravo.zone("hand").length).toBe(handBefore);
    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);
    // GY has veil + one discarded card (hand or drawn).
    expect(Bravo.zone("graveyard").length).toBeGreaterThanOrEqual(2);
    // Spent 1 AP; go again refunds it.
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundaries: battleworn d1 −1; second activate illegal; model shape", () => {
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
        head: [monstrousVeil],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const helmId = Defender.findCardInZone("head", monstrousVeil);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(monstrousVeil);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    expect(game.objectState(helmId)?.defenseCounterTotal).toBe(-1);

    // Activate path after destroy is illegal.
    const game2 = FabTestEngine.start(
      {
        hero: bravo,
        head: [monstrousVeil],
        hand: [nimblismBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, seed: "veil2" },
    );
    const Bravo = game2.as(bravo);
    Bravo.activate(monstrousVeil);
    drain(game2);
    game2.passBoth();
    expect(() => Bravo.activate(monstrousVeil)).toThrow();

    const a1 = monstrousVeil.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.layerKeywords?.some((k) => k.name === "go-again")).toBe(true);
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        { type: "draw", count: 1, player: "controller" },
        {
          type: "discard",
          target: {
            selector: "object",
            zones: ["hand"],
            count: 1,
            random: true,
          },
        },
      ],
    });
  });
});
