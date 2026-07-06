import { describe, expect, test } from "vite-plus/test";

import { AnimationPlanV1Schema } from "./animations.js";

describe("AnimationPlanV1Schema", () => {
  test("accepts semantic refs and transient anchors", () => {
    const plan = {
      id: "move-1",
      version: 1,
      stateVersion: 12,
      moveId: "play-program",
      actorId: "player-1",
      correlationId: "corr-1",
      fromVersion: 11,
      toVersion: 12,
      anchors: [{ id: "pending-program", role: "board-right", label: "Pending program" }],
      steps: [
        {
          id: "focus-program",
          type: "effect",
          source: { kind: "anchor", id: "pending-program" },
          targets: [{ kind: "entity", id: "target-card" }],
          label: "Program targets card",
          audioCue: "effect.trigger",
        },
        {
          id: "trash-program",
          type: "moveEntity",
          entity: { kind: "entity", id: "program-card" },
          from: { kind: "anchor", id: "pending-program" },
          to: { kind: "zone", id: "trash", ownerId: "player-1" },
          audioCue: "card.discard",
        },
      ],
    };

    expect(AnimationPlanV1Schema.parse(plan)).toEqual(plan);
  });

  test("rejects unknown step variants", () => {
    const result = AnimationPlanV1Schema.safeParse({
      id: "move-1",
      version: 1,
      steps: [{ id: "bad", type: "cssSelector", selector: ".card" }],
    });

    expect(result.success).toBe(false);
  });

  test("rejects renderer-specific fields", () => {
    const result = AnimationPlanV1Schema.safeParse({
      id: "move-1",
      version: 1,
      steps: [
        {
          id: "move-card",
          type: "moveEntity",
          entity: { kind: "entity", id: "card-1" },
          to: { kind: "zone", id: "trash" },
          className: "cyberpunk-card",
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  test("rejects unknown audio cues", () => {
    const result = AnimationPlanV1Schema.safeParse({
      id: "move-1",
      version: 1,
      steps: [
        {
          id: "move-card",
          type: "moveEntity",
          entity: { kind: "entity", id: "card-1" },
          to: { kind: "zone", id: "trash" },
          audioCue: "cyberpunk.card.move",
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
