/**
 * DTD223 Frontline Plating (Chest d2), DTD224 Frontline Gauntlets (Arms d2),
 * DTD225 Frontline Legs (Legs d2) — siblings of proven DTD222 Frontline Helm.
 *
 * Printed: "At the beginning of your end phase, put a -1{d} counter on this.
 *  Blade Break"
 *
 * Card model fix: added `actor: "controller"` to end-phase trigger (bare
 * end-phase matches every seat, not just the controller's).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";
import { frontlinePlating } from "../../../../../../cards/src/cards/equipment/frontline-plating.ts";
import { frontlineGauntlets } from "../../../../../../cards/src/cards/equipment/frontline-gauntlets.ts";
import { frontlineLegs } from "../../../../../../cards/src/cards/equipment/frontline-legs.ts";

function zoneDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
  zone: "chest" | "arms" | "legs",
  canonicalId: string,
): number | undefined {
  const state = game.getState();
  const player = state.players[playerId];
  if (!player) return undefined;
  const instanceId = state.containers.zonesByPlayerId[playerId]![zone].find(
    (id) => state.objects[id]?.canonicalId === canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 40; safety += 1) {
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
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering" as const,
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

describe("frontline-plating (DTD223)", () => {
  it("core mechanic: your end phase → -1{d} counter (d2 → d1)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [frontlinePlating], hand: [], deck: 6, actionPoints: 1 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(zoneDefense(game, Bravo.id, "chest", frontlinePlating.canonicalId)).toBe(2);
    Bravo.endTurn();
    drain(game);
    expect(zoneDefense(game, Bravo.id, "chest", frontlinePlating.canonicalId)).toBe(1);
  });
});

describe("frontline-gauntlets (DTD224)", () => {
  it("core mechanic: your end phase → -1{d} counter (d2 → d1)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [frontlineGauntlets], hand: [], deck: 6, actionPoints: 1 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(zoneDefense(game, Bravo.id, "arms", frontlineGauntlets.canonicalId)).toBe(2);
    Bravo.endTurn();
    drain(game);
    expect(zoneDefense(game, Bravo.id, "arms", frontlineGauntlets.canonicalId)).toBe(1);
  });
});

describe("frontline-legs (DTD225)", () => {
  it("core mechanic: your end phase → -1{d} counter (d2 → d1)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [frontlineLegs], hand: [], deck: 6, actionPoints: 1 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(zoneDefense(game, Bravo.id, "legs", frontlineLegs.canonicalId)).toBe(2);
    Bravo.endTurn();
    drain(game);
    expect(zoneDefense(game, Bravo.id, "legs", frontlineLegs.canonicalId)).toBe(1);
  });

  it("boundaries: opponent end phase does not put a counter", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, actionPoints: 1 },
      { hero: bravo, legs: [frontlineLegs], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expect(zoneDefense(game, Bravo.id, "legs", frontlineLegs.canonicalId)).toBe(2);
    // Dash (opponent) ends turn — should NOT trigger bravo's frontline.
    Dash.endTurn();
    drain(game);
    expect(zoneDefense(game, Bravo.id, "legs", frontlineLegs.canonicalId)).toBe(2);
  });
});
