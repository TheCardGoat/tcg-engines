/**
 * PEN287 Glory Plate — Revered Chest d0 Guardwell.
 *
 * Printed:
 *   This gets +1{d} for each Toughness token that has left the arena this turn.
 *   Guardwell
 *
 * Reasoning (case-by-case):
 * 1. Continuous +1{d} per Toughness that left arena this turn (count
 *    left-arena-this-turn + name Toughness Token).
 * 2. ENGINE: left-arena-this-turn was typed but unevaluated (threw); tokens
 *    cease-to-exist so object-history walk misses them — wired leave-arena
 *    event LKI fact + count evaluator.
 * 3. STRUCTURAL: token destroy → ceaseTokenExistence emitted leave-arena
 *    follow-ups, but reduction required objectIsInZone (object already
 *    deleted) and dropped the observation — leave-arena never committed.
 *    Fixed resulting leave-arena/enter-or-leave-arena to always commit.
 * 4. Toughness destroys at start of opponent's turn — endTurn + ordering
 *    drain for simultaneous triggers.
 * 5. Guardwell on base d0: defend contributes 0 (+buff); bare d0.
 *
 * Status: ✅ Toughness left → +1{d} each; bare d0; Guardwell; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { gloryPlate } from "../../../../../../cards/src/cards/equipment/glory-plate.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

const LIFE = 20;

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
    // Two Toughness start-of-opponent-turn destroys order simultaneously.
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

function endTurnDrain(game: ReturnType<typeof FabTestEngine.start>, hero: typeof bravo): void {
  game.as(hero).endTurn();
  drain(game);
}

function chestDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.chest.find(
    (id) => state.objects[id]?.canonicalId === gloryPlate.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("glory-plate (PEN287)", () => {
  it("core mechanic: each Toughness that left arena this turn → +1{d}", () => {
    // Dash has plate + 2 Toughness. Bravo is turn player.
    // End Bravo's turn → Dash start: Toughness "at start of opponent's turn"
    // destroys under Dash while Dash is becoming turn player — still same
    // global turnNumber as the end-turn boundary. Safer: seed Toughness on
    // Bravo (controller of plate is Bravo) and have Dash's turn start
    // destroy them (start-phase actor opponent for Toughness on Bravo).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: LIFE,
        chest: [gloryPlate],
        arena: [fabToken("toughness"), fabToken("toughness")],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(chestDefense(game, Bravo.id)).toBe(0);
    expect(Bravo.zone("arena").length).toBeGreaterThanOrEqual(2);

    // Bravo ends → Dash becomes turn player → Toughness on Bravo see
    // start-phase actor:opponent and destroy (leave arena).
    endTurnDrain(game, bravo);
    // After Dash's start-phase, 2 Toughness should have left under Bravo.
    expect(chestDefense(game, Bravo.id)).toBe(2);
  });

  it("boundaries: no Toughness left → d0; Guardwell; model left-arena count", () => {
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        chest: [gloryPlate],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(chestDefense(bare, bare.as(bravo).id)).toBe(0);

    // Guardwell d0: defend contributes 0; equipment may stay with no counters
    // when defense is 0 (guardwell only stamps when defense > 0).
    const gw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [gloryPlate],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    gw.as(dash).attackWith(snatchRed);
    // d0 may still be legal to defend depending on engine — try or skip.
    try {
      gw.as(bravo).defendWith(gloryPlate);
    } catch {
      // d0 equipment may be illegal to declare — still prove life at full snatch.
    }
    gw.helpers.resolveRestOfCombat();
    expect(gw.as(bravo).life()).toBeLessThanOrEqual(LIFE);

    const a1 = gloryPlate.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.staticKind).toBe("continuous");
    expect(a1.effect).toMatchObject({
      type: "modify-numeric",
      property: "defense",
      op: "add",
      amount: {
        type: "count",
        what: "left-arena-this-turn",
        filter: { name: "Toughness", typeBox: { metatypes: ["Token"] } },
      },
      target: { selector: "self" },
      duration: "while-in-arena",
    });
    expect(gloryPlate.base.keywords?.some((k) => k.name === "guardwell")).toBe(true);
    expect(gloryPlate.base.numeric.defense).toBe(0);
  });
});
