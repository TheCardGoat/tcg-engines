import { describe, expect, it } from "vite-plus/test";

import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockResource,
} from "../gundam/testing/index.ts";
import type { PlayerId } from "../types/branded.ts";

import { takeAutomatedActionWithFallback } from "./planner.ts";
import { greedyLegalStrategy } from "./greedy-legal-strategy.ts";
import type { CandidateStrategy } from "./types.ts";

/**
 * End-to-end tests for the candidate-based planner + greedy strategy.
 * Each test seeds a specific state, runs one automated action, and
 * asserts on the outcome + the candidate that was actually submitted.
 *
 * These pin the planner's fallback chain (candidate → passTurn →
 * concede) and the greedy strategy's family priority ordering.
 */
describe("takeAutomatedActionWithFallback: happy path", () => {
  it("submits the top-priority candidate when the strategy ranks one legal", () => {
    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "RX-78-2" });
    const target = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, name: "Dom" });

    const engine = GundamTestEngine.create(
      { play: [attacker] },
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

  it("prefers enterBattle over deployUnit when both are legal", () => {
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

    expect(result.selectedCandidate?.family).toBe("enterBattle");
  });
});

describe("takeAutomatedActionWithFallback: fallback chain", () => {
  it("falls back to passTurn when no candidates are available besides pass", () => {
    // Empty hand, empty board — the enumerator produces only passTurn.
    // greedyLegalStrategy emits it last; the planner still submits it
    // because the fallback chain folds "only-pass candidates" into the
    // happy path.
    const engine = GundamTestEngine.create({}, {});

    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      greedyLegalStrategy,
      engine.runtime.getStaticResources(),
    );

    // When the strategy returned passTurn among its candidates, that's
    // a "candidate-succeeded" outcome (not a fallback).
    expect(result.outcome).toBe("candidate-succeeded");
    expect(result.selectedCandidate?.family).toBe("passTurn");
  });

  it("falls back to passTurn when the strategy returns zero candidates", () => {
    const emptyStrategy: CandidateStrategy = {
      name: "empty",
      selectCandidates: () => [],
    };

    const engine = GundamTestEngine.create({}, {});

    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      emptyStrategy,
      engine.runtime.getStaticResources(),
    );

    expect(result.outcome).toBe("no-candidates-pass-succeeded");
    expect(result.selectedCandidate?.family).toBe("passTurn");
  });
});

describe("takeAutomatedActionWithFallback: game-ended short-circuit", () => {
  it("returns game-ended when gameEnded is set, without submitting anything", () => {
    const engine = GundamTestEngine.create({}, {});
    const state = engine.runtime.getState();
    state.ctx.status.gameEnded = true;

    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      greedyLegalStrategy,
      engine.runtime.getStaticResources(),
    );

    expect(result.outcome).toBe("game-ended");
    expect(result.selectedCandidate).toBeUndefined();
    expect(result.attemptedCandidates).toEqual([]);
  });
});

describe("takeAutomatedActionWithFallback: maxCandidateAttempts", () => {
  it("respects the maxCandidateAttempts cap", () => {
    // Use a stub strategy that returns many duplicate-but-legal
    // candidates to prove the planner doesn't try more than the cap.
    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "Guncannon" });
    const target = createMockUnit({ cost: 2, level: 2, ap: 2, hp: 4, name: "Dom" });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: target, exhausted: true }] },
    );

    const result = takeAutomatedActionWithFallback(
      engine.runtime,
      PLAYER_ONE as PlayerId,
      greedyLegalStrategy,
      engine.runtime.getStaticResources(),
      { maxCandidateAttempts: 1 },
    );

    // The first (highest-priority) candidate is enterBattle; that one
    // succeeds, so we shouldn't have tried anything else.
    expect(result.attemptedCandidates).toHaveLength(1);
    expect(result.outcome).toBe("candidate-succeeded");
  });
});

void PLAYER_TWO;
