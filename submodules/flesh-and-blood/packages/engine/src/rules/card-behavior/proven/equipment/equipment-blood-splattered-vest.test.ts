/**
 * HNT168 Blood Splattered Vest — Assassin/Ninja Chest d1 Blade Break.
 *
 * Printed:
 *   Whenever a dagger you control hits, you may gain {r} and put a stain
 *   counter on this. Then if there are 3 or more stain counters on this,
 *   destroy it.
 *   Blade Break
 *
 * Reasoning (case-by-case):
 * 1. Prior model bound stain + destroy to the hitting dagger (`it`). Printed
 *    "on this" / "destroy it" is the vest — remodelled to selector:self.
 * 2. Optional gain {r} + stain; decline keeps 0 stain and no RP.
 * 3. Non-dagger hit (AAC Snatch) does not fire.
 * 4. Third stain destroys the vest (seed 2, accept once).
 * 5. Blade Break d1 lifecycle.
 *
 * Status: ✅ dagger hit optional stain+{r}; decline; non-dagger; 3-stain destroy; BB.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { bloodSplatteredVest } from "../../../../../../cards/src/cards/equipment/blood-splattered-vest.ts";
import { quicksilverDagger } from "../../../../../../cards/src/cards/weapons/quicksilver-dagger.ts";

const SNATCH = 4;
const LIFE = 20;

/** Resolve combat + stack, answering the first boolean with `accept` (robe pattern). */
function resolveWithOptional(
  game: ReturnType<typeof FabTestEngine.start>,
  accept: boolean | null,
): void {
  let answered = accept === null;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean" && !answered && accept !== null) {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      answered = true;
      continue;
    }
    if (decision?.kind === "boolean" && answered) {
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
    if (decision) {
      throw new Error(`unexpected decision kind: ${decision.kind}`);
    }
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

function vestInstanceId(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): string | undefined {
  const state = game.getState();
  return state.containers.zonesByPlayerId[playerId]?.chest.find(
    (id) => state.objects[id]?.canonicalId === bloodSplatteredVest.canonicalId,
  );
}

function stainCount(game: ReturnType<typeof FabTestEngine.start>, instanceId: string): number {
  const obj = game.getState().objects[instanceId];
  if (!obj) return 0;
  return obj.counters
    .filter((c) => c.kind === "named" && c.name === "stain")
    .reduce((sum, c) => sum + c.count, 0);
}

describe("blood-splattered-vest (HNT168)", () => {
  it("proven: bladeBreak d1 — defend contributes 1 then destroy to GY", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [{ card: bloodSplatteredVest, state: { namedCounters: { stain: 2 } } }],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(bloodSplatteredVest);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
    expect(Defender.zone("chest")).not.toContain(bloodSplatteredVest.canonicalId);
    expect(Defender.zone("graveyard")).toContain(bloodSplatteredVest.canonicalId);
  });

  it("core mechanic: dagger hit → optional accept → +1{r} and stain on vest", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodSplatteredVest],
        weapon1: [quicksilverDagger],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.resourcePoints()).toBe(1);

    Bravo.activate(quicksilverDagger);
    resolveWithOptional(game, true);

    const vestId = vestInstanceId(game, Bravo.id);
    expect(vestId).toBeDefined();
    expect(stainCount(game, vestId!)).toBe(1);
    // Spent 1 RP for attack, gained 1 from optional.
    expect(Bravo.resourcePoints()).toBe(1);
    expect(Bravo.zone("chest")).toContain(bloodSplatteredVest.canonicalId);
  });

  it("boundaries: decline optional — no stain, no gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodSplatteredVest],
        weapon1: [quicksilverDagger],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(quicksilverDagger);
    resolveWithOptional(game, false);

    const vestId = vestInstanceId(game, Bravo.id);
    expect(vestId).toBeDefined();
    expect(stainCount(game, vestId!)).toBe(0);
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("boundaries: non-dagger hit does not offer stain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodSplatteredVest],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    resolveWithOptional(game, null);

    const vestId = vestInstanceId(game, Bravo.id);
    expect(vestId).toBeDefined();
    expect(stainCount(game, vestId!)).toBe(0);
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("core interaction: third stain destroys the vest", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [{ card: bloodSplatteredVest, state: { namedCounters: { stain: 2 } } }],
        weapon1: [quicksilverDagger],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const vestId = vestInstanceId(game, Bravo.id)!;
    // Establish the bounded counter state through the public fixture driver so
    // the next accepted dagger hit reaches the printed destruction threshold.
    game.setCounters(vestId, { namedCounters: { stain: 2 } });
    expect(stainCount(game, vestId)).toBe(2);

    Bravo.activate(quicksilverDagger);
    resolveWithOptional(game, true);

    expect(Bravo.zone("chest")).not.toContain(bloodSplatteredVest.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bloodSplatteredVest.canonicalId);
  });

  it("model guard: dagger hit optional gain+stain on self; 3-stain destroy self", () => {
    const a1 = bloodSplatteredVest.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.trigger).toMatchObject({
      event: { name: "hit", actor: "controller", filter: { typeBox: { subtypes: ["Dagger"] } } },
    });
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        {
          type: "optional",
          effect: {
            type: "sequence",
            steps: [
              { type: "gain-resources", amount: 1 },
              {
                type: "add-counter",
                counter: { kind: "named", name: "stain" },
                count: 1,
                target: { selector: "self" },
              },
            ],
          },
        },
        {
          type: "conditional",
          condition: {
            type: "has-counter",
            counter: { kind: "named", name: "stain" },
            target: { selector: "self" },
            comparison: { op: "gte", value: 3 },
          },
          then: {
            type: "destroy",
            target: { selector: "self" },
          },
        },
      ],
    });
  });
});
