/**
 * Pending-effect queue foundation (PR A of the effect-resolution redesign).
 *
 * Exercises the plumbing in isolation by pushing PendingEffect entries
 * directly onto G.pendingEffects (no moves are migrated yet). Verifies:
 *  - Effects with no player choice auto-resolve via the flow engine's
 *    onTransitionCheck drain.
 *  - Effects with a target filter halt the flow and require an explicit
 *    resolveEffect move from the controller.
 *  - Tier sort: Burst resolves before triggered, active-player triggered
 *    resolves before standby-player triggered.
 *  - resolveEffect validation rejects wrong controller / empty queue.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
} from "../../index.ts";
import type { PendingEffect } from "../types.ts";
import { priorityHeadIndex } from "./pending-effects.ts";

const drawOneEffect: CardEffect = {
  type: "triggered",
  activation: { timing: ["deploy"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "Draw 1.",
};

// Effect used in halt-path tests: player-chosen target (rule 10-3-3).
// Modeled as "activated" so requiresPlayerChoice halts until the caller
// supplies targets — triggered/burst kinds auto-pick candidates and
// never halt, matching legacy TriggerQueue.flush semantics.
const restOpponentUnitEffect: CardEffect = {
  type: "activated",
  activation: { timing: ["activate:main"] },
  directives: [
    {
      action: {
        action: "rest",
        target: { owner: "opponent", cardType: "unit", count: 1 },
      },
    },
  ],
  sourceText: "Rest 1 enemy unit.",
};

let peIdCounter = 0;
function makePending(
  overrides: Partial<PendingEffect> & Pick<PendingEffect, "effect" | "controllerId">,
): PendingEffect {
  return {
    id: overrides.id ?? `test_${++peIdCounter}`,
    sourceCardId: overrides.sourceCardId ?? "unused",
    effectIndex: overrides.effectIndex ?? 0,
    kind: overrides.kind ?? "triggered",
    ...overrides,
  };
}

describe("Pending effects — auto-drain", () => {
  it("auto-resolves an effect with no player choice when resolveEffect is explicitly called", () => {
    const unit = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [unit], deck: 5 }, {});
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine
      .getG()
      .pendingEffects.push(
        makePending({ effect: drawOneEffect, controllerId: PLAYER_ONE, kind: "triggered" }),
      );

    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({}));

    expect(engine.getG().pendingEffects).toHaveLength(0);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });

  it("auto-resolves on any subsequent command via the flow onTransitionCheck drain", () => {
    const unit = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [unit], deck: 5 }, { deck: 5 });
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine
      .getG()
      .pendingEffects.push(
        makePending({ effect: drawOneEffect, controllerId: PLAYER_ONE, kind: "triggered" }),
      );

    // passPhase → passTurn → resolveFlowTransitions → onTransitionCheck
    // fires drainPendingEffects before the main-phase → end-phase advance.
    engine.tickFlow(PLAYER_ONE);

    expect(engine.getG().pendingEffects).toHaveLength(0);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });
});

describe("Pending effects — player choice required", () => {
  it("an effect with an opponent-target filter halts the flow until resolveEffect is called with targets", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    // Even a benign command does NOT auto-resolve this because the effect
    // still needs target selection (rule 10-3-3).
    engine.tickFlow(PLAYER_ONE);
    expect(engine.getG().pendingEffects).toHaveLength(1);

    // Controller explicitly submits a target.
    expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({ targets: [enemyId] }));

    expect(engine.getG().pendingEffects).toHaveLength(0);
    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });

  it("resolveEffect fails for the wrong controller", () => {
    const engine = GundamTestEngine.create({}, {});

    engine
      .getG()
      .pendingEffects.push(
        makePending({ effect: drawOneEffect, controllerId: PLAYER_ONE, kind: "triggered" }),
      );

    // The runtime's active-player gate catches the wrong actor before the
    // move's validate runs: when the queue halts, drainPendingEffects
    // shifts activePlayer to the head's controllerId (PLAYER_ONE), so
    // PLAYER_TWO is not the active player. In this test the pending effect
    // is pushed directly onto G without triggering a drain, so activePlayer
    // is still PLAYER_ONE from setup — either way PLAYER_TWO is rejected.
    expectFailure(engine.asPlayer(PLAYER_TWO).resolveEffect({}), "NOT_ACTIVE_PLAYER");
  });

  it("resolveEffect fails when the queue is empty", () => {
    const engine = GundamTestEngine.create({}, {});
    expectFailure(engine.asPlayer(PLAYER_ONE).resolveEffect({}), "NO_PENDING_EFFECT");
  });

  it("resolveEffect rejects with MISSING_TARGETS when the head needs input and none is supplied", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });

    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    expectFailure(engine.asPlayer(PLAYER_ONE).resolveEffect({}), "MISSING_TARGETS");
  });
});

describe("Pending effects — halt contract", () => {
  it("a choice-required head halts the flow: a following command does not advance past it", () => {
    const myUnit = createMockUnit({ ap: 1, hp: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [myUnit] }, { play: [enemy] });

    engine.getG().pendingEffects.push(
      makePending({
        effect: restOpponentUnitEffect,
        controllerId: PLAYER_ONE,
        kind: "activated",
      }),
    );

    const phaseBefore = engine.getState().ctx.status.phase;
    // With a choice-required effect at the head, the drain returns "halt"
    // and resolveFlowTransitions must not advance beyond the current state.
    engine.tickFlow(PLAYER_ONE);

    expect(engine.getState().ctx.status.phase).toBe(phaseBefore);
    expect(engine.getG().pendingEffects).toHaveLength(1);
  });
});

describe("Pending effects — addFromTrash zone guard", () => {
  // EffectAction for `addFromTrash` carries a TargetFilter whose `zone`
  // field is typed as the wide `Zone` union, not a literal `"trash"`. If
  // card data names a different zone (or omits it and the data pipeline
  // forgets to re-inject `"trash"`), the tutor would silently resolve
  // against hand / battle / resource. The executor must fail fast on the
  // bad-zone case so malformed data can't widen the action's semantics.
  const badZoneAddFromTrashEffect: CardEffect = {
    type: "triggered",
    activation: { timing: ["deploy"] },
    directives: [
      {
        action: {
          action: "addFromTrash",
          target: {
            owner: "friendly",
            cardType: "pilot",
            // Non-trash zone — defensive guard in executor should throw.
            zone: "hand",
            count: 1,
          },
        },
      },
    ],
    sourceText: "(tainted: addFromTrash with zone:hand)",
  };

  it("executor throws when addFromTrash target names a non-trash zone", () => {
    const engine = GundamTestEngine.create({}, {});
    engine.getG().pendingEffects.push(
      makePending({
        effect: badZoneAddFromTrashEffect,
        controllerId: PLAYER_ONE,
        kind: "triggered",
      }),
    );

    // `executeAction` throws; the runtime wraps it as a CommandFailure.
    const result = engine.asPlayer(PLAYER_ONE).resolveEffect({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("EXECUTION_ERROR");
      expect(result.error).toMatch(/Invalid addFromTrash target zone/);
    }
    // And the pending-effect queue is untouched (no state mutation).
    expect(engine.getG().pendingEffects).toHaveLength(1);
  });
});

describe("Pending effects — tier ordering", () => {
  it("priorityHeadIndex: burst < active-player triggered < standby-player triggered", () => {
    const pendingEffects: PendingEffect[] = [
      makePending({ id: "a", effect: drawOneEffect, controllerId: PLAYER_TWO, kind: "triggered" }),
      makePending({ id: "b", effect: drawOneEffect, controllerId: PLAYER_ONE, kind: "triggered" }),
      makePending({ id: "c", effect: drawOneEffect, controllerId: PLAYER_ONE, kind: "burst" }),
      makePending({ id: "d", effect: drawOneEffect, controllerId: PLAYER_ONE, kind: "activated" }),
    ];
    const g = { pendingEffects } as unknown as Parameters<typeof priorityHeadIndex>[0];

    // c (burst) wins tier; never mutates the array.
    expect(priorityHeadIndex(g, PLAYER_ONE)).toBe(2);
    expect(pendingEffects.map((pe) => pe.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("auto-drain processes the whole queue in priority order in a single flow pass", () => {
    const unit = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({ play: [unit], deck: 10 }, { deck: 10 });

    const p1DeckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const p2DeckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO });

    // Insert in deliberately inverted priority; drain must sort + process all.
    engine.getG().pendingEffects.push(
      makePending({
        id: "standby-triggered",
        effect: drawOneEffect,
        controllerId: PLAYER_TWO,
        kind: "triggered",
      }),
      makePending({
        id: "active-triggered",
        effect: drawOneEffect,
        controllerId: PLAYER_ONE,
        kind: "triggered",
      }),
      makePending({
        id: "burst",
        effect: drawOneEffect,
        controllerId: PLAYER_ONE,
        kind: "burst",
      }),
    );

    // One command triggers resolveFlowTransitions; drain loops until the queue
    // is empty or hits a choice-required head. None of these need a choice.
    engine.tickFlow(PLAYER_ONE);

    expect(engine.getG().pendingEffects).toHaveLength(0);
    // p1 drew twice (burst + active-triggered); p2 drew once (standby-triggered).
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(p1DeckBefore - 2);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO })).toBe(p2DeckBefore - 1);
  });
});
