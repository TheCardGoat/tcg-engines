import { describe, expect, it } from "vite-plus/test";
import type { AnimationPlanV2 } from "@tcg/protocol";
import { compileAnimationPlan } from "@tcg/simulator-runtime/animation";

import { deckRevealCuesFromPlan } from "./CyberpunkDeckRevealMotion";

describe("deckRevealCuesFromPlan", () => {
  it("uses a centered card-back cue for reveals that stay in the deck", () => {
    const plan: AnimationPlanV2 = {
      id: "reveal-7",
      version: 2,
      steps: [
        {
          id: "first",
          type: "emphasize",
          at: { kind: "zone", id: "opp-deck", ownerId: "p2" },
          style: "spotlight",
          reveal: { kind: "hidden" },
          startAtMs: 800,
          durationMs: 800,
        },
        {
          id: "second",
          type: "emphasize",
          at: { kind: "zone", id: "opp-deck", ownerId: "p2" },
          style: "spotlight",
          reveal: { kind: "hidden" },
          startAtMs: 900,
          durationMs: 800,
        },
      ],
    };

    expect(deckRevealCuesFromPlan(compileAnimationPlan(plan))).toEqual([
      {
        id: "plan:reveal-7:opponent",
        side: "opponent",
        cards: [
          { entityId: "first", title: "Revealed card" },
          { entityId: "second", title: "Revealed card" },
        ],
        visibility: "public",
        cardTimings: [
          { startAtMs: 560, durationMs: 560 },
          { startAtMs: 630, durationMs: 560 },
        ],
      },
    ]);
  });

  it("carries revealed identities for a multi-viewer deck spotlight", () => {
    const plan: AnimationPlanV2 = {
      id: "rival-choice",
      version: 2,
      steps: [
        {
          id: "top-1",
          type: "emphasize",
          at: { kind: "zone", id: "p-deck", ownerId: "p1" },
          style: "spotlight",
          reveal: {
            kind: "card",
            cardId: "top-1",
            audience: { kind: "players", ids: ["p1", "p2"] },
          },
          startAtMs: 0,
          durationMs: 1600,
        },
      ],
    };

    expect(deckRevealCuesFromPlan(compileAnimationPlan(plan))).toEqual([
      {
        id: "plan:rival-choice:player",
        side: "player",
        cards: [{ entityId: "top-1", title: "Revealed card" }],
        visibility: "public",
        cardTimings: [{ startAtMs: 0, durationMs: 1120 }],
      },
    ]);
  });

  it("ignores ordinary deck emphasis", () => {
    const plan: AnimationPlanV2 = {
      id: "scry-1",
      version: 2,
      steps: [
        {
          id: "pulse",
          type: "emphasize",
          at: { kind: "zone", id: "p-deck", ownerId: "p1" },
          style: "pulse",
          startAtMs: 0,
          durationMs: 800,
        },
      ],
    };
    expect(deckRevealCuesFromPlan(compileAnimationPlan(plan))).toEqual([]);
  });

  it("leaves deck-to-resource flights to the card transfer animation", () => {
    const plan: AnimationPlanV2 = {
      id: "bootleg-sale",
      version: 2,
      steps: [
        {
          id: "sold-card",
          type: "entityTransfer",
          entity: { kind: "entity", id: "sold-card" },
          from: { kind: "zone", id: "p-deck", ownerId: "p1" },
          to: { kind: "zone", id: "p-eddieArea", ownerId: "p1" },
          sourceFace: "hidden",
          destinationFace: "public",
          reveal: { kind: "card", cardId: "sold-card", audience: { kind: "all" } },
          startAtMs: 0,
          durationMs: 800,
        },
      ],
    };

    expect(deckRevealCuesFromPlan(compileAnimationPlan(plan))).toEqual([]);
  });

  it("uses the compiled timing for fast playback", () => {
    const plan: AnimationPlanV2 = {
      id: "fast-reveal",
      version: 2,
      steps: [
        {
          id: "spotlight",
          type: "emphasize",
          at: { kind: "zone", id: "p-deck", ownerId: "p1" },
          style: "spotlight",
          reveal: { kind: "hidden" },
          startAtMs: 800,
          durationMs: 800,
        },
      ],
    };
    const cue = deckRevealCuesFromPlan(compileAnimationPlan(plan, "fast"))[0];
    expect(cue?.cardTimings[0]?.startAtMs).toBeLessThan(800);
    expect(cue?.cardTimings[0]?.durationMs).toBeLessThan(800);
  });

  it("retains separate cues when one plan reveals both decks", () => {
    const plan: AnimationPlanV2 = {
      id: "both-decks",
      version: 2,
      steps: [
        {
          id: "player",
          type: "emphasize",
          at: { kind: "zone", id: "p-deck", ownerId: "p1" },
          style: "spotlight",
          reveal: { kind: "hidden" },
          startAtMs: 0,
          durationMs: 800,
        },
        {
          id: "opponent",
          type: "emphasize",
          at: { kind: "zone", id: "opp-deck", ownerId: "p2" },
          style: "spotlight",
          reveal: { kind: "hidden" },
          startAtMs: 800,
          durationMs: 800,
        },
      ],
    };
    expect(
      deckRevealCuesFromPlan(compileAnimationPlan(plan)).map((cue) => [
        cue.side,
        cue.cardTimings[0]?.startAtMs,
      ]),
    ).toEqual([
      ["player", 0],
      ["opponent", 560],
    ]);
  });

  it("carries the triggering ability onto the cue as the caption source", () => {
    const plan: AnimationPlanV2 = {
      id: "sketchy-reveal",
      version: 2,
      steps: [
        {
          id: "top-1",
          type: "emphasize",
          at: { kind: "zone", id: "p-deck", ownerId: "p1" },
          style: "spotlight",
          reveal: { kind: "card", cardId: "top-1", audience: { kind: "all" } },
          sourceCardId: "sketchy-ripper",
          sourceTitle: "Sketchy Ripper",
          sourceImageUrl: "/sketchy.png",
          startAtMs: 0,
          durationMs: 800,
        },
      ],
    };

    expect(deckRevealCuesFromPlan(compileAnimationPlan(plan))).toEqual([
      {
        id: "plan:sketchy-reveal:player",
        side: "player",
        cards: [{ entityId: "top-1", title: "Revealed card" }],
        visibility: "public",
        cardTimings: [{ startAtMs: 0, durationMs: 560 }],
        source: { title: "Sketchy Ripper", imageUrl: "/sketchy.png" },
      },
    ]);
  });
});
