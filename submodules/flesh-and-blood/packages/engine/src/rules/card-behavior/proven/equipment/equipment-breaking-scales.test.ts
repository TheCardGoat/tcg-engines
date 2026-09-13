/**
 * KSU007 Breaking Scales — Ninja Arms d1 Battleworn.
 *
 * Printed:
 *   Attack Reaction - Destroy Breaking Scales: Target attack action card with
 *   combo gains +1{p}.
 *   Battleworn
 *
 * Reasoning (hand-authored; case-by-case; AR twin of Fisticuffs):
 * 1. AR destroy-self only; open reaction window after defend pass.
 * 2. Target must be AAC with combo — Rising Knee Thrust (p1) +1 → p2 damage.
 * 3. Snatch (no combo) is not a legal target / cannot buff via this filter.
 * 4. Out of AR step illegal; battleworn d1 defend → d0 (stays equipped).
 *
 * Status: ✅ AR destroy → combo AAC +1{p}; non-combo no fire; BW d1; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { breakingScales } from "../../../../../../cards/src/cards/equipment/breaking-scales.ts";
import { risingKneeThrustBlue } from "../../../../../../cards/src/cards/actions/rising-knee-thrust.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const LIFE = 40;
const KNEE = 1;
const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 80; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const attack = decision.candidates.find(
        (c) =>
          game.getState().objects[c.instanceId]?.canonicalId === risingKneeThrustBlue.canonicalId ||
          game.getState().objects[c.instanceId]?.canonicalId === snatchRed.canonicalId,
      );
      const pick = attack ?? decision.candidates[0];
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

function finishCombat(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 80; safety += 1) {
    drain(game);
    if (!game.combat() && game.getState().rulesStack.length === 0 && !game.getState().decision) {
      return;
    }
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio && !game.getState().decision) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    if (!game.getState().decision && !prio) return;
  }
}

function armsDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.arms.find(
    (id) => state.objects[id]?.canonicalId === breakingScales.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("breaking-scales (KSU007)", () => {
  it("core mechanic: AR destroy → combo AAC +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [breakingScales],
        hand: [risingKneeThrustBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.attackWith(risingKneeThrustBlue);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    Bravo.activate(breakingScales);
    finishCombat(game);

    expect(Bravo.zone("graveyard")).toContain(breakingScales.canonicalId);
    expect(Bravo.zone("arms")).not.toContain(breakingScales.canonicalId);
    // Rising Knee base 1 +1 = 2 damage.
    expect(Opponent.life()).toBe(LIFE - (KNEE + 1));
  });

  it("boundaries: non-combo AAC not buffed; out of AR illegal; BW d1; model", () => {
    // Snatch has no combo — AR may still activate but filter should not
    // produce a legal target (activation throws or no power gain).
    const noCombo = FabTestEngine.start(
      {
        hero: bravo,
        arms: [breakingScales],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const A = noCombo.as(bravo);
    const B = noCombo.as(dash);
    A.attackWith(snatchRed);
    B.defendWith([]);
    A.pass();
    B.pass();
    expect(noCombo.combat()?.step).toBe("reaction");
    // No legal combo AAC target → activation rejected.
    expect(() => A.activate(breakingScales)).toThrow();
    expect(A.zone("arms")).toContain(breakingScales.canonicalId);
    finishCombat(noCombo);
    expect(B.life()).toBe(LIFE - SNATCH);

    // Out of reaction step illegal.
    const out = FabTestEngine.start(
      {
        hero: bravo,
        arms: [breakingScales],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => out.as(bravo).activate(breakingScales)).toThrow();

    // Battleworn: defend d1 → d0, stay equipped.
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        arms: [breakingScales],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Def = bw.as(bravo);
    expect(armsDefense(bw, Def.id)).toBe(1);
    bw.as(dash).attackWith(snatchRed);
    Def.defendWith(breakingScales);
    bw.helpers.resolveRestOfCombat();
    expect(Def.life()).toBe(LIFE - (SNATCH - 1));
    expect(Def.zone("arms")).toContain(breakingScales.canonicalId);
    expect(armsDefense(bw, Def.id)).toBe(0);

    const a1 = breakingScales.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("attack-reaction");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "power",
      amount: 1,
      target: {
        filter: {
          typeBox: {
            types: ["Action"],
            subtypes: ["Attack"],
          },
          hasKeyword: "combo",
        },
      },
      duration: "this-turn",
    });
    expect(breakingScales.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "battleworn" })]),
    );
  });
});
