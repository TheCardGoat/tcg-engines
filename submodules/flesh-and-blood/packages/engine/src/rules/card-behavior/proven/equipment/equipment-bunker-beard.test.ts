/**
 * HNT220 Bunker Beard — Generic Head d0.
 *
 * Printed:
 *   Defense Reaction - Destroy this: You may add an action card from your
 *   arsenal to the active chain link as a defending card.
 *
 * Reasoning (hand-authored):
 * 1. DR ability on equipment: destroy-self cost, legal only as defending hero
 *    in the reaction step.
 * 2. Optional add-defending from arsenal Action uses hand/arsenal path of
 *    add-defending (already supported).
 * 3. Decline optional: beard still destroyed, arsenal untouched.
 * 4. No arsenal Action: optional/target fails closed without adding.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { bunkerBeard } from "../../../../../../cards/src/cards/equipment/bunker-beard.ts";

const SNATCH = 4;
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

/** Pass until defending player has priority in reaction. */
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

describe("bunker-beard (HNT220)", () => {
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
        head: [bunkerBeard],
        // Arsenal Action with d2 to prove defense contribution.
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

    Defender.activate(bunkerBeard);

    // Optional "you may add…": accept, then pick arsenal action.
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

    // Snatch 4 − nimblism d2 = 2 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("graveyard")).toContain(bunkerBeard.canonicalId);
    expect(Defender.zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(Defender.zone("head")).not.toContain(bunkerBeard.canonicalId);
    expect(Defender.zone("arsenal")).not.toContain(nimblismBlue.canonicalId);
  });

  it("boundaries: decline keeps arsenal; DR illegal before reaction", () => {
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
        head: [bunkerBeard],
        arsenal: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    // Before combat: DR illegal.
    const preCombat = Defender.expectFailure({
      move: "activate",
      payload: { instanceId: Defender.card(bunkerBeard) },
    });
    expect(preCombat.accepted).toBe(false);

    Attacker.attackWith(snatchRed);
    toReaction(game);
    defenderReactionPriority(game, Defender.id);
    Defender.activate(bunkerBeard);

    // Decline optional — arsenal stays, beard still destroyed.
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
    expect(Defender.zone("graveyard")).toContain(bunkerBeard.canonicalId);
    expect(Defender.zone("arsenal")).toContain(nimblismBlue.canonicalId);

    const a1 = bunkerBeard.base.abilities?.[0];
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
  });
});
