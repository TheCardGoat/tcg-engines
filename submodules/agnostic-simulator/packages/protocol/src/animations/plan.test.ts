import { describe, expect, test } from "vitest";

import { AnimationPlanV2Schema } from "./plan.js";

describe("AnimationPlanV2Schema", () => {
  test("accepts semantic tones on localized emphasis", () => {
    expect(
      AnimationPlanV2Schema.parse({
        id: "crowd-reaction",
        version: 2,
        steps: [
          {
            id: "crowd-cheers",
            type: "emphasize",
            at: { kind: "player", id: "p1" },
            style: "pulse",
            tone: "positive",
            label: "CROWD CHEERS",
          },
        ],
      }).steps[0],
    ).toMatchObject({ tone: "positive", label: "CROWD CHEERS" });
  });

  test("accepts a viewer-safe entity transfer", () => {
    const plan = {
      id: "move-1",
      version: 2,
      steps: [
        {
          id: "card-1",
          type: "entityTransfer",
          entity: { kind: "entity", id: "card-1" },
          from: { kind: "zone", id: "field", ownerId: "p1" },
          to: { kind: "zone", id: "trash", ownerId: "p1" },
          sourceFace: "public",
          destinationFace: "public",
        },
      ],
    } as const;

    expect(AnimationPlanV2Schema.parse(plan)).toEqual(plan);
  });

  test("accepts one representative visual for a batched transfer", () => {
    const plan = {
      id: "draw-up",
      version: 2,
      steps: [
        {
          id: "draw-up-p1",
          type: "entityTransfer",
          entity: { kind: "entity", id: "representative-card" },
          from: { kind: "zone", id: "p1:deck", ownerId: "p1" },
          to: { kind: "zone", id: "p1:hand", ownerId: "p1" },
          sourceFace: "hidden",
          destinationFace: "public",
          quantity: 4,
        },
      ],
    } as const;

    expect(AnimationPlanV2Schema.parse(plan)).toEqual(plan);
  });

  test("accepts an opt-in source-card effect with a semantic result", () => {
    const plan = {
      id: "damage-1",
      version: 2,
      steps: [
        {
          id: "damage-1:impact",
          type: "effect",
          source: { kind: "entity", id: "instant-1" },
          targets: [{ kind: "player", id: "p2" }],
          presentation: "source-card",
          sourceFace: "public",
          sourceExitTo: { kind: "zone", id: "p1:graveyard", ownerId: "p1" },
          valueLabel: "10",
          label: "ARCANE DAMAGE",
          tone: "negative",
        },
      ],
    } as const;

    expect(AnimationPlanV2Schema.parse(plan)).toEqual(plan);
  });

  test("accepts a transfer that preserves existing endpoint visuals", () => {
    const plan = {
      id: "copy-trigger-1",
      version: 2,
      steps: [
        {
          id: "trigger-1",
          type: "entityTransfer",
          entity: { kind: "entity", id: "rules-stack:layer-1" },
          from: { kind: "entity", id: "source-card-1" },
          to: { kind: "zone", id: "p1:stack", ownerId: "p1" },
          sourceFace: "public",
          destinationFace: "public",
          sourcePresentation: "copy",
          destinationPresentation: "replace",
        },
      ],
    } as const;

    expect(AnimationPlanV2Schema.parse(plan)).toEqual(plan);
  });

  test("rejects a transfer without an endpoint", () => {
    const result = AnimationPlanV2Schema.safeParse({
      id: "invalid",
      version: 2,
      steps: [
        {
          id: "card-1",
          type: "entityTransfer",
          entity: { kind: "entity", id: "card-1" },
          sourceFace: "hidden",
          destinationFace: "hidden",
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  test("requires explicit faces", () => {
    const result = AnimationPlanV2Schema.safeParse({
      id: "invalid",
      version: 2,
      steps: [
        {
          id: "card-1",
          type: "entityTransfer",
          entity: { kind: "entity", id: "card-1" },
          to: { kind: "zone", id: "hand" },
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  test("accepts the game-agnostic state, value, randomization, and result steps", () => {
    const plan = {
      id: "semantic-steps",
      version: 2,
      steps: [
        {
          id: "rest-card",
          type: "entityStateChange",
          entity: { kind: "entity", id: "card-1" },
          at: { kind: "entity", id: "card-1" },
          change: "orientation",
          sourceFace: "public",
          destinationFace: "public",
          fromRotationDeg: 0,
          toRotationDeg: 90,
        },
        {
          id: "damage",
          type: "valueDelta",
          subject: { kind: "entity", id: "card-1" },
          delta: 2,
          label: "damage",
          tone: "negative",
        },
        {
          id: "shuffle",
          type: "randomization",
          at: { kind: "zone", id: "deck", ownerId: "p1" },
          kind: "shuffle",
        },
        {
          id: "comparison",
          type: "comparison",
          title: "REVEAL",
          participants: [
            {
              entity: { kind: "entity", id: "card-1" },
              label: "First card",
              valueLabel: "7",
              tone: "winner",
            },
            {
              entity: { kind: "entity", id: "card-2" },
              label: "Second card",
              valueLabel: "4",
              tone: "loser",
            },
          ],
          resultLabel: "FIRST WINS",
        },
        {
          id: "result",
          type: "gameResult",
          outcome: "winner",
          winner: { kind: "player", id: "p1" },
          reasonLabel: "concession",
        },
      ],
    } as const;

    expect(AnimationPlanV2Schema.parse(plan)).toEqual(plan);
  });

  test("requires rotation endpoints for orientation changes", () => {
    const result = AnimationPlanV2Schema.safeParse({
      id: "invalid-orientation",
      version: 2,
      steps: [
        {
          id: "rest-card",
          type: "entityStateChange",
          entity: { kind: "entity", id: "card-1" },
          at: { kind: "entity", id: "card-1" },
          change: "orientation",
          sourceFace: "public",
          destinationFace: "public",
        },
      ],
    });

    expect(result.success).toBe(false);
  });

  test("requires exactly one winner for winner outcomes", () => {
    expect(
      AnimationPlanV2Schema.safeParse({
        id: "missing-winner",
        version: 2,
        steps: [{ id: "result", type: "gameResult", outcome: "winner" }],
      }).success,
    ).toBe(false);
    expect(
      AnimationPlanV2Schema.safeParse({
        id: "draw-with-winner",
        version: 2,
        steps: [
          {
            id: "result",
            type: "gameResult",
            outcome: "draw",
            winner: { kind: "player", id: "p1" },
          },
        ],
      }).success,
    ).toBe(false);
  });

  test("accepts the shared reveal, block, prevention, and randomization cues", () => {
    for (const audioCue of [
      "card.reveal",
      "card.destroy",
      "combat.block",
      "damage.prevent",
      "random.die",
      "random.coin",
    ]) {
      expect(
        AnimationPlanV2Schema.safeParse({
          id: audioCue,
          version: 2,
          steps: [
            {
              id: audioCue,
              type: "emphasize",
              at: { kind: "player", id: "p1" },
              audioCue,
            },
          ],
        }).success,
      ).toBe(true);
    }
  });
});
