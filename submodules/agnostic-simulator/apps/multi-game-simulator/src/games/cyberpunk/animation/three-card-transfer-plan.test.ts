import type { AnimationPlanV2 } from "@tcg/protocol";
import { describe, expect, it } from "vitest";

import { enhanceCyberpunkCardTransferTiming } from "./three-card-transfer-plan";

const plan: AnimationPlanV2 = {
  id: "cyberpunk-motion",
  version: 2,
  steps: [
    {
      id: "card",
      type: "entityTransfer",
      entity: { kind: "entity", id: "card-1" },
      from: { kind: "zone", id: "p-hand" },
      to: { kind: "zone", id: "p-field" },
      sourceFace: "public",
      destinationFace: "public",
      durationMs: 240,
    },
    {
      id: "gig",
      type: "entityTransfer",
      entity: { kind: "entity", id: "gig-1" },
      from: { kind: "zone", id: "p-fixer" },
      to: { kind: "zone", id: "p-gigArea" },
      sourceFace: "public",
      destinationFace: "public",
      durationMs: 360,
    },
  ],
};

describe("enhanceCyberpunkCardTransferTiming", () => {
  it("gives cards and Gig dice the faster default physical timing", () => {
    const enhanced = enhanceCyberpunkCardTransferTiming(plan, true);

    expect(enhanced.steps[0]?.durationMs).toBe(567);
    expect(enhanced.steps[1]?.durationMs).toBe(567);
  });

  it("leaves the DOM fallback plan unchanged", () => {
    expect(enhanceCyberpunkCardTransferTiming(plan, false)).toBe(plan);
  });
});
