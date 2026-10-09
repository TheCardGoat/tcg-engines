import {
  AnimationPlanV2Schema,
  type AnimationPlanV2,
  type EntityTransferStepV2,
} from "@tcg/protocol";
import { compileAnimationPlan } from "@tcg/simulator-runtime/animation";
import { describe, expect, it } from "vitest";

import { enhanceCyberpunkCardTransferTiming } from "./three-card-transfer-plan";

const unitStep: EntityTransferStepV2 = {
  id: "card",
  type: "entityTransfer",
  entity: { kind: "entity", id: "card-1" },
  from: { kind: "zone", id: "p-hand" },
  to: { kind: "zone", id: "p-field" },
  sourceFace: "public",
  destinationFace: "public",
  durationMs: 240,
};
const plan: AnimationPlanV2 = {
  id: "cyberpunk-motion",
  version: 2,
  steps: [
    unitStep,
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
    {
      id: "retrieval",
      type: "entityTransfer",
      entity: { kind: "entity", id: "gear-1" },
      from: { kind: "zone", id: "p-trash" },
      to: { kind: "zone", id: "p-hand" },
      sourceFace: "public",
      destinationFace: "public",
      durationMs: 240,
    },
    {
      id: "hidden-retrieval",
      type: "entityTransfer",
      entity: { kind: "entity", id: "secret-1" },
      from: { kind: "zone", id: "p-trash" },
      to: { kind: "zone", id: "p-hand" },
      sourceFace: "hidden",
      destinationFace: "hidden",
      durationMs: 240,
    },
  ],
};

describe("enhanceCyberpunkCardTransferTiming", () => {
  it("gives unit entry its hover/drop/settle timing and keeps Gig dice readable", () => {
    const enhanced = enhanceCyberpunkCardTransferTiming(plan, true);

    expect(enhanced.steps.map((step) => step.id)).toEqual([
      "card",
      "gig",
      "retrieval",
      "hidden-retrieval",
    ]);
    expect(enhanced.steps[0]?.durationMs).toBe(760);
    expect(enhanced.steps[1]?.durationMs).toBeGreaterThan(plan.steps[1]?.durationMs ?? 0);
    expect(enhanced.steps[1]?.durationMs).toBeGreaterThan(enhanced.steps[0]?.durationMs ?? 0);
  });

  it("stages a public trash retrieval while an unrevealed one keeps the plain pace", () => {
    const enhanced = enhanceCyberpunkCardTransferTiming(plan, true);

    expect(enhanced.steps[2]?.durationMs).toBeGreaterThanOrEqual(2_000);
    expect(enhanced.steps[3]?.durationMs).toBe(800);
  });

  it("leaves the plan untouched when enhancement is off", () => {
    expect(enhanceCyberpunkCardTransferTiming(plan, false)).toBe(plan);
  });

  it("adds contact for hand attachment without treating other zone moves as plays", () => {
    const enhanced = enhanceCyberpunkCardTransferTiming(
      {
        ...plan,
        steps: [
          { ...unitStep, to: { kind: "entity", id: "host" }, audioCue: "card.move" },
          { ...plan.steps[1]!, audioCue: "card.move" },
        ],
      },
      true,
    );
    expect(compileAnimationPlan(enhanced).audioCues.map(({ cue }) => cue)).toEqual([
      "card.move",
      "card.play",
      "card.move",
    ]);
  });

  it.each(["card.move", "card.play"] as const)(
    "schedules %s plays on the compiled landing clock",
    (audioCue) => {
      const withAudio: AnimationPlanV2 = {
        ...plan,
        steps: [{ ...plan.steps[0]!, startAtMs: 100, audioCue }],
      };
      const enhanced = enhanceCyberpunkCardTransferTiming(withAudio, true);
      expect(AnimationPlanV2Schema.safeParse(enhanced).success).toBe(true);
      const compiled = compileAnimationPlan(enhanced);
      expect(compiled.primaryDurationMs).toBe(602);
      expect(compiled.audioCues.map(({ cue, startAtMs }) => ({ cue, startAtMs }))).toEqual([
        { cue: "card.move", startAtMs: 70 },
        { cue: "card.play", startAtMs: 490 },
      ]);
      const fast = compileAnimationPlan(enhanced, "fast");
      expect(fast.audioCues[1]?.startAtMs).toBe(245);
      expect(compileAnimationPlan(enhanced, "normal", true).audioCues[1]?.startAtMs).toBe(0);
      expect(compileAnimationPlan(enhanced, "off").audioCues[1]?.startAtMs).toBe(0);
    },
  );
});
