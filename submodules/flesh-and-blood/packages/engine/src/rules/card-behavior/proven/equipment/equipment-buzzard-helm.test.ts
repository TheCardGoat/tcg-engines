/**
 * PEN002 Buzzard Helm — Brute Head d1 Temper.
 *
 * Printed:
 *   When this defends, draw a card then discard a random card. If a card with
 *   6 or more {p} is discarded this way, this gets +1{d} this turn.
 *   Temper
 *
 * Reasoning (hand-authored):
 * 1. Defend subject:self → draw then random discard (outputBinding it).
 * 2. Power 6+ discarded → +1{d} this turn (binding-matches, not unwired status).
 * 3. Power <6 discard → base d1 only; Temper then −1 → destroy (d0).
 * 4. Power 6+ → +1{d} this turn so block d2; Temper −1 leaves helm seated.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, regurgitatingSlogRed } from "../../../fixtures.ts";
import { buzzardHelm } from "../../../../../../cards/src/cards/equipment/buzzard-helm.ts";

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

describe("buzzard-helm (PEN002)", () => {
  it("core mechanic: defend draw+random discard power-6 → +1{d} this turn + temper", () => {
    // Empty hand so draw is the only card; deck top is slog (power 6).
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
        head: [buzzardHelm],
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, regurgitatingSlogRed],
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(buzzardHelm);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Discarded slog (6{p}) → +1{d} so block d2: snatch 4−2 = 2 damage.
    expect(Defender.zone("graveyard")).toContain(regurgitatingSlogRed.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    // Temper: helm still seated with −1 counter (not blade-break).
    expect(Defender.zone("head")).toContain(buzzardHelm.canonicalId);
  });

  it("boundaries: low-power discard → d1 only; subject:self + binding-matches model", () => {
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
        head: [buzzardHelm],
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, nimblismBlue],
      },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(buzzardHelm);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Nimblism has no power (or low) — base d1: snatch 4−1 = 3.
    // Temper −1 on d1 → defense 0 → destroy (8.3.10). Not a blade-break bug.
    expect(game.as(dash).life()).toBe(LIFE - (SNATCH - 1));
    expect(game.as(dash).zone("head")).not.toContain(buzzardHelm.canonicalId);
    expect(game.as(dash).zone("graveyard")).toContain(buzzardHelm.canonicalId);

    const a1 = buzzardHelm.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.trigger) return;
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "defend",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "defender",
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "sequence",
      steps: [
        { type: "draw", count: 1 },
        { type: "discard", outputBinding: "it" },
        {
          type: "conditional",
          condition: {
            type: "binding-matches",
            binding: "it",
            filter: { power: { op: "gte", value: 6 } },
          },
        },
      ],
    });
    expect(buzzardHelm.base.keywords?.some((k) => k.name === "temper")).toBe(true);
  });
});
