import { describe, expect, it } from "bun:test";

import { createCanonicalEngineMoveLog, selectVisibleEngineLogForViewer } from "./move-logs";

describe("createCanonicalEngineMoveLog", () => {
  it("preserves public nested fields in private viewer messages", () => {
    const log = createCanonicalEngineMoveLog({
      moveType: "resolveEffect",
      playerId: "player-one",
      timestamp: 123,
      messages: [
        {
          key: "lorcana.effect.resolve.scrySelection.detail",
          values: {
            sourceCardId: "source-card",
            destinations: [
              {
                zone: "hand",
                cardIds: {
                  __private: true,
                  value: ["hidden-card"],
                  visibleTo: ["player-one"],
                },
              },
            ],
          },
        },
      ],
    });

    expect(log.privateByPlayerId?.["player-one"]).toEqual([
      {
        key: "lorcana.effect.resolve.scrySelection.detail",
        values: {
          sourceCardId: "source-card",
          destinations: [
            {
              zone: "hand",
              cardIds: ["hidden-card"],
            },
          ],
        },
      },
    ]);
  });
});

describe("selectVisibleEngineLogForViewer", () => {
  it("strips legacy private fields for non-visible viewers", () => {
    expect(
      selectVisibleEngineLogForViewer(
        {
          type: "passTurn",
          hidden: { __private: true, value: "card-a", visibleTo: ["player-one"] },
        },
        "player-two",
      ),
    ).toEqual({ type: "passTurn" });
  });
});
