import { compileAnimationPlan } from "@tcg/simulator-runtime/animation";
import { describe, expect, it } from "vite-plus/test";

import {
  reducedMotionTransferPlan,
  shouldSuppressSimulatorMotion,
  withViewerRelativeResultAudio,
} from "./createSimulatorAnimationScope";

const resultPlan = compileAnimationPlan({
  id: "result-plan",
  version: 2,
  steps: [
    {
      id: "result",
      type: "gameResult",
      outcome: "winner",
      winner: { kind: "player", id: "p1" },
      audioCue: "game.win",
    },
  ],
});

describe("withViewerRelativeResultAudio", () => {
  it("derives victory and defeat from the viewer seat", () => {
    expect(withViewerRelativeResultAudio(resultPlan, "p1").audioCues).toMatchObject([
      { cue: "game.win" },
    ]);
    expect(withViewerRelativeResultAudio(resultPlan, "p2").audioCues).toMatchObject([
      { cue: "game.loss" },
    ]);
  });

  it("does not play a perspective result cue to spectators", () => {
    expect(withViewerRelativeResultAudio(resultPlan, null).audioCues).toEqual([]);
  });
});

describe("simulator Motion lifecycle policy", () => {
  it("suppresses playback for reduced motion and the deterministic test harness", () => {
    expect(shouldSuppressSimulatorMotion(true, false)).toBe(true);
    expect(shouldSuppressSimulatorMotion(false, true)).toBe(true);
    expect(shouldSuppressSimulatorMotion(false, false)).toBe(false);
  });

  it("keeps only a short simultaneous crossfade for reduced-motion transfers", () => {
    const plan = reducedMotionTransferPlan(
      {
        id: "reduced-transfer",
        version: 2,
        steps: [
          {
            id: "move",
            type: "entityTransfer",
            entity: { kind: "entity", id: "card" },
            from: { kind: "zone", id: "p1:combat-chain", ownerId: "p1" },
            to: { kind: "zone", id: "p1:banished", ownerId: "p1" },
            sourceFace: "public",
            destinationFace: "public",
            startAtMs: 45,
            durationMs: 440,
          },
          { id: "pulse", type: "emphasize", at: { kind: "entity", id: "card" }, style: "pulse" },
        ],
      },
      140,
    );

    expect(plan.steps).toEqual([
      expect.objectContaining({ id: "move", startAtMs: 0, durationMs: 140 }),
    ]);
  });
});
