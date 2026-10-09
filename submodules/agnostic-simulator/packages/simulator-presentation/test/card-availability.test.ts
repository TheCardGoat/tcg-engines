import { expect, test } from "vitest";
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type InteractionAction,
} from "@tcg/protocol";
import { availableInteractionCardIds } from "../src/card-selection";
function action(id: string, enabled = true): InteractionAction {
  return {
    id,
    requestId: id,
    intent: "activate",
    enabled,
    text: { key: id },
    source: { kind: "card", instanceId: id },
    inputs: [],
  };
}
function view(actions: InteractionAction[]): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "alpha-clash",
    actorId: "p1",
    stateVersion: 1,
    status: "ready",
    actions,
  };
}
test("available cards include enabled action sources, never disabled sources", () => {
  expect([
    ...availableInteractionCardIds(view([action("playable"), action("blocked", false)])),
  ]).toEqual(["playable"]);
});
test("source choices advertise only enabled candidates, not effect targets", () => {
  const choice = action("choice");
  delete choice.source;
  choice.inputs = [
    {
      kind: "entity-selection",
      id: "source",
      text: { key: "Source" },
      role: "source",
      required: true,
      entityKinds: ["card"],
      min: 1,
      max: 1,
      ordered: false,
      candidates: [
        { entity: { kind: "card", instanceId: "legal" }, enabled: true },
        { entity: { kind: "card", instanceId: "illegal" }, enabled: false },
      ],
    },
  ];
  expect([...availableInteractionCardIds(view([choice]))]).toEqual(["legal"]);
  const input = choice.inputs[0];
  if (input.kind !== "entity-selection") throw new Error("Expected a source selection");
  input.role = "target";
  expect(availableInteractionCardIds(view([choice])).size).toBe(0);
});
test("waiting, game over and failed projections do not advertise actions", () => {
  const state = view([action("card")]);
  for (const status of ["waiting", "game-over"] as const)
    expect(availableInteractionCardIds({ ...state, status }).size).toBe(0);
  expect(
    availableInteractionCardIds({
      ...state,
      projectionFailure: { code: "projection_failed", retryable: true },
    }).size,
  ).toBe(0);
});
