/**
 * HVY009 Knucklehead — Brute Head d2 Temper, Kayo Specialization.
 *
 * Printed:
 *   Action - Destroy this: Roll a 6-sided die. Until end of turn, your base
 *   {i} is the number rolled.
 *   Temper
 *
 * Reasoning (hand-authored):
 * 1. destroy-self Action → roll d6 → set-base intellect on controller hero to
 *    roll-result until end of turn.
 * 2. Temper: first defend d2 contributes, −1{d} counter, stays equipped
 *    (printed d2 > 1 so not destroyed on first close).
 * 3. Seeded RNG for deterministic roll assertion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { knucklehead } from "../../../../../../cards/src/cards/equipment/knucklehead.ts";
import { kayo } from "../../../../../../cards/src/cards/heroes/kayo.ts";

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

describe("knucklehead (HVY009)", () => {
  it("core mechanic: destroy → d6 → base intellect is the roll UEOT", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        head: [knucklehead],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, seed: "kayo2" },
    );
    const Kayo = game.as(kayo);
    expect(Kayo.intellect()).toBe(kayo.base.numeric.intellect ?? 4);

    Kayo.activate(knucklehead);
    drain(game);

    const rolls = game
      .committedEvents()
      .filter((e) => e.name === "roll" || e.name === "roll-request")
      .map((e) => (e.data as { result?: number }).result)
      .filter((r): r is number => typeof r === "number");
    // Prefer explicit result field; fall back to bindings on roll-request.
    let rolled: number | undefined = rolls[0];
    if (rolled === undefined) {
      const req = game
        .committedEvents()
        .filter((e) => e.name === "roll-request")
        .at(-1) as { bindings?: { numbers?: Record<string, number> } } | undefined;
      const bound = req?.bindings?.numbers?.["roll-result"];
      if (typeof bound === "number") rolled = bound;
    }
    expect(typeof rolled).toBe("number");
    const face = rolled as number;
    expect(face).toBeGreaterThanOrEqual(1);
    expect(face).toBeLessThanOrEqual(6);

    expect(Kayo.intellect()).toBe(face);
    expect(Kayo.zone("graveyard")).toContain(knucklehead.canonicalId);
    expect(Kayo.zone("head")).not.toContain(knucklehead.canonicalId);
  });

  it("boundaries: temper first defend d2 + −1 counter; model roll sequence", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kayo,
        life: LIFE,
        head: [knucklehead],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(kayo);
    const helmId = Defender.findCardInZone("head", knucklehead);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(knucklehead);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("head")).toContain(knucklehead.canonicalId);
    expect(game.objectState(helmId)?.defenseCounterTotal).toBe(-1);

    const a1 = knucklehead.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        { type: "roll", sides: 6 },
        {
          type: "modify-numeric",
          property: "intellect",
          op: "set-base",
          amount: { type: "roll-result" },
          target: { selector: "controller" },
          duration: "this-turn",
        },
      ],
    });
    expect(knucklehead.base.keywords?.some((k) => k.name === "temper")).toBe(true);
  });
});
