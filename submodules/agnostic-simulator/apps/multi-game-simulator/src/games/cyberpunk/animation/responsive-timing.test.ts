import { describe, expect, test } from "vite-plus/test";
import { AnimationPlanV2Schema, type AnimationPlanV2 } from "@tcg/protocol";
import { compileAnimationPlan } from "@tcg/simulator-runtime/animation";
import { CYBERPUNK_REFLOW_DURATION_MS, paceCyberpunkAnimationPlan } from "./responsive-timing";

const sale: AnimationPlanV2 = {
  id: "sell",
  version: 2,
  steps: [
    {
      id: "transfer",
      type: "entityTransfer",
      entity: { kind: "entity", id: "sold-card" },
      from: { kind: "zone", id: "p-hand" },
      to: { kind: "zone", id: "p-eddies" },
      sourceFace: "public",
      destinationFace: "public",
      durationMs: 800,
      audioCue: "card.move",
    },
    {
      id: "contact",
      type: "hold",
      startAtMs: 640,
      durationMs: 0,
      audioCue: "card.play",
    },
  ],
};

describe("Cyberpunk responsive animation timing", () => {
  test("unlocks a routine sale within 400ms at normal speed and keeps contact audio aligned", () => {
    const paced = paceCyberpunkAnimationPlan(sale);
    expect(AnimationPlanV2Schema.safeParse(paced).success).toBe(true);
    const compiled = compileAnimationPlan(paced, "normal", false, CYBERPUNK_REFLOW_DURATION_MS);
    expect(compiled.interactionBlockingDurationMs + compiled.reflowDurationMs).toBeLessThanOrEqual(
      400,
    );
    const contact = compiled.audioCues.find((cue) => cue.cue === "card.play")!;
    expect(contact.startAtMs / compiled.primaryDurationMs).toBeCloseTo(0.8, 2);
    expect(sale.steps[0]?.durationMs).toBe(800);
    expect(compileAnimationPlan(paced, "off").interactionBlockingDurationMs).toBe(0);
    expect(compileAnimationPlan(paced, "normal", true).interactionBlockingDurationMs).toBe(0);
  });

  test("preserves deliberate combat and public retrieval timelines", () => {
    const combat: AnimationPlanV2 = {
      ...sale,
      steps: [
        ...sale.steps,
        {
          id: "fight",
          type: "combat",
          source: { kind: "entity", id: "attacker" },
          target: { kind: "entity", id: "defender" },
          durationMs: 1600,
        },
      ],
    };
    expect(paceCyberpunkAnimationPlan(combat)).toBe(combat);
    const retrieval: AnimationPlanV2 = {
      ...sale,
      steps: [
        {
          ...sale.steps[0]!,
          id: "retrieve",
          type: "entityTransfer",
          entity: { kind: "entity", id: "revealed-card" },
          from: { kind: "zone", id: "p-trash" },
          to: { kind: "zone", id: "p-hand" },
          sourceFace: "public",
          destinationFace: "public",
          durationMs: 2000,
        },
      ],
    };
    expect(paceCyberpunkAnimationPlan(retrieval)).toBe(retrieval);
  });

  test("preserves reveal holds and transfer timelines when another command is queued", () => {
    const reveal = { kind: "card", cardId: "revealed-card", audience: { kind: "all" } } as const;
    const emphasis: AnimationPlanV2 = {
      id: "public-reveal",
      version: 2,
      steps: [
        {
          id: "reveal",
          type: "emphasize",
          style: "spotlight",
          at: { kind: "entity", id: "revealed-card" },
          reveal,
          durationMs: 2000,
        },
      ],
    };
    const transfer: AnimationPlanV2 = {
      ...emphasis,
      steps: [
        {
          id: "reveal-transfer",
          type: "entityTransfer",
          entity: { kind: "entity", id: "revealed-card" },
          from: { kind: "zone", id: "p-deck" },
          to: { kind: "zone", id: "p-hand" },
          sourceFace: "hidden",
          destinationFace: "public",
          reveal,
          durationMs: 2000,
        },
      ],
    };
    for (const plan of [emphasis, transfer]) {
      expect(AnimationPlanV2Schema.safeParse(plan).success).toBe(true);
      expect(paceCyberpunkAnimationPlan(plan)).toBe(plan);
      expect(compileAnimationPlan(paceCyberpunkAnimationPlan(plan)).primaryDurationMs).toBe(
        compileAnimationPlan(plan).primaryDurationMs,
      );
    }
  });

  test("keeps short plans and only retimes longer default-duration feedback", () => {
    const short: AnimationPlanV2 = {
      ...sale,
      steps: [{ id: "brief", type: "hold", durationMs: 100 }],
    };
    expect(paceCyberpunkAnimationPlan(short)).toBe(short);
    const feedback: AnimationPlanV2 = {
      ...sale,
      steps: [
        {
          id: "value",
          type: "valueDelta",
          subject: { kind: "entity", id: "gig" },
          delta: 1,
        },
      ],
    };
    const compiled = compileAnimationPlan(paceCyberpunkAnimationPlan(feedback));
    expect(compiled.interactionBlockingDurationMs).toBeLessThanOrEqual(336);
  });
});
