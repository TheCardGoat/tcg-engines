/**
 * EVR020 Earthlore Bounty — Guardian Chest d2 Temper.
 *
 * Printed:
 *   Whenever you draw 1 or more cards from an action card effect, create that
 *   many Seismic Surge tokens.
 *   Temper
 *
 * Reasoning (case-by-case):
 * 1. "from an action card effect" is not a property of the drawn card — it is
 *    a property of the layer that proposed the draw. Prior filter path matched
 *    the drawn card and never fired. Wired trigger-matcher: draw + hasStatus
 *    from-action-card-effect → event.source types includes Action.
 * 2. Multi-draw batch (Tome of Fyendal Draw 2) creates that many Surges via
 *    event-amount batch sum (Valda family).
 * 3. End-phase draw-to-intellect must not create Surges (not Action effect).
 * 4. Temper d2 lifecycle is production-testable.
 *
 * Status: ✅ temper + action-effect draw → Seismic Surge; end-phase negative.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { earthloreBounty } from "../../../../../../cards/src/cards/equipment/earthlore-bounty.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

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
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
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
    (id) => state.objects[id]?.canonicalId === earthloreBounty.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

function seismicSurgeCount(
  player: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
): number {
  return player.zone("arena").filter((id) => id === "token:seismic-surge").length;
}

describe("earthlore-bounty (EVR020)", () => {
  it("proven: temper d2 — first defend d2→d1 stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [earthloreBounty],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);
    expect(chestDefense(game, Defender.id)).toBe(2);

    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(earthloreBounty);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("chest")).toContain(earthloreBounty.canonicalId);
    expect(chestDefense(game, Defender.id)).toBe(1);
  });

  it("core mechanic: draw 2 from Action card effect → create 2 Seismic Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [earthloreBounty],
        hand: [tomeOfFyendalYellow, snatchRed],
        actionPoints: 1,
        deck: 8,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(seismicSurgeCount(Bravo)).toBe(0);

    Bravo.play(tomeOfFyendalYellow, { pitch: [snatchRed] });
    drain(game);

    expect(seismicSurgeCount(Bravo)).toBe(2);
  });

  it("boundaries: end-phase draw-to-intellect does not create Seismic Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [earthloreBounty],
        hand: [],
        // Force end-turn draw-up without Action effects.
        deck: 8,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    drain(game);

    expect(seismicSurgeCount(Bravo)).toBe(0);
  });

  it("model guard: draw from-action-card-effect → Seismic Surge event-amount", () => {
    const a1 = earthloreBounty.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.trigger).toMatchObject({
      event: {
        name: "draw",
        actor: "controller",
        filter: { hasStatus: "from-action-card-effect" },
      },
    });
    expect(a1.effect).toMatchObject({
      type: "create-token",
      token: "seismic-surge",
      count: { type: "event-amount" },
    });
  });
});
