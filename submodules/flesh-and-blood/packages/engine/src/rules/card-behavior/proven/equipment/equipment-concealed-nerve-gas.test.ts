/**
 * PEN079 Concealed Nerve Gas — Ranger Chest Trap (Cloaked).
 *
 * Printed:
 *   Cloaked
 *   While this is equipped face-down, when an attack with go again hits you,
 *   destroy this and create a Frailty token under each opponent's control.
 *
 * Reasoning (case-by-case):
 * 1. Cloaked seats face-down (fixture + keyword).
 * 2. Hit by opponent's go-again attack → destroy trap + Frailty under opponent.
 * 3. Model remodel: controller was "each" (both heroes get Frailty including
 *    the trap owner). Printed "each opponent" → controller: "opponent" (1v1
 *    sole opponent). Trigger adds target: "hero" for "hits you".
 * 4. Boundaries: non-go-again attack does not fire; face-up trap does not fire.
 *
 * Status: ✅ cloaked GA hit → destroy + Frailty under opponent; non-GA / face-up.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { concealedNerveGas } from "../../../../../../cards/src/cards/equipment/concealed-nerve-gas.ts";

const LIFE = 20;
const SNATCH = 4;

/** Cost-0 Attack Action with go again — exercises the trap gate cleanly. */
const goAgainAttack = {
  canonicalId: "trainer-ga-attack-pen079",
  types: ["Generic", "Action", "Attack"],
  cost: 0,
  power: 4,
  keywords: [{ name: "go-again" as const }],
};

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
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

function frailtyCount(player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>): number {
  return player.zone("arena").filter((id) => id === "token:frailty").length;
}

describe("concealed-nerve-gas (PEN079)", () => {
  it("core mechanic: cloaked + go-again hit → destroy trap + Frailty under opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [goAgainAttack],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [concealedNerveGas],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    const chestId = Defender.findCardInZone("chest", concealedNerveGas);

    // Cloaked: seats face-down.
    expect(game.objectState(chestId)?.faceDown).toBe(true);
    expect(frailtyCount(Attacker)).toBe(0);
    expect(frailtyCount(Defender)).toBe(0);

    Attacker.attackWith(goAgainAttack);
    // No block — take the hit.
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Trap destroys itself.
    expect(Defender.zone("chest")).not.toContain(concealedNerveGas.canonicalId);
    expect(Defender.zone("graveyard")).toContain(concealedNerveGas.canonicalId);
    // Frailty under the attacking opponent only (not under trap controller).
    expect(frailtyCount(Attacker)).toBe(1);
    expect(frailtyCount(Defender)).toBe(0);
    // Hit still connected (p4 unblocked).
    expect(Defender.life()).toBe(LIFE - 4);
  });

  it("boundaries: non-go-again no fire; face-up no fire; model opponent Frailty", () => {
    // Snatch has no go-again — trap stays, no Frailty.
    const noGa = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [concealedNerveGas],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    noGa.as(bravo).attackWith(snatchRed);
    drain(noGa);
    noGa.helpers.resolveRestOfCombat();
    drain(noGa);
    expect(noGa.as(dash).zone("chest")).toContain(concealedNerveGas.canonicalId);
    expect(frailtyCount(noGa.as(bravo))).toBe(0);
    expect(noGa.as(dash).life()).toBe(LIFE - SNATCH);

    // Face-up trap: no fire.
    const faceUp = FabTestEngine.start(
      {
        hero: bravo,
        hand: [goAgainAttack],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [{ card: concealedNerveGas, state: { faceDown: false } }],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const trapId = faceUp.as(dash).findCardInZone("chest", concealedNerveGas);
    expect(faceUp.objectState(trapId)?.faceDown).toBeFalsy();

    faceUp.as(bravo).attackWith(goAgainAttack);
    drain(faceUp);
    faceUp.helpers.resolveRestOfCombat();
    drain(faceUp);
    expect(faceUp.as(dash).zone("chest")).toContain(concealedNerveGas.canonicalId);
    expect(frailtyCount(faceUp.as(bravo))).toBe(0);

    const a1 = concealedNerveGas.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.trigger) return;
    expect(a1.trigger).toMatchObject({
      kind: "event-and-state",
      event: {
        name: "hit",
        actor: {
          kind: "player",
          player: "opponent",
        },
        observes: {
          kind: "event-object",
          selector: "attack",
          relationship: {
            kind: "any",
          },
          filter: { hasKeyword: "go-again" },
        },
        target: {
          kind: "hero",
        },
      },
    });
    expect(a1.trigger.kind === "event-and-state" ? a1.trigger.state : undefined).toMatchObject({
      type: "has-status",
      status: "equipped-face-down",
    });
    expect(a1.resolution.kind === "effect" ? a1.resolution.effect : undefined).toMatchObject({
      type: "sequence",
      steps: [
        { type: "destroy", target: { selector: "self" } },
        { type: "create-token", token: "frailty", controller: "opponent" },
      ],
    });
    expect(concealedNerveGas.base.keywords?.some((k) => k.name === "cloaked")).toBe(true);
  });
});
