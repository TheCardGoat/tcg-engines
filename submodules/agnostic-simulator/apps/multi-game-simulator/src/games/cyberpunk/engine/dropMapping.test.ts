import { describe, expect, it } from "vitest";
import { INTERACTION_PROTOCOL_VERSION, type EngineInteractionView } from "@tcg/protocol";

import { mapDropToAction, type DropContext } from "./dropMapping";

function buildContext(
  attachTargets: string[],
  source: { cardId: string; cardType: "gear" | "unit" | "legend" | "program" } = {
    cardId: "gear_1",
    cardType: "gear",
  },
): DropContext {
  return {
    humanSide: "player",
    humanZones: {
      hand: [source],
    },
    interactionView: {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "cyberpunk",
      actorId: "p1",
      stateVersion: 1,
      status: "ready",
      actions: [
        {
          id: "playCard",
          requestId: "playCard-1",
          intent: "play-card",
          text: { key: "cyberpunk.move.playCard" },
          enabled: true,
          inputs: [
            {
              id: "cardId",
              kind: "entity-selection",
              role: "source",
              entityKinds: ["card"],
              text: { key: "cyberpunk.move.playCard.card" },
              min: 1,
              max: 1,
              ordered: false,
              candidates: [
                {
                  entity: { kind: "card", instanceId: source.cardId, ownerId: "p1" },
                  enabled: true,
                },
              ],
            },
            {
              id: "attachToId",
              kind: "entity-selection",
              role: "target",
              entityKinds: ["card"],
              text: { key: "cyberpunk.move.playCard.attachTo" },
              min: 0,
              max: 1,
              ordered: false,
              candidates: attachTargets.map((instanceId) => ({
                entity: { kind: "card", instanceId, ownerId: "p1" },
                enabled: true,
              })),
            },
          ],
        },
      ],
    } satisfies EngineInteractionView,
  };
}

describe("mapDropToAction", () => {
  it("maps Gear from hand onto a legal friendly field host", () => {
    const action = mapDropToAction(
      {
        source: { type: "card", zone: "p-hand", index: 0, cardId: "gear_1", cardType: "gear" },
        target: { type: "card", zone: "p-field", index: 0, cardId: "unit_1" },
      },
      buildContext(["unit_1"]),
    );

    expect(action).toEqual({ type: "playCard", cardId: "gear_1", attachToId: "unit_1", as: "p1" });
  });

  it("maps Gear from hand onto a legal friendly legend-area host", () => {
    const action = mapDropToAction(
      {
        source: { type: "card", zone: "p-hand", index: 0, cardId: "gear_1", cardType: "gear" },
        target: { type: "card", zone: "p-legendArea", index: 0, cardId: "legend_1" },
      },
      buildContext(["legend_1"]),
    );

    expect(action).toEqual({
      type: "playCard",
      cardId: "gear_1",
      attachToId: "legend_1",
      as: "p1",
    });
  });

  it("rejects Gear drops onto a legend-area card that is not an attach target", () => {
    const action = mapDropToAction(
      {
        source: { type: "card", zone: "p-hand", index: 0, cardId: "gear_1", cardType: "gear" },
        target: { type: "card", zone: "p-legendArea", index: 0, cardId: "face_down_legend" },
      },
      buildContext(["legend_1"]),
    );

    expect(action).toBeNull();
  });

  it("does not treat a non-Gear hand card dropped onto a legend-area card as a play", () => {
    const action = mapDropToAction(
      {
        source: { type: "card", zone: "p-hand", index: 0, cardId: "unit_1", cardType: "unit" },
        target: { type: "card", zone: "p-legendArea", index: 0, cardId: "legend_1" },
      },
      buildContext([], { cardId: "unit_1", cardType: "unit" }),
    );

    expect(action).toBeNull();
  });
});
