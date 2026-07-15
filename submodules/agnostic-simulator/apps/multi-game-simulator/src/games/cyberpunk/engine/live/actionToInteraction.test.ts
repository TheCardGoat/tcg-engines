import { describe, expect, test } from "vite-plus/test";
import type { EngineInteractionView } from "@tcg/protocol";

import { actionToInteractionSubmission } from "./actionToInteraction";

describe("actionToInteractionSubmission", () => {
  test("serializes resolveScry with protocol input ids", () => {
    const view: EngineInteractionView = {
      protocolVersion: 1,
      gameSlug: "cyberpunk",
      actorId: "p1",
      stateVersion: 7,
      status: "choosing",
      actions: [
        {
          id: "resolveScry",
          requestId: "cyberpunk:7:resolveScry",
          intent: "order-cards",
          text: { key: "cyberpunk.choice.scry" },
          enabled: true,
          inputs: [
            {
              kind: "option-selection",
              id: "destinationZone",
              text: { key: "cyberpunk.choice.scry.destination" },
              min: 0,
              max: 1,
              options: [{ id: "hand", text: { key: "hand" }, enabled: true }],
            },
            {
              kind: "entity-selection",
              id: "selectedCardIds",
              role: "source",
              entityKinds: ["card"],
              min: 0,
              max: 1,
              candidates: [
                {
                  entity: { kind: "card", instanceId: "card-1" },
                  enabled: true,
                },
              ],
            },
          ],
        },
      ],
    };

    expect(
      actionToInteractionSubmission(
        {
          type: "resolveScry",
          destinations: [{ zone: "hand", cardIds: ["card-1"] }],
        },
        view,
      ),
    ).toMatchObject({
      actionId: "resolveScry",
      values: {
        destinationZone: "hand",
        selectedCardIds: ["card-1"],
      },
    });
  });
});
