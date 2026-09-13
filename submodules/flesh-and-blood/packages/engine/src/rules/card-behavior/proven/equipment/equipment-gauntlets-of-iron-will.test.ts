/**
 * HVY053 Gauntlets of Iron Will — Guardian Arms d2 Temper.
 *
 * Printed:
 *   When this defends, the next time an attack would gain {p} this chain link,
 *   instead it gains that much minus 1.
 *   Temper
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Defend subject:self registers one-shot power-gain replacement this link.
 * 2. ENGINE: replaces.name "gain" matches continuous-effect-applied power
 *    increases; contribution value −1 (Flourish family).
 * 3. Happy: Slog attack, defend gauntlets, Pummel +4 → attack gains +3;
 *    damage (6+3) − d2 = 7; Temper −1.
 * 4. Boundary: no AR power gain → base slog − d2; Temper; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import {
  bravo,
  dash,
  snatchRed,
  pummelRed,
  nimblismBlue,
  regurgitatingSlogRed,
} from "../../../fixtures.ts";
import { gauntletsOfIronWill } from "../../../../../../cards/src/cards/equipment/gauntlets-of-iron-will.ts";

const LIFE = 40;
const SLOG = 6;
const PUMMEL = 4;
const ARMS_D = 2;

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
    if (decision?.kind === "option") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "option",
            optionIds: decision.options.slice(0, decision.min).map((o) => o.id),
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

function toReaction(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 16; safety += 1) {
    if (game.combat()?.step === "reaction") return;
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
    const prio = game.getState().priority?.holderPlayerId;
    if (!prio) return;
    try {
      game.exec({ move: "pass", actorId: prio, payload: {} });
    } catch {
      return;
    }
  }
}

describe("gauntlets-of-iron-will (HVY053)", () => {
  it("core mechanic: defend → next attack power gain this link −1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [regurgitatingSlogRed, pummelRed, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [gauntletsOfIronWill],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(regurgitatingSlogRed, { pitch: [nimblismBlue] });
    // Decline optional slog dominate cost.
    for (let safety = 0; safety < 8; safety += 1) {
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
      break;
    }
    Defender.defendWith(gauntletsOfIronWill);
    // Drain defend-trigger stack (register replacement) without resolving combat.
    for (let safety = 0; safety < 24; safety += 1) {
      if (game.combat()?.step === "reaction") break;
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
      if (game.getState().rulesStack.length === 0 && game.combat()?.step === "defend") {
        toReaction(game);
        break;
      }
      const prio = game.getState().priority?.holderPlayerId;
      if (prio && game.getState().rulesStack.length > 0) {
        try {
          game.exec({ move: "pass", actorId: prio, payload: {} });
        } catch {
          break;
        }
        continue;
      }
      break;
    }
    if (game.combat()?.step !== "reaction") toReaction(game);
    expect(game.combat()?.step).toBe("reaction");
    // Replacement registered for this link (next power gain −1).
    expect(game.getState().replacementEffects.length).toBeGreaterThan(0);

    // Pummel +4 on cost≥2 AAC → iron will reduces to +3.
    Attacker.play(pummelRed, {
      modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
      pitch: [nimblismBlue, nimblismBlue],
    });
    drain(game);
    if (game.combat()) game.helpers.resolveRestOfCombat();
    drain(game);

    // Slog 6 + (4−1) = 9 − arms d2 = 7 damage.
    expect(Defender.life()).toBe(LIFE - (SLOG + (PUMMEL - 1) - ARMS_D));
    expect(Defender.zone("arms")).toContain(gauntletsOfIronWill.canonicalId);
    const armsId = Defender.findCardInZone("arms", gauntletsOfIronWill);
    expect(game.objectState(armsId)?.defenseCounterTotal).toBe(-1);
  });

  it("boundaries: no power gain → base block; Temper; model gain−1 this-chain-link", () => {
    const bare = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, arms: [gauntletsOfIronWill], deck: 6 },
      { autoPassPriority: false },
    );
    bare.as(bravo).attackWith(snatchRed);
    bare.as(dash).defendWith(gauntletsOfIronWill);
    drain(bare);
    bare.helpers.resolveRestOfCombat();

    // Snatch 4 − d2 = 2; no power gain to reduce.
    expect(bare.as(dash).life()).toBe(LIFE - (4 - ARMS_D));
    expect(bare.as(dash).zone("arms")).toContain(gauntletsOfIronWill.canonicalId);
    const armsId = bare.as(dash).findCardInZone("arms", gauntletsOfIronWill);
    expect(bare.objectState(armsId)?.defenseCounterTotal).toBe(-1);

    const a1 = gauntletsOfIronWill.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered" || a1.resolution.kind !== "effect")
      return;
    expect(a1.trigger).toMatchObject({
      event: { name: "defend", observes: { kind: "source" } },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "replacement",
      replaces: { name: "gain" },
      modification: {
        type: "modify-numeric",
        property: "power",
        op: "subtract",
        amount: 1,
      },
      duration: "this-chain-link",
    });
  });
});
