import type { EngineInteractionView, InteractionAction } from "@tcg/protocol";
import { describe, expect, test } from "vite-plus/test";

import { projectInteractionCardActions } from "./project-card-actions";

describe("projectInteractionCardActions", () => {
  test("preserves disabled actions and candidate-specific reasons take precedence", () => {
    const view = viewWithActions([
      action({
        enabled: false,
        disabledText: { key: "game.action.wrong-phase", params: { label: "Wrong phase." } },
        candidateEnabled: false,
        candidateDisabledText: {
          key: "game.card.insufficient-cost",
          params: { label: "Needs 4 — 2 available." },
        },
      }),
    ]);

    expect(
      projectInteractionCardActions(view, "card-1", {
        presentationFor: () => ({ order: 10 }),
      }),
    ).toEqual([
      expect.objectContaining({
        id: "playCard:card-1",
        commandRef: "playCard",
        availability: {
          kind: "disabled",
          reason: "Needs 4 — 2 available.",
          reasonCode: "game.card.insufficient-cost",
        },
      }),
    ]);
  });

  test("keeps enabled and disabled source candidates in stable action order", () => {
    const view = viewWithActions([
      action({ id: "attack", enabled: true, candidateEnabled: true }),
      action({ id: "activate", enabled: false, candidateEnabled: true }),
    ]);

    const projected = projectInteractionCardActions(view, "card-1", {
      presentationFor: (candidate) => ({
        order: candidate.id === "attack" ? 20 : 30,
      }),
      fallbackDisabledReason: "Unavailable right now.",
    });

    expect(projected.map((candidate) => candidate.commandRef)).toEqual(["attack", "activate"]);
    expect(projected[0]?.availability).toEqual({ kind: "enabled" });
    expect(projected[1]?.availability).toEqual({
      kind: "disabled",
      reason: "Unavailable right now.",
      reasonCode: undefined,
    });
  });
});

function action({
  id = "playCard",
  enabled,
  disabledText,
  candidateEnabled,
  candidateDisabledText,
}: {
  id?: string;
  enabled: boolean;
  disabledText?: InteractionAction["disabledText"];
  candidateEnabled: boolean;
  candidateDisabledText?: InteractionAction["disabledText"];
}): InteractionAction {
  return {
    id,
    requestId: `cyberpunk:1:${id}`,
    intent: "play-card",
    text: { key: id },
    enabled,
    disabledText,
    inputs: [
      {
        kind: "entity-selection",
        id: "cardId",
        text: { key: `${id}.source` },
        role: "source",
        required: true,
        entityKinds: ["card"],
        min: 1,
        max: 1,
        ordered: false,
        candidates: [
          {
            entity: { kind: "card", instanceId: "card-1" },
            enabled: candidateEnabled,
            disabledText: candidateDisabledText,
          },
        ],
      },
    ],
  };
}

function viewWithActions(actions: InteractionAction[]): EngineInteractionView {
  return {
    protocolVersion: 2,
    gameSlug: "cyberpunk",
    actorId: "player",
    stateVersion: 1,
    status: "ready",
    actions,
  };
}
