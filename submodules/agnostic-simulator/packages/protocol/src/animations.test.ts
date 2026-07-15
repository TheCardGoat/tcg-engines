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

  test("accepts generic steal audio and move labels", () => {
    const plan = {
      id: "steal-1",
      version: 1,
      steps: [
        {
          id: "move-gig",
          type: "moveEntity",
          entity: { kind: "entity", id: "gig-d6" },
          from: { kind: "zone", id: "opp-gigs", ownerId: "player-2" },
          to: { kind: "zone", id: "p-gigs", ownerId: "player-1" },
          label: "GIG STOLEN",
          audioCue: "resource.steal",
        },
      ],
    };

    expect(AnimationPlanV1Schema.parse(plan)).toEqual({ ...plan, anchors: [] });
  });

  test("accepts explicit card face overrides for staged reveals", () => {
    const plan = {
      id: "legend-reveal-1",
      version: 1,
      steps: [
        {
          id: "legend-to-center",
          type: "moveEntity",
          entity: { kind: "entity", id: "legend-1" },
          from: { kind: "zone", id: "p-legendArea", ownerId: "player-1" },
          to: { kind: "anchor", id: "resolving-program:legend-1" },
          sourceFace: "hidden",
          destinationFace: "hidden",
        },
        {
          id: "legend-flip",
          type: "spotlightEntity",
          entity: { kind: "entity", id: "legend-1" },
          at: { kind: "anchor", id: "resolving-program:legend-1" },
          sourceFace: "hidden",
          destinationFace: "public",
          audioCue: "effect.trigger",
        },
      ],
    };

    expect(AnimationPlanV1Schema.parse(plan)).toEqual({ ...plan, anchors: [] });
  });

  test("accepts blocked combat reason", () => {
    const plan = {
      id: "block-1",
      version: 1,
      steps: [
        {
          id: "blocker-redirect",
          type: "combat",
          source: { kind: "entity", id: "blocker" },
          target: { kind: "entity", id: "attacker" },
          reason: "blocked",
          attackKind: "fight",
          label: "BLOCK",
          detailLabel: "REDIRECTED",
          audioCue: "effect.trigger",
        },
      ],
    };

    expect(AnimationPlanV1Schema.parse(plan)).toEqual({ ...plan, anchors: [] });
  });

  test("rejects unknown combat reasons", () => {
    const result = AnimationPlanV1Schema.safeParse({
      id: "block-1",
      version: 1,
      steps: [
        {
          id: "bad-combat",
          type: "combat",
          source: { kind: "entity", id: "blocker" },
          target: { kind: "entity", id: "attacker" },
          reason: "redirected",
        },
      ],
    });

    expect(result.success).toBe(false);
  });
});
