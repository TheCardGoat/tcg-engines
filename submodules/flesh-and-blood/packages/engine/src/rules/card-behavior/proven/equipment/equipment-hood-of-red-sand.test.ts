/**
 * HVY099 Hood of Red Sand — Warrior Head d1 Battleworn, Kassai Specialization.
 *
 * Printed:
 *   Attack Reaction - {r}, banish a red and yellow card from your graveyard,
 *   destroy this: Target sword attack gets "When this hits, draw a card."
 *   Battleworn
 *
 * Reasoning (hand-authored):
 * 1. Mixed activation cost: 1{r} + banish red GY + banish yellow GY + destroy-self.
 *    Nested mixed "all" is flattened by activationBanishRequirements (Kassai path).
 * 2. Grant on-hit draw onto sword attack on combat-chain (Sword is a subtype).
 * 3. On hit, controller draws 1.
 * 4. Missing red or yellow in GY → AR not legal.
 * 5. Battleworn first defend d1 → −1 counter.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import {
  bravo,
  dash,
  dawnblade,
  snatchRed,
  tomeOfFyendalYellow,
  sigilOfSolaceRed,
} from "../../../fixtures.ts";
import { listLegalCommands } from "../../../../automation/legal-commands.ts";
import { hoodOfRedSand } from "../../../../../../cards/src/cards/equipment/hood-of-red-sand.ts";

const SNATCH = 4;
const LIFE = 20;
const HOOD_ABILITY =
  "6ntF8Rdm7PqLkHWnPMkrF:attackReactionBanishRedYellowFromGraveyardDestroyTarget";

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
      const need = decision.min ?? 1;
      const picks = decision.candidates.slice(0, need).map((c) => c.instanceId);
      if (picks.length < need && need > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks },
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
  for (let safety = 0; safety < 24; safety += 1) {
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (!prio) return;
    game.exec({ move: "pass", actorId: prio, payload: {} });
  }
}

function advanceWeaponToReaction(
  game: ReturnType<typeof FabTestEngine.start>,
  attacker: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
): void {
  attacker.activate(dawnblade);
  for (let safety = 0; safety < 24; safety += 1) {
    if (game.combat()?.step === "defend" || game.combat()?.step === "reaction") break;
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
    if (!prio) break;
    game.exec({ move: "pass", actorId: prio, payload: {} });
  }
  toReaction(game);
}

/** Activate hood AR: multi banish cost picks + destroy-self. */
function activateHoodAr(game: ReturnType<typeof FabTestEngine.start>, actorId: string): void {
  const activate = listLegalCommands(game.getRuntime(), actorId).find(
    (cmd) => cmd.move === "activate" && cmd.payload.ability === HOOD_ABILITY,
  );
  expect(activate).toBeDefined();
  game.exec({ move: "activate", actorId, payload: activate!.payload });

  for (let safety = 0; safety < 24; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target" && decision.actorId === actorId) {
      const need = decision.min;
      const picks = decision.candidates.slice(0, need).map((c) => c.instanceId);
      if (picks.length < need) {
        throw new Error(`Hood AR expected ${need} cost candidates, got ${picks.length}.`);
      }
      game.exec({
        move: "answer-decision",
        actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks },
        },
      });
      continue;
    }
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
    if (decision) {
      if (game.answerForcedDecision()) continue;
      break;
    }
    break;
  }
}

describe("hood-of-red-sand (HVY099)", () => {
  it("core mechanic: AR banish red+yellow + destroy → sword hit draws", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [hoodOfRedSand],
        weapon1: [dawnblade],
        graveyard: [snatchRed, tomeOfFyendalYellow],
        // Dawnblade {r} + AR {r}
        resourcePoints: 2,
        actionPoints: 1,
        deck: 8,
        hand: [],
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const handBefore = Attacker.zone("hand").length;
    const deckBefore = Attacker.zone("deck").length;

    advanceWeaponToReaction(game, Attacker);
    expect(game.combat()?.step).toBe("reaction");

    activateHoodAr(game, Attacker.id);
    drain(game);

    // Costs paid: hood destroyed → GY; red+yellow banished from GY.
    expect(Attacker.zone("head")).not.toContain(hoodOfRedSand.canonicalId);
    expect(Attacker.zone("graveyard")).toContain(hoodOfRedSand.canonicalId);
    expect(Attacker.zone("banished")).toContain(snatchRed.canonicalId);
    expect(Attacker.zone("banished")).toContain(tomeOfFyendalYellow.canonicalId);

    // Resolve combat — sword hits, granted ability draws.
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(LIFE - 3); // dawnblade power 3
    // Draw from on-hit.
    expect(Attacker.zone("hand").length).toBe(handBefore + 1);
    expect(Attacker.zone("deck").length).toBe(deckBefore - 1);
  });

  it("boundaries: missing GY color illegal; battleworn d1 −1; model shape", () => {
    // Only red in GY — cannot pay yellow banish.
    const missingYellow = FabTestEngine.start(
      {
        hero: bravo,
        head: [hoodOfRedSand],
        weapon1: [dawnblade],
        graveyard: [snatchRed, sigilOfSolaceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    advanceWeaponToReaction(missingYellow, missingYellow.as(bravo));
    const illegal = listLegalCommands(missingYellow.getRuntime(), missingYellow.as(bravo).id).find(
      (cmd) => cmd.move === "activate" && cmd.payload.ability === HOOD_ABILITY,
    );
    expect(illegal).toBeUndefined();

    // Battleworn defend path.
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
        head: [hoodOfRedSand],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const helmId = Defender.findCardInZone("head", hoodOfRedSand);
    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(hoodOfRedSand);
    drain(game);
    game.helpers.resolveRestOfCombat();
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    expect(game.objectState(helmId)?.defenseCounterTotal).toBe(-1);

    const a2 = hoodOfRedSand.base.abilities?.[0];
    expect(a2?.kind).toBe("activated");
    if (a2?.kind !== "activated" || !a2.effect) return;
    expect(a2.abilityType).toBe("attack-reaction");
    expect(a2.cost).toMatchObject({
      class: "mixed",
      type: "all",
    });
    expect(a2.effect).toMatchObject({
      type: "grant-property",
      property: {
        kind: "ability",
        ability: {
          kind: "static",
          staticKind: "triggered",
          resolution: {
            kind: "effect",
            effect: { type: "draw", count: 1, player: "controller" },
          },
        },
      },
      target: {
        filter: { typeBox: { subtypes: ["Sword"] } },
      },
      duration: "this-turn",
    });
  });
});
