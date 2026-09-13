import { describe, expect, it } from "vite-plus/test";
import type { EngineInteractionView, InteractionAction } from "@tcg/protocol";
import { interactionViewHasSourceCard, interactionViewSourceCardIds } from "./interactionView.ts";

describe("interaction view selectors", () => {
  it("collects enabled source card candidates from protocol actions", () => {
    const view = viewWithActions([
      action("deployUnit", ["unit-a", "unit-b"]),
      action("passTurn", []),
    ]);

    expect([...interactionViewSourceCardIds(view)].sort()).toEqual(["unit-a", "unit-b"]);
    expect(interactionViewHasSourceCard(view, "unit-a")).toBe(true);
    expect(interactionViewHasSourceCard(view, "missing")).toBe(false);
  });

  it("ignores disabled actions and non-source inputs", () => {
    const view = viewWithActions([
      action("deployUnit", ["unit-a"], false),
      {
        ...action("enterBattle", []),
        inputs: [
          {
            kind: "entity-selection",
            id: "target",
            text: { key: "gundam.input.target" },
            required: true,
            role: "target",
            entityKinds: ["card"],
            min: 1,
            max: 1,
            ordered: false,
            candidates: [{ entity: { kind: "card", instanceId: "target-a" }, enabled: true }],
          },
        ],
      },
    ]);

    expect([...interactionViewSourceCardIds(view)]).toEqual([]);
  });
});

function viewWithActions(actions: InteractionAction[]): EngineInteractionView {
  return {
    protocolVersion: 2,
    gameSlug: "gundam",
    actorId: "p1",
    stateVersion: 1,
    status: "ready",
    actions,
  };
}

function action(id: string, cardIds: string[], enabled = true): InteractionAction {
  return {
    id,
    requestId: `gundam:1:${id}`,
    intent: "play-card",
    text: { key: `gundam.move.${id}` },
    enabled,
    inputs: [
      {
        kind: "entity-selection",
        id: "cardId",
        text: { key: "gundam.input.cardId" },
        required: true,
        role: "source",
        entityKinds: ["card"],
        min: 1,
        max: 1,
        ordered: false,
        candidates: cardIds.map((instanceId) => ({
          entity: { kind: "card", instanceId },
          enabled: true,
        })),
      },
    ],
  };
}
