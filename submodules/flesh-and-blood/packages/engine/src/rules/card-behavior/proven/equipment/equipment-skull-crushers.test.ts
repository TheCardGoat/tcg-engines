/**
 * EVR001 Skull Crushers — Brute Arms d1 Battleworn.
 *
 * Printed:
 *   Whenever you roll a 5 or 6 on a die, your Brute attacks gain +1{p} this turn.
 *   Whenever you roll a 1 on a die, destroy Skull Crushers.
 *   Battleworn
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Prior model: event name "trigger" + hasStatus rolled-N-on-a-die — never
 *    matched live committed `roll` events (Gambler's Gloves residue class).
 * 2. Remodel: roll + controller actor + face comparison (gte 5 / eq 1);
 *    engine eventAmount(roll) → data.result; floating appliesTo Brute attacks.
 * 3. Die source: Barkbone Instant destroy-self rolls a d6 for the controller.
 * 4. Happy 5–6: roll → Brute AAC (Pack Hunt base 5) deals 6; arms still equipped.
 * 5. Happy 1: roll → Skull Crushers destroyed to GY.
 * 6. Boundary mid face (2–4): no destroy, no +1{p}.
 * 7. Boundary Generic AAC (Snatch) after 5–6: not Brute → unbuffed.
 * 8. Battleworn d1: defend keeps arms, −1{d} counter.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, packHuntYellow, snatchRed } from "../../../fixtures.ts";
import { skullCrushers } from "../../../../../../cards/src/cards/equipment/skull-crushers.ts";
import { barkboneStrapping } from "../../../../../../cards/src/cards/equipment/barkbone-strapping.ts";

const LIFE = 40;
const PACK_HUNT = 5;
const SNATCH = 4;
const ARMS_D = 1;

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

function committedRollResult(game: ReturnType<typeof FabTestEngine.start>): number {
  const rolls = game
    .committedEvents()
    .filter((e) => e.name === "roll")
    .map((e) => (e.data as { result?: number }).result)
    .filter((r): r is number => typeof r === "number");
  expect(rolls.length).toBeGreaterThan(0);
  return rolls.at(-1)!;
}

function rollBarkbone(seed: string): ReturnType<typeof FabTestEngine.start> & { face: number } {
  const game = FabTestEngine.start(
    {
      hero: bravo,
      arms: [skullCrushers],
      chest: [barkboneStrapping],
      hand: [packHuntYellow, snatchRed],
      resourcePoints: 4,
      actionPoints: 2,
      deck: 6,
    },
    { hero: dash, life: LIFE, hand: [], deck: 6 },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual", seed },
  );
  const Bravo = game.as(bravo);
  expect(Bravo.zone("arms")).toContain(skullCrushers.canonicalId);
  const activated = Bravo.activate(barkboneStrapping);
  expect(activated.accepted).toBe(true);
  drain(game);
  const face = committedRollResult(game);
  return Object.assign(game, { face });
}

describe("skull-crushers (EVR001)", () => {
  it("core mechanic: roll 5–6 → Brute attacks +1{p} this turn", () => {
    // seed skull4 → barkbone face 5 (probe-pinned for this fixture layout).
    const game = rollBarkbone("skull4");
    expect(game.face).toBeGreaterThanOrEqual(5);
    expect(game.face).toBeLessThanOrEqual(6);

    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);
    expect(Bravo.zone("arms")).toContain(skullCrushers.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(skullCrushers.canonicalId);

    Bravo.attackWith(packHuntYellow);
    // Pack Hunt intimidate may open a decision; drain and resolve combat.
    drain(game);
    if (game.combat()) game.helpers.resolveRestOfCombat();
    drain(game);

    expect(Opponent.life()).toBe(LIFE - (PACK_HUNT + 1));
  });

  it("core mechanic: roll 1 → destroy Skull Crushers", () => {
    // seed c → barkbone face 1 (probe-pinned for this fixture layout).
    const game = rollBarkbone("c");
    expect(game.face).toBe(1);

    const Bravo = game.as(bravo);
    expect(Bravo.zone("arms")).not.toContain(skullCrushers.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(skullCrushers.canonicalId);
  });

  it("boundaries: mid face no destroy/no buff; Generic AAC unbuffed; BW d1; model", () => {
    // Mid face (2–4): arms stay; Pack Hunt deals base power only.
    // seed skull-hi → face 4 under this fixture layout.
    const mid = rollBarkbone("skull-hi");
    expect(mid.face).toBeGreaterThanOrEqual(2);
    expect(mid.face).toBeLessThanOrEqual(4);
    const MidBravo = mid.as(bravo);
    const MidOpp = mid.as(dash);
    expect(MidBravo.zone("arms")).toContain(skullCrushers.canonicalId);
    MidBravo.attackWith(packHuntYellow);
    drain(mid);
    if (mid.combat()) mid.helpers.resolveRestOfCombat();
    drain(mid);
    expect(MidOpp.life()).toBe(LIFE - PACK_HUNT);

    // High face then Generic Snatch (not Brute) stays unbuffed.
    // seed skull4 → face 5.
    const hi = rollBarkbone("skull4");
    expect(hi.face).toBeGreaterThanOrEqual(5);
    const HiBravo = hi.as(bravo);
    const HiOpp = hi.as(dash);
    HiBravo.attackWith(snatchRed);
    hi.helpers.resolveRestOfCombat();
    expect(HiOpp.life()).toBe(LIFE - SNATCH);

    // Battleworn d1.
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: LIFE, arms: [skullCrushers], hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Def = bw.as(bravo);
    const eqId = Def.findCardInZone("arms", skullCrushers);
    bw.as(dash).attackWith(snatchRed);
    Def.exec({ move: "defend", payload: { instanceIds: [eqId] } });
    bw.helpers.resolveRestOfCombat();
    expect(Def.zone("arms")).toContain(skullCrushers.canonicalId);
    expect(bw.objectState(eqId)?.defenseCounterTotal ?? 0).toBeLessThanOrEqual(-ARMS_D);

    // Model shape: roll triggers + face comparisons + floating Brute appliesTo.
    const a1 = skullCrushers.base.abilities?.find(
      (a) => a.id === "KccqWCmJhTfHpcNQJfdMQ:wheneverRoll56DieBruteAttacksGain1",
    );
    const a2 = skullCrushers.base.abilities?.find(
      (a) => a.id === "KccqWCmJhTfHpcNQJfdMQ:wheneverRoll1DieDestroySkullCrushers",
    );
    expect(a1).toMatchObject({
      trigger: {
        kind: "event",
        event: {
          name: "roll",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
          result: { op: "gte", value: 5 },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "modify-numeric",
          property: "power",
          amount: 1,
          duration: "this-turn",
          appliesTo: {
            next: { typeBox: { supertypes: ["Brute"] } },
            count: { type: "all" },
          },
        },
      },
      kind: "static",
      staticKind: "triggered",
    });
    expect(a2).toMatchObject({
      trigger: {
        kind: "event",
        event: {
          name: "roll",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
          result: { op: "eq", value: 1 },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "destroy",
          target: { selector: "self" },
        },
      },
      kind: "static",
      staticKind: "triggered",
    });
  });
});
