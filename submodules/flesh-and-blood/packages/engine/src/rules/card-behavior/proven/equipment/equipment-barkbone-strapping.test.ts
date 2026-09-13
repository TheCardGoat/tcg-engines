/**
 * RNR005 Barkbone Strapping — Brute Chest d1 Battleworn.
 *
 * Printed:
 *   Instant - Destroy Barkbone Strapping: Roll a 6 die. Gain {r} equal to
 *   half the number rolled, rounded down.
 *   Battleworn
 *
 * Reasoning (case-by-case):
 * 1. Instant destroy-self (no AP); legal on controller's priority outside
 *    combat timing restrictions for Instant equipment.
 * 2. sequence: roll sides:6 then gain-resources amount roll-result ÷2 down.
 * 3. Roll is deterministic under a fixed seed but advances with deck shuffle
 *    entropy — assert committed roll result (1–6) and RP === floor(result/2)
 *    rather than a magic seed face.
 * 4. Battleworn d1: defend −1{d} counter and stay equipped.
 * 5. Model: abilityType instant + destroy-self + roll/gain-resources.
 *
 * Status: ✅ Instant roll→floor half {r}; BW d1; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { barkboneStrapping } from "../../../../../../cards/src/cards/equipment/barkbone-strapping.ts";

const LIFE = 20;
const SNATCH = 4;
const DEF = 1;

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

describe("barkbone-strapping (RNR005)", () => {
  it("core mechanic: Instant destroy → roll d6 → floor(n/2) {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [barkboneStrapping],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.resourcePoints()).toBe(0);

    const result = Bravo.activate(barkboneStrapping);
    expect(result.accepted).toBe(true);
    drain(game);

    expect(Bravo.zone("graveyard")).toContain(barkboneStrapping.canonicalId);
    expect(Bravo.zone("chest")).not.toContain(barkboneStrapping.canonicalId);

    const roll = game.committedEvents().find((e) => e.name === "roll") as
      | { data: { sides: number; result: number; playerId: string } }
      | undefined;
    expect(roll).toBeDefined();
    expect(roll!.data.sides).toBe(6);
    expect(roll!.data.result).toBeGreaterThanOrEqual(1);
    expect(roll!.data.result).toBeLessThanOrEqual(6);
    expect(roll!.data.playerId).toBe(Bravo.id);

    const expectedRp = Math.floor(roll!.data.result / 2);
    expect(Bravo.resourcePoints()).toBe(expectedRp);
    expect(Bravo.resourcePoints()).toBeGreaterThanOrEqual(0);
    expect(Bravo.resourcePoints()).toBeLessThanOrEqual(3);
  });

  it("boundaries: Battleworn d1; Instant model destroy-self + roll-result half", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [barkboneStrapping],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    game.as(dash).attackWith(snatchRed);
    game.as(bravo).defendWith(barkboneStrapping);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − d1 = 3; plate stays with −1{d} counter (battleworn).
    expect(game.as(bravo).life()).toBe(LIFE - (SNATCH - DEF));
    expect(game.as(bravo).zone("chest")).toContain(barkboneStrapping.canonicalId);
    expect(game.as(bravo).zone("graveyard")).not.toContain(barkboneStrapping.canonicalId);

    const a1 = barkboneStrapping.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        { type: "roll", sides: 6 },
        {
          type: "gain-resources",
          amount: { type: "roll-result", divisor: 2, rounding: "down" },
        },
      ],
    });
    expect(barkboneStrapping.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);
    expect(barkboneStrapping.base.numeric.defense).toBe(1);
  });
});
