/**
 * PEN138 Graven Vestment — Assassin Chest d2 Blade Break.
 *
 * Printed:
 *   While this is in your graveyard, at the start of your turn, you may
 *   destroy 2 Silver you control. If you do, equip this.
 *   When this is equipped from anywhere other than your graveyard, put a
 *   -1{d} counter on it.
 *   Blade Break
 *
 * Reasoning (case-by-case; chest twin of PEN137 graven-cowl):
 * 1. a1 is GY-functional (functionalZones: graveyard) + in-your-graveyard;
 *    optional destroy 2 name:Silver then equip self from GY.
 * 2. Prior model used subtypes:["Silver"] (never matches) and lacked
 *    functionalZones — remodeled to cowl pattern.
 * 3. a2 equip from non-GY puts −1{d}; equip from GY does not.
 * 4. Blade Break d2 lifecycle.
 *
 * Status: ✅ GY start destroy 2 Silver → equip; name Silver; BB d2.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { gravenVestment } from "../../../../../../cards/src/cards/equipment/graven-vestment.ts";
import { silver } from "../../../../../../cards/src/cards/tokens/silver.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      // Accept optional GY equip path.
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
      const need = Math.max(decision.min ?? 1, 0);
      const picks = decision.candidates.slice(0, need).map((c) => c.instanceId);
      if (picks.length < need && (decision.min ?? 1) > 0) break;
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
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
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

function chestDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.chest.find(
    (id) => state.objects[id]?.canonicalId === gravenVestment.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("graven-vestment (PEN138)", () => {
  it("core mechanic: start of turn in GY + destroy 2 Silver → equip from GY (no −1{d})", () => {
    const s1 = fabToken("silver");
    const s2 = {
      ...fabToken("silver"),
      canonicalId: silver.canonicalId,
    };
    const game = FabTestEngine.start(
      { hero: bravo, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        graveyard: [gravenVestment],
        arena: [s1, s2],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    expect(Dash.zone("graveyard")).toContain(gravenVestment.canonicalId);
    expect(Dash.zone("chest")).not.toContain(gravenVestment.canonicalId);

    // Bravo ends turn → Dash start-phase should offer GY equip optional.
    game.as(bravo).endTurn();
    drain(game);

    expect(Dash.zone("chest")).toContain(gravenVestment.canonicalId);
    expect(Dash.zone("graveyard")).not.toContain(gravenVestment.canonicalId);
    // Equipped from GY → a2 excludeFrom graveyard → no −1{d} (still base d2).
    expect(chestDefense(game, Dash.id)).toBe(2);
    // Silvers destroyed.
    expect(
      Dash.zone("arena").filter((id) => /silver/i.test(id) || id === silver.canonicalId),
    ).toHaveLength(0);
  });

  it("boundaries: 1 Silver stuck; bladeBreak; model name Silver + GY functionalZones", () => {
    // Without 2 Silvers, start-of-turn equip does not happen.
    const stuck = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      {
        hero: dash,
        graveyard: [gravenVestment],
        arena: [fabToken("silver")],
        deck: 4,
      },
      { autoPassPriority: false },
    );
    stuck.as(bravo).endTurn();
    drain(stuck);
    expect(stuck.as(dash).zone("graveyard")).toContain(gravenVestment.canonicalId);
    expect(stuck.as(dash).zone("chest")).not.toContain(gravenVestment.canonicalId);

    // Blade Break: defend d2 → destroy.
    const bb = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        chest: [gravenVestment],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    bb.as(bravo).attackWith(snatchRed);
    bb.as(dash).defendWith(gravenVestment);
    bb.helpers.resolveRestOfCombat();
    expect(bb.as(dash).zone("chest")).not.toContain(gravenVestment.canonicalId);
    expect(bb.as(dash).zone("graveyard")).toContain(gravenVestment.canonicalId);

    const a1 = gravenVestment.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.functionalZones).toEqual(["graveyard"]);
      expect(a1.trigger).toMatchObject({
        kind: "event-and-state",
        state: { type: "has-status", status: "in-your-graveyard" },
      });
      expect(a1.trigger).toMatchObject({
        event: { name: "start-phase" },
      });
      expect(a1.resolution?.effect).toMatchObject({
        type: "optional",
        effect: {
          type: "destroy",
          target: {
            filter: { name: "Silver" },
            count: 2,
          },
        },
        then: { type: "equip", target: { selector: "self" } },
      });
    }

    const a2 = gravenVestment.base.abilities?.[1];
    expect(a2?.kind).toBe("static");
    if (a2?.kind === "static") {
      expect(a2.trigger).toMatchObject({
        event: { name: "equip", excludeFrom: ["graveyard"] },
      });
      expect(a2.resolution?.effect).toMatchObject({
        type: "add-counter",
        counter: { kind: "numeric", value: -1, property: "defense" },
        count: 1,
      });
    }
    expect(gravenVestment.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(gravenVestment.base.numeric.defense).toBe(2);
  });
});
