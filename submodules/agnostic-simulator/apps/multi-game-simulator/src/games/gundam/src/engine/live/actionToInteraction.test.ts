import { describe, expect, it } from "vite-plus/test";

import { asMoveName } from "../../game/types.ts";
import { moveToInteractionSubmission } from "./actionToInteraction.ts";
import type { EngineInteractionView } from "@tcg/protocol";

describe("moveToInteractionSubmission", () => {
  it("maps a move and partial input to a protocol submission", () => {
    expect(
      moveToInteractionSubmission(
        asMoveName("deployUnit"),
        { cardId: "card_1", target: "zone_1" },
        viewWithActions(["deployUnit"]),
      ),
    ).toEqual({
      protocolVersion: 1,
      stateVersion: 4,
      requestId: "gundam:4:deployUnit",
      actionId: "deployUnit",
      values: { cardId: "card_1", target: "zone_1" },
    });
  });

  it("flattens pending-effect answer objects into protocol value keys", () => {
    expect(
      moveToInteractionSubmission(
        asMoveName("resolveEffect"),
        {
          pendingEffectId: "effect_1",
          optionalAnswers: { 0: true },
          chooseOneAnswers: { 1: 2 },
          deckLookAnswers: {
            2: {
              tutorCardId: "card_2",
              toTop: ["card_3"],
              toBottom: ["card_4"],
            },
          },
        },
        viewWithActions(["resolveEffect"]),
      ),
    ).toMatchObject({
      actionId: "resolveEffect",
      values: {
        pendingEffectId: "effect_1",
        "optionalAnswers.0": true,
        "chooseOneAnswers.1": 2,
        "deckLookAnswers.2.tutorCardId": "card_2",
        "deckLookAnswers.2.toTop": ["card_3"],
        "deckLookAnswers.2.toBottom": ["card_4"],
      },
    });
  });

  it("does not submit without an enabled matching action", () => {
    expect(moveToInteractionSubmission(asMoveName("passTurn"), {}, undefined)).toBeNull();
    expect(
      moveToInteractionSubmission(asMoveName("passTurn"), {}, viewWithActions(["concede"])),
    ).toBeNull();
    expect(
      moveToInteractionSubmission(asMoveName("passTurn"), {}, viewWithActions(["passTurn"], false)),
    ).toBeNull();
  });
});

function viewWithActions(actionIds: string[], enabled = true): EngineInteractionView {
  return {
    protocolVersion: 1,
    gameSlug: "gundam",
    actorId: "p1",
    stateVersion: 4,
    status: "ready",
    actions: actionIds.map((id) => ({
      id,
      requestId: `gundam:4:${id}`,
      intent: "custom",
      text: { key: `move.${id}` },
      enabled,
      inputs: [],
    })),
  };
}
