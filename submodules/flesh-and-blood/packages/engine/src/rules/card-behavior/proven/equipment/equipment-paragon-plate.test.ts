/**
 * AHA004 Paragon Plate — Warrior Chest d2 Temper.
 *
 * Printed (i18n):
 *   Attack Reaction - {t}, remove a +1{p} counter from an attacking sword you
 *   control: Gain {r}.
 *   Temper
 *
 * Model:
 *   activated attack-reaction; mixed cost: tap-self + remove-counters
 *   (numeric +1{p}, filter Sword + hasStatus attacking); gain-resources 1;
 *   temper keyword.
 *
 * Reasoning (hand-authored — found architectural gaps):
 * 1. Attack Reaction window only (illegal outside reaction step while a sword
 *    you control is the active attack).
 * 2. Cost pays with tap of this equipment + removing one +1{p} from an
 *    attacking sword. Named-only remove-counter costs (Pleiades path) were
 *    insufficient — engine now accepts numeric filtered costs and
 *    hasCounter:"+1{p}" matches numeric stacks.
 * 3. Effect: controller gains 1{r}; equipment stays (no destroy cost).
 * 4. Boundary: no +1{p} on the sword → AR not legal.
 * 5. Boundary: Temper first defend d2 → −1{d} counter.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { listLegalCommands } from "../../../../automation/legal-commands.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../../fixtures.ts";
import { paragonPlate } from "../../../../../../cards/src/cards/equipment/paragon-plate.ts";

const SNATCH = 4;
const LIFE = 20;
const PLATE_ABILITY = "CWDdwtBckLgb6gR6KqnD9:attackReactionRemove1CounterFromAttackingSwordControl";

function weaponId(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  card: { canonicalId: string },
): string {
  const state = game.getState();
  const _player = state.players[playerId]!;
  const id =
    state.containers.zonesByPlayerId[playerId]!.weapon1.find(
      (iid) => state.objects[iid]?.canonicalId === card.canonicalId,
    ) ??
    state.containers.zonesByPlayerId[playerId]!.weapon2.find(
      (iid) => state.objects[iid]?.canonicalId === card.canonicalId,
    );
  if (!id) throw new Error(`weapon ${card.canonicalId} not seated`);
  return id;
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

function activatePlateAr(game: ReturnType<typeof FabTestEngine.start>, actorId: string): void {
  const activate = listLegalCommands(game.getRuntime(), actorId).find(
    (cmd) => cmd.move === "activate" && cmd.payload.ability === PLATE_ABILITY,
  );
  expect(activate).toBeDefined();
  game.exec({ move: "activate", actorId, payload: activate!.payload });

  for (let safety = 0; safety < 16; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target" && decision.actorId === actorId) {
      const need = decision.min ?? 1;
      const picks = decision.candidates.slice(0, need).map((c) => c.instanceId);
      if (picks.length < need) {
        throw new Error(`Paragon Plate AR expected ${need} cost candidates, got ${picks.length}.`);
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

describe("paragon-plate (AHA004)", () => {
  it("core mechanic: AR {t} + remove +1{p} from attacking sword → gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [paragonPlate],
        weapon1: [{ card: dawnblade, state: { powerCounterTotal: 1 } }],
        hand: [],
        // Dawnblade attack costs {r}; AR then refunds 1 after the spend.
        resourcePoints: 1,
        actionPoints: 1,
        deck: 8,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);

    const swordId = weaponId(game, Attacker.id, dawnblade);
    expect(game.objectState(swordId)?.powerCounterTotal).toBe(1);

    advanceWeaponToReaction(game, Attacker);
    expect(game.combat()?.step).toBe("reaction");
    // Weapon attack spent the 1{r}; plate AR should refund 1 after cost.
    expect(Attacker.resourcePoints()).toBe(0);

    activatePlateAr(game, Attacker.id);
    drain(game);

    expect(game.objectState(swordId)?.powerCounterTotal ?? 0).toBe(0);
    expect(Attacker.resourcePoints()).toBe(1);
    // Equipment stays seated (no destroy cost) and is tapped.
    expect(Attacker.zone("chest")).toContain(paragonPlate.canonicalId);
    const plateId = Attacker.findCardInZone("chest", paragonPlate);
    expect(game.objectState(plateId)?.tapped).toBe(true);
  });

  it("boundaries: no +1{p} on sword → AR illegal; temper d2 −1; model shape", () => {
    const noCounter = FabTestEngine.start(
      {
        hero: bravo,
        chest: [paragonPlate],
        weapon1: [dawnblade],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    advanceWeaponToReaction(noCounter, noCounter.as(bravo));
    const illegal = listLegalCommands(noCounter.getRuntime(), noCounter.as(bravo).id).find(
      (cmd) => cmd.move === "activate" && cmd.payload.ability === PLATE_ABILITY,
    );
    expect(illegal).toBeUndefined();

    // Temper first defend.
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
        chest: [paragonPlate],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const plateId = Defender.findCardInZone("chest", paragonPlate);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(paragonPlate);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("chest")).toContain(paragonPlate.canonicalId);
    expect(game.objectState(plateId)?.defenseCounterTotal).toBe(-1);

    const a1 = paragonPlate.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("attack-reaction");
    expect(a1.effect).toMatchObject({ type: "gain-resources", amount: 1 });
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
    });
  });
});
