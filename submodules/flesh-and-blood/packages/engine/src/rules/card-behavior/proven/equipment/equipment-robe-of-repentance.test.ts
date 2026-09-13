/**
 * IAR162 Robe of Repentance — Shadow Chest d0.
 *
 * Printed:
 *   Instant - Destroy this: Turn a card with blood debt in your banished zone
 *   face-down.
 *
 * Reasoning (case-by-case, 1v1 product):
 * 1. Twin of Grille of Repentance (IAR161) — same Instant destroy-self →
 *    turn-face-down path, seated in Chest instead of Head.
 * 2. Instant destroy-self pays the cost → equipment leaves Chest to GY.
 * 3. On-stack target is a controller blood-debt card in banished (public).
 * 4. Resolution turns that card face-down (private) in banished.
 * 5. CR 8.3.11a: face-down blood-debt does not lose life at end phase.
 * 6. No legal blood-debt banished target → Instant illegal.
 * 7. Model already correct; engine path proven on grille + face-down skip.
 *
 * Status: ✅ Instant destroy → face-down debt; end-phase no tick; empty illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { robeOfRepentance } from "../../../../../../cards/src/cards/equipment/robe-of-repentance.ts";
import { hungeringDemigonYellow } from "../../../../../../cards/src/cards/actions/hungering-demigon.ts";

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

function endTurnDrain(game: ReturnType<typeof FabTestEngine.start>, hero: typeof bravo): void {
  game.as(hero).endTurn();
  for (let safety = 0; safety < 32; safety += 1) {
    const d = game.getState().decision;
    if (d) {
      if (d.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      if (game.answerForcedDecision()) continue;
      break;
    }
    if (game.getState().rulesStack.length > 0 || game.getState().rulesProcess) {
      try {
        game.passBoth();
      } catch {
        break;
      }
      continue;
    }
    break;
  }
}

describe("robe-of-repentance (IAR162)", () => {
  it("core mechanic: Instant destroy → turn blood-debt banished face-down; end phase no life loss", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: LIFE,
        chest: [robeOfRepentance],
        banished: [hungeringDemigonYellow],
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("chest")).toContain(robeOfRepentance.canonicalId);
    expect(Bravo.zone("banished")).toContain(hungeringDemigonYellow.canonicalId);

    const debtId = Bravo.card(hungeringDemigonYellow);
    expect(game.getState().objects[debtId]?.markers.some((m) => m.kind === "face-down")).toBe(
      false,
    );

    Bravo.activate(robeOfRepentance);
    drain(game);

    // Cost: destroy this → Chest empty, equipment in GY.
    expect(Bravo.zone("graveyard")).toContain(robeOfRepentance.canonicalId);
    expect(Bravo.zone("chest")).not.toContain(robeOfRepentance.canonicalId);

    // Effect: blood-debt card remains banished but is now private (face-down).
    expect(Bravo.zone("banished")).toContain(hungeringDemigonYellow.canonicalId);
    expect(game.getState().objects[debtId]?.markers.some((m) => m.kind === "face-down")).toBe(true);

    // CR 8.3.11a: face-down blood-debt does not tick at end phase.
    endTurnDrain(game, bravo);
    expect(Bravo.life()).toBe(LIFE);
  });

  it("boundaries: no blood-debt banished → illegal; face-up debt still ticks without robe", () => {
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        chest: [robeOfRepentance],
        banished: [snatchRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => empty.as(bravo).activate(robeOfRepentance)).toThrow();

    // Control: public blood-debt without turning face-down still loses 1 life.
    const control = FabTestEngine.start(
      {
        hero: bravo,
        life: LIFE,
        banished: [hungeringDemigonYellow],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    endTurnDrain(control, bravo);
    expect(control.as(bravo).life()).toBe(LIFE - 1);

    // Model shape check.
    const a1 = robeOfRepentance.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "turn-face-down",
      target: {
        selector: "object",
        declared: "on-stack",
        player: "controller",
        zones: ["banished"],
        filter: { hasKeyword: "blood-debt" },
        count: 1,
      },
    });
    expect(robeOfRepentance.base.numeric.defense).toBe(0);
  });
});
