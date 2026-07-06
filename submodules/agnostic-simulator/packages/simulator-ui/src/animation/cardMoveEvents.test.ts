import { describe, expect, test } from "vite-plus/test";

import { cardMoveRecordsToAnimationPlans } from "./cardMoveEvents.js";

describe("cardMoveRecordsToAnimationPlans", () => {
  test("projects deck-to-hand records as moveEntity plans", () => {
    const plans = cardMoveRecordsToAnimationPlans([
      {
        id: "draw-1",
        cardId: "card-1",
        ownerId: "p1",
        fromZoneId: "deck:p1",
        toZoneId: "hand:p1",
        reason: "draw",
      },
    ]);

    expect(plans).toEqual([
      {
        id: "draw-1",
        version: 1,
        anchors: [],
        steps: [
          {
            id: "draw-1:move",
            type: "moveEntity",
            entity: { kind: "entity", id: "card-1" },
            from: { kind: "zone", id: "deck:p1", ownerId: "p1" },
            to: { kind: "zone", id: "hand:p1", ownerId: "p1" },
            delayMs: undefined,
            durationMs: undefined,
          },
        ],
      },
    ]);
  });

  test("projects records without a source as enterEntity plans", () => {
    const plans = cardMoveRecordsToAnimationPlans([
      {
        id: "enter-1",
        cardId: "card-1",
        ownerId: "p1",
        toZoneId: "battleArea:p1",
        delayMs: 80,
        durationMs: 240,
      },
    ]);

    expect(plans[0]).toMatchObject({
      id: "enter-1",
      version: 1,
      anchors: [],
      steps: [
        {
          id: "enter-1:enter",
          type: "enterEntity",
          entity: { kind: "entity", id: "card-1" },
          to: { kind: "zone", id: "battleArea:p1", ownerId: "p1" },
          delayMs: 80,
          durationMs: 240,
        },
      ],
    });
  });
});
