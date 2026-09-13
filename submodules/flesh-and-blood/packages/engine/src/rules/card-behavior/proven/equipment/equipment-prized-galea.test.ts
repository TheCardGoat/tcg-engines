/**
 * HVY098 Prized Galea — Warrior Head d2 Temper, Olympia Specialization.
 *
 * Printed:
 *   Attack Reaction - {r}, destroy this: Target weapon attack you control
 *   wagers a Gold token with the defending hero.
 *   Temper
 *
 * Reasoning (hand-authored):
 * 1. this-attack resolves the live attack proxy to the physical weapon.
 * 2. AR timing as attacking player in reaction; {r}+destroy-self.
 * 3. wager stake gold creates Gold token + stamps wager on the weapon attack.
 * 4. Temper first defend d2 −1 counter path.
 */
import { describe, expect, it } from "vitest";
import {
  createFabMatchContext,
  FabTestEngine,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../../../../index.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../../fixtures.ts";
import { prizedGalea } from "../../../../../../cards/src/cards/equipment/prized-galea.ts";

const SNATCH = 4;
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

describe("prized-galea (HVY098)", () => {
  it("core mechanic: AR destroy + {r} → weapon attack wagers Gold", () => {
    let game = FabTestEngine.start(
      {
        hero: bravo,
        head: [prizedGalea],
        weapon1: [dawnblade],
        actionPoints: 1,
        // Dawnblade attack costs {r}; AR costs another {r}.
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    let Attacker = game.as(bravo);

    Attacker.activate(dawnblade);
    for (let safety = 0; safety < 24; safety += 1) {
      if (game.combat()?.step === "defend") break;
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
    expect(game.combat()?.step).toBe("reaction");

    const snapshot = game.getState();
    game = FabTestEngine.fromState(
      restoreFabMatchSnapshot(
        serializeFabMatchSnapshot(snapshot),
        createFabMatchContext(snapshot.cardDefinitions, snapshot.publicCardIdentities),
      ),
    );
    Attacker = game.as(bravo);

    // Pitch for the AR resource cost.
    Attacker.activate(prizedGalea);
    // If pitch decision surfaces, pay with nimblism.
    for (let safety = 0; safety < 16; safety += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "payment") {
        const pick = decision.candidates[0];
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "payment",
              instanceIds: pick ? [pick.instanceId] : [],
            },
          },
        });
        continue;
      }
      if (decision?.kind === "entity-target") {
        const pick = decision.candidates[0];
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
      break;
    }
    drain(game);

    expect(Attacker.zone("graveyard")).toContain(prizedGalea.canonicalId);
    expect(Attacker.zone("head")).not.toContain(prizedGalea.canonicalId);
    // `drain` resolves the chain link: the unblocked weapon attack wins its
    // attached wager and creates the exact preserved Gold prize once.
    expect(Attacker.zone("arena").filter((id) => /token:gold/i.test(id))).toHaveLength(1);
    // Wager observation was emitted on the selected weapon attack.
    const wagers = game.committedEvents().filter((e) => e.name === "wager");
    expect(wagers.length).toBeGreaterThanOrEqual(1);
  });

  it("rejects an attack action because the exact active attack is not a weapon", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [prizedGalea],
        hand: [snatchRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Attacker = game.as(bravo);

    Attacker.attackWith(snatchRed);
    toReaction(game);
    Attacker.activate(prizedGalea);

    expect(() => drain(game)).toThrow(/wager requires the active attack/i);
    expect(Attacker.zone("graveyard")).toContain(prizedGalea.canonicalId);
    expect(game.committedEvents().filter((event) => event.name === "wager")).toEqual([]);
  });

  it("cannot reuse a closed weapon attack as a stale wager target", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [prizedGalea],
        weapon1: [dawnblade],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Attacker = game.as(bravo);

    Attacker.activate(dawnblade);
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();

    expect(() => Attacker.activate(prizedGalea)).toThrow();
    expect(game.committedEvents().filter((event) => event.name === "wager")).toEqual([]);
  });

  it("boundaries: temper first defend d2 −1; model the exact active attack", () => {
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
        head: [prizedGalea],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const helmId = Defender.findCardInZone("head", prizedGalea);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(prizedGalea);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("head")).toContain(prizedGalea.canonicalId);
    expect(game.objectState(helmId)?.defenseCounterTotal).toBe(-1);

    const a1 = prizedGalea.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("attack-reaction");
    expect(a1.effect).toMatchObject({
      type: "wager",
      stake: "gold",
      attacker: {
        selector: "this-attack",
        filter: { typeBox: { types: ["Weapon"] } },
      },
    });
  });
});
