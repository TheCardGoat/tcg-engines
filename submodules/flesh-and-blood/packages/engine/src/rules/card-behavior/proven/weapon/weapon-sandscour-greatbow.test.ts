import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, nimblismBlue, searingShot } from "../../../fixtures.ts";
import { sandscourGreatbow } from "../../../../../../cards/src/cards/weapons/sandscour-greatbow.ts";
import { lexi } from "../../../../../../cards/src/cards/heroes/lexi.ts";

function resolve(game: ReturnType<typeof FabTestEngine.start>, accept: boolean): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (decision) throw new Error(`unexpected decision ${decision.kind}`);
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
  throw new Error("Sandscour did not resolve");
}

function deckArrowGame() {
  return FabTestEngine.start(
    {
      hero: lexi,
      weapon1: [sandscourGreatbow],
      hand: [],
      deck: [searingShot],
      resourcePoints: 1,
      actionPoints: 1,
    },
    { hero: bravo, hand: [], deck: 6 },
    { autoPassPriority: false },
  );
}

describe("sandscour-greatbow (DYN151) deck-origin arrow", () => {
  it("a1 deck-top load puts an aim counter on the face-up arrow", () => {
    const game = deckArrowGame();
    const Lexi = game.as(lexi);
    Lexi.activate(sandscourGreatbow);
    resolve(game, true);

    expect(Lexi.zone("arsenal")).toContain(searingShot.canonicalId);
    const arrowInstanceId = game
      .getState()
      .containers.zonesByPlayerId[Lexi.id]!.arsenal.find(
        (instanceId) =>
          game.getState().objects[instanceId]?.canonicalId === searingShot.canonicalId,
      );
    expect(arrowInstanceId).toBeDefined();
    expect(game.getState().objects[arrowInstanceId!]?.counters).toContainEqual({
      kind: "named",
      name: "aim",
      count: 1,
    });
    expect(Lexi.actionPoints()).toBe(1);
  });

  it("a1 cannot activate without the resource", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [sandscourGreatbow],
        hand: [],
        deck: [searingShot],
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => game.as(lexi).activate(sandscourGreatbow)).toThrow();
  });

  it("a2 boundary: a hand-origin arrow is face-up but receives no aim counter", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [sandscourGreatbow],
        hand: [searingShot],
        deck: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: bravo, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Lexi = game.as(lexi);
    Lexi.activate(sandscourGreatbow);
    resolve(game, true);
    const arrowInstanceId = game
      .getState()
      .containers.zonesByPlayerId[Lexi.id]!.arsenal.find(
        (instanceId) =>
          game.getState().objects[instanceId]?.canonicalId === searingShot.canonicalId,
      );
    expect(arrowInstanceId).toBeDefined();
    expect(game.getState().objects[arrowInstanceId!]?.counters).not.toContainEqual({
      kind: "named",
      name: "aim",
      count: 1,
    });
  });
});
