import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";
import { touchOfReality } from "../../../../../../cards/src/cards/equipment/touch-of-reality.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 32; safety += 1) {
    if (game.getState().decision || game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

function ward(
  game: ReturnType<typeof FabTestEngine.start>,
  instanceId: string,
): number | undefined {
  const state = game.getState();
  const object = state.objects[instanceId];
  if (!object) return undefined;
  const keyword = buildFabRulesView(state)
    .object({ instanceId, incarnation: object.incarnation })
    ?.current.keywords.find((candidate) => candidate.name === "ward");
  return keyword && "value" in keyword && typeof keyword.value === "number"
    ? keyword.value
    : undefined;
}

describe("touch-of-reality (PEN122)", () => {
  it("chooses and pays X before resolution, gains Ward X, then destroys itself at end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, arms: [touchOfReality], resourcePoints: 2, hand: [], deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const touchId = Dash.findCardInZone("arms", touchOfReality);

    game.exec({ move: "activate", actorId: Dash.id, payload: { instanceId: touchId } });
    const decision = game.getState().decision;
    expect(decision).toMatchObject({ kind: "numeric", min: 0, max: 2 });
    if (decision?.kind !== "numeric") throw new Error("Touch of Reality must declare X.");
    game.exec({
      move: "answer-decision",
      actorId: Dash.id,
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "numeric", value: 2 },
      },
    });
    drain(game);

    expect(game.getState().players[Dash.id]?.resourcePoints).toBe(0);
    expect(
      game.getState().objects[touchId]?.markers.some((marker) => marker.kind === "tapped"),
    ).toBe(true);
    expect(ward(game, touchId)).toBe(2);

    Dash.endTurn();
    drain(game);
    expect(Dash.zone("arms")).not.toContain(touchOfReality.canonicalId);
    expect(Dash.zone("graveyard")).toContain(touchOfReality.canonicalId);
  });

  it("does not let a player choose more X than their available resources", () => {
    const game = FabTestEngine.start(
      { hero: dash, arms: [touchOfReality], hand: [], deck: 0, resourcePoints: 0 },
      { hero: bravo, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const touchId = Dash.findCardInZone("arms", touchOfReality);

    game.exec({ move: "activate", actorId: Dash.id, payload: { instanceId: touchId } });
    const decision = game.getState().decision;
    expect(decision).toMatchObject({ kind: "numeric", min: 0, max: 0 });
    if (decision?.kind !== "numeric") throw new Error("Touch of Reality must declare X.");
    expect(() =>
      game.exec({
        move: "answer-decision",
        actorId: Dash.id,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "numeric", value: 1 },
        },
      }),
    ).toThrow("within the legal range");
    expect(
      game.getState().objects[touchId]?.markers.some((marker) => marker.kind === "tapped"),
    ).toBe(false);
  });
});
