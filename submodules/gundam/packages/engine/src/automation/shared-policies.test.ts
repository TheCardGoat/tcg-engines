import { describe, expect, it } from "vite-plus/test";

import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  createMockResource,
} from "../gundam/testing/index.ts";
import type { PendingEffect } from "../gundam/types.ts";
import type { PlayerId } from "../types/branded.ts";

import { enumerateGundamBotCandidates } from "./candidate-enumerator.ts";
import { composeStrategy, vetoFamily, DEFAULT_FAMILY_PRIORITY } from "./shared-policies.ts";
import { greedyLegalStrategy } from "./greedy-legal-strategy.ts";
import { takeAutomatedActionWithFallback } from "./planner.ts";

/**
 * Behavioural pinning for the SharedPolicies layer: every strategy built
 * by `composeStrategy` inherits the canonical resolveEffect / setup
 * decision tree, can override individual families without affecting the
 * rest, and produces deterministic output keyed off the priority record.
 */
describe("composeStrategy: defaults", () => {
  it("greedy-legal still prefers enterBattle over deployUnit", () => {
    // Re-pin the post-refactor behaviour: greedy-legal now compose-s on
    // top of DEFAULT_POLICIES and keeps the same family priority.
    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "Guncannon" });
    const inHand = createMockUnit({ cost: 1, level: 1, ap: 1, hp: 2, name: "RX-78-2" });
    const target = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, name: "Dom" });

    const engine = GundamTestEngine.create(
      {
        hand: [inHand],
        play: [attacker],
        resourceArea: [createMockResource(), createMockResource()],
      },
      { play: [{ card: target, exhausted: true }] },
    );

    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      greedyLegalStrategy,
      engine.runtime.getStaticResources(),
    );

    expect(result.outcome).toBe("candidate-succeeded");
    expect(result.selectedCandidate?.family).toBe("enterBattle");
  });

  it("DEFAULT_FAMILY_PRIORITY ranks setup ahead of pass", () => {
    // Sanity check on the shared priority constant — sub-policies can
    // override it via the `priority` option but downstream strategies
    // (greedy, pass-only) all share these defaults.
    expect(DEFAULT_FAMILY_PRIORITY.chooseFirstPlayer).toBe(0);
    expect(DEFAULT_FAMILY_PRIORITY.passTurn).toBe(11);
    expect(DEFAULT_FAMILY_PRIORITY.concede).toBe(99);
  });
});

describe("composeStrategy: family-policy overrides", () => {
  it("a strategy can override only enterBattle and inherit the rest", () => {
    // Strategy that refuses to attack but otherwise behaves like greedy.
    const noAttackStrategy = composeStrategy("no-attack", {
      enterBattle: vetoFamily(),
    });

    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "Guncannon" });
    const target = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, name: "Dom" });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: target, exhausted: true }] },
    );

    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      noAttackStrategy,
      engine.runtime.getStaticResources(),
    );

    // enterBattle was vetoed; the strategy must have submitted something
    // else (or fallen through to the planner's pass-family fallback).
    expect(result.selectedCandidate?.family).not.toBe("enterBattle");
  });

  it("an override does not affect the canonical resolveEffect policy", () => {
    // Two strategies that override different families — both still emit
    // identical resolveEffect candidates because the shared default
    // policy is inherited.
    const overrideA = composeStrategy("override-a", { enterBattle: vetoFamily() });
    const overrideB = composeStrategy("override-b", { deployUnit: vetoFamily() });

    const engine = GundamTestEngine.create({}, {});
    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );
    const ctx = {
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view: engine.runtime.getFilteredView({ role: "player", playerId: PLAYER_ONE as PlayerId }),
      candidates,
      turnNumber: 0,
      pendingChoice: null,
      cards: engine.runtime.getCardReadAPI(),
    };

    const aResolve = overrideA.selectCandidates(ctx).filter((c) => c.family === "resolveEffect");
    const bResolve = overrideB.selectCandidates(ctx).filter((c) => c.family === "resolveEffect");
    expect(aResolve).toEqual(bResolve);
  });
});

// =============================================================================
// chooseOne ranking (PR #239 review feedback — Copilot)
// =============================================================================

const drawOrDiscardChooseOneEffect: CardEffect = {
  type: "command",
  activation: { timing: ["main"] },
  directives: [
    {
      kind: "chooseOne",
      options: [
        // Option 0: discard — directive-intent classifies as `decline`.
        { label: "Discard 1", directives: [{ action: { action: "discard", count: 1 } }] },
        // Option 1: draw — directive-intent classifies as `accept`.
        { label: "Draw 2", directives: [{ action: { action: "draw", count: 2 } }] },
      ],
    },
  ],
  sourceText: "Choose one: Discard 1 / Draw 2.",
};

describe("composeStrategy: chooseOne ranking via directive-intent", () => {
  it("picks the highest-ranked option (accept > decline) regardless of option order", () => {
    // Default `defaultResolveEffect` policy must rank chooseOne options
    // by `classifyDirectiveIntent` on each option's first action and
    // emit a single candidate matching the best one. Here option 1
    // (draw) outranks option 0 (discard), so the strategy must keep
    // exactly the option-1 candidate even though enumerator order
    // emits option 0 first.
    const engine = GundamTestEngine.create({}, {});
    const pending: PendingEffect = {
      id: "pe_chooseOne_rank",
      controllerId: PLAYER_ONE,
      sourceCardId: "unused",
      effect: drawOrDiscardChooseOneEffect,
      effectIndex: 0,
      kind: "command",
    };
    engine.getG().pendingEffects.push(pending);

    const candidates = enumerateGundamBotCandidates(
      engine.runtime.getState(),
      PLAYER_ONE as PlayerId,
      engine.runtime.getStaticResources(),
    );

    // Sanity: enumerator emitted both options.
    const allResolves = candidates.filter((c) => c.family === "resolveEffect");
    expect(allResolves).toHaveLength(2);

    const strategy = composeStrategy("test-default", {});
    const ctx = {
      playerId: PLAYER_ONE as PlayerId,
      state: engine.runtime.getState(),
      view: engine.runtime.getFilteredView({ role: "player", playerId: PLAYER_ONE as PlayerId }),
      candidates,
      turnNumber: 0,
      // `CandidateStrategyContext.pendingChoice` is `PendingChoicePrompt | null`;
      // `getPendingChoice` returns `undefined` when no head is waiting,
      // so coalesce.
      pendingChoice:
        engine.runtime.getPendingChoice({
          role: "player",
          playerId: PLAYER_ONE as PlayerId,
        }) ?? null,
      cards: engine.runtime.getCardReadAPI(),
    };
    const picked = strategy.selectCandidates(ctx).filter((c) => c.family === "resolveEffect");

    expect(picked).toHaveLength(1);
    const [only] = picked;
    if (only?.family !== "resolveEffect") throw new Error("type narrow");
    // Option 1 (draw) is `accept`; should win over option 0 (discard).
    expect(only.chooseOneAnswers?.[0]).toBe(1);
  });
});
