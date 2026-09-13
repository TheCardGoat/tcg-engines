import type { AnimationPlanV2 } from "@tcg/protocol/animations";
import { describe, expect, it } from "vitest";

import { compileAnimationPlan } from "./compile-plan";

const entity = { kind: "entity", id: "card-1" } as const;
const zone = { kind: "zone", id: "p1:field", ownerId: "p1" } as const;

describe("compileAnimationPlan", () => {
  it("uses one canonical timing table for every semantic step", () => {
    const compiled = compileAnimationPlan({
      id: "all-steps",
      version: 2,
      steps: [
        {
          id: "transfer",
          type: "entityTransfer",
          entity,
          from: zone,
          to: { ...zone, id: "p1:trash" },
          sourceFace: "public",
          destinationFace: "public",
        },
        { id: "emphasize", type: "emphasize", at: entity, style: "pulse" },
        {
          id: "state",
          type: "entityStateChange",
          entity,
          at: entity,
          change: "orientation",
          sourceFace: "public",
          destinationFace: "public",
          fromRotationDeg: 0,
          toRotationDeg: 90,
        },
        { id: "effect", type: "effect", source: entity, targets: [entity], label: "Trigger" },
        { id: "combat", type: "combat", source: entity, target: entity, reason: "declared" },
        { id: "value", type: "valueDelta", subject: entity, delta: 1 },
        { id: "phase", type: "phaseChange", from: "start", to: "main", variant: "phase" },
        { id: "random", type: "randomization", at: zone, kind: "shuffle" },
        {
          id: "comparison",
          type: "comparison",
          title: "REVEAL",
          participants: [
            { entity, label: "One", valueLabel: "7", tone: "winner" },
            {
              entity: { kind: "entity", id: "card-2" },
              label: "Two",
              valueLabel: "4",
              tone: "loser",
            },
          ],
          resultLabel: "ONE WINS",
        },
        { id: "result", type: "gameResult", outcome: "draw", reasonLabel: "timeout" },
        { id: "hold", type: "hold", durationMs: 100 },
      ],
    } satisfies AnimationPlanV2);

    expect(
      Object.fromEntries(compiled.steps.map((step) => [step.step.id, step.durationMs])),
    ).toEqual({
      transfer: 560,
      emphasize: 800,
      state: 560,
      effect: 800,
      combat: 800,
      value: 800,
      phase: 800,
      random: 800,
      comparison: 800,
      result: 1_200,
      hold: 100,
    });
    expect(compiled.primaryDurationMs).toBe(1_200);
    expect(compiled.interactionBlockingDurationMs).toBe(1_200);
    expect(compiled.reflowDurationMs).toBe(240);
  });

  it("keeps phase and turn feedback visible without extending the command lock", () => {
    const compiled = compileAnimationPlan({
      id: "turn-with-draw",
      version: 2,
      steps: [
        {
          id: "draw",
          type: "entityTransfer",
          entity,
          from: { ...zone, id: "p1:deck" },
          to: { ...zone, id: "p1:hand" },
          sourceFace: "hidden",
          destinationFace: "hidden",
          durationMs: 440,
        },
        {
          id: "turn",
          type: "phaseChange",
          from: "Turn 1",
          to: "Turn 2",
          variant: "turn",
          durationMs: 1_600,
        },
      ],
    });

    expect(compiled.primaryDurationMs).toBe(1_600);
    expect(compiled.interactionBlockingDurationMs).toBe(440);
  });

  it("does not lock commands for phase-only feedback", () => {
    const compiled = compileAnimationPlan({
      id: "phase-only",
      version: 2,
      steps: [
        {
          id: "phase",
          type: "phaseChange",
          from: "start",
          to: "main",
          variant: "phase",
          durationMs: 4_000,
        },
      ],
    });

    expect(compiled.primaryDurationMs).toBe(4_000);
    expect(compiled.interactionBlockingDurationMs).toBe(0);
  });

  it("scales semantic timing and only reserves reflow for transfers", () => {
    const plan = {
      id: "non-spatial",
      version: 2,
      steps: [{ id: "shuffle", type: "randomization", at: zone, kind: "shuffle" }],
    } satisfies AnimationPlanV2;

    expect(compileAnimationPlan(plan, "fast")).toMatchObject({
      primaryDurationMs: 400,
      interactionBlockingDurationMs: 400,
      reflowDurationMs: 0,
    });
    expect(compileAnimationPlan(plan, "off")).toMatchObject({
      primaryDurationMs: 0,
      interactionBlockingDurationMs: 0,
      reflowDurationMs: 0,
    });
  });
});
