/**
 * PEN080 Concealed Pathogen — Ranger Chest Trap (Cloaked).
 *
 * Printed:
 *   Cloaked
 *   While this is equipped face-down, when an attack hits you and its
 *   controller has played or activated an attack reaction this chain link,
 *   destroy this and create a Bloodrot Pox token under each opponent's control.
 *
 * Reasoning (case-by-case):
 * 1. Cloaked seats face-down.
 * 2. After attacker plays an AR this chain link, hit → destroy trap + Bloodrot
 *    Pox under opponent (1v1).
 * 3. Model flaws fixed:
 *    - has-status was unwired name (always false) → Red Alert status id
 *    - create-token controller each → opponent
 *    - hit target:hero for "hits you"; drop subtypes:Attack residue
 * 4. Boundaries: no AR this link → no fire; face-up → no fire.
 *
 * Status: ✅ cloaked + AR this link hit → destroy + Bloodrot under opponent.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { concealedPathogen } from "../../../../../../cards/src/cards/equipment/concealed-pathogen.ts";
import { spreadingPlagueYellow } from "../../../../../../cards/src/cards/attack-reactions/spreading-plague.ts";

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

function bloodrotCount(player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>): number {
  return player.zone("arena").filter((id) => id === "token:bloodrot-pox").length;
}

describe("concealed-pathogen (PEN080)", () => {
  it("core mechanic: cloaked + AR this link + hit → destroy + Bloodrot under opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, spreadingPlagueYellow],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [concealedPathogen],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    const chestId = Defender.findCardInZone("chest", concealedPathogen);

    expect(game.objectState(chestId)?.faceDown).toBe(true);
    expect(bloodrotCount(Attacker)).toBe(0);

    Attacker.attackWith(snatchRed);
    // Pass defend (no block) into reaction.
    toReaction(game);
    expect(game.combat()?.step).toBe("reaction");

    Attacker.play(spreadingPlagueYellow);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(Defender.zone("chest")).not.toContain(concealedPathogen.canonicalId);
    expect(Defender.zone("graveyard")).toContain(concealedPathogen.canonicalId);
    expect(bloodrotCount(Attacker)).toBe(1);
    expect(bloodrotCount(Defender)).toBe(0);
    expect(Defender.life()).toBe(LIFE - SNATCH);
  });

  it("boundaries: no AR no fire; face-up no fire; model AR status + opponent Bloodrot", () => {
    // Hit without AR this link.
    const noAr = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [concealedPathogen],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    noAr.as(bravo).attackWith(snatchRed);
    drain(noAr);
    noAr.helpers.resolveRestOfCombat();
    drain(noAr);
    expect(noAr.as(dash).zone("chest")).toContain(concealedPathogen.canonicalId);
    expect(bloodrotCount(noAr.as(bravo))).toBe(0);

    // Face-up trap: no fire even with AR.
    const faceUp = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, spreadingPlagueYellow],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [{ card: concealedPathogen, state: { faceDown: false } }],
        deck: 6,
      },
      { autoPassPriority: false },
    );

    faceUp.as(bravo).attackWith(snatchRed);
    toReaction(faceUp);
    faceUp.as(bravo).play(spreadingPlagueYellow);
    drain(faceUp);
    faceUp.helpers.resolveRestOfCombat();
    drain(faceUp);
    expect(faceUp.as(dash).zone("chest")).toContain(concealedPathogen.canonicalId);
    expect(bloodrotCount(faceUp.as(bravo))).toBe(0);

    const a1 = concealedPathogen.base.abilities?.[0];
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
        observes: { kind: "none" },
        target: {
          kind: "hero",
        },
      },
    });
    expect(a1.trigger.kind === "event-and-state" ? a1.trigger.state : undefined).toMatchObject({
      type: "and",
      conditions: [
        { type: "has-status", status: "equipped-face-down" },
        {
          type: "has-status",
          status: "attack-reaction-played-or-activated-this-chain-link",
        },
      ],
    });
    expect(a1.resolution?.kind === "effect" ? a1.resolution.effect : undefined).toMatchObject({
      type: "sequence",
      steps: [
        { type: "destroy", target: { selector: "self" } },
        { type: "create-token", token: "bloodrot-pox", controller: "opponent" },
      ],
    });
    expect(concealedPathogen.base.keywords?.some((k) => k.name === "cloaked")).toBe(true);
  });
});
