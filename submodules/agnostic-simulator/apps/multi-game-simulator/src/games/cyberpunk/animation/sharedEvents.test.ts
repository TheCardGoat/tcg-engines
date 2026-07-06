import { describe, expect, test } from "vite-plus/test";
import { PLAYER_SIDE_TO_ID } from "../engine/index.js";
import type {
  CardAttachStep,
  CardEnterStep,
  CardExitStep,
  CardLandStep,
  CardMoveStep,
  EffectTargetStep,
  LegendRevealStep,
} from "./types.js";
import {
  cyberpunkAnimationScriptToAnimationPlans,
  cyberpunkAnimationStepToAnimationPlan,
  isCyberpunkAnimationStepSharedSupported,
  type CyberpunkSharedAnimationContext,
} from "./sharedEvents.js";
import { cyberpunkImmediateSystemAudioCues } from "./CyberpunkSharedAnimationLayer.js";

const context: CyberpunkSharedAnimationContext = {
  viewerSeatId: String(PLAYER_SIDE_TO_ID.player),
};

describe("cyberpunkImmediateSystemAudioCues", () => {
  test("maps non-animated system events to shared cues", () => {
    expect(
      cyberpunkImmediateSystemAudioCues(
        cyberpunkRawEntry({
          events: [
            { type: "turnStarted", playerId: PLAYER_SIDE_TO_ID.player, turn: 2 },
            { type: "gameEnded", winnerId: PLAYER_SIDE_TO_ID.player, reason: "score" },
          ],
        }),
        String(PLAYER_SIDE_TO_ID.player),
      ),
    ).toEqual(["turn.change", "game.win"]);
  });

  test("dedupes repeated system cues per entry and maps losses", () => {
    expect(
      cyberpunkImmediateSystemAudioCues(
        cyberpunkRawEntry({
          events: [
            { type: "turnStarted", playerId: PLAYER_SIDE_TO_ID.player, turn: 2 },
            { type: "turnStarted", playerId: PLAYER_SIDE_TO_ID.opponent, turn: 2 },
            { type: "gameEnded", winnerId: PLAYER_SIDE_TO_ID.opponent, reason: "score" },
          ],
        }),
        String(PLAYER_SIDE_TO_ID.player),
      ),
    ).toEqual(["turn.change", "game.loss"]);
  });
});

describe("cyberpunkAnimationStepToAnimationPlan", () => {
  test("maps card moves to Motion moveEntity plans", () => {
    const step: CardMoveStep = {
      id: "step-1",
      kind: "cardMove",
      startMs: 120,
      durationMs: 340,
      reason: "cardMoved",
      cardId: "card-1" as CardMoveStep["cardId"],
      fromZone: "hand",
      toZone: "field",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(cyberpunkAnimationStepToAnimationPlan(step, context)).toMatchObject({
      id: "step-1",
      version: 1,
      steps: [
        {
          id: "step-1",
          type: "moveEntity",
          delayMs: 120,
          durationMs: 340,
          entity: { kind: "entity", id: "card-1" },
          from: { kind: "zone", id: "p-hand", ownerId: String(PLAYER_SIDE_TO_ID.player) },
          to: { kind: "zone", id: "p-field", ownerId: String(PLAYER_SIDE_TO_ID.player) },
        },
      ],
    });
  });

  test("routes pending targeted Programs through the resolving program anchor", () => {
    const step: CardMoveStep = {
      id: "step-focus",
      kind: "cardMove",
      startMs: 120,
      durationMs: 340,
      reason: "cardMoved",
      cardId: "program-1" as CardMoveStep["cardId"],
      fromZone: "hand",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(
      cyberpunkAnimationStepToAnimationPlan(step, {
        ...context,
        pendingEffectSourceCardId: "program-1",
      }),
    ).toMatchObject({
      steps: [
        {
          type: "moveEntity",
          entity: { kind: "entity", id: "program-1" },
          from: { kind: "zone", id: "p-hand" },
          to: { kind: "anchor", id: "resolving-program:program-1" },
        },
      ],
    });
  });

  test("maps draw enters to deck-to-hand moves and other enters/exits to explicit steps", () => {
    const draw: CardEnterStep = {
      id: "draw-step",
      kind: "cardEnter",
      startMs: 80,
      durationMs: 300,
      reason: "cardsDrawn",
      cardId: "drawn-card" as CardEnterStep["cardId"],
      toZone: "hand",
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const enter: CardEnterStep = {
      id: "enter-step",
      kind: "cardEnter",
      startMs: 0,
      durationMs: 200,
      reason: "search",
      cardId: "entered-card" as CardEnterStep["cardId"],
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const exit: CardExitStep = {
      id: "exit-step",
      kind: "cardExit",
      startMs: 0,
      durationMs: 200,
      reason: "cardSold",
      cardId: "sold-card" as CardExitStep["cardId"],
      fromZone: "hand",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
      exitReason: "sold",
    };

    expect(cyberpunkAnimationStepToAnimationPlan(draw, context)).toMatchObject({
      steps: [{ type: "moveEntity", from: { id: "p-deck" }, to: { id: "p-hand" } }],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(enter, context)).toMatchObject({
      steps: [{ type: "enterEntity", to: { id: "p-trash" } }],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(exit, context)).toMatchObject({
      steps: [{ type: "moveEntity", from: { id: "p-hand" }, to: { id: "p-trash" } }],
    });
  });

  test("maps attach, reveal, land, and targeted effects to shared Motion primitives", () => {
    const attach: CardAttachStep = {
      id: "attach-step",
      kind: "cardAttach",
      startMs: 0,
      durationMs: 300,
      reason: "cardAttached",
      gearId: "gear-1" as CardAttachStep["gearId"],
      hostId: "host-1" as CardAttachStep["hostId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const reveal: LegendRevealStep = {
      id: "reveal-step",
      kind: "legendReveal",
      startMs: 0,
      durationMs: 300,
      reason: "legendCalled",
      cardId: "legend-1" as LegendRevealStep["cardId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const land: CardLandStep = {
      id: "land-step",
      kind: "cardLand",
      startMs: 10,
      durationMs: 280,
      reason: "cardPlayed",
      cardId: "program-1" as CardLandStep["cardId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const effect: EffectTargetStep = {
      id: "effect-step",
      kind: "effectTarget",
      startMs: 30,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(cyberpunkAnimationStepToAnimationPlan(attach, context)).toMatchObject({
      steps: [
        {
          type: "moveEntity",
          entity: { kind: "entity", id: "gear-1" },
          from: { id: "p-hand" },
          to: { kind: "entity", id: "host-1" },
        },
      ],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(reveal, context)).toMatchObject({
      steps: [{ type: "effect", source: { id: "p-legendArea" }, label: "REVEAL" }],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(land, context)).toMatchObject({
      steps: [{ type: "effect", source: { id: "program-1" }, label: "PLAYED" }],
    });
    expect(cyberpunkAnimationStepToAnimationPlan(effect, context)).toMatchObject({
      steps: [
        {
          type: "effect",
          source: { kind: "entity", id: "program-1" },
          targets: [{ kind: "entity", id: "unit-1" }],
          label: "RESOLVED",
        },
      ],
    });
  });

  test("marks every script step as shared Motion-supported", () => {
    const land: CardLandStep = {
      id: "land-step",
      kind: "cardLand",
      startMs: 0,
      durationMs: 240,
      reason: "cardPlayed",
      cardId: "program-1" as CardLandStep["cardId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(isCyberpunkAnimationStepSharedSupported(land)).toBe(true);
  });
});

function cyberpunkRawEntry(
  overrides: Partial<Parameters<typeof cyberpunkImmediateSystemAudioCues>[0]>,
): Parameters<typeof cyberpunkImmediateSystemAudioCues>[0] {
  return {
    id: 1,
    timestamp: 0,
    side: "system",
    move: "test",
    input: {},
    stateID: 1,
    moveLogs: [],
    events: [],
    animationScript: { steps: [], totalDurationMs: 0 },
    ...overrides,
  };
}

describe("cyberpunkAnimationScriptToAnimationPlans", () => {
  test("preserves entry prefixes", () => {
    const step: CardMoveStep = {
      id: "step-8",
      kind: "cardMove",
      startMs: 0,
      durationMs: 300,
      reason: "cardMoved",
      cardId: "card-8" as CardMoveStep["cardId"],
      fromZone: "hand",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [step], totalDurationMs: 300 },
      { ...context, idPrefix: "entry-1" },
    );

    expect(plans).toHaveLength(1);
    expect(plans[0]?.id).toBe("entry-1:step-8");
  });

  test("labels defeated targeted effects and delays target cleanup transfers", () => {
    const effect: EffectTargetStep = {
      id: "step-target",
      kind: "effectTarget",
      startMs: 0,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const defeated: CardExitStep = {
      id: "step-defeated",
      kind: "cardExit",
      startMs: 380,
      durationMs: 300,
      reason: "cardDefeated",
      cardId: "unit-1" as CardExitStep["cardId"],
      fromZone: "field",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
      exitReason: "defeated",
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [effect, defeated], totalDurationMs: 680 },
      { ...context, resultHoldMs: 1_200 },
    );

    expect(plans).toHaveLength(2);
    expect(plans[0]).toMatchObject({
      steps: [{ type: "effect", label: "DEFEATED", durationMs: 1_580 }],
    });
    expect(plans[1]).toMatchObject({
      steps: [
        {
          type: "moveEntity",
          delayMs: 1_580,
          from: { id: "p-field" },
          to: { id: "p-trash" },
        },
      ],
    });
  });

  test("pairs overlapping target cleanup with the result beat before moving cards", () => {
    const effect: EffectTargetStep = {
      id: "step-target",
      kind: "effectTarget",
      startMs: 300,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const defeated: CardExitStep = {
      id: "step-defeated",
      kind: "cardExit",
      startMs: 300,
      durationMs: 300,
      reason: "cardDefeated",
      cardId: "unit-1" as CardExitStep["cardId"],
      fromZone: "field",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.opponent,
      exitReason: "defeated",
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [effect, defeated], totalDurationMs: 680 },
      { ...context, resultHoldMs: 1_200 },
    );

    expect(plans[0]).toMatchObject({
      steps: [{ type: "effect", label: "DEFEATED", targets: [{ id: "unit-1" }] }],
    });
    expect(plans[1]).toMatchObject({
      steps: [
        {
          type: "moveEntity",
          delayMs: 1_880,
          from: { id: "opp-field" },
          to: { id: "opp-trash" },
        },
      ],
    });
  });

  test("settles a resolving Program source into trash after the final result beat", () => {
    const effect: EffectTargetStep = {
      id: "step-target",
      kind: "effectTarget",
      startMs: 0,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const defeated: CardExitStep = {
      id: "step-defeated",
      kind: "cardExit",
      startMs: 380,
      durationMs: 300,
      reason: "cardDefeated",
      cardId: "unit-1" as CardExitStep["cardId"],
      fromZone: "field",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.opponent,
      exitReason: "defeated",
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [effect, defeated], totalDurationMs: 680 },
      {
        ...context,
        resolvingProgramSourceCardId: "program-1",
        resultHoldMs: 1_200,
      },
    );

    expect(plans).toHaveLength(3);
    expect(plans[0]).toMatchObject({
      steps: [
        {
          type: "effect",
          source: { kind: "anchor", id: "resolving-program:program-1" },
          label: "DEFEATED",
          durationMs: 1_580,
        },
      ],
    });
    expect(plans[1]).toMatchObject({
      steps: [
        {
          type: "moveEntity",
          entity: { kind: "entity", id: "unit-1" },
          from: { id: "opp-field" },
          to: { id: "opp-trash" },
          delayMs: 1_580,
        },
      ],
    });
    expect(plans[2]).toMatchObject({
      id: "step-target:source-cleanup",
      steps: [
        {
          id: "step-target:source-cleanup",
          type: "moveEntity",
          entity: { kind: "entity", id: "program-1" },
          from: { kind: "anchor", id: "resolving-program:program-1" },
          to: { kind: "zone", id: "p-trash" },
          delayMs: 1_580,
          durationMs: 420,
        },
      ],
    });
  });

  test("keeps a multi-step resolving Program in limbo while another target choice remains", () => {
    const effect: EffectTargetStep = {
      id: "step-target",
      kind: "effectTarget",
      startMs: 0,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const plans = cyberpunkAnimationScriptToAnimationPlans(
      { steps: [effect], totalDurationMs: 380 },
      {
        ...context,
        pendingEffectSourceCardId: "program-1",
        resolvingProgramSourceCardId: "program-1",
        resultHoldMs: 1_200,
      },
    );

    expect(plans).toHaveLength(1);
    expect(plans[0]).toMatchObject({
      steps: [
        {
          type: "effect",
          source: { kind: "anchor", id: "resolving-program:program-1" },
        },
      ],
    });
  });
});
