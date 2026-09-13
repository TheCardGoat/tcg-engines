/**
 * PEN081 Concealed Sedative — Ranger Chest Trap (Cloaked).
 *
 * Printed:
 *   Cloaked
 *   While this is equipped face-down, when an attack with {p} greater than its
 *   base hits you, destroy this and create an Inertia token under each
 *   opponent's control.
 *
 * Reasoning (case-by-case):
 * 1. Cloaked face-down gate.
 * 2. Attack power > base (Pummel +4 on cost-2+ AAC) → hit → destroy + Inertia
 *    under opponent.
 * 3. Remodel: controller each → opponent; hit target:hero.
 * 4. Boundary: unmodified base-power hit (Snatch) does not fire; face-up inert.
 *
 * Status: ✅ p>base hit → destroy + Inertia under opponent; base-power/face-up.
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
import { concealedSedative } from "../../../../../../cards/src/cards/equipment/concealed-sedative.ts";

const LIFE = 20;
const SNATCH = 4;

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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (!prio) return;
    try {
      game.exec({ move: "pass", actorId: prio, payload: {} });
    } catch {
      return;
    }
  }
}

function inertiaCount(player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>): number {
  return player.zone("arena").filter((id) => id === "token:inertia").length;
}

describe("concealed-sedative (PEN081)", () => {
  it("core mechanic: cloaked + p>base hit → destroy + Inertia under opponent", () => {
    // Slog base 6 + Pummel +4 → current 10 > base 6.
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
        chest: [concealedSedative],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    const chestId = Defender.findCardInZone("chest", concealedSedative);

    expect(game.objectState(chestId)?.faceDown).toBe(true);
    expect(inertiaCount(Attacker)).toBe(0);

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
    toReaction(game);
    expect(game.combat()?.step).toBe("reaction");

    // Pummel mode for AAC cost 2+ (+4{p}).
    Attacker.play(pummelRed, {
      modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
      pitch: [nimblismBlue, nimblismBlue],
    });
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(Defender.zone("chest")).not.toContain(concealedSedative.canonicalId);
    expect(Defender.zone("graveyard")).toContain(concealedSedative.canonicalId);
    expect(inertiaCount(Attacker)).toBe(1);
    expect(inertiaCount(Defender)).toBe(0);
  });

  it("boundaries: base-power hit no fire; face-up no fire; model opponent Inertia", () => {
    // Snatch p4 base unbuffed — current === base.
    const base = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [concealedSedative],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    base.as(bravo).attackWith(snatchRed);
    drain(base);
    base.helpers.resolveRestOfCombat();
    drain(base);
    expect(base.as(dash).zone("chest")).toContain(concealedSedative.canonicalId);
    expect(inertiaCount(base.as(bravo))).toBe(0);
    expect(base.as(dash).life()).toBe(LIFE - SNATCH);

    // Face-up with p>base still inert.
    const faceUp = FabTestEngine.start(
      {
        hero: bravo,
        hand: [regurgitatingSlogRed, pummelRed, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [{ card: concealedSedative, state: { faceDown: false } }],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    faceUp.as(bravo).attackWith(regurgitatingSlogRed, { pitch: [nimblismBlue] });
    for (let safety = 0; safety < 8; safety += 1) {
      const decision = faceUp.getState().decision;
      if (decision?.kind === "boolean") {
        faceUp.exec({
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
    toReaction(faceUp);
    faceUp.as(bravo).play(pummelRed, {
      modeIds: [`${pummelRed.canonicalId}:chooseMode:hitHero`],
      pitch: [nimblismBlue, nimblismBlue],
    });
    drain(faceUp);
    faceUp.helpers.resolveRestOfCombat();
    drain(faceUp);
    expect(faceUp.as(dash).zone("chest")).toContain(concealedSedative.canonicalId);
    expect(inertiaCount(faceUp.as(bravo))).toBe(0);

    const a1 = concealedSedative.base.abilities?.[0];
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
          filter: { hasStatus: "power-greater-than-base" },
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
    expect(a1.resolution?.kind === "effect" ? a1.resolution.effect : undefined).toMatchObject({
      type: "sequence",
      steps: [
        { type: "destroy", target: { selector: "self" } },
        { type: "create-token", token: "inertia", controller: "opponent" },
      ],
    });
    expect(concealedSedative.base.keywords?.some((k) => k.name === "cloaked")).toBe(true);
  });
});
