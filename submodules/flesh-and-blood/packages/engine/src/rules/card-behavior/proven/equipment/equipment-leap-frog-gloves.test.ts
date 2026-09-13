/**
 * HNT171 Leap Frog Gloves — Assassin/Ninja Arms d1 Blade Break.
 *
 * Printed:
 *   When an opponent plays or activates an attack reaction, you may add this
 *   to the active chain link as a defending card.
 *   Blade Break
 *
 * Reasoning (hand-authored; arms twin of HNT169 vocal-sac):
 * 1. types:["Attack Reaction"] — single CR type; AND of Attack+Reaction never
 *    matches live type-boxes.
 * 2. optional add-defending self from Arms; accept → d1 + BB; decline stays.
 * 3. Dual play + activate triggers.
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
import { leapFrogGloves } from "../../../../../../cards/src/cards/equipment/leap-frog-gloves.ts";

const SNATCH = 4;
const SLOG = 6;
const LIFE = 20;

function answerBoolean(game: ReturnType<typeof FabTestEngine.start>, value: boolean): boolean {
  const decision = game.getState().decision;
  if (decision?.kind !== "boolean") return false;
  game.exec({
    move: "answer-decision",
    actorId: decision.actorId,
    payload: {
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "boolean", value },
    },
  });
  return true;
}

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
      const need = decision.min;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "option",
            optionIds: decision.options.slice(0, need).map((o) => o.id),
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
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
      answerBoolean(game, false);
      continue;
    }
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (!prio) return;
    game.exec({ move: "pass", actorId: prio, payload: {} });
  }
}

function acceptOptionalFor(
  game: ReturnType<typeof FabTestEngine.start>,
  actorId: string,
  value: boolean,
): boolean {
  for (let safety = 0; safety < 32; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean" && decision.actorId === actorId) {
      return answerBoolean(game, value);
    }
    if (decision?.kind === "boolean") {
      answerBoolean(game, false);
      continue;
    }
    if (decision?.kind === "option") {
      const need = decision.min;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "option",
            optionIds: decision.options.slice(0, need).map((o) => o.id),
          },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) return false;
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
    if (game.getState().rulesStack.length > 0) {
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
    }
    return false;
  }
  return false;
}

describe("leap-frog-gloves (HNT171)", () => {
  it("core mechanic: opponent AR → optional add as defender d1 + BB", () => {
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
        arms: [leapFrogGloves],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(regurgitatingSlogRed, { pitch: [nimblismBlue] });
    acceptOptionalFor(game, Attacker.id, false);
    toReaction(game);
    expect(game.combat()?.step).toBe("reaction");

    Attacker.play(pummelRed, {
      modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
      pitch: [nimblismBlue, nimblismBlue],
    });

    expect(acceptOptionalFor(game, Defender.id, true)).toBe(true);

    drain(game);
    game.helpers.resolveRestOfCombat();

    // Pummel +4 on cost≥2 AAC → 10 power − d1 = 9 damage; BB → GY.
    expect(Defender.life()).toBe(LIFE - (SLOG + 4 - 1));
    expect(Defender.zone("graveyard")).toContain(leapFrogGloves.canonicalId);
    expect(Defender.zone("arms")).not.toContain(leapFrogGloves.canonicalId);
  });

  it("boundaries: decline keeps arms; normal defend still BB d1; model", () => {
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
        arms: [leapFrogGloves],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(regurgitatingSlogRed, { pitch: [nimblismBlue] });
    acceptOptionalFor(game, Attacker.id, false);
    toReaction(game);
    Attacker.play(pummelRed, {
      modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
      pitch: [nimblismBlue, nimblismBlue],
    });
    expect(acceptOptionalFor(game, Defender.id, false)).toBe(true);

    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SLOG + 4));
    expect(Defender.zone("arms")).toContain(leapFrogGloves.canonicalId);

    // Normal defend path.
    const game2 = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [leapFrogGloves],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    game2.as(bravo).attackWith(snatchRed);
    game2.as(dash).defendWith(leapFrogGloves);
    drain(game2);
    game2.helpers.resolveRestOfCombat();
    expect(game2.as(dash).life()).toBe(LIFE - (SNATCH - 1));
    expect(game2.as(dash).zone("graveyard")).toContain(leapFrogGloves.canonicalId);

    const abilities = leapFrogGloves.base.abilities ?? [];
    expect(abilities).toHaveLength(2);
    for (const a of abilities) {
      expect(a.kind).toBe("static");
      if (a.kind !== "static" || a.staticKind !== "triggered" || a.resolution.kind !== "effect")
        continue;
      expect(a.trigger).toMatchObject({
        event: {
          actor: { kind: "player", player: "opponent" },
          observes: {
            kind: "event-object",
            filter: { typeBox: { types: ["Attack Reaction"] } },
          },
        },
      });
      expect(["play", "activate"]).toContain((a.trigger as { event: { name: string } }).event.name);
      expect(a.resolution?.effect).toMatchObject({
        type: "optional",
        effect: {
          type: "add-defending",
          target: { selector: "self" },
        },
      });
    }
  });
});
