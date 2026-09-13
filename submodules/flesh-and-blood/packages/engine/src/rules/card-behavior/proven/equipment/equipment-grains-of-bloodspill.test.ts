/**
 * HVY097 Grains of Bloodspill — Warrior Chest d2 Temper.
 *
 * Printed:
 *   Whenever a weapon attack you control hits, you may pay {r}. If you do,
 *   create a Vigor token.
 *   Temper
 *
 * Reasoning (case-by-case):
 * 1. Prior model filtered hit with subtypes:["Weapon"]. Weapon is FAB_TYPES,
 *    not FAB_SUBTYPES — isKnownVocabulary("subtype","Weapon") is false so the
 *    trigger never fired. Remodelled to types:["Weapon"].
 * 2. Optional pay {r} is the "you may"; create Vigor is "if you do".
 * 3. AAC hits (Snatch) are not weapon attacks — no optional / no Vigor.
 * 4. Decline keeps RP after weapon cost and creates no token.
 * 5. Temper d2: first defend contributes 2 then −1{d} (survives at d1).
 *
 * Status: ✅ weapon hit optional pay → Vigor; decline; non-weapon; Temper; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { grainsOfBloodspill } from "../../../../../../cards/src/cards/equipment/grains-of-bloodspill.ts";
import { quicksilverDagger } from "../../../../../../cards/src/cards/weapons/quicksilver-dagger.ts";

const SNATCH = 4;
const LIFE = 20;

/** Resolve combat + stack, answering the first boolean with `accept`. */
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

function hasVigorToken(game: ReturnType<typeof FabTestEngine.start>, playerId: string): boolean {
  const state = game.getState();
  const arena = state.containers.zonesByPlayerId[playerId]?.arena ?? [];
  return arena.some((id) => {
    const obj = state.objects[id];
    if (!obj) return /vigor/i.test(String(id));
    return /vigor/i.test(obj.canonicalId) || /vigor/i.test(String(id));
  });
}

describe("grains-of-bloodspill (HVY097)", () => {
  it("proven: Temper d2 — defend contributes 2 then −1{d}, remains seated", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [grainsOfBloodspill],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(grainsOfBloodspill);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 − d2 = 2 damage; Temper −1 leaves d1 so equipment stays.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("chest")).toContain(grainsOfBloodspill.canonicalId);
  });

  it("core mechanic: weapon hit → pay {r} → create Vigor token", () => {
    // Dagger attack costs 1; optional pay costs 1 → start with 2 RP.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [grainsOfBloodspill],
        weapon1: [quicksilverDagger],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.resourcePoints()).toBe(2);

    Bravo.activate(quicksilverDagger);
    resolveWithOptional(game, true);

    expect(hasVigorToken(game, Bravo.id)).toBe(true);
    // Spent 1 to attack + 1 optional pay → 0.
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("chest")).toContain(grainsOfBloodspill.canonicalId);
    expect(game.as(dash).life()).toBeLessThan(40);
  });

  it("boundaries: decline optional — no Vigor, keep leftover RP after weapon cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [grainsOfBloodspill],
        weapon1: [quicksilverDagger],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(quicksilverDagger);
    resolveWithOptional(game, false);

    expect(hasVigorToken(game, Bravo.id)).toBe(false);
    // Attack spent 1; declined optional pay → 1 left.
    expect(Bravo.resourcePoints()).toBe(1);
  });

  it("boundaries: non-weapon (AAC) hit does not create Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [grainsOfBloodspill],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    resolveWithOptional(game, null);

    expect(hasVigorToken(game, Bravo.id)).toBe(false);
    // Snatch is free (cost 0); unused RP remain.
    expect(Bravo.resourcePoints()).toBe(2);
  });

  it("model guard: hit filter uses types Weapon (not subtypes)", () => {
    const a1 = grainsOfBloodspill.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.trigger).toMatchObject({
      event: {
        name: "hit",
        actor: "controller",
        filter: { typeBox: { types: ["Weapon"] } },
      },
    });
    expect(a1.effect).toMatchObject({
      type: "optional",
      effect: {
        type: "pay",
        cost: { class: "asset", type: "resources", amount: 1 },
      },
      then: {
        type: "create-token",
        token: "vigor",
        controller: "controller",
      },
    });
  });
});
