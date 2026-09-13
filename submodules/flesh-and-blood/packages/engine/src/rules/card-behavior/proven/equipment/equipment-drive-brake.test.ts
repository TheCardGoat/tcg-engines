import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed, throttleRed } from "../../../fixtures.ts";
import { driveBrake } from "../../../../../../cards/src/cards/equipment/drive-brake.ts";
import { hyperDriverRed } from "../../../../../../cards/src/cards/actions/hyper-driver.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 96; safety += 1) {
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
    const actorId = game.getState().priority?.holderPlayerId;
    if (!actorId) return;
    try {
      game.exec({ move: "pass", actorId, payload: {} });
    } catch {
      return;
    }
  }
}

function defenseCounter(game: ReturnType<typeof FabTestEngine.start>, playerId: string): number {
  const id = game
    .getState()
    .containers.zonesByPlayerId[playerId]!.arms.find(
      (objectId) => game.getState().objects[objectId]?.canonicalId === driveBrake.canonicalId,
    );
  return id ? (game.objectState(id)?.defenseCounterTotal ?? 0) : 0;
}

function passUntil(game: ReturnType<typeof FabTestEngine.start>, playerId: string): void {
  for (
    let safety = 0;
    safety < 16 && game.getState().priority?.holderPlayerId !== playerId;
    safety += 1
  ) {
    const actorId = game.getState().priority?.holderPlayerId;
    if (!actorId) return;
    game.exec({ move: "pass", actorId, payload: {} });
  }
}

describe("drive-brake (AMX006)", () => {
  it("AAA: Battleworn −1{d} is removed when a boosted Hyper Driver is banished", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        arms: [driveBrake],
        hand: [throttleRed, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: [snatchRed, snatchRed, hyperDriverRed],
        actionPoints: 1,
        resourcePoints: 6,
      },
      { autoPassPriority: false, autoPitch: true, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(snatchRed);
    Dash.defend(driveBrake);
    drain(game);
    game.helpers.resolveRestOfCombat();
    expect(defenseCounter(game, Dash.id)).toBe(-1);

    Bravo.endTurn();
    passUntil(game, Dash.id);
    Dash.play(throttleRed, { boost: true });
    drain(game);
    expect(Dash.zone("banished")).toContain(hyperDriverRed.canonicalId);
    expect(defenseCounter(game, Dash.id)).toBe(0);
  });

  it("boundary: boosting a non-Hyper Driver does not remove the counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        arms: [driveBrake],
        hand: [throttleRed, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
        resourcePoints: 6,
      },
      { autoPassPriority: false, autoPitch: true, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(snatchRed);
    Dash.defend(driveBrake);
    drain(game);
    game.helpers.resolveRestOfCombat();
    expect(defenseCounter(game, Dash.id)).toBe(-1);
    Bravo.endTurn();
    passUntil(game, Dash.id);
    Dash.play(throttleRed, { boost: true });
    drain(game);
    expect(defenseCounter(game, Dash.id)).toBe(-1);
  });
});
