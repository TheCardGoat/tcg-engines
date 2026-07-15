import { describe, expect, it } from "vite-plus/test";
import type { EngineInteractionView, InteractionAction } from "@tcg/protocol";
import { findDualModeMatchInInteractionView } from "./dualModeCard.ts";

describe("findDualModeMatchInInteractionView", () => {
  it("detects a card that is available as both command and pilot from protocol actions", () => {
    const match = findDualModeMatchInInteractionView(
      "hand-card",
      viewWithActions([
        action("playCommand", ["hand-card"]),
        action("playCommandAsPilot", ["hand-card"]),
      ]),
    );

    expect(match).toMatchObject({
      commandLegal: true,
      pilotLegal: true,
      cmdMove: "playCommand",
      pilotMove: "playCommandAsPilot",
    });
  });

  it("ignores single-mode cards", () => {
    expect(
      findDualModeMatchInInteractionView(
        "hand-card",
        viewWithActions([action("playCommand", ["hand-card"])]),
      ),
    ).toBeNull();
  });
});

function viewWithActions(actions: InteractionAction[]): EngineInteractionView {
  return {
    protocolVersion: 1,
    gameSlug: "gundam",
    actorId: "p1",
    stateVersion: 1,
    status: "ready",
    actions,
  };
}

function action(id: string, cardIds: string[]): InteractionAction {
  return {
    id,
    requestId: `gundam:1:${id}`,
    intent: "play-card",
    text: { key: `gundam.move.${id}` },
    enabled: true,
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
