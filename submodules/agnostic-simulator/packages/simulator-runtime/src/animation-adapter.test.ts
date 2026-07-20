import { describe, expect, it } from "vitest";

import { adaptAnimationPlans, type AnimationPlanAdapter } from "./animation-adapter.js";

const adapter: AnimationPlanAdapter<string, { readonly ownerId: string }> = {
  id: "test.card-move",
  toAnimationPlans: (cardId, context) => [
    {
      id: `move:${cardId}`,
      version: 1,
      anchors: [],
      steps: [
        {
          id: `move:${cardId}:step`,
          type: "moveEntity",
          entity: { kind: "entity", id: cardId },
          from: { kind: "zone", id: "deck", ownerId: context.ownerId },
          to: { kind: "zone", id: "hand", ownerId: context.ownerId },
        },
      ],
    },
  ],
};

describe("adaptAnimationPlans", () => {
  it("validates and returns canonical shared plans", () => {
    expect(adaptAnimationPlans(adapter, "card-1", { ownerId: "player-1" })).toEqual([
      expect.objectContaining({ id: "move:card-1", version: 1, anchors: [] }),
    ]);
  });

  it("rejects invalid game adapter output before rendering", () => {
    const invalid: AnimationPlanAdapter<string, void> = {
      id: "invalid",
      toAnimationPlans: () => [{ id: "bad", version: 2 as never, anchors: [], steps: [] }],
    };
    expect(() => adaptAnimationPlans(invalid, "card", undefined)).toThrow();
  });
});
