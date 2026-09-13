/**
 * HNT194 Red Alert Gloves — Assassin/Warrior Arms d1 Blade Break.
 *
 * Printed:
 *   If an attack reaction has been played or activated this chain link, this
 *   gets +1{d}.
 *   Blade Break
 *
 * Reasoning (hand-authored; arms twin of HNT192 red-alert-visor):
 * 1. Continuous +1{d} is condition-gated per chain link, not a this-turn latch.
 * 2. Defend then AR this link → d2 at damage; BB.
 * 3. Without AR, base d1 + BB.
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
import { redAlertGloves } from "../../../../../../cards/src/cards/equipment/red-alert-gloves.ts";

const SNATCH = 4;
const SLOG = 6;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
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
    game.exec({ move: "pass", actorId: prio, payload: {} });
  }
}

describe("red-alert-gloves (HNT194)", () => {
  it("core mechanic: AR this chain link → +1{d} (d2) then BB", () => {
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
        arms: [redAlertGloves],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(regurgitatingSlogRed, { pitch: [nimblismBlue] });
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
    Defender.defendWith(redAlertGloves);
    toReaction(game);
    expect(game.combat()?.step).toBe("reaction");

    Attacker.play(pummelRed, {
      modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
      pitch: [nimblismBlue, nimblismBlue],
    });
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Slog 6 + pummel 4 = 10 power; gloves d1+1 = 2 → 8 damage; BB → GY.
    expect(Defender.life()).toBe(LIFE - (SLOG + 4 - 2));
    expect(Defender.zone("graveyard")).toContain(redAlertGloves.canonicalId);
    expect(Defender.zone("arms")).not.toContain(redAlertGloves.canonicalId);
  });

  it("boundaries: no AR → base d1 BB; model continuous permanent", () => {
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
        arms: [redAlertGloves],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(redAlertGloves);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(LIFE - (SNATCH - 1));
    expect(game.as(dash).zone("graveyard")).toContain(redAlertGloves.canonicalId);

    const a1 = redAlertGloves.base.abilities?.find(
      (a) => a.id === "j9NnkHbJbdLdDLg9QtPht:ifAttackReactionHasBeenPlayedActivatedChainLink",
    );
    expect(a1).toMatchObject({
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "has-status",
        status: "attack-reaction-played-or-activated-this-chain-link",
      },
      effect: {
        type: "modify-numeric",
        property: "defense",
        amount: 1,
        duration: "permanent",
        target: { selector: "self" },
      },
    });
  });
});
