import { typeBoxTokens } from "@tcg/flesh-and-blood-types";
/**
 * FLR006 Well-Grounded — Earth Legs d0.
 *
 * Printed:
 *   Instant - Destroy this: Prevent the next 2 damage that would be dealt to
 *   you this turn. Activate this only if there are 4 or more Earth cards in
 *   your banished zone.
 *
 * Reasoning:
 * 1. Activated Instant (no AP cost), destroy-self cost, arms a this-turn
 *    prevention of 2 damage for the controller — same prevention path proven
 *    by HVY197 sheltered-cove (Instant destroy-self → prevent 2).
 * 2. The activation is gated on 4+ Earth cards in the controller's banished
 *    zone — the same zone-count gate family proven by FLR003/PEN216 lignum
 *    (banished Earth ≥ 4). With <4 Earth banished, activate must be illegal.
 * 3. Blanket prevention (shielded: controller) reduces subsequent combat
 *    damage: snatch 4 → prevent 2 → 2 taken.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { wellGrounded } from "../../../../../../cards/src/cards/equipment/well-grounded.ts";
import { cadaverousTillingRed } from "../../../../../../cards/src/cards/actions/cadaverous-tilling.ts";
import { cadaverousTillingBlue } from "../../../../../../cards/src/cards/actions/cadaverous-tilling.ts";
import { earthFormBlue } from "../../../../../../cards/src/cards/actions/earth-form.ts";
import { fruitsOfTheForestRed } from "../../../../../../cards/src/cards/actions/fruits-of-the-forest.ts";

const SNATCH = 4;
const LIFE = 20;

const FOUR_EARTH = [
  cadaverousTillingRed,
  cadaverousTillingBlue,
  earthFormBlue,
  fruitsOfTheForestRed,
] as const;

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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("well-grounded (FLR006)", () => {
  it("core mechanic: 4+ Earth banished → Instant destroy-self prevent 2 on next damage", () => {
    // Arm prevention during the defend priority window (same turn as damage)
    // so this-turn duration still applies.
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
        legs: [wellGrounded],
        banished: [...FOUR_EARTH],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    expect(Defender.zone("banished").length).toBeGreaterThanOrEqual(4);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith([]);
    Attacker.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Defender.id);

    Defender.activate(wellGrounded);
    drain(game);
    expect(Defender.zone("graveyard")).toContain(wellGrounded.canonicalId);

    // No block — take combat damage with prevention armed.
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Snatch 4, prevent 2 → 2 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
  });

  it("boundaries: fewer than 4 Earth banished → activate illegal", () => {
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
        legs: [wellGrounded],
        // Only 3 Earth banished — activation gate unmet.
        banished: [cadaverousTillingRed, cadaverousTillingBlue, earthFormBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);

    const rejected = Defender.expectFailure({
      move: "activate",
      payload: { instanceId: Defender.card(wellGrounded) },
    });
    expect(rejected.accepted).toBe(false);
  });

  it("model guard: activated Instant destroy-self, zone-count gate, prevention 2 this-turn", () => {
    const a1 = wellGrounded.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.condition).toMatchObject({
      type: "zone-count",
      zone: "banished",
      player: "controller",
      filter: { typeBox: { supertypes: ["Earth"] } },
      comparison: { op: "gte", value: 4 },
    });
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 2,
      shielded: { selector: "controller" },
      duration: "this-turn",
    });
    expect(wellGrounded.base.numeric.defense).toBe(0);
    expect(typeBoxTokens(wellGrounded.base.typeBox)).toEqual(
      expect.arrayContaining(["Earth", "Legs"]),
    );
  });

  it("catalog: Earth Legs d0 with no keywords", () => {
    expect(wellGrounded.canonicalId).toBe("zngmGjhrGpJfmnbMP87JP");
    expect(wellGrounded.base.numeric.defense).toBe(0);
    expect(wellGrounded.base.keywords ?? []).toEqual([]);
  });
});
