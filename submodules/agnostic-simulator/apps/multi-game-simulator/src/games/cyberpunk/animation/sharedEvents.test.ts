import { describe, expect, test } from "vite-plus/test";
import { AnimationPlanV2Schema } from "@tcg/protocol";
import type { AnimationScript, CardMoveStep } from "@tcg/cyberpunk-engine";

import { PLAYER_SIDE_TO_ID } from "../engine/index.js";
import {
  cyberpunkAnimationScriptToAnimationPlans,
  cyberpunkAnimationStepToAnimationPlan,
  isCyberpunkAuthoritativeRollback,
  projectCyberpunkAuthoritativeAnimationPlan,
} from "./sharedEvents.js";

const context = {
  viewerSeatId: String(PLAYER_SIDE_TO_ID.player),
  idPrefix: "transition-1",
};

describe("Cyberpunk AnimationPlanV2 adapter", () => {
  test("combines engine records into one canonical plan", () => {
    const plans = cyberpunkAnimationScriptToAnimationPlans(
      {
        steps: [
          cardMove({
            id: "move-a",
            cardId: "card-a",
            fromZone: "field",
            toZone: "trash",
          }),
          cardMove({
            id: "move-b",
            cardId: "card-b",
            fromZone: "hand",
            toZone: "field",
          }),
        ],
      } as AnimationScript,
      context,
    );

    expect(plans).toHaveLength(1);
    expect(AnimationPlanV2Schema.parse(plans[0])).toEqual(plans[0]);
    expect(plans[0]?.steps.map((step) => step.type)).toEqual(["entityTransfer", "entityTransfer"]);
  });

  test("keeps explicit viewer-safe faces and absolute starts", () => {
    const plan = cyberpunkAnimationStepToAnimationPlan(
      cardMove({
        id: "move",
        cardId: "blocker",
        fromZone: "field",
        toZone: "trash",
        startMs: 120,
      }),
      context,
    );
    expect(plan?.version).toBe(2);
    expect(plan?.steps[0]).toMatchObject({
      type: "entityTransfer",
      sourceFace: "public",
      destinationFace: "public",
      startAtMs: 120,
    });
  });

  test("hides a public card when it returns to the opponent's private hand", () => {
    const plan = cyberpunkAnimationStepToAnimationPlan(
      cardMove({
        id: "bounce",
        cardId: "rival-unit",
        playerId: PLAYER_SIDE_TO_ID.opponent,
        fromZone: "field",
        toZone: "hand",
      }),
      context,
    );

    expect(plan?.steps[0]).toMatchObject({
      type: "entityTransfer",
      sourceFace: "public",
      destinationFace: "hidden",
    });
  });

  test("keeps the viewer's own private hand public", () => {
    const plan = cyberpunkAnimationStepToAnimationPlan(
      cardMove({
        id: "return",
        cardId: "friendly-unit",
        fromZone: "field",
        toZone: "hand",
      }),
      context,
    );

    expect(plan?.steps[0]).toMatchObject({
      type: "entityTransfer",
      sourceFace: "public",
      destinationFace: "public",
    });
  });

  test("shows a card face-up throughout a private-to-public transfer", () => {
    const plan = cyberpunkAnimationStepToAnimationPlan(
      cardMove({
        id: "deploy",
        cardId: "friendly-unit",
        fromZone: "hand",
        toZone: "field",
      }),
      context,
    );

    expect(plan?.steps[0]).toMatchObject({
      type: "entityTransfer",
      sourceFace: "public",
      destinationFace: "public",
    });
  });

  test("keeps a revealed card face-up while it moves to the resolving area", () => {
    const plan = cyberpunkAnimationStepToAnimationPlan(
      {
        id: "reveal",
        kind: "cardReveal",
        cardId: "top-card",
        playerId: PLAYER_SIDE_TO_ID.player,
        fromZone: "deck",
        toZone: "trash",
        startMs: 0,
        durationMs: 560,
        reason: "test",
      } as AnimationScript["steps"][number],
      context,
    );

    expect(plan?.steps[0]).toMatchObject({
      id: "reveal:to-resolution",
      type: "entityTransfer",
      sourceFace: "public",
      destinationFace: "public",
    });
  });

  test("keeps a revealed legend face-up and holds rather than flipping it", () => {
    const plan = cyberpunkAnimationStepToAnimationPlan(
      {
        id: "legend",
        kind: "legendReveal",
        cardId: "legend-card",
        playerId: PLAYER_SIDE_TO_ID.player,
        startMs: 0,
        durationMs: 560,
        reason: "test",
      } as AnimationScript["steps"][number],
      context,
    );

    expect(plan?.steps[0]).toMatchObject({
      id: "legend:to-resolution",
      type: "entityTransfer",
      sourceFace: "public",
      destinationFace: "public",
    });
    expect(plan?.steps[1]).toMatchObject({ id: "legend:hold", type: "hold" });
  });

  test("maps state changes, randomization, values, and results to shared semantics", () => {
    const plans = cyberpunkAnimationScriptToAnimationPlans(
      {
        steps: [
          {
            id: "spend",
            kind: "entityStateChange",
            startMs: 0,
            durationMs: 420,
            reason: "cardSpent",
            cardId: "unit",
            playerId: PLAYER_SIDE_TO_ID.player,
            change: "spent",
          },
          {
            id: "shuffle",
            kind: "randomization",
            startMs: 420,
            durationMs: 720,
            reason: "deckShuffled",
            playerId: PLAYER_SIDE_TO_ID.player,
            randomization: "shuffle",
          },
          {
            id: "result",
            kind: "gameResult",
            startMs: 1140,
            durationMs: 1200,
            reason: "gameEnded",
            winnerId: PLAYER_SIDE_TO_ID.player,
            reasonLabel: "seven gigs",
          },
        ],
        totalDurationMs: 2340,
      } as AnimationScript,
      context,
    );

    expect(plans.flatMap((plan) => plan.steps)).toMatchObject([
      {
        type: "entityStateChange",
        change: "orientation",
        fromRotationDeg: 0,
        toRotationDeg: 90,
      },
      { type: "randomization", kind: "shuffle" },
      {
        type: "gameResult",
        outcome: "winner",
        winner: { kind: "player", id: String(PLAYER_SIDE_TO_ID.player) },
      },
    ]);
  });

  test("projects authoritative engine zones and faces for the current viewer", () => {
    const plan = projectCyberpunkAuthoritativeAnimationPlan(
      {
        id: "server-plan",
        version: 2,
        steps: [
          {
            id: "return",
            type: "entityTransfer",
            entity: { kind: "entity", id: "friendly-unit" },
            from: {
              kind: "zone",
              id: "field",
              ownerId: String(PLAYER_SIDE_TO_ID.player),
            },
            to: {
              kind: "zone",
              id: "hand",
              ownerId: String(PLAYER_SIDE_TO_ID.player),
            },
            sourceFace: "public",
            destinationFace: "hidden",
          },
        ],
      },
      String(PLAYER_SIDE_TO_ID.player),
    );

    expect(plan.steps[0]).toMatchObject({
      from: { kind: "zone", id: "p-field" },
      to: { kind: "zone", id: "p-hand" },
      sourceFace: "public",
      destinationFace: "public",
    });
  });

  test("projects authoritative Gig transfers into rendered Fixer and Gig zones", () => {
    const plan = projectCyberpunkAuthoritativeAnimationPlan(
      {
        id: "gain-gig",
        version: 2,
        steps: [
          {
            id: "move-die",
            type: "entityTransfer",
            entity: { kind: "entity", id: "gig-die" },
            from: { kind: "zone", id: "fixerArea", ownerId: String(PLAYER_SIDE_TO_ID.opponent) },
            to: { kind: "zone", id: "gigArea", ownerId: String(PLAYER_SIDE_TO_ID.opponent) },
            sourceFace: "public",
            destinationFace: "public",
          },
        ],
      },
      String(PLAYER_SIDE_TO_ID.player),
    );

    expect(plan.steps[0]).toMatchObject({
      from: { kind: "zone", id: "opp-fixer" },
      to: { kind: "zone", id: "opp-gigArea" },
    });
  });

  test("classifies an undo version as an authoritative rollback", () => {
    expect(isCyberpunkAuthoritativeRollback(4, 9)).toBe(true);
    expect(isCyberpunkAuthoritativeRollback(10, 9)).toBe(false);
    expect(isCyberpunkAuthoritativeRollback(0, null)).toBe(false);
  });
});

function cardMove(overrides: {
  id: string;
  cardId: string;
  playerId?: CardMoveStep["playerId"];
  fromZone: CardMoveStep["fromZone"];
  toZone: CardMoveStep["toZone"];
  startMs?: number;
}): CardMoveStep {
  return {
    kind: "cardMove",
    playerId: PLAYER_SIDE_TO_ID.player,
    startMs: 0,
    durationMs: 560,
    reason: "test",
    ...overrides,
  } as CardMoveStep;
}
