import { typeBoxTokens } from "@tcg/flesh-and-blood-types";
/**
 * PEN316 Burnished Bunkerplate — Generic Chest d0.
 *
 * Printed:
 *   Defense Reaction - Destroy this: You may add an action card from your
 *   arsenal to the active chain link as a defending card.
 *
 * Reasoning (case-by-case — chest twin of HNT220 Bunker Beard):
 * 1. DR activated on equipment: destroy-self cost; legal only for defending
 *    hero in the reaction step (not pre-combat).
 * 2. Optional add-defending from arsenal Action — same leaf as beard
 *    (arsenal/hand origin already supported; not ambush-gated).
 * 3. Accept: plate destroyed, arsenal Action contributes {d} on the link.
 * 4. Decline: plate still destroyed (cost), arsenal untouched.
 * 5. Model: abilityType defense-reaction + optional add-defending filter Action.
 *
 * Status: ✅ DR arsenal Action defender; decline; pre-combat illegal; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { burnishedBunkerplate } from "../../../../../../cards/src/cards/equipment/burnished-bunkerplate.ts";

const SNATCH = 4;
const LIFE = 20;
/** nimblismBlue printed defense contribution when defending. */
const NIMBLISM_D = 2;

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

function defenderReactionPriority(
  game: ReturnType<typeof FabTestEngine.start>,
  defenderId: string,
): void {
  for (let safety = 0; safety < 8; safety += 1) {
    if (game.getState().priority?.holderPlayerId === defenderId) return;
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (!prio || game.getState().decision) return;
    game.exec({ move: "pass", actorId: prio, payload: {} });
  }
}

describe("burnished-bunkerplate (PEN316)", () => {
  it("core mechanic: DR destroy → optional arsenal Action as defender", () => {
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
        chest: [burnishedBunkerplate],
        arsenal: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    toReaction(game);
    expect(game.combat()?.step).toBe("reaction");
    defenderReactionPriority(game, Defender.id);

    Defender.activate(burnishedBunkerplate);

    let acceptedOptional = false;
    for (let safety = 0; safety < 24; safety += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "boolean" && decision.actorId === Defender.id) {
        answerBoolean(game, true);
        acceptedOptional = true;
        continue;
      }
      if (decision?.kind === "entity-target" && decision.actorId === Defender.id) {
        const arsenalId = Defender.findCardInZone("arsenal", nimblismBlue);
        const pick =
          decision.candidates.find((c) => c.instanceId === arsenalId) ?? decision.candidates[0];
        expect(pick).toBeDefined();
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
      if (game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      break;
    }
    expect(acceptedOptional).toBe(true);

    drain(game);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − nimblism d2 = 2 damage; plate d0 does not block (destroyed as cost).
    expect(Defender.life()).toBe(LIFE - (SNATCH - NIMBLISM_D));
    expect(Defender.zone("graveyard")).toContain(burnishedBunkerplate.canonicalId);
    expect(Defender.zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(Defender.zone("chest")).not.toContain(burnishedBunkerplate.canonicalId);
    expect(Defender.zone("arsenal")).not.toContain(nimblismBlue.canonicalId);
  });

  it("boundaries: decline keeps arsenal; pre-combat DR illegal; model", () => {
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
        chest: [burnishedBunkerplate],
        arsenal: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    const preCombat = Defender.expectFailure({
      move: "activate",
      payload: { instanceId: Defender.card(burnishedBunkerplate) },
    });
    expect(preCombat.accepted).toBe(false);

    Attacker.attackWith(snatchRed);
    toReaction(game);
    defenderReactionPriority(game, Defender.id);
    Defender.activate(burnishedBunkerplate);

    for (let safety = 0; safety < 16; safety += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "boolean" && decision.actorId === Defender.id) {
        answerBoolean(game, false);
        break;
      }
      if (decision?.kind === "boolean") {
        answerBoolean(game, false);
        continue;
      }
      break;
    }

    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - SNATCH);
    expect(Defender.zone("graveyard")).toContain(burnishedBunkerplate.canonicalId);
    expect(Defender.zone("arsenal")).toContain(nimblismBlue.canonicalId);

    const a1 = burnishedBunkerplate.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("defense-reaction");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "optional",
      effect: {
        type: "add-defending",
        target: {
          selector: "object",
          zones: ["arsenal"],
          filter: { typeBox: { types: ["Action"] } },
        },
      },
    });
    expect(burnishedBunkerplate.base.numeric.defense).toBe(0);
    expect(typeBoxTokens(burnishedBunkerplate.base.typeBox)).toEqual(
      expect.arrayContaining(["Equipment", "Chest"]),
    );
  });
});
