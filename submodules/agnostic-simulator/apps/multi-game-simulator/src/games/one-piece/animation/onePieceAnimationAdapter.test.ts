import { describe, expect, test } from "vite-plus/test";
import type { EngineAnimation } from "@tcg/op-engine/practice-st01";

import { onePieceAnimationsToAnimationPlan } from "./onePieceAnimationAdapter.ts";

describe("One Piece AnimationPlanV2 adapter", () => {
  test("maps a draw into one viewer-safe transfer", () => {
    const draw = {
      id: "draw-1",
      duration: 500,
      data: {
        kind: "cardMove",
        cardId: "card-1",
        fromOwner: "south",
        fromZone: "deck",
        toOwner: "south",
        toZone: "hand",
      },
    } as EngineAnimation;
    expect(onePieceAnimationsToAnimationPlan([draw], "transition-1")).toMatchObject({
      id: "transition-1",
      version: 2,
      steps: [
        {
          type: "entityTransfer",
          sourceFace: "hidden",
          destinationFace: "public",
          audioCue: "card.draw",
        },
      ],
    });
  });

  test("rejects unsupported native records at the adapter boundary", () => {
    const unknown = {
      id: "unknown",
      duration: 100,
      data: { kind: "generic", name: "unknown", params: {} },
    } as EngineAnimation;
    expect(() => onePieceAnimationsToAnimationPlan([unknown], "transition-2")).toThrow(
      "Unsupported One Piece animation data",
    );
  });
});
