import type { EngineAnimation } from "@tcg/op-engine/practice-st01";
import { adaptAnimationPlans } from "@tcg/simulator-runtime/animation-adapter";
import { describe, expect, it } from "vite-plus/test";

import { onePieceAnimationPlanAdapter } from "./onePieceAnimationAdapter.ts";

describe("onePieceAnimationPlanAdapter", () => {
  it("maps engine draws through the validated shared plan boundary", () => {
    const draw: EngineAnimation = {
      id: "draw-1",
      type: "cardMove",
      duration: 320,
      data: {
        kind: "cardMove",
        cardId: "private-card-instance",
        fromOwner: "north",
        toOwner: "north",
        fromZone: "deck",
        toZone: "hand",
      },
    };

    const [plan] = adaptAnimationPlans(onePieceAnimationPlanAdapter, [draw], undefined);

    expect(onePieceAnimationPlanAdapter.id).toBe("one-piece-engine-animation-v1");
    expect(plan?.steps).toEqual([
      expect.objectContaining({
        type: "moveEntity",
        from: { kind: "zone", id: "opponent-deck", ownerId: "opponent" },
        to: { kind: "zone", id: "opponent-hand", ownerId: "opponent" },
        audioCue: "card.draw",
      }),
    ]);
  });

  it("rejects engine animation kinds without an explicit shared mapping", () => {
    const unknown: EngineAnimation = {
      id: "unknown-1",
      type: "generic",
      duration: 100,
      data: { kind: "generic", name: "futureEvent", params: {} },
    };

    expect(() => adaptAnimationPlans(onePieceAnimationPlanAdapter, [unknown], undefined)).toThrow(
      "Unsupported One Piece animation data: futureEvent",
    );
  });
});
