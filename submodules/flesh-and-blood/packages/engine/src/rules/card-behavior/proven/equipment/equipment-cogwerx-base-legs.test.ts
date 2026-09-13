import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, throttleRed } from "../../../fixtures.ts";
import { cogwerxBaseLegs } from "../../../../../../cards/src/cards/equipment/cogwerx-base-legs.ts";

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
          answer: { kind: "boolean", value: true },
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
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const actorId = game.getPriorityPlayerId();
    if (!actorId) return;
    try {
      game.exec({ move: "pass", actorId, payload: {} });
    } catch {
      return;
    }
  }
}

function steam(game: ReturnType<typeof FabTestEngine.start>, playerId: string): number {
  const id = game
    .getState()
    .containers.zonesByPlayerId[playerId]!.legs.find(
      (objectId) => game.getState().objects[objectId]?.canonicalId === cogwerxBaseLegs.canonicalId,
    );
  return (
    game
      .getState()
      .objects[id ?? ""]?.counters.filter(
        (counter) => counter.kind === "named" && counter.name === "steam",
      )
      .reduce((sum, counter) => sum + ("count" in counter ? counter.count : 0), 0) ?? 0
  );
}

describe("cogwerx-base-legs (EVO017)", () => {
  it("AAA: equips with steam, then boosted-turn Instant gains 1 action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [cogwerxBaseLegs],
        hand: [throttleRed],
        deck: [throttleRed, throttleRed],
        resourcePoints: 3,
        actionPoints: 1,
      },
      { hero: bravo, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    drain(game);
    expect(steam(game, Dash.id)).toBe(1);
    Dash.play(throttleRed, { boost: true });
    drain(game);
    // Throttle has go again, so the boost leaves the original action point available.
    expect(Dash.actionPoints()).toBe(1);
    Dash.activate(cogwerxBaseLegs);
    drain(game);
    expect(steam(game, Dash.id)).toBe(0);
    expect(Dash.actionPoints()).toBe(2);
  });

  it("boundary: without boost, the Instant cannot spend steam for AP", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [cogwerxBaseLegs], resourcePoints: 1, actionPoints: 1, deck: 3 },
      { hero: bravo, deck: 3 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    drain(game);
    expect(steam(game, Dash.id)).toBe(1);
    expect(() => Dash.activate(cogwerxBaseLegs)).toThrow();
    expect(steam(game, Dash.id)).toBe(1);
  });
});
